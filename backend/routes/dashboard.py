from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import Dict, Any
from ..database import get_db
from ..models import Case, Complaint, URLAnalysis, APKAnalysis, Transaction, SystemAlert

router = APIRouter(prefix="/dashboard", tags=["Dashboard Intelligence"])

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_cases = db.query(Case).count()
    active_cases = db.query(Case).filter(Case.status.in_(["Active", "Under Investigation"])).count()
    high_risk_cases = db.query(Case).filter(Case.priority.in_(["High", "Critical"])).count()
    
    total_complaints = db.query(Complaint).count()
    total_urls = db.query(URLAnalysis).count()
    suspicious_urls = db.query(URLAnalysis).filter(URLAnalysis.risk_score >= 50).count()
    analyzed_apks = db.query(APKAnalysis).count()
    
    flagged_txns = db.query(Transaction).filter(
        (Transaction.is_mule_account == True) | (Transaction.risk_score >= 50)
    ).count()

    # Total loss sum
    total_loss = db.query(func.sum(Case.total_loss_amount)).scalar() or 0.0

    # Trend data: Complaints aggregated over past 7 intervals or days
    now = datetime.utcnow()
    trend_data = []
    for i in range(6, -1, -1):
        day_start = now - timedelta(days=i+1)
        day_end = now - timedelta(days=i)
        day_label = day_end.strftime("%d %b")
        count = db.query(Complaint).filter(Complaint.incident_date >= day_start, Complaint.incident_date < day_end).count()
        trend_data.append({"date": day_label, "complaints": count})

    # Fraud Category Distribution
    fraud_dist = []
    cat_counts = db.query(Case.category, func.count(Case.id)).group_by(Case.category).all()
    for cat, count in cat_counts:
        fraud_dist.append({"category": cat, "count": count})

    # Status breakdown
    status_dist = []
    st_counts = db.query(Case.status, func.count(Case.id)).group_by(Case.status).all()
    for st, count in st_counts:
        status_dist.append({"status": st, "count": count})

    # Transaction risk distribution
    tx_risks = [
        {"risk": "Critical", "count": db.query(Transaction).filter(Transaction.risk_score >= 75).count()},
        {"risk": "High", "count": db.query(Transaction).filter(Transaction.risk_score >= 50, Transaction.risk_score < 75).count()},
        {"risk": "Medium", "count": db.query(Transaction).filter(Transaction.risk_score >= 25, Transaction.risk_score < 50).count()},
        {"risk": "Low", "count": db.query(Transaction).filter(Transaction.risk_score < 25).count()},
    ]

    # Recent cases
    recent_cases = db.query(Case).order_by(Case.created_at.desc()).limit(5).all()
    recent_cases_data = [
        {
            "id": c.id,
            "case_number": c.case_number,
            "title": c.title,
            "category": c.category,
            "priority": c.priority,
            "status": c.status,
            "district": c.district,
            "total_loss_amount": c.total_loss_amount,
            "complaints_count": len(c.complaints),
            "created_at": c.created_at.isoformat() if c.created_at else None
        }
        for c in recent_cases
    ]

    # Priority alerts
    alerts = db.query(SystemAlert).order_by(SystemAlert.created_at.desc()).limit(5).all()
    alerts_data = [
        {
            "id": a.id,
            "case_id": a.case_id,
            "title": a.title,
            "message": a.message,
            "severity": a.severity,
            "alert_type": a.alert_type,
            "created_at": a.created_at.isoformat() if a.created_at else None
        }
        for a in alerts
    ]

    return {
        "total_cases": total_cases,
        "active_investigations": active_cases,
        "high_risk_cases": high_risk_cases,
        "total_complaints": total_complaints,
        "flagged_transactions": flagged_txns,
        "suspicious_urls": suspicious_urls,
        "analyzed_apks": analyzed_apks,
        "total_loss_amount": total_loss,
        "complaints_trend": trend_data,
        "fraud_distribution": fraud_dist,
        "status_distribution": status_dist,
        "transaction_risk_distribution": tx_risks,
        "recent_cases": recent_cases_data,
        "priority_alerts": alerts_data
    }
