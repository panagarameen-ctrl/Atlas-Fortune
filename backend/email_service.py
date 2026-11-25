import os
import re
import ipaddress
import logging
import httpx
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()
logger = logging.getLogger(__name__)

# Emergent managed email proxy. This is a CONSTANT — never read it from env.
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
OWNER_EMAIL = os.environ.get("OWNER_EMAIL", "invest@atlasfortune.in")

# ---------------- Guardrail gate (copied as-is from playbook) ----------------
_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: str | None = None) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except httpx.HTTPStatusError as e:
        logger.error(f"Email send failed: {e.response.status_code} {e.response.text}")
        return None
    except Exception as e:
        logger.error(f"Email send error: {str(e)}")
        return None


# ---------------- Server-side notification templates ----------------
def _shell(title: str, rows: list[tuple[str, str]], intro: str) -> str:
    row_html = "".join(
        f'<tr><td style="padding:6px 0;color:#8a94a6;font-size:13px;width:140px;'
        f'vertical-align:top">{escape(k)}</td>'
        f'<td style="padding:6px 0;color:#223047;font-size:14px">{escape(v)}</td></tr>'
        for k, v in rows
    )
    return (
        f'<table role="presentation" width="100%" style="background:#FBF7EF;padding:24px">'
        f'<tr><td>'
        f'<table role="presentation" width="100%" style="max-width:560px;margin:0 auto;'
        f'background:#ffffff;border-radius:12px;overflow:hidden;'
        f'font-family:Arial,Helvetica,sans-serif">'
        f'<tr><td style="background:#0A1E3C;padding:20px 28px">'
        f'<span style="color:#ffffff;font-size:18px;letter-spacing:2px">ATLAS FORTUNE</span>'
        f'<span style="color:#C6A15B;font-size:12px;display:block;margin-top:2px">{escape(title)}</span>'
        f'</td></tr>'
        f'<tr><td style="padding:24px 28px">'
        f'<p style="color:#223047;font-size:14px;margin:0 0 16px">{escape(intro)}</p>'
        f'<table role="presentation" width="100%">{row_html}</table>'
        f'<p style="font-size:12px;color:#8a94a6;margin:22px 0 0">'
        f'Sent by {escape(EMAIL_FROM_NAME)}. We never ask for your password or card details by email.'
        f'</p></td></tr></table></td></tr></table>'
    )


async def notify_new_lead(lead: dict) -> None:
    html = _shell(
        "New Consultation Request",
        [
            ("Name", lead.get("name", "")),
            ("Email", lead.get("email", "")),
            ("Phone", lead.get("phone", "")),
            ("Source", lead.get("source", "")),
            ("Message", lead.get("message", "")),
        ],
        "A new consultation request was submitted on your website.",
    )
    await send_email(to=OWNER_EMAIL, subject="New consultation request — Atlas Fortune", html=html)


async def notify_new_application(app: dict) -> None:
    html = _shell(
        "New Job Application",
        [
            ("Name", app.get("name", "")),
            ("Email", app.get("email", "")),
            ("Phone", app.get("phone", "")),
            ("Role", app.get("job_title", "")),
            ("Note", app.get("note", "") or "—"),
        ],
        "A new job application was submitted on your careers page.",
    )
    await send_email(to=OWNER_EMAIL, subject="New job application — Atlas Fortune", html=html)


async def notify_new_callback(cb: dict) -> None:
    html = _shell(
        "New Call-Back Request",
        [
            ("Name", cb.get("name", "")),
            ("Phone", cb.get("phone", "")),
            ("Preferred time", cb.get("preferred_time", "")),
        ],
        "A visitor asked you to call them back.",
    )
    await send_email(to=OWNER_EMAIL, subject="New call-back request — Atlas Fortune", html=html)


async def notify_new_booking(bk: dict) -> None:
    html = _shell(
        "New Discovery Call Booking",
        [
            ("Name", bk.get("name", "")),
            ("Email", bk.get("email", "")),
            ("Phone", bk.get("phone", "")),
            ("Date", bk.get("date", "")),
            ("Time (IST)", bk.get("slot", "")),
        ],
        "A visitor booked a 30-minute discovery call.",
    )
    await send_email(to=OWNER_EMAIL, subject="New discovery call booking — Atlas Fortune", html=html)
