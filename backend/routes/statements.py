from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import StatementImport, Transaction, Case, AuditLog
from ..services.statement_parser import parse_statement_file
from ..services.financial_analyzer import analyze_transaction_batch

router = APIRouter(prefix="/statements", tags=["Statement Intelligence"])

@router.post("/upload")
async def upload_statement(
    file: UploadFile = File(...),
    case_id: Optional[int] = Form(None),
    bank_name: Optional[str] = Form("State Bank of India"),
    db: Session = Depends(get_db)
):
    """
    Upload and normalize bank or UPI statements (.csv, .xlsx).
    Extracts debit, credit, balance, counterparty, UTR references and flags anomalies.
    """
    if not (file.filename.endswith(".csv") or file.filename.endswith(".xlsx") or file.filename.endswith(".xls")):
        raise HTTPException(status_code=400, detail="Supported formats are .csv and .xlsx")

    content = await file.read()
    try:
        parsed = parse_statement_file(content, file.filename)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse statement: {str(e)}")

    # Run mule & layering detection on the parsed batch
    analysis_res = analyze_transaction_batch(parsed["valid_transactions"])

    # Create StatementImport record
    statement_rec = StatementImport(
        case_id=case_id,
        filename=file.filename,
        file_type="XLSX" if file.filename.endswith(".xlsx") else "CSV",
        file_size_bytes=len(content),
        bank_name=bank_name,
        total_records=parsed["total_records"],
        valid_records=len(parsed["valid_transactions"]),
        duplicate_records=parsed["duplicate_records"],
        invalid_records=parsed["invalid_records"],
        total_debit=parsed["total_debit"],
        total_credit=parsed["total_credit"],
        validation_log=parsed["validation_log"]
    )
    db.add(statement_rec)
    db.commit()
    db.refresh(statement_rec)

    # Save normalized transactions to database
    saved_txns = []
    for t in analysis_res["flagged_records"]:
        existing = db.query(Transaction).filter(Transaction.transaction_id == t["transaction_id"]).first()
        if not existing:
            new_t = Transaction(
                case_id=case_id,
                statement_import_id=statement_rec.id,
                transaction_id=t["transaction_id"],
                utr_number=t.get("utr_number") or t.get("upi_ref") or t["transaction_id"],
                from_account=t["from_account"],
                from_bank=t.get("from_bank", bank_name),
                to_account=t["to_account"],
                to_bank=t.get("to_bank", "Unknown"),
                counterparty_name=t.get("counterparty_name"),
                amount=t["amount"],
                debit_amount=t.get("debit_amount", 0.0),
                credit_amount=t.get("credit_amount", 0.0),
                balance=t.get("balance", 0.0),
                timestamp=t.get("timestamp"),
                channel=t.get("channel", "UPI"),
                narration=t.get("narration"),
                risk_score=t.get("risk_score", 0),
                risk_flags=t.get("risk_flags", []),
                is_mule_account=t.get("is_flagged", False),
                mule_risk_level="High" if t.get("risk_score", 0) >= 50 else "Low",
                source_file=file.filename,
                source_record_ref=t.get("source_record_ref")
            )
            db.add(new_t)
            saved_txns.append(new_t)

    # Log to immutable audit trail
    audit = AuditLog(
        case_id=case_id,
        action="STATEMENT_INGESTED",
        actor_name="Insp. Vikram Rathore",
        actor_role="Investigating Officer",
        details=f"Normalized statement '{file.filename}' ({len(saved_txns)} valid records, ₹{parsed['total_credit']:,.2f} credits)."
    )
    db.add(audit)
    db.commit()

    return {
        "statement_import_id": statement_rec.id,
        "filename": file.filename,
        "total_records": parsed["total_records"],
        "valid_records": len(saved_txns),
        "duplicate_records": parsed["duplicate_records"],
        "invalid_records": parsed["invalid_records"],
        "total_debit": parsed["total_debit"],
        "total_credit": parsed["total_credit"],
        "column_mappings": parsed["column_mappings"],
        "mule_accounts_flagged": len(analysis_res["mule_accounts"]),
        "mule_accounts": analysis_res["mule_accounts"],
        "layering_chains": analysis_res["layering_chains"],
        "structuring_alerts": analysis_res["structuring_alerts"],
        "validation_log": parsed["validation_log"]
    }

@router.get("/history")
def get_statement_history(case_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(StatementImport)
    if case_id:
        query = query.filter(StatementImport.case_id == case_id)
    return query.order_by(StatementImport.created_at.desc()).all()

@router.get("/{import_id}/validation-report")
def get_validation_report(import_id: int, db: Session = Depends(get_db)):
    rec = db.query(StatementImport).filter(StatementImport.id == import_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Statement import record not found")
    
    return {
        "statement_id": rec.id,
        "filename": rec.filename,
        "bank_name": rec.bank_name,
        "file_type": rec.file_type,
        "file_size_bytes": rec.file_size_bytes,
        "total_records": rec.total_records,
        "valid_records": rec.valid_records,
        "duplicate_records": rec.duplicate_records,
        "invalid_records": rec.invalid_records,
        "total_debit": rec.total_debit,
        "total_credit": rec.total_credit,
        "imported_by": rec.imported_by,
        "created_at": rec.created_at.isoformat() if rec.created_at else None,
        "validation_log": rec.validation_log
    }
