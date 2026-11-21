from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from ..database import get_db
from ..services.evidence_correlation import build_investigation_graph, get_cross_case_correlations

router = APIRouter(prefix="/evidence", tags=["Digital Evidence Intelligence & Graph"])

@router.get("/graph")
def get_graph_data(
    case_id: Optional[int] = None,
    entity_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Returns Cytoscape.js compatible graph data structure containing nodes & edges,
    with cross-case syndicate links highlighted.
    """
    return build_investigation_graph(db, filter_case_id=case_id, entity_type_filter=entity_type)

@router.get("/cross-case-alerts")
def get_cross_case_alerts(db: Session = Depends(get_db)):
    """
    Finds digital identifiers (phone numbers, UPI IDs, bank accounts)
    linked across multiple distinct cybercrime FIRs/cases across Rajasthan districts.
    """
    return get_cross_case_correlations(db)
