from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from ..database import get_db
from ..services.timeline_service import get_investigation_timeline

router = APIRouter(prefix="/timeline", tags=["Investigation Chronological Timeline"])

@router.get("", response_model=List[Dict[str, Any]])
def get_timeline(case_id: Optional[int] = None, db: Session = Depends(get_db)):
    """
    Returns an event-by-event chronological investigation timeline
    combining victim debit incidents, rapid multi-hop layering, and police interventions.
    """
    return get_investigation_timeline(db, case_id)
