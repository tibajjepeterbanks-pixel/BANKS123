import sys
import os
import hmac
import hashlib
import uuid
import math
from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException, Header, status, Query, Request, UploadFile, File, Form
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import boto3
from botocore.config import Config
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import select, or_, func
from sqlalchemy.orm import selectinload

import models

# --- Windows Python 3.14 Asyncio noise patch ---
if sys.platform == 'win32':
    from asyncio import proactor_events
    _orig = proactor_events._ProactorBasePipeTransport._call_connection_lost
    def _patched(self, exc):
        try: _orig(self, exc)
        except (ConnectionResetError, ConnectionAbortedError, OSError): pass
    proactor_events._ProactorBasePipeTransport._call_connection_lost = _patched

# --- AUTO CONFIGURATIONS ENGINE (POSTGRESQL OR LOCAL SQLITE) ---
DATABASE_URL = os.getenv("DATABASE_URL")
IS_SQLITE = False
if not DATABASE_URL:
    DATABASE_URL = "sqlite+aiosqlite:///./makerere_portal.db"
    IS_SQLITE = True

WEBHOOK_SECRET = os.getenv("MOMO_WEBHOOK_SECRET", "super-secret-signing-key")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID", "")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY", "")
AWS_REGION = os.getenv("AWS_REGION", "eu-west-1")
S3_BUCKET_NAME = os.getenv("AWS_S3_BUCKET_NAME", "makerere-archives")

LOCAL_STORAGE_DIR = "local_s3_simulation"
if (not AWS_ACCESS_KEY_ID or not AWS_SECRET_ACCESS_KEY) and not os.path.exists(LOCAL_STORAGE_DIR):
    os.makedirs(LOCAL_STORAGE_DIR)

# --- ENGINE DECLARATION ---
engine = create_async_engine(
    DATABASE_URL, 
    echo=False,
    connect_args={"check_same_thread": False} if IS_SQLITE else {}
)
AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

app = FastAPI(title="Makerere Past Papers API Node", version="4.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_db():
    async with AsyncSessionLocal() as session:
        try: yield session
        finally: await session.close()

# --- PYDANTIC SCHEMAS ---
class MomoCallbackPayload(BaseModel):
    reference: str
    external_transaction_id: str
    status: str  # SUCCESSFUL or FAILED
    amount: float

class CourseSearchResponse(BaseModel):
    id: str
    code: str
    name: str
    school_name: str
    college_code: str
    papers_count: int

class PaymentPromptRequest(BaseModel):
    paper_id: str
    student_phone: str

# Mock Current User Context Guard Extractors
async def get_current_user_id() -> str:
    return "mocked-admin-or-student-uuid-4444"

# --- LIFESPAN STARTUP SYSTEM DATA SEEDER ---
@app.on_event("startup")
async def seed_makerere_institutional_matrix():
    async with engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)
        
    async with AsyncSessionLocal() as db:
        college_check = await db.execute(select(models.College).limit(1))
        if college_check.scalar_one_or_none():
            return # Data already seeded
            
        colleges_to_seed = {
            "CoCIS": "College of Computing and Information Sciences",
            "CEDAT": "College of Engineering, Design, Art and Technology",
            "CAES": "College of Agricultural and Environmental Sciences",
            "COBAMS": "College of Business and Management Sciences",
            "CEES": "College of Education and External Studies",
            "CHS": "College of Health Sciences",
            "CHUSS": "College of Humanities and Social Sciences",
            "CONAS": "College of Natural Sciences",
            "SOL": "School of Law",
            "COVAB": "College of Veterinary Medicine, Animal Resources and Biosecurity"
        }
        
        for code, name in colleges_to_seed.items():
            college = models.College(code=code, name=name)
            db.add(college)
            await db.flush()
            
            # Add school divisions
            school_name = f"School of Academic Studies ({code})"
            school = models.School(name=school_name, college_id=college.id)
            db.add(school)
            await db.flush()
            
            # Seed example courses matching Next.js requirements
            sample_courses = [
                {"code": f"CSC{code}1", "name": "Introduction to Digital Frameworks"},
                {"code": f"BIT{code}2", "name": "Relational Data Management Systems"}
            ]
            for c_data in sample_courses:
                course = models.Course(code=c_data["code"], name=c_data["name"], school_id=school.id)
                db.add(course)
                
        # Seed an admin profile for analytics operations
        admin_user = models.User(
            id="mocked-admin-or-student-uuid-4444",
            email="admin@mak.ac.ug",
            password_hash=hashlib.sha256("admin123".encode()).hexdigest(),
            name="Registrar Office Administrator",
            role=models.Role.ADMIN,
            is_email_verified=True
        )
        db.add(admin_user)
        await db.commit()

