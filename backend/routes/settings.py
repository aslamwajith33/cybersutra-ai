from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.seed_data import seed_demo_data
from ..config import settings
from ..models import Case, Complaint, URLAnalysis, APKAnalysis, Transaction, DigitalEntity, EvidenceLink, InvestigationReport, SystemAlert, User

router = APIRouter(prefix="/settings", tags=["Settings & Administration"])

@router.get("/status")
def get_system_status(db: Session = Depends(get_db)):
    return {
        "project_name": settings.PROJECT_NAME,
        "tagline": settings.TAGLINE,
        "version": settings.VERSION,
        "database_type": "SQLite (Local Zero-Config)" if "sqlite" in settings.DATABASE_URL else "PostgreSQL",
        "database_url": settings.DATABASE_URL.split("@")[-1] if "@" in settings.DATABASE_URL else settings.DATABASE_URL,
        "threat_intel_api_configured": bool(settings.VIRUSTOTAL_API_KEY),
        "total_cases": db.query(Case).count(),
        "total_complaints": db.query(Complaint).count(),
        "total_transactions": db.query(Transaction).count(),
        "total_urls_analyzed": db.query(URLAnalysis).count(),
        "total_apks_analyzed": db.query(APKAnalysis).count(),
        "is_demo_mode": True
    }

@router.post("/seed-demo-data")
def trigger_seed_demo_data(force: bool = False, db: Session = Depends(get_db)):
    """
    Seed realistic demonstration cybercrime intelligence cases, complaints,
    mule transactions, phishing URLs, and loan app APK analyses.
    """
    result = seed_demo_data(db, force_reset=force)
    return result

@router.post("/reset-database")
def reset_database(db: Session = Depends(get_db)):
    """
    Reset all database tables to empty state.
    """
    db.query(SystemAlert).delete()
    db.query(InvestigationReport).delete()
    db.query(EvidenceLink).delete()
    db.query(DigitalEntity).delete()
    db.query(Transaction).delete()
    db.query(APKAnalysis).delete()
    db.query(URLAnalysis).delete()
    db.query(Complaint).delete()
    db.query(Case).delete()
    db.commit()
    return {"status": "success", "message": "All investigation records cleared. Database reset to empty state."}
