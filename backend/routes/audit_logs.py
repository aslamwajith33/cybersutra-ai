from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import AuditLog

router = APIRouter(prefix="/audit-logs", tags=["Audit Trail & Evidentiary Integrity"])

@router.get("")
def get_audit_logs(
    case_id: Optional[int] = None,
    action: Optional[str] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(AuditLog)
    if case_id:
        query = query.filter(AuditLog.case_id == case_id)
    if action:
        query = query.filter(AuditLog.action == action)

    logs = query.order_by(AuditLog.timestamp.desc()).limit(limit).all()
    return [
        {
            "id": l.id,
            "case_id": l.case_id,
            "action": l.action,
            "actor_name": l.actor_name,
            "actor_role": l.actor_role,
            "details": l.details,
            "ip_address": l.ip_address,
            "timestamp": l.timestamp.isoformat() if l.timestamp else None
        }
        for l in logs
    ]
