import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Transaction, Case
from ..schemas import TransactionCreate, TransactionResponse
from ..services.financial_analyzer import analyze_transaction_batch, parse_csv_bank_statement

router = APIRouter(prefix="/financial", tags=["Financial Intelligence & Mule Detection"])

@router.get("/transactions", response_model=List[TransactionResponse])
def get_transactions(
    case_id: Optional[int] = None,
    is_mule: Optional[bool] = None,
    flagged_only: Optional[bool] = False,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Transaction)
    if case_id:
        query = query.filter(Transaction.case_id == case_id)
    if is_mule is not None:
        query = query.filter(Transaction.is_mule_account == is_mule)
    if flagged_only:
        query = query.filter(Transaction.risk_score >= 50)

    return query.order_by(Transaction.timestamp.desc()).limit(limit).all()

@router.post("/transactions", response_model=TransactionResponse)
def add_transaction(txn_in: TransactionCreate, db: Session = Depends(get_db)):
    # Check if transaction ID already exists
    existing = db.query(Transaction).filter(Transaction.transaction_id == txn_in.transaction_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Transaction ID already exists in repository")

    # Run single transaction analysis
    batch_res = analyze_transaction_batch([txn_in.model_dump()])
    scored = batch_res["flagged_records"][0] if batch_res["flagged_records"] else txn_in.model_dump()

    new_tx = Transaction(
        case_id=txn_in.case_id,
        transaction_id=txn_in.transaction_id,
        from_account=txn_in.from_account,
        from_bank=txn_in.from_bank or "Unknown",
        to_account=txn_in.to_account,
        to_bank=txn_in.to_bank or "Unknown",
        amount=txn_in.amount,
        timestamp=txn_in.timestamp or datetime.datetime.utcnow(),
        upi_ref=txn_in.upi_ref,
        channel=txn_in.channel or "UPI",
        risk_score=scored.get("risk_score", 0),
        risk_flags=scored.get("risk_flags", []),
        is_mule_account=scored.get("is_flagged", False),
        mule_risk_level="High" if scored.get("risk_score", 0) >= 60 else ("Medium" if scored.get("risk_score", 0) >= 30 else "Low"),
        notes=txn_in.notes
    )
    db.add(new_tx)
    db.commit()
    db.refresh(new_tx)
    return new_tx

@router.post("/upload-statement")
async def upload_bank_statement(
    file: UploadFile = File(...),
    case_id: Optional[int] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Upload and parse bank / UPI transaction statements (CSV).
    Automatically flags rapid layering, structuring below ₹50,000, and mule account patterns.
    """
    if not file.filename.endswith(".csv") and not file.filename.endswith(".txt"):
        raise HTTPException(status_code=400, detail="File must be a CSV format bank statement")

    content = await file.read()
    csv_text = content.decode("utf-8", errors="ignore")

    parsed_txns = parse_csv_bank_statement(csv_text, case_id)
    if not parsed_txns:
        raise HTTPException(status_code=400, detail="No valid transactions parsed from CSV. Please check column headers.")

    # Run batch forensic analysis
    analysis_result = analyze_transaction_batch(parsed_txns)

    # Save to database
    saved_records = []
    for item in analysis_result["flagged_records"]:
        # Check duplicate
        exists = db.query(Transaction).filter(Transaction.transaction_id == item["transaction_id"]).first()
        if not exists:
            db_item = Transaction(
                case_id=case_id,
                transaction_id=item["transaction_id"],
                from_account=item["from_account"],
                from_bank=item.get("from_bank", "Unknown"),
                to_account=item["to_account"],
                to_bank=item.get("to_bank", "Unknown"),
                amount=item["amount"],
                timestamp=item.get("timestamp") or datetime.datetime.utcnow(),
                upi_ref=item.get("upi_ref"),
                channel=item.get("channel", "UPI"),
                risk_score=item.get("risk_score", 0),
                risk_flags=item.get("risk_flags", []),
                is_mule_account=item.get("is_flagged", False),
                mule_risk_level="High" if item.get("risk_score", 0) >= 60 else "Low",
                notes=item.get("notes")
            )
            db.add(db_item)
            saved_records.append(db_item)

    db.commit()

    return {
        "status": "success",
        "imported_count": len(saved_records),
        "total_volume": analysis_result["total_volume"],
        "flagged_count": analysis_result["flagged_transactions"],
        "mule_accounts_identified": len(analysis_result["mule_accounts"]),
        "mule_accounts": analysis_result["mule_accounts"],
        "layering_chains": analysis_result["layering_chains"],
        "structuring_alerts": analysis_result["structuring_alerts"]
    }

@router.get("/mule-analysis")
def get_mule_analysis(case_id: Optional[int] = None, db: Session = Depends(get_db)):
    """
    Run comprehensive mule account and layering analysis across all recorded transactions.
    """
    query = db.query(Transaction)
    if case_id:
        query = query.filter(Transaction.case_id == case_id)
    txns = query.all()

    tx_dicts = [
        {
            "id": t.id,
            "case_id": t.case_id,
            "transaction_id": t.transaction_id,
            "from_account": t.from_account,
            "from_bank": t.from_bank,
            "to_account": t.to_account,
            "to_bank": t.to_bank,
            "amount": t.amount,
            "timestamp": t.timestamp,
            "upi_ref": t.upi_ref,
            "channel": t.channel,
            "notes": t.notes
        }
        for t in txns
    ]

    return analyze_transaction_batch(tx_dicts)
