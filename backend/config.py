import os
import shutil
from typing import Optional

class Settings:
    PROJECT_NAME: str = "CyberSutra AI"
    TAGLINE: str = "Connecting Digital Evidence. Accelerating Cybercrime Investigation."
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    IS_VERCEL: bool = bool(os.getenv("VERCEL"))
    
    # Database: Defaults to SQLite for immediate, zero-config reliability
    # On Vercel serverless, /tmp is writable; copy existing seed db to /tmp if available
    if IS_VERCEL:
        _tmp_db = "/tmp/cybersutra.db"
        _local_db = os.path.join(BASE_DIR, "cybersutra.db")
        if not os.path.exists(_tmp_db) and os.path.exists(_local_db):
            try:
                shutil.copyfile(_local_db, _tmp_db)
            except Exception:
                pass
        DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{_tmp_db}")
        UPLOAD_DIR: str = "/tmp/uploads"
        REPORT_DIR: str = "/tmp/reports"
        SAMPLE_DIR: str = os.path.join(BASE_DIR, "sample_data")
    else:
        DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./cybersutra.db")
        UPLOAD_DIR: str = os.path.join(BASE_DIR, "uploads")
        REPORT_DIR: str = os.path.join(BASE_DIR, "reports")
        SAMPLE_DIR: str = os.path.join(BASE_DIR, "sample_data")
    
    # Security & Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "cybersutra-secret-key-rajasthan-police-hackathon-2025")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Optional Threat Intel API Keys
    VIRUSTOTAL_API_KEY: Optional[str] = os.getenv("VIRUSTOTAL_API_KEY", None)
    PHISHTANK_API_KEY: Optional[str] = os.getenv("PHISHTANK_API_KEY", None)

settings = Settings()

try:
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    os.makedirs(settings.REPORT_DIR, exist_ok=True)
    os.makedirs(settings.SAMPLE_DIR, exist_ok=True)
except Exception:
    pass
