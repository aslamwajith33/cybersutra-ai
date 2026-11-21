import os
import zipfile
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .config import settings
from .database import engine, Base, SessionLocal
from .services.seed_data import seed_demo_data

# Import route routers
from .routes import (
    auth, dashboard, cases, url_intel, apk_scanner, financial, evidence, reports,
    settings as settings_route, statements, money_trail, infrastructure, notices, audit_logs,
    fraud_dna, copilot, timeline
)

# Initialize FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Intelligent Cybercrime & Financial Crime Investigation Intelligence Platform for Rajasthan Police (PS05 Hackathon).",
    version=settings.VERSION
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Database table creation notice: {e}")

# Helper: Create synthetic sample APK and CSV for easy investigator demo testing
def create_sample_files():
    try:
        sample_dir = settings.SAMPLE_DIR
        os.makedirs(sample_dir, exist_ok=True)
        
        # 1. Sample APK: InstantRupee_LoanShark_Sample.apk
        apk_path = os.path.join(sample_dir, "InstantRupee_LoanShark_Sample.apk")
        if not os.path.exists(apk_path):
            with zipfile.ZipFile(apk_path, "w") as z:
                fake_manifest = (
                    b"AndroidManifest.xml\x00\x00"
                    b"package=com.instantrupee.extortion.loan\x00"
                    b"android.permission.READ_CONTACTS\x00"
                    b"android.permission.READ_SMS\x00"
                    b"android.permission.RECEIVE_SMS\x00"
                    b"android.permission.CAMERA\x00"
                    b"android.permission.ACCESS_FINE_LOCATION\x00"
                    b"android.permission.SYSTEM_ALERT_WINDOW\x00"
                    b"android.permission.REQUEST_INSTALL_PACKAGES\x00"
                )
                z.writestr("AndroidManifest.xml", fake_manifest)
                fake_dex = (
                    b"classes.dex\x00\x00"
                    b"http://185.220.101.45:8080/c2/exfiltrate_contacts\x00"
                    b"http://api.loan-extort-syndicate.xyz/upload_photo\x00"
                    b"http://103.251.167.22/tg_gate\x00"
                    b"debug_key_cert_rajasthan_test\x00"
                )
                z.writestr("classes.dex", fake_dex)
                z.writestr("META-INF/CERT.RSA", b"DEBUG_CERTIFICATE_DUMMY_DATA")

        # 2. Sample Bank Transaction Statement CSV with UTR and Narration
        csv_path = os.path.join(sample_dir, "Suspicious_Bank_Statement_Batch.csv")
        if not os.path.exists(csv_path):
            csv_content = """Date,Txn ID,Sender Account,Receiver Account,Amount,Debit,Credit,Balance,Sender Bank,Receiver Bank,Channel,UTR,Narration
2025-05-10 10:15:00,TXN-STMT-9001,ACC-VICTIM-1029,HDFC-501004928172,49500,0,49500,49500,State Bank of India,HDFC Bank,UPI,UTR5010029101,UPI-P2A-VIP Task Deposit
2025-05-10 10:22:00,TXN-STMT-9002,ACC-VICTIM-1030,HDFC-501004928172,48800,0,48800,98300,Bank of Baroda,HDFC Bank,UPI,UTR5010029102,UPI-P2A-Telegram Task Level 2
2025-05-10 10:31:00,TXN-STMT-9003,HDFC-501004928172,ICICI-001205019844,97000,97000,0,1300,HDFC Bank,ICICI Bank,IMPS,IMPS5010029103,IMPS-Fund Transfer to Secondary Layer
2025-05-10 10:45:00,TXN-STMT-9004,ICICI-001205019844,AXIS-919010045211,95000,95000,0,800,ICICI Bank,Axis Bank,IMPS,IMPS5010029104,IMPS-Alwar Cashout Settlement
2025-05-10 11:10:00,TXN-STMT-9005,ACC-VICTIM-2041,PNB-12890001002341,49900,0,49900,49900,Punjab National Bank,PNB,UPI,UTR5010029105,UPI-Electricity Bill Pay JVVNL
2025-05-10 11:18:00,TXN-STMT-9006,PNB-12890001002341,HDFC-501004928172,49000,49000,0,900,PNB,HDFC Bank,UPI,UTR5010029106,UPI-Internal Routing Syndicate
"""
            with open(csv_path, "w", encoding="utf-8") as f:
                f.write(csv_content)
    except Exception as e:
        print(f"Notice: Read-only filesystem detected, sample generation skipped: {e}")

create_sample_files()

# Seed demo data if database is empty on startup
try:
    db = SessionLocal()
    seed_demo_data(db, force_reset=False)
    db.close()
except Exception as e:
    print(f"Notice: Seed data check: {e}")

# Mount Static Files for PDF reports and sample files
try:
    if os.path.exists(settings.REPORT_DIR):
        app.mount("/static/reports", StaticFiles(directory=settings.REPORT_DIR), name="reports")
    if os.path.exists(settings.SAMPLE_DIR):
        app.mount("/static/samples", StaticFiles(directory=settings.SAMPLE_DIR), name="samples")
except Exception as e:
    print(f"Notice: Static files mount: {e}")

# Register API routers with both /api and root prefix to guarantee Vercel routing compatibility
all_routers = [
    auth.router, dashboard.router, cases.router, url_intel.router, apk_scanner.router,
    financial.router, statements.router, money_trail.router, infrastructure.router,
    evidence.router, notices.router, reports.router, audit_logs.router, fraud_dna.router,
    copilot.router, timeline.router, settings_route.router
]

for r in all_routers:
    app.include_router(r, prefix=settings.API_PREFIX)
    app.include_router(r, prefix="")

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "tagline": settings.TAGLINE,
        "version": settings.VERSION,
        "hackathon_problem_statement": "PS05 – Financial Crime Infrastructure & Money-Trail Analysis System",
        "secret_weapon": "Fraud Network DNA Engine",
        "docs_url": "/docs",
        "api_status": "OPERATIONAL",
        "jurisdiction": "Rajasthan Police & Indian Law Enforcement Agencies"
    }
