from fastapi import FastAPI, APIRouter, Header, HTTPException, BackgroundTasks, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from email_service import notify_new_lead, notify_new_application, notify_new_booking, notify_new_callback
from typing import Literal


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# ---- Lead (consultation / contact form) ----
class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    message: str
    source: str = "contact_section"

class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    message: str
    source: str = "contact_section"
    handled: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# ---- Callback request ----
class CallbackCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    phone: str = Field(min_length=7, max_length=20)
    preferred_time: Literal["Morning", "Afternoon", "Evening"]

class Callback(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    preferred_time: str
    handled: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# ---- Job application ----
class ApplicationCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    job_title: str
    note: str = ""

class Application(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    job_title: str
    note: str = ""
    handled: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# ---- Booking (discovery call) ----
class BookingCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    date: str   # YYYY-MM-DD
    slot: str   # e.g. "10:30 AM"

class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    date: str
    slot: str
    handled: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# ---- Blog post ----
class BlogCreate(BaseModel):
    slug: str
    title: str
    category: str
    date: str
    read: str = "5 min read"
    excerpt: str
    image: str
    content: List[str] = []
    featured: bool = False

class Blog(BlogCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class HandledUpdate(BaseModel):
    handled: bool

class AdminLogin(BaseModel):
    passcode: str

# ---- Admin auth ----
ADMIN_PASSCODE = os.environ.get("ADMIN_PASSCODE", "atlas-admin-2025")

async def require_admin(x_admin_token: Optional[str] = Header(default=None)):
    if x_admin_token != ADMIN_PASSCODE:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True

# Booking slot config
BOOKING_SLOTS = [
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM",
]

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/admin/login")
async def admin_login(input: AdminLogin):
    if input.passcode != ADMIN_PASSCODE:
        raise HTTPException(status_code=401, detail="Invalid passcode")
    return {"token": ADMIN_PASSCODE}

@api_router.post("/leads", response_model=Lead)
async def create_lead(input: LeadCreate, background_tasks: BackgroundTasks):
    lead = Lead(**input.model_dump())
    await db.leads.insert_one(lead.model_dump())
    logger.info(f"New lead captured: {lead.email} ({lead.source})")
    background_tasks.add_task(notify_new_lead, lead.model_dump())
    return lead

@api_router.get("/leads", response_model=List[Lead])
async def get_leads(_: bool = Depends(require_admin)):
    leads = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return leads

@api_router.patch("/leads/{lead_id}", response_model=Lead)
async def update_lead(lead_id: str, update: HandledUpdate, _: bool = Depends(require_admin)):
    res = await db.leads.find_one_and_update(
        {"id": lead_id}, {"$set": {"handled": update.handled}},
        projection={"_id": 0}, return_document=True,
    )
    if not res:
        raise HTTPException(status_code=404, detail="Lead not found")
    return res

@api_router.delete("/leads/{lead_id}")
async def delete_lead(lead_id: str, _: bool = Depends(require_admin)):
    res = await db.leads.delete_one({"id": lead_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"status": "deleted"}

@api_router.post("/callbacks", response_model=Callback)
async def create_callback(input: CallbackCreate, background_tasks: BackgroundTasks):
    cb = Callback(**input.model_dump())
    await db.callbacks.insert_one(cb.model_dump())
    background_tasks.add_task(notify_new_callback, cb.model_dump())
    return cb

@api_router.get("/callbacks", response_model=List[Callback])
async def get_callbacks(_: bool = Depends(require_admin)):
    return await db.callbacks.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)

@api_router.patch("/callbacks/{cb_id}", response_model=Callback)
async def update_callback(cb_id: str, update: HandledUpdate, _: bool = Depends(require_admin)):
    res = await db.callbacks.find_one_and_update(
        {"id": cb_id}, {"$set": {"handled": update.handled}},
        projection={"_id": 0}, return_document=True,
    )
    if not res:
        raise HTTPException(status_code=404, detail="Callback not found")
    return res

@api_router.delete("/callbacks/{cb_id}")
async def delete_callback(cb_id: str, _: bool = Depends(require_admin)):
    res = await db.callbacks.delete_one({"id": cb_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Callback not found")
    return {"status": "deleted"}

@api_router.post("/applications", response_model=Application)
async def create_application(input: ApplicationCreate, background_tasks: BackgroundTasks):
    application = Application(**input.model_dump())
    await db.applications.insert_one(application.model_dump())
    logger.info(f"New job application: {application.email} for {application.job_title}")
    background_tasks.add_task(notify_new_application, application.model_dump())
    return application

@api_router.get("/applications", response_model=List[Application])
async def get_applications(_: bool = Depends(require_admin)):
    applications = await db.applications.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return applications

@api_router.patch("/applications/{app_id}", response_model=Application)
async def update_application(app_id: str, update: HandledUpdate, _: bool = Depends(require_admin)):
    res = await db.applications.find_one_and_update(
        {"id": app_id}, {"$set": {"handled": update.handled}},
        projection={"_id": 0}, return_document=True,
    )
    if not res:
        raise HTTPException(status_code=404, detail="Application not found")
    return res

@api_router.delete("/applications/{app_id}")
async def delete_application(app_id: str, _: bool = Depends(require_admin)):
    res = await db.applications.delete_one({"id": app_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"status": "deleted"}

# ---- Bookings ----
@api_router.get("/bookings/availability")
async def booking_availability(date: str):
    taken = await db.bookings.find({"date": date}, {"_id": 0, "slot": 1}).to_list(1000)
    taken_slots = {t["slot"] for t in taken}
    available = [s for s in BOOKING_SLOTS if s not in taken_slots]
    return {"date": date, "all_slots": BOOKING_SLOTS, "available": available, "booked": list(taken_slots)}

@api_router.post("/bookings", response_model=Booking)
async def create_booking(input: BookingCreate, background_tasks: BackgroundTasks):
    if input.slot not in BOOKING_SLOTS:
        raise HTTPException(status_code=400, detail="Invalid time slot")
    existing = await db.bookings.find_one({"date": input.date, "slot": input.slot})
    if existing:
        raise HTTPException(status_code=409, detail="That slot has just been booked. Please choose another.")
    booking = Booking(**input.model_dump())
    await db.bookings.insert_one(booking.model_dump())
    logger.info(f"New booking: {booking.email} {booking.date} {booking.slot}")
    background_tasks.add_task(notify_new_booking, booking.model_dump())
    return booking

@api_router.get("/bookings", response_model=List[Booking])
async def get_bookings(_: bool = Depends(require_admin)):
    bookings = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return bookings

@api_router.patch("/bookings/{booking_id}", response_model=Booking)
async def update_booking(booking_id: str, update: HandledUpdate, _: bool = Depends(require_admin)):
    res = await db.bookings.find_one_and_update(
        {"id": booking_id}, {"$set": {"handled": update.handled}},
        projection={"_id": 0}, return_document=True,
    )
    if not res:
        raise HTTPException(status_code=404, detail="Booking not found")
    return res

@api_router.delete("/bookings/{booking_id}")
async def delete_booking(booking_id: str, _: bool = Depends(require_admin)):
    res = await db.bookings.delete_one({"id": booking_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"status": "deleted"}

# ---- Blogs (public read, admin write) ----
@api_router.get("/blogs", response_model=List[Blog])
async def list_blogs():
    blogs = await db.blogs.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return blogs

@api_router.get("/blogs/{slug}", response_model=Blog)
async def get_blog(slug: str):
    blog = await db.blogs.find_one({"slug": slug}, {"_id": 0})
    if not blog:
        raise HTTPException(status_code=404, detail="Article not found")
    return blog

@api_router.post("/blogs", response_model=Blog)
async def create_blog(input: BlogCreate, _: bool = Depends(require_admin)):
    existing = await db.blogs.find_one({"slug": input.slug})
    if existing:
        raise HTTPException(status_code=409, detail="An article with that slug already exists")
    blog = Blog(**input.model_dump())
    await db.blogs.insert_one(blog.model_dump())
    return blog

@api_router.put("/blogs/{slug}", response_model=Blog)
async def update_blog(slug: str, input: BlogCreate, _: bool = Depends(require_admin)):
    existing = await db.blogs.find_one({"slug": slug}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Article not found")
    data = input.model_dump()
    data["id"] = existing["id"]
    data["created_at"] = existing.get("created_at")
    await db.blogs.replace_one({"slug": slug}, data)
    return data

@api_router.delete("/blogs/{slug}")
async def delete_blog(slug: str, _: bool = Depends(require_admin)):
    res = await db.blogs.delete_one({"slug": slug})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"status": "deleted"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

SEED_BLOGS = [
    {"slug": "investment-consulting-for-wealth-growth", "title": "Investment Consulting for Wealth Growth", "category": "Investment", "date": "May 4, 2025", "read": "5 min read", "excerpt": "How disciplined advisory transforms scattered savings into a compounding engine that funds every life milestone.", "image": "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=1600&q=80", "featured": True, "content": ["Wealth is rarely built by accident. Behind every well-funded retirement, every debt-free home and every generational transfer of capital sits a quiet, disciplined framework \u2014 one that turns scattered savings into a compounding engine.", "Investment consulting begins not with a product, but with a conversation. Before recommending anything, we map your cash-flows, obligations, aspirations and risk appetite. Only then does a strategy take shape.", "The magic of compounding rewards patience and consistency far more than timing. A modest, regular investment made early and left undisturbed will almost always outperform a larger, later, more anxious one.", "Our role as advisors is to keep you disciplined through every economic season \u2014 to prevent the emotional decisions that quietly erode long-term returns, and to keep every rupee aligned to the milestones that matter most."]},
    {"slug": "smart-financial-planning-for-your-future", "title": "Smart Financial Planning for Your Future", "category": "Financial Planning", "date": "April 22, 2025", "read": "6 min read", "excerpt": "A framework for aligning cash-flows, insurance, tax and investing under one calm, coherent plan.", "image": "https://images.unsplash.com/photo-1709880945165-d2208c6ad2ec?w=1600&q=80", "featured": False, "content": ["Financial planning is often mistaken for investing. In truth, investing is just one instrument in a much larger orchestra \u2014 one that includes cash-flow, protection, taxation and estate structuring.", "A coherent plan begins by giving every rupee a job. When your income is intentionally allocated toward spending, protection, and growth, financial anxiety gives way to quiet confidence.", "Insurance is the foundation that protects the plan itself. Adequate life and health cover ensures that a single unexpected event does not derail decades of careful progress.", "Finally, a plan is a living document. As your life evolves \u2014 marriage, children, new ventures \u2014 your financial craft evolves with it, reviewed and refined at every meaningful turn."]},
    {"slug": "tax-planning-tips-for-higher-savings", "title": "Tax Planning Tips for Higher Savings", "category": "Tax Planning", "date": "April 10, 2025", "read": "4 min read", "excerpt": "Legal, elegant strategies that reduce tax leakage and quietly add years of freedom to your retirement.", "image": "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1600&q=80", "featured": False, "content": ["Tax is one of the largest lifetime expenses most families never actively manage. Elegant, entirely legal planning can reduce leakage and add years of freedom to your retirement.", "The first principle is to use every legitimate allowance and deduction available to you \u2014 not aggressively, but intentionally, as part of a coordinated plan.", "Asset location matters as much as asset allocation. Placing the right investments in the right tax wrappers can meaningfully improve your net, after-tax return over time.", "Above all, tax planning should never drive investment decisions on its own. The best outcomes come when tax efficiency quietly supports a sound, goal-oriented strategy."]},
]

@app.on_event("startup")
async def seed_blogs():
    count = await db.blogs.count_documents({})
    if count == 0:
        docs = [Blog(**b).model_dump() for b in SEED_BLOGS]
        await db.blogs.insert_many(docs)
        logger.info(f"Seeded {len(docs)} blog articles")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()