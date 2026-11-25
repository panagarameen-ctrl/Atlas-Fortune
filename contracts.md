# Atlas Fortune — Backend Integration Contracts

## Goal
Persist form submissions from the frontend to MongoDB and allow retrieval.

## Data currently mocked (frontend)
- Contact/consultation form (ContactSection.jsx, Contact.jsx) -> only showed a toast, no persistence.
- Career "Apply Now" (Career.jsx) -> only showed a toast.
- All page content (services, blogs, team, jobs) stays as static frontend mock data (no backend needed).

## What moves to backend
Only the two lead-capture forms. Content remains static mock.

## API Contracts (all prefixed with /api)

### 1. Consultation / Contact leads
POST /api/leads
Body: { name: str, email: str, phone: str, message: str, source: str }
  - source: "contact_section" | "contact_page"
Response 200: { id, name, email, phone, message, source, created_at }

GET /api/leads  -> List[Lead] (newest first) — for admin/verification

### 2. Job applications
POST /api/applications
Body: { name: str, email: str, phone: str, job_title: str, note?: str }
Response 200: { id, name, email, phone, job_title, note, created_at }

GET /api/applications -> List[Application] (newest first)

## MongoDB collections
- leads: { id (uuid str), name, email, phone, message, source, created_at (iso str) }
- applications: { id, name, email, phone, job_title, note, created_at }

## Frontend integration changes
- ContactSection.jsx: POST /api/leads with source="contact_section" on submit; keep toast on success; show error toast on failure.
- Contact.jsx: POST /api/leads with source="contact_page".
- Career.jsx: replace mock apply with a small dialog collecting name/email/phone, POST /api/applications.
- Use REACT_APP_BACKEND_URL + "/api". Use axios.

## Notes
- No auth (MVP). Basic validation via pydantic (EmailStr).
- Keep static content (services/blogs/team/jobs) in mock.js — not served by backend.
