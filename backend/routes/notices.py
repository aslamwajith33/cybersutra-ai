from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from ..database import get_db
from ..models import LawfulNotice, Case, AuditLog
from ..services.notice_generator import generate_lawful_notice_text

router = APIRouter(prefix="/notices", tags=["Statutory Lawful Notices (Sec 91/102 CrPC)"])

class NoticeDraftRequest(BaseModel):
    case_id: int
    notice_type: str = "SECTION_91_CRPC"  # SECTION_91_CRPC, SECTION_102_CRPC, SECTION_69A_IT
    target_institution: str  # e.g. "HDFC Bank Fraud Risk Nodal Officer"
    target_identifier: str   # e.g. "HDFC-501004928172"
    issuing_officer: Optional[str] = "Insp. Vikram Rathore, IO"

@router.post("/draft")
def draft_notice(req: NoticeDraftRequest, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.id == req.case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    notice_dict = generate_lawful_notice_text(
        notice_type=req.notice_type,
        case=case,
        target_institution=req.target_institution,
        target_identifier=req.target_identifier,
        issuing_officer=req.issuing_officer or "Insp. Vikram Rathore, IO"
    )

    new_notice = LawfulNotice(
        case_id=case.id,
        notice_number=notice_dict["notice_number"],
        notice_type=notice_dict["notice_type"],
        target_institution=notice_dict["target_institution"],
        target_identifier=notice_dict["target_identifier"],
        subject=notice_dict["subject"],
        legal_statute=notice_dict["legal_statute"],
        content_text=notice_dict["content_text"],
        issuing_officer=notice_dict["issuing_officer"],
        status="Issued"
    )
    db.add(new_notice)

    # Log to audit trail
    audit = AuditLog(
        case_id=case.id,
        action="NOTICE_ISSUED",
        actor_name=req.issuing_officer or "Insp. Vikram Rathore",
        actor_role="Investigating Officer",
        details=f"Issued statutory {notice_dict['legal_statute']} notice to {req.target_institution} regarding identifier '{req.target_identifier}'."
    )
    db.add(audit)
    db.commit()
    db.refresh(new_notice)

    return new_notice

@router.get("")
def get_notices(case_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(LawfulNotice)
    if case_id:
        query = query.filter(LawfulNotice.case_id == case_id)
    return query.order_by(LawfulNotice.created_at.desc()).all()

@router.get("/{notice_id}")
def get_notice_detail(notice_id: int, db: Session = Depends(get_db)):
    notice = db.query(LawfulNotice).filter(LawfulNotice.id == notice_id).first()
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    return notice
