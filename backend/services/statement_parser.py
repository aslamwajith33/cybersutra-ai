import io
import csv
import re
import openpyxl
from datetime import datetime
from typing import Dict, Any, List, Tuple

try:
    import pypdf
    PYPDF_AVAILABLE = True
except ImportError:
    PYPDF_AVAILABLE = False

HEADER_SYNONYMS = {
    "date": ["date", "txn date", "transaction date", "value date", "trans date", "booking date"],
    "time": ["time", "txn time", "transaction time"],
    "txn_id": ["txn id", "transaction id", "txnid", "reference", "ref no", "reference no", "chq/ref no", "cheque no", "journal no"],
    "utr": ["utr", "utr number", "utr no", "rrn", "upi ref", "upi ref no", "imps ref", "neft ref"],
    "narration": ["narration", "description", "particulars", "remarks", "transaction details", "memo"],
    "debit": ["debit", "withdrawal", "dr", "debit amount", "withdrawn"],
    "credit": ["credit", "deposit", "cr", "credit amount", "deposited"],
    "balance": ["balance", "closing balance", "avail balance", "ledger balance"],
    "account": ["account", "account number", "acc no", "account no", "remitter a/c", "sender a/c"],
    "counterparty": ["counterparty", "counterparty account", "beneficiary account", "beneficiary a/c", "payee account", "receiver a/c", "to account"],
    "counterparty_name": ["counterparty name", "beneficiary name", "payee name", "receiver name"],
    "channel": ["channel", "mode", "type", "txn type", "payment mode"]
}

def detect_column_mappings(header_row: List[str]) -> Dict[str, str]:
    mapping = {}
    for std_field, synonyms in HEADER_SYNONYMS.items():
        for raw_h in header_row:
            if raw_h is None:
                continue
            clean_raw = str(raw_h).strip().lower()
            if clean_raw in synonyms or any(syn in clean_raw for syn in synonyms):
                mapping[std_field] = raw_h
                break
    return mapping

def clean_amount(val: Any) -> float:
    if val is None:
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    s = str(val).replace("₹", "").replace("Rs.", "").replace("Rs", "").replace("INR", "").replace(",", "").strip()
    if s.startswith("(") and s.endswith(")"):
        s = "-" + s[1:-1]
    try:
        return float(s)
    except ValueError:
        return 0.0

def parse_date_val(val: Any) -> datetime:
    if isinstance(val, datetime):
        return val
    if not val:
        return datetime.utcnow()
    
    val_str = str(val).strip()
    for fmt in (
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d",
        "%d/%m/%Y %H:%M:%S",
        "%d/%m/%Y",
        "%d-%m-%Y %H:%M:%S",
        "%d-%m-%Y",
        "%d-%b-%Y",
        "%d-%b-%Y %H:%M:%S",
        "%Y/%m/%d"
    ):
        try:
            return datetime.strptime(val_str, fmt)
        except ValueError:
            pass
    return datetime.utcnow()

def parse_pdf_statement(file_bytes: bytes) -> List[Dict[str, Any]]:
    """Extract tabular transactions from electronic PDF bank statement."""
    rows = []
    if not PYPDF_AVAILABLE:
        return rows

    reader = pypdf.PdfReader(io.BytesIO(file_bytes))
    full_text = ""
    for page in reader.pages:
        full_text += page.extract_text() or ""

    lines = full_text.split("\n")
    # Regex to find lines having dates and amounts
    date_regex = re.compile(r"(\d{2}[/-]\d{2}[/-]\d{4}|\d{4}-\d{2}-\d{2})")
    amount_regex = re.compile(r"(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)")

    idx = 1
    for line in lines:
        date_match = date_regex.search(line)
        if date_match:
            amounts = amount_regex.findall(line)
            if amounts:
                amt = clean_amount(amounts[0])
                if amt > 0:
                    rows.append({
                        "Date": date_match.group(1),
                        "Txn ID": f"TXN-PDF-{idx}",
                        "Narration": line[:80].strip(),
                        "Amount": amt,
                        "Debit": amt,
                        "Credit": 0,
                        "Account": "ACC-PRIMARY-PDF",
                        "Counterparty": f"BENEFICIARY-{idx}",
                        "UTR": f"UTR-PDF-{idx}"
                    })
                    idx += 1
    return rows

