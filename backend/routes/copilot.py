from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from pydantic import BaseModel
from ..database import get_db
from ..services.copilot_engine import query_copilot

router = APIRouter(prefix="/copilot", tags=["AI Investigation Copilot"])

class CopilotQueryRequest(BaseModel):
    query: str
    case_id: Optional[int] = None

@router.post("/query")
def ask_copilot(req: CopilotQueryRequest, db: Session = Depends(get_db)):
    """
    Query the AI Investigation Copilot with natural language.
    Produces explainable summaries, risk factor breakdowns, and SOP next steps.
    """
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    return query_copilot(req.query.strip(), req.case_id, db)
