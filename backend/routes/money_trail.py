from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..services.money_trail_tracker import trace_money_trail

router = APIRouter(prefix="/money-trail", tags=["Money Trail Explorer"])

@router.get("/trace")
def trace_trail(
    query: str = Query(..., description="UTR number, transaction ID, or bank account to trace"),
    case_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Trace multi-hop money movement originating from a victim debit reference (UTR)
    across subsequent intermediary mule accounts.
    """
    if not query.strip():
        raise HTTPException(status_code=400, detail="Search reference query is required")

    result = trace_money_trail(db, query.strip(), case_id)
    return result
