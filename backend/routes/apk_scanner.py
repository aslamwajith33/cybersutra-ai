import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import APKAnalysis, Case
from ..schemas import APKAnalysisResponse
from ..config import settings
from ..services.apk_analyzer import analyze_apk_file

router = APIRouter(prefix="/apk-scanner", tags=["APK Static Scanner"])

@router.post("/scan", response_model=APKAnalysisResponse)
async def scan_apk(
    file: UploadFile = File(...),
    case_id: Optional[int] = Form(None),
    investigator_notes: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Upload and statically inspect Android APK without execution.
    Extracts permissions, manifest, dex strings, C2 endpoints, and hashes.
    """
    if not file.filename.endswith(".apk") and not file.filename.endswith(".zip"):
        raise HTTPException(status_code=400, detail="File must be an Android APK or ZIP archive")

    # Save uploaded file safely to UPLOAD_DIR
    temp_path = os.path.join(settings.UPLOAD_DIR, f"temp_{file.filename}")
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        analysis = analyze_apk_file(temp_path, file.filename)
    finally:
        # Keep copy in uploads directory with unique sha or cleanup
        pass

    apk_record = APKAnalysis(
        case_id=case_id,
        filename=analysis["filename"],
        package_name=analysis["package_name"],
        app_name=analysis["app_name"],
        version_name=analysis.get("version_name", "1.0"),
        sha256_hash=analysis["sha256_hash"],
        md5_hash=analysis["md5_hash"],
        file_size_bytes=analysis["file_size_bytes"],
        risk_score=analysis["risk_score"],
        risk_category=analysis["risk_category"],
        dangerous_permissions=analysis["dangerous_permissions"],
        normal_permissions=analysis["normal_permissions"],
        extracted_urls=analysis["extracted_urls"],
        extracted_ips=analysis["extracted_ips"],
        certificate_info=analysis["certificate_info"],
        threat_indicators=analysis["threat_indicators"],
        loan_shark_indicators=analysis["loan_shark_indicators"],
        investigator_notes=investigator_notes
    )
    db.add(apk_record)
    db.commit()
    db.refresh(apk_record)

    return apk_record

@router.get("/history", response_model=List[APKAnalysisResponse])
def get_apk_history(
    case_id: Optional[int] = None,
    risk_category: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(APKAnalysis)
    if case_id:
        query = query.filter(APKAnalysis.case_id == case_id)
    if risk_category:
        query = query.filter(APKAnalysis.risk_category == risk_category)

    return query.order_by(APKAnalysis.created_at.desc()).limit(limit).all()

@router.get("/{apk_id}", response_model=APKAnalysisResponse)
def get_apk_detail(apk_id: int, db: Session = Depends(get_db)):
    rec = db.query(APKAnalysis).filter(APKAnalysis.id == apk_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="APK analysis record not found")
    return rec
