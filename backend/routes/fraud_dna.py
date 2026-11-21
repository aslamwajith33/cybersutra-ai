from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from ..database import get_db
from ..services.fraud_dna import generate_fraud_network_dna

router = APIRouter(prefix="/fraud-dna", tags=["Secret Weapon: Fraud Network DNA"])

@router.get("", response_model=List[Dict[str, Any]])
def get_fraud_dna(case_id: Optional[int] = None, db: Session = Depends(get_db)):
    """
    Secret Weapon Feature: Fraud Network DNA.
    Synthesizes identical genetic markers across disparate cybercrime complaints:
    same hosting, same DNS, same transaction smurfing pattern, same UPI syntax.
    """
    return generate_fraud_network_dna(db, case_id=case_id)