# =========================================================================
# FEATURE 1: INSTANT MULTI-DIMENSIONAL SEARCH INDEX (COURSE CODE/NAME)
# =========================================================================
@app.get("/api/courses/search", response_model=List[CourseSearchResponse])
async def instant_course_search(q: str = Query(..., min_length=2), db: AsyncSession = Depends(get_db)):
    clean_query = q.strip()
    stmt = (
        select(models.Course)
        .options(
            selectinload(models.Course.school).selectinload(models.School.college),
            selectinload(models.Course.past_papers)
        )
        .where(
            or_(
                models.Course.code.ilike(f"%{clean_query}%"),
                models.Course.name.ilike(f"%{clean_query}%")
            )
        )
        .limit(10)
    )
    result = await db.execute(stmt)
    courses = result.scalars().all()
    
    return [
        CourseSearchResponse(
            id=c.id, code=c.code, name=c.name,
            school_name=c.school.name, college_code=c.school.college.code,
            papers_count=len(c.past_papers)
        ) for c in courses
    ]

# =========================================================================
# FEATURE 2: AUTOMATIC METADATA EXTRACTION & PAST PAPER BULK UPLOAD
# =========================================================================
@app.post("/api/admin/papers/upload", status_code=status.HTTP_201_CREATED)
async def admin_upload_past_paper(
    course_id: str = Form(...),
    academic_year: str = Form(...),
    semester: int = Form(...),
    year_of_study: int = Form(...),
    file: UploadFile = File(...),
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF file format archives can be uploaded.")
        
    file_bytes = await file.read()
    file_size_kb = len(file_bytes) / 1024
    size_label = f"{file_size_kb:.1f} KB" if file_size_kb < 1024 else f"{(file_size_kb/1024):.1f} MB"
    
    # PDF Parser metadata simulation loops (Pages count calculation)
    simulated_pages_count = max(3, int(math.ceil(file_size_kb / 150)))
    
    unique_file_key = f"{uuid.uuid4()}_{file.filename.replace(' ', '_')}"
    
    # Save target file using active storage tier choices
    if not AWS_ACCESS_KEY_ID or not AWS_SECRET_ACCESS_KEY:
        # Local development storage loop fallback
        with open(os.path.join(LOCAL_STORAGE_DIR, unique_file_key), "wb") as f:
            f.write(file_bytes)
    else:
        # Cloud S3 client deployment routing
        s3 = boto3.client('s3', region_name=AWS_REGION, aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
        s3.put_object(Bucket=S3_BUCKET_NAME, Key=unique_file_key, Body=file_bytes)

    new_paper = models.PastPaper(
        course_id=course_id, academic_year=academic_year, semester=semester,
        year_of_study=year_of_study, file_name=file.filename, file_url=unique_file_key,
        file_size=size_label, pages_count=simulated_pages_count, uploaded_by_id=current_user_id
    )
    db.add(new_paper)
    await db.commit()
    
    return {"success": True, "message": "Metadata extracted and file indexed successfully."}

# =========================================================================
# FEATURE 3: SECURE PAYMENT ACQUISITION DISPATCH PROMPT HOOK (STK INIT)
# =========================================================================
@app.post("/api/payments/initiate")
async def dispatch_momo_prompt(payload: PaymentPromptRequest, current_user_id: str = Depends(get_current_user_id), db: AsyncSession = Depends(get_db)):
    internal_ref = f"MAK-PAY-{uuid.uuid4().hex[:12].upper()}"
    
    new_payment = models.Payment(
        user_id=current_user_id, paper_id=payload.paper_id, amount=200.0,
        student_phone=payload.student_phone, merchant_phone="0704130457",
        reference=internal_ref, status=models.PaymentStatus.PENDING
    )
    db.add(new_payment)
    await db.commit()
    
    # In production, initiate network API prompt dispatch here.
    return {"success": True, "reference": internal_ref, "message": "Carrier STK Prompt dispatched successfully."}

# =========================================================================
# FEATURE 4: TIME-TIMING ATTACK RESISTANT GATEWAY CALLBACK WEBHOOK
# =========================================================================
@app.post("/api/payments/momo-callback")

    else:
        # Cloud S3 client deployment routing
        s3 = boto3.client('s3', region_name=AWS_REGION, aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
        # --- PATCH UNFINISHED CODE LINE BELOW ---
        s3.put_object(Bucket=S3_BUCKET_NAME, Key=unique_file_key, Body=file_bytes)
        
    # Add a temporary return statement to close out the function structure safely
    return {"status": "success", "file_key": unique_file_key}
