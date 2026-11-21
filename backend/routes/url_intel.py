from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import URLAnalysis, Case
from ..schemas import URLAnalyzeRequest, URLAnalysisResponse
from ..services.url_analyzer import analyze_url

router = APIRouter(prefix="/url-intel", tags=["URL Intelligence"])

@router.post("/analyze", response_model=URLAnalysisResponse)
def analyze_suspicious_url(payload: URLAnalyzeRequest, db: Session = Depends(get_db)):
    """
    Perform deep static heuristic analysis of suspicious URL.
    Persists result to database if case_id is provided or for history.
    """
    if not payload.url:
        raise HTTPException(status_code=400, detail="URL is required")

    result = analyze_url(payload.url, payload.investigator_notes)

    url_record = URLAnalysis(
        case_id=payload.case_id,
        url=result["url"],
        domain=result["domain"],
        ip_address=result["ip_address"],
        scheme=result["scheme"],
        risk_score=result["risk_score"],
        risk_category=result["risk_category"],
        indicators=result["indicators"],
        explanation=result["explanation"],
        verification_steps=result["verification_steps"],
        is_shortener=result["is_shortener"],
        is_ip_host=result["is_ip_host"],
        is_suspicious_tld=result["is_suspicious_tld"],
        analysis_method=result["analysis_method"],
        investigator_notes=payload.investigator_notes
    )
    db.add(url_record)
    db.commit()
    db.refresh(url_record)

    return url_record

@router.get("/history", response_model=List[URLAnalysisResponse])
def get_url_history(
    case_id: Optional[int] = None,
    risk_category: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(URLAnalysis)
    if case_id:
        query = query.filter(URLAnalysis.case_id == case_id)
    if risk_category:
        query = query.filter(URLAnalysis.risk_category == risk_category)

    return query.order_by(URLAnalysis.created_at.desc()).limit(limit).all()

@router.get("/{url_id}", response_model=URLAnalysisResponse)
def get_url_detail(url_id: int, db: Session = Depends(get_db)):
    rec = db.query(URLAnalysis).filter(URLAnalysis.id == url_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="URL analysis record not found")
    return rec