def parse_statement_file(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    """
    Ingest CSV, XLSX, or PDF bank statement with flexible schema normalization,
    duplicate suppression, and detailed row-by-row validation logging.
    """
    is_excel = filename.endswith(".xlsx") or filename.endswith(".xls")
    is_pdf = filename.endswith(".pdf")
    rows: List[Dict[str, Any]] = []

    if is_pdf:
        rows = parse_pdf_statement(file_bytes)
        headers = ["Date", "Txn ID", "Narration", "Amount", "Debit", "Credit", "Account", "Counterparty", "UTR"]
    elif is_excel:
        wb = openpyxl.load_workbook(io.BytesIO(file_bytes), data_only=True)
        sheet = wb.active
        all_lines = list(sheet.iter_rows(values_only=True))
        if not all_lines:
            raise ValueError("Excel worksheet is empty")
        header_idx = 0
        for i, line in enumerate(all_lines[:10]):
            text_line = [str(cell).lower() for cell in line if cell is not None]
            if any("date" in c or "amount" in c or "debit" in c or "balance" in c for c in text_line):
                header_idx = i
                break
        headers = [str(c).strip() if c is not None else f"col_{j}" for j, c in enumerate(all_lines[header_idx])]
        for line in all_lines[header_idx + 1:]:
            if any(cell is not None for cell in line):
                row_dict = {headers[j]: line[j] for j in range(min(len(headers), len(line)))}
                rows.append(row_dict)
    else:
        text_content = file_bytes.decode("utf-8", errors="ignore")
        reader = csv.reader(io.StringIO(text_content))
        all_lines = list(reader)
        if not all_lines:
            raise ValueError("CSV file is empty")
        header_idx = 0
        for i, line in enumerate(all_lines[:10]):
            text_line = [str(cell).lower() for cell in line]
            if any("date" in c or "amount" in c or "debit" in c or "balance" in c for c in text_line):
                header_idx = i
                break
        headers = [h.strip() for h in all_lines[header_idx]]
        for line in all_lines[header_idx + 1:]:
            if line and any(c.strip() for c in line):
                row_dict = {headers[j]: line[j] for j in range(min(len(headers), len(line)))}
                rows.append(row_dict)

    mappings = detect_column_mappings(headers)

    valid_transactions = []
    validation_log = []
    seen_tx_ids = set()
    total_debit = 0.0
    total_credit = 0.0
    duplicate_count = 0
    invalid_count = 0

    for idx, r in enumerate(rows, start=1):
        raw_date = r.get(mappings.get("date", ""))
        raw_txn_id = r.get(mappings.get("txn_id", ""))
        raw_utr = r.get(mappings.get("utr", ""))
        raw_debit = clean_amount(r.get(mappings.get("debit", "")))
        raw_credit = clean_amount(r.get(mappings.get("credit", "")))
        raw_balance = clean_amount(r.get(mappings.get("balance", "")))
        raw_narration = str(r.get(mappings.get("narration", ""), "")).strip()
        raw_account = str(r.get(mappings.get("account", ""), "")).strip() or "PRIMARY_ACCOUNT"
        raw_counterparty = str(r.get(mappings.get("counterparty", ""), "")).strip()
        raw_counterparty_name = str(r.get(mappings.get("counterparty_name", ""), "")).strip()
        raw_channel = str(r.get(mappings.get("channel", "UPI"))).strip() or "UPI"

        txn_id = str(raw_txn_id).strip() if raw_txn_id else f"TXN-IMPORT-{idx}-{int(datetime.utcnow().timestamp())}"
        utr_no = str(raw_utr).strip() if raw_utr else txn_id

        amount = raw_credit if raw_credit > 0 else raw_debit
        if amount <= 0:
            invalid_count += 1
            validation_log.append({
                "row": idx,
                "status": "INVALID",
                "reason": "Missing or zero transaction amount (debit and credit both zero)."
            })
            continue

        if txn_id in seen_tx_ids:
            duplicate_count += 1
            validation_log.append({
                "row": idx,
                "status": "DUPLICATE",
                "reason": f"Transaction reference '{txn_id}' already processed in this batch."
            })
            continue
        seen_tx_ids.add(txn_id)

        parsed_date = parse_date_val(raw_date)
        total_debit += raw_debit
        total_credit += raw_credit

        from_acc = raw_account if raw_debit > 0 else (raw_counterparty or "REMITTER_UNKNOWN")
        to_acc = raw_counterparty if raw_debit > 0 else raw_account
        if not to_acc:
            to_acc = "BENEFICIARY_UNKNOWN"

        valid_transactions.append({
            "transaction_id": txn_id,
            "utr_number": utr_no,
            "from_account": from_acc,
            "from_bank": "State Bank of India" if "sbi" in from_acc.lower() else "Remitter Bank",
            "to_account": to_acc,
            "to_bank": "HDFC Bank" if "hdfc" in to_acc.lower() else "Beneficiary Bank",
            "counterparty_name": raw_counterparty_name,
            "amount": amount,
            "debit_amount": raw_debit,
            "credit_amount": raw_credit,
            "balance": raw_balance,
            "timestamp": parsed_date,
            "upi_ref": utr_no,
            "channel": raw_channel,
            "narration": raw_narration,
            "source_file": filename,
            "source_record_ref": f"Row #{idx}"
        })

    return {
        "filename": filename,
        "total_rows_parsed": len(rows),
        "valid_transactions": valid_transactions,
        "total_records": len(valid_transactions),
        "duplicate_records": duplicate_count,
        "invalid_records": invalid_count,
        "total_debit": round(total_debit, 2),
        "total_credit": round(total_credit, 2),
        "column_mappings": mappings,
        "validation_log": validation_log[:50]
    }
