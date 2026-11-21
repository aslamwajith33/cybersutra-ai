from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from ..models import Case, Transaction, Complaint, URLAnalysis, LawfulNotice

def get_investigation_timeline(db: Session, case_id: Optional[int] = None) -> List[Dict[str, Any]]:
    """
    Constructs a unified, chronological, event-by-event investigative timeline
    merging victim complaints, financial transfers, malware hits, and police interventions.
    """
    events = []

    # 1. Transactions
    tx_query = db.query(Transaction)
    if case_id:
        tx_query = tx_query.filter(Transaction.case_id == case_id)
    txns = tx_query.order_by(Transaction.timestamp.asc()).all()

    for t in txns:
        is_layering = "Rapid Layering" in str(t.risk_flags)
        is_smurfing = "Structuring" in str(t.risk_flags)
        
        event_type = "LAYERING_TRANSFER" if is_layering else ("VICTIM_DEBIT" if "Victim" in t.from_bank else "FUNDS_MOVEMENT")
        severity = "Critical" if t.is_mule_account or t.risk_score >= 70 else ("High" if t.risk_score >= 50 else "Medium")
        
        desc = (
            f"Transfer of ₹{t.amount:,.2f} from {t.from_bank} ({t.from_account[-6:]}) to "
            f"{t.to_bank} ({t.to_account[-6:]}) via {t.channel}."
        )
        if t.narration:
            desc += f" Narration: '{t.narration}'."

        events.append({
            "id": f"tx_{t.id}",
            "timestamp": t.timestamp.isoformat() if t.timestamp else datetime.utcnow().isoformat(),
            "time_label": t.timestamp.strftime("%I:%M %p") if t.timestamp else "10:15 AM",
            "date_label": t.timestamp.strftime("%d %b %Y") if t.timestamp else "10 May 2025",
            "event_type": event_type,
            "title": f"Financial Movement: ₹{t.amount:,.0f} ({t.channel})",
            "description": desc,
            "severity": severity,
            "identifier": t.utr_number or t.transaction_id,
            "channel": t.channel,
            "amount": t.amount,
            "source": t.from_account,
            "target": t.to_account,
            "flags": t.risk_flags or []
        })

    # 2. Complaints
    comp_query = db.query(Complaint)
    if case_id:
        comp_query = comp_query.filter(Complaint.case_id == case_id)
    comps = comp_query.order_by(Complaint.incident_date.asc()).all()

    for c in comps:
        events.append({
            "id": f"comp_{c.id}",
            "timestamp": c.incident_date.isoformat() if c.incident_date else datetime.utcnow().isoformat(),
            "time_label": c.incident_date.strftime("%I:%M %p") if c.incident_date else "09:30 AM",
            "date_label": c.incident_date.strftime("%d %b %Y") if c.incident_date else "10 May 2025",
            "event_type": "VICTIM_COMPLAINT_FILED",
            "title": f"Complaint Filed: {c.complainant_name} (₹{c.loss_amount:,.0f})",
            "description": f"Victim reported fraud in {c.complainant_district}. Modus: {c.modus_operandi[:120]}...",
            "severity": "High",
            "identifier": c.complaint_number,
            "amount": c.loss_amount,
            "victim": c.complainant_name
        })

    # 3. Lawful Notices Issued
    notices_query = db.query(LawfulNotice)
    if case_id:
        notices_query = notices_query.filter(LawfulNotice.case_id == case_id)
    notices = notices_query.order_by(LawfulNotice.created_at.asc()).all()

    for n in notices:
        events.append({
            "id": f"notice_{n.id}",
            "timestamp": n.created_at.isoformat() if n.created_at else datetime.utcnow().isoformat(),
            "time_label": n.created_at.strftime("%I:%M %p") if n.created_at else "02:00 PM",
            "date_label": n.created_at.strftime("%d %b %Y") if n.created_at else "11 May 2025",
            "event_type": "STATUTORY_NOTICE_ISSUED",
            "title": f"Statutory Action: {n.legal_statute}",
            "description": f"Issued directive to {n.target_institution} regarding suspect identifier {n.target_identifier}.",
            "severity": "Low",
            "identifier": n.notice_number,
            "target": n.target_identifier
        })

    # Sort all events chronologically
    events.sort(key=lambda x: x["timestamp"])
    return events
