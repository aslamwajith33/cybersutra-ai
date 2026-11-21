import os
import random
import datetime
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Case, InvestigationReport
from ..schemas import ReportCreateRequest, ReportResponse
from ..services.report_generator import generate_investigation_pdf
from ..config import settings

router = APIRouter(prefix="/reports", tags=["Investigation Reports"])

@router.get("", response_model=List[ReportResponse])
def get_reports(case_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(InvestigationReport)
    if case_id:
        query = query.filter(InvestigationReport.case_id == case_id)
    
    reports = query.order_by(InvestigationReport.created_at.desc()).all()
    results = []
    for r in reports:
        item = ReportResponse.model_validate(r)
        if r.case:
            item.case_title = r.case.title
        results.append(item)
    return results

@router.post("/generate", response_model=ReportResponse)
def generate_report(req: ReportCreateRequest, db: Session = Depends(get_db)):
    c = db.query(Case).filter(Case.id == req.case_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")

    rand_suffix = random.randint(100, 999)
    rep_num = f"REP-DOSSIER-{c.case_number}-{rand_suffix}"

    # Build findings dict
    findings = {
        "case_number": c.case_number,
        "complaints_count": len(c.complaints),
        "urls_count": len(c.urls),
        "apks_count": len(c.apks),
        "transactions_count": len(c.transactions),
        "flagged_transactions": sum(1 for t in c.transactions if t.is_mule_account or t.risk_score >= 50),
        "total_financial_loss": c.total_loss_amount
    }

    recs = [
        "Issue Section 91 Cr.P.C. requisition to beneficiary banks for transactional freeze.",
        "Submit Section 69A IT Act takedown request to CERT-In / NCIIPC for identified domains.",
        "Requisition Call Detail Records (CDR) and Subscriber Information (CAF) for suspect numbers from TSPs.",
        "Preserve SHA-256 digital evidence hashes for trial evidence admissibility under Indian Evidence Act."
    ]

    # Generate PDF using ReportLab
    try:
        pdf_filename = generate_investigation_pdf(
            case=c,
            report_number=rep_num,
            generated_by=req.generated_by or "Insp. Vikram Rathore, IO",
            findings=findings
        )
    except Exception as e:
        pdf_filename = None
        print(f"PDF generation error: {e}")

    summary_text = (
        f"Official digital forensics and evidence intelligence dossier for Case {c.case_number}. "
        f"Synthesizes cross-case entity correlation, identified mule banking nodes, "
        f"and static URL/APK malware indicators under IT Act 2000 and BNS provisions."
    )

    new_rep = InvestigationReport(
        report_number=rep_num,
        case_id=c.id,
        title=req.title or f"Forensic Intelligence Dossier - {c.case_number}",
        generated_by=req.generated_by or "Insp. Vikram Rathore, IO",
        status="Final",
        summary=summary_text,
        findings=findings,
        recommendations=recs,
        pdf_filename=pdf_filename
    )
    db.add(new_rep)
    db.commit()
    db.refresh(new_rep)

    resp = ReportResponse.model_validate(new_rep)
    resp.case_title = c.title
    return resp

@router.get("/{report_id}/download")
def download_report_pdf(report_id: int, db: Session = Depends(get_db)):
    rep = db.query(InvestigationReport).filter(InvestigationReport.id == report_id).first()
    if not rep or not rep.pdf_filename:
        raise HTTPException(status_code=404, detail="PDF report not found or not generated")

    pdf_path = os.path.join(settings.REPORT_DIR, rep.pdf_filename)
    if not os.path.exists(pdf_path):
        # Regenerate on the fly if needed
        c = rep.case
        if c:
            generate_investigation_pdf(c, rep.report_number, rep.generated_by, rep.findings)
        if not os.path.exists(pdf_path):
            raise HTTPException(status_code=404, detail="PDF file missing on server disk")

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=rep.pdf_filename
    )
