from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from ..database import get_db
from ..models import DomainIPIntelligence, Case, AuditLog
from ..services.infrastructure_intel import analyze_digital_infrastructure

router = APIRouter(prefix="/infrastructure", tags=["Domain & IP Intelligence"])

@router.get("/analyze")
def analyze_infra(
    identifier: str = Query(..., description="Domain name or IP address to inspect"),
    case_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Forensically inspect digital infrastructure and correlate DNS/hosting/SSL
    to cybercrime mule accounts and victim loss.
    """
    if not identifier.strip():
        raise HTTPException(status_code=400, detail="Identifier is required")

    result = analyze_digital_infrastructure(identifier.strip(), case_id, db)

    # Persist or update record
    rec = db.query(DomainIPIntelligence).filter(DomainIPIntelligence.identifier == result["identifier"]).first()
    if not rec:
        rec = DomainIPIntelligence(
            case_id=case_id,
            identifier=result["identifier"],
            entity_type=result["entity_type"],
            registrar_or_asn=result["registrar_or_asn"],
            hosting_provider=result["hosting_provider"],
            country_code=result["country_code"],
            city=result["city"],
            dns_records=result["dns_records"],
            ssl_issuer=result["ssl_issuer"],
            ssl_valid_until=result["ssl_valid_until"],
            linked_bank_accounts=result["linked_bank_accounts"],
            linked_upi_ids=result["linked_upi_ids"],
            linked_victim_loss=result["linked_victim_loss"],
            risk_score=result["risk_score"],
            risk_category=result["risk_category"],
            threat_classification=result["threat_classification"],
            technical_summary=result["technical_summary"]
        )
        db.add(rec)
        db.commit()
        db.refresh(rec)

    return result

@router.get("/history")
def get_infra_history(case_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(DomainIPIntelligence)
    if case_id:
        query = query.filter(DomainIPIntelligence.case_id == case_id)
    records = query.order_by(DomainIPIntelligence.created_at.desc()).all()
    
    return [
        {
            "id": r.id,
            "identifier": r.identifier,
            "entity_type": r.entity_type,
            "registrar_or_asn": r.registrar_or_asn,
            "hosting_provider": r.hosting_provider,
            "country_code": r.country_code,
            "city": r.city,
            "dns_records": r.dns_records,
            "ssl_issuer": r.ssl_issuer,
            "ssl_valid_until": r.ssl_valid_until,
            "linked_bank_accounts": r.linked_bank_accounts,
            "linked_upi_ids": r.linked_upi_ids,
            "linked_victim_loss": r.linked_victim_loss,
            "risk_score": r.risk_score,
            "risk_category": r.risk_category,
            "threat_classification": r.threat_classification,
            "technical_summary": r.technical_summary,
            "created_at": r.created_at.isoformat() if r.created_at else None
        }
        for r in records
    ]
