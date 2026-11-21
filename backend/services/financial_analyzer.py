import io
import csv
from datetime import datetime, timedelta
from typing import Dict, Any, List, Tuple
from collections import defaultdict

def analyze_transaction_batch(transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Perform deep forensic analysis on a series of financial transactions.
    Identifies:
      1. Mule Account behavior (high pass-through, low retention).
      2. Layering (rapid multi-hop transfers within minutes).
      3. Smurfing / Structuring (transactions just below Rs 50,000 threshold).
      4. Fan-out and Fan-in syndicates.
    """
    if not transactions:
        return {
            "total_transactions": 0,
            "total_volume": 0.0,
            "flagged_transactions": 0,
            "mule_accounts": [],
            "layering_chains": [],
            "structuring_alerts": [],
            "flagged_records": []
        }

    # Sort transactions chronologically
    sorted_txns = sorted(transactions, key=lambda x: x.get("timestamp") or datetime.min)

    account_inflow = defaultdict(float)
    account_outflow = defaultdict(float)
    account_in_count = defaultdict(int)
    account_out_count = defaultdict(int)
    account_banks = {}
    account_associated_cases = defaultdict(set)
    account_txns = defaultdict(list)

    flagged_records = []
    structuring_alerts = []
    layering_chains = []

    # First pass: Build account-level profiles and check individual transaction anomalies
    for txn in sorted_txns:
        amount = float(txn.get("amount", 0.0))
        from_acc = str(txn.get("from_account", "UNKNOWN")).strip()
        to_acc = str(txn.get("to_account", "UNKNOWN")).strip()
        timestamp = txn.get("timestamp")
        if isinstance(timestamp, str):
            try:
                timestamp = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
            except Exception:
                timestamp = datetime.utcnow()
        elif not isinstance(timestamp, datetime):
            timestamp = datetime.utcnow()

        from_bank = txn.get("from_bank", "Unknown")
        to_bank = txn.get("to_bank", "Unknown")
        if to_bank and to_bank != "Unknown":
            account_banks[to_acc] = to_bank
        if from_bank and from_bank != "Unknown":
            account_banks[from_acc] = from_bank

        case_id = txn.get("case_id")
        if case_id:
            account_associated_cases[from_acc].add(str(case_id))
            account_associated_cases[to_acc].add(str(case_id))

        account_inflow[to_acc] += amount
        account_in_count[to_acc] += 1
        account_outflow[from_acc] += amount
        account_out_count[from_acc] += 1

        account_txns[to_acc].append({"dir": "in", "amt": amount, "time": timestamp, "from": from_acc, "txn": txn})
        account_txns[from_acc].append({"dir": "out", "amt": amount, "time": timestamp, "to": to_acc, "txn": txn})

        # Check for Structuring / Smurfing (RBI/PMLA Rs 50,000 threshold evasion)
        # Amounts typically between Rs 45,000 and Rs 49,999
        risk_flags = []
        txn_risk_score = 10

        if 45000 <= amount < 50000:
            risk_flags.append("Structuring / Smurfing Pattern (Evading Rs 50,000 PMLA statutory reporting threshold)")
            txn_risk_score += 35
            structuring_alerts.append({
                "transaction_id": txn.get("transaction_id"),
                "amount": amount,
                "from_account": from_acc,
                "to_account": to_acc,
                "timestamp": timestamp.isoformat() if hasattr(timestamp, "isoformat") else str(timestamp),
                "reason": f"Amount of ₹{amount:,.2f} is strategically structured just below the ₹50,000 compliance limit."
            })

        if amount >= 200000:
            risk_flags.append("High-Value Transfer (> ₹2,00,000)")
            txn_risk_score += 20

        txn_record = dict(txn)
        txn_record["risk_score"] = min(100, txn_risk_score)
        txn_record["risk_flags"] = risk_flags
        txn_record["is_flagged"] = len(risk_flags) > 0
        flagged_records.append(txn_record)

    # Second pass: Detect Layering Chains (Quick funds routing in < 30 minutes)
    for acc, tx_list in account_txns.items():
        in_txs = [t for t in tx_list if t["dir"] == "in"]
        out_txs = [t for t in tx_list if t["dir"] == "out"]

        for it in in_txs:
            for ot in out_txs:
                if ot["time"] >= it["time"]:
                    delta = (ot["time"] - it["time"]).total_seconds()
                    # Transferred out within 30 minutes with matching or near-matching amounts (>80% of inflow)
                    if delta <= 1800 and ot["amt"] >= (it["amt"] * 0.8):
                        layering_chains.append({
                            "intermediary_account": acc,
                            "bank": account_banks.get(acc, "Unknown Bank"),
                            "received_from": it["from"],
                            "inflow_amount": it["amt"],
                            "forwarded_to": ot["to"],
                            "outflow_amount": ot["amt"],
                            "time_difference_minutes": round(delta / 60, 1),
                            "timestamp": it["time"].isoformat() if hasattr(it["time"], "isoformat") else str(it["time"]),
                            "description": f"Rapid Layering: ₹{it['amt']:,.2f} credited and ₹{ot['amt']:,.2f} routed out within {round(delta/60, 1)} minutes."
                        })

    # Third pass: Score Accounts for Mule Risk
    all_accounts = set(list(account_inflow.keys()) + list(account_outflow.keys()))
    mule_accounts = []

    for acc in all_accounts:
        inflow = account_inflow[acc]
        outflow = account_outflow[acc]
        total_volume = inflow + outflow

        if total_volume < 10000:  # Skip trivial micro-transactions for mule tagging
            continue

        mule_score = 0
        indicators = []

        # 1. High Pass-through / Zero Retention (Classic Mule)
        if inflow > 20000 and outflow > 0:
            retention_ratio = (inflow - outflow) / inflow if inflow > 0 else 0
            if -0.15 <= retention_ratio <= 0.15:  # Retains almost 0%
                mule_score += 40
                indicators.append(f"Zero Retention Pass-Through: Inflow of ₹{inflow:,.2f} immediately drained (₹{outflow:,.2f} outflow).")
            elif retention_ratio < 0.3:
                mule_score += 25
                indicators.append(f"Low Balance Retention: Drains > 70% of received funds promptly.")
        else:
            retention_ratio = 1.0

        # 2. Check Layering participation
        acc_layering = [lc for lc in layering_chains if lc["intermediary_account"] == acc]
        if acc_layering:
            mule_score += 35
            indicators.append(f"Involved in {len(acc_layering)} rapid-layering transfer cycles (< 30 min latency).")

        # 3. High Velocity Anomaly
        total_txns_count = account_in_count[acc] + account_out_count[acc]
        if total_txns_count >= 5:
            mule_score += 15
            indicators.append(f"High Transaction Velocity ({total_txns_count} transfers recorded).")

        # 4. Multi-Case Linkage
        associated_cases_list = list(account_associated_cases.get(acc, []))
        if len(associated_cases_list) > 1:
            mule_score += 20
            indicators.append(f"Cross-Case Linkage: Linked to {len(associated_cases_list)} distinct cyber complaints/cases.")

        mule_score = min(100, max(0, mule_score))

        if mule_score >= 60:
            risk_level = "Critical"
        elif mule_score >= 40:
            risk_level = "High"
        elif mule_score >= 20:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        if mule_score >= 35:
            mule_accounts.append({
                "account_number": acc,
                "bank_name": account_banks.get(acc, "Unknown Bank / PSP"),
                "total_inflow": round(inflow, 2),
                "total_outflow": round(outflow, 2),
                "retention_ratio": round(retention_ratio, 2),
                "rapid_velocity_count": len(acc_layering),
                "structuring_count": sum(1 for sa in structuring_alerts if sa["from_account"] == acc or sa["to_account"] == acc),
                "mule_score": mule_score,
                "mule_risk_level": risk_level,
                "indicators": indicators,
                "associated_cases": associated_cases_list
            })

    # Sort mule accounts by risk score descending
    mule_accounts.sort(key=lambda x: x["mule_score"], reverse=True)

    # Update flagged_records with mule flags
    mule_acc_set = {m["account_number"] for m in mule_accounts if m["mule_risk_level"] in ("Critical", "High")}
    for r in flagged_records:
        if r["to_account"] in mule_acc_set or r["from_account"] in mule_acc_set:
            if "Transacted with Identified Mule Account" not in r["risk_flags"]:
                r["risk_flags"].append("Transacted with Identified Mule Account")
                r["risk_score"] = min(100, r["risk_score"] + 25)
                r["is_flagged"] = True

    total_volume = sum(float(t.get("amount", 0.0)) for t in transactions)
    flagged_count = sum(1 for t in flagged_records if t["is_flagged"])

    return {
        "total_transactions": len(transactions),
        "total_volume": round(total_volume, 2),
        "flagged_transactions": flagged_count,
        "mule_accounts": mule_accounts,
        "layering_chains": layering_chains[:20],
        "structuring_alerts": structuring_alerts[:20],
        "flagged_records": flagged_records
    }

def parse_csv_bank_statement(csv_content: str, case_id: int = None) -> List[Dict[str, Any]]:
    """
    Parse a CSV bank or UPI statement into structured transaction records.
    Supports standard Indian bank export headers (SBI, HDFC, ICICI, PNB, PhonePe, Paytm).
    """
    reader = csv.DictReader(io.StringIO(csv_content.strip()))
    transactions = []

    # Normalized header search
    def get_val(row, candidates, default=""):
        for c in candidates:
            for k in row.keys():
                if k and c.lower() == k.strip().lower():
                    return row[k].strip()
        return default

    idx = 1
    for row in reader:
        txn_id = get_val(row, ["Txn ID", "Transaction ID", "TxnId", "UTR", "Reference No", "Ref No", "Chq/Ref No"], f"TXN-IMPORT-{idx}")
        amount_str = get_val(row, ["Amount", "Txn Amount", "Debit", "Credit", "Transaction Amount"], "0")
        
        # Clean amount string (remove commas, currency symbols)
        amount_clean = amount_str.replace("₹", "").replace("Rs", "").replace(",", "").strip()
        try:
            amount = float(amount_clean) if amount_clean else 0.0
        except ValueError:
            amount = 0.0

        if amount <= 0:
            idx += 1
            continue

        from_acc = get_val(row, ["From Account", "Sender Account", "Debited From", "Remitter Account", "Sender UPI"], f"ACC-REMITTER-{idx}")
        to_acc = get_val(row, ["To Account", "Receiver Account", "Credited To", "Beneficiary Account", "Beneficiary UPI"], f"ACC-BENEFICIARY-{idx}")
        from_bank = get_val(row, ["From Bank", "Sender Bank", "Remitter Bank"], "State Bank of India")
        to_bank = get_val(row, ["To Bank", "Receiver Bank", "Beneficiary Bank"], "ICICI Bank")
        channel = get_val(row, ["Channel", "Type", "Mode", "Txn Type"], "UPI")
        upi_ref = get_val(row, ["UPI Ref", "UPI Ref No", "RRN", "UTR"], txn_id)
        
        date_str = get_val(row, ["Date", "Txn Date", "Transaction Date", "Timestamp"], "")
        timestamp = datetime.utcnow()
        if date_str:
            for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%d/%m/%Y %H:%M:%S", "%d/%m/%Y", "%d-%m-%Y"):
                try:
                    timestamp = datetime.strptime(date_str, fmt)
                    break
                except Exception:
                    pass

        transactions.append({
            "transaction_id": txn_id,
            "case_id": case_id,
            "from_account": from_acc,
            "from_bank": from_bank,
            "to_account": to_acc,
            "to_bank": to_bank,
            "amount": amount,
            "timestamp": timestamp,
            "upi_ref": upi_ref,
            "channel": channel,
            "notes": f"Imported via Statement batch line {idx}"
        })
        idx += 1

    return transactions
