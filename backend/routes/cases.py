import datetime
import random
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Case, Complaint, URLAnalysis, APKAnalysis, Transaction, InvestigationReport
from ..schemas import CaseCreate, CaseUpdate, CaseResponse, ComplaintCreate, ComplaintResponse

router = APIRouter(prefix="/cases", tags=["Case Management"])

@router.get("", response_model=List[CaseResponse])
def get_cases(
    search: Optional[str] = None,
    category: Optional[str] = None,
    priority: Optional[str] = None,
    status: Optional[str] = None,
    district: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Case)

    if search:
        s = f"%{search}%"
        query = query.filter((Case.case_number.ilike(s)) | (Case.title.ilike(s)) | (Case.description.ilike(s)))
    if category:
        query = query.filter(Case.category == category)
    if priority:
        query = query.filter(Case.priority == priority)
    if status:
        query = query.filter(Case.status == status)
    if district:
        query = query.filter(Case.district == district)

    cases = query.order_by(Case.created_at.desc()).all()
    
    result = []
    for c in cases:
        resp = CaseResponse.model_validate(c)
        resp.complaints_count = len(c.complaints)
        resp.evidence_count = len(c.urls) + len(c.apks)
        resp.flagged_transactions_count = sum(1 for t in c.transactions if t.is_mule_account or t.risk_score >= 50)
        result.append(resp)
    return result

@router.post("", response_model=CaseResponse)
def create_case(case_in: CaseCreate, db: Session = Depends(get_db)):
    case_num = case_in.case_number
    if not case_num:
        rand_suffix = random.randint(100, 999)
        case_num = f"RJ-CC-{datetime.datetime.utcnow().year}-{rand_suffix}"

    new_case = Case(
        case_number=case_num,
        title=case_in.title,
        description=case_in.description,
        category=case_in.category,
        priority=case_in.priority,
        status=case_in.status,
        police_station=case_in.police_station or "Jaipur Cyber Crime Police Station",
        district=case_in.district or "Jaipur",
        investigating_officer=case_in.investigating_officer or "Insp. Vikram Rathore",
        total_loss_amount=case_in.total_loss_amount or 0.0
    )
    db.add(new_case)
    db.commit()
    db.refresh(new_case)
    return new_case

@router.get("/{case_id}")
def get_case_detail(case_id: int, db: Session = Depends(get_db)):
    c = db.query(Case).filter(Case.id == case_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")

    complaints_data = [
        {
            "id": comp.id,
            "complaint_number": comp.complaint_number,
            "complainant_name": comp.complainant_name,
            "complainant_phone": comp.complainant_phone,
            "complainant_district": comp.complainant_district,
            "loss_amount": comp.loss_amount,
            "category": comp.category,
            "modus_operandi": comp.modus_operandi,
            "suspect_phone": comp.suspect_phone,
            "suspect_upi": comp.suspect_upi,
            "suspect_bank_acc": comp.suspect_bank_acc,
            "suspect_url": comp.suspect_url,
            "notes": comp.notes,
            "incident_date": comp.incident_date.isoformat() if comp.incident_date else None,
            "created_at": comp.created_at.isoformat() if comp.created_at else None
        }
        for comp in c.complaints
    ]

    urls_data = [
        {
            "id": u.id,
            "url": u.url,
            "domain": u.domain,
            "risk_score": u.risk_score,
            "risk_category": u.risk_category,
            "indicators": u.indicators,
            "explanation": u.explanation,
            "verification_steps": u.verification_steps,
            "investigator_notes": u.investigator_notes,
            "created_at": u.created_at.isoformat() if u.created_at else None
        }
        for u in c.urls
    ]

    apks_data = [
        {
            "id": a.id,
            "filename": a.filename,
            "package_name": a.package_name,
            "app_name": a.app_name,
            "sha256_hash": a.sha256_hash,
            "file_size_bytes": a.file_size_bytes,
            "risk_score": a.risk_score,
            "risk_category": a.risk_category,
            "dangerous_permissions": a.dangerous_permissions,
            "threat_indicators": a.threat_indicators,
            "extracted_urls": a.extracted_urls,
            "extracted_ips": a.extracted_ips,
            "investigator_notes": a.investigator_notes,
            "created_at": a.created_at.isoformat() if a.created_at else None
        }
        for a in c.apks
    ]

    txns_data = [
        {
            "id": t.id,
            "transaction_id": t.transaction_id,
            "from_account": t.from_account,
            "from_bank": t.from_bank,
            "to_account": t.to_account,
            "to_bank": t.to_bank,
            "amount": t.amount,
            "timestamp": t.timestamp.isoformat() if t.timestamp else None,
            "channel": t.channel,
            "risk_score": t.risk_score,
            "risk_flags": t.risk_flags,
            "is_mule_account": t.is_mule_account,
            "mule_risk_level": t.mule_risk_level
        }
        for t in c.transactions
    ]

    reports_data = [
        {
            "id": r.id,
            "report_number": r.report_number,
            "title": r.title,
            "generated_by": r.generated_by,
            "status": r.status,
            "pdf_filename": r.pdf_filename,
            "created_at": r.created_at.isoformat() if r.created_at else None
        }
        for r in c.reports
    ]

    return {
        "id": c.id,
        "case_number": c.case_number,
        "title": c.title,
        "description": c.description,
        "category": c.category,
        "priority": c.priority,
        "status": c.status,
        "police_station": c.police_station,
        "district": c.district,
        "investigating_officer": c.investigating_officer,
        "total_loss_amount": c.total_loss_amount,
        "created_at": c.created_at.isoformat() if c.created_at else None,
        "updated_at": c.updated_at.isoformat() if c.updated_at else None,
        "complaints": complaints_data,
        "urls": urls_data,
        "apks": apks_data,
        "transactions": txns_data,
        "reports": reports_data
    }

@router.put("/{case_id}", response_model=CaseResponse)
def update_case(case_id: int, case_in: CaseUpdate, db: Session = Depends(get_db)):
    c = db.query(Case).filter(Case.id == case_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")

    update_data = case_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(c, field, value)

    c.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(c)
    return c

@router.post("/{case_id}/complaints", response_model=ComplaintResponse)
def add_complaint_to_case(case_id: int, complaint_in: ComplaintCreate, db: Session = Depends(get_db)):
    c = db.query(Case).filter(Case.id == case_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")

    complaint_num = complaint_in.complaint_number
    if not complaint_num:
        rand_suffix = random.randint(1000, 9999)
        complaint_num = f"NCRP-{datetime.datetime.utcnow().year}-{rand_suffix}"

    new_comp = Complaint(
        complaint_number=complaint_num,
        case_id=case_id,
        complainant_name=complaint_in.complainant_name,
        complainant_phone=complaint_in.complainant_phone,
        complainant_district=complaint_in.complainant_district or c.district,
        loss_amount=complaint_in.loss_amount or 0.0,
        category=complaint_in.category or c.category,
        modus_operandi=complaint_in.modus_operandi,
        suspect_phone=complaint_in.suspect_phone,
        suspect_upi=complaint_in.suspect_upi,
        suspect_bank_acc=complaint_in.suspect_bank_acc,
        suspect_url=complaint_in.suspect_url,
        notes=complaint_in.notes
    )
    db.add(new_comp)

    # Update case loss amount
    c.total_loss_amount = (c.total_loss_amount or 0.0) + (complaint_in.loss_amount or 0.0)
    db.commit()
    db.refresh(new_comp)
    return new_comp
