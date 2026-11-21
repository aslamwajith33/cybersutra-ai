from typing import Dict, Any, List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from ..models import Transaction, Complaint, Case

def trace_money_trail(db: Session, root_utr_or_account: str, case_id: Optional[int] = None) -> Dict[str, Any]:
    """
    Forensic multi-hop money trail tracer.
    Traces fund movement from the victim's initial debit across subsequent UTR/account hops.
    """
    search_term = root_utr_or_account.strip()

    # Query initial starting transaction by UTR or Account
    query = db.query(Transaction)
    if case_id:
        query = query.filter(Transaction.case_id == case_id)

    # Find starting seeds
    seed_txns = query.filter(
        (Transaction.utr_number.ilike(f"%{search_term}%")) |
        (Transaction.transaction_id.ilike(f"%{search_term}%")) |
        (Transaction.from_account.ilike(f"%{search_term}%")) |
        (Transaction.to_account.ilike(f"%{search_term}%"))
    ).order_by(Transaction.timestamp.asc()).all()

    if not seed_txns:
        # Check in complaints
        comp = db.query(Complaint).filter(
            (Complaint.initial_utr.ilike(f"%{search_term}%")) |
            (Complaint.suspect_bank_acc.ilike(f"%{search_term}%"))
        ).first()
        if comp and comp.case_id:
            seed_txns = db.query(Transaction).filter(Transaction.case_id == comp.case_id).order_by(Transaction.timestamp.asc()).all()

    hops: List[Dict[str, Any]] = []
    seen_accounts = set()
    total_traced_amount = 0.0

    current_accounts = set()
    for t in seed_txns[:3]:
        current_accounts.add(t.to_account)
        seen_accounts.add(t.from_account)
        seen_accounts.add(t.to_account)
        total_traced_amount += t.amount
        hops.append({
            "hop_number": 1,
            "hop_type": "PRIMARY_COLLECTOR_MULE",
            "transaction_id": t.transaction_id,
            "utr_number": t.utr_number or t.upi_ref,
            "from_account": t.from_account,
            "from_bank": t.from_bank,
            "to_account": t.to_account,
            "to_bank": t.to_bank,
            "amount": t.amount,
            "timestamp": t.timestamp.isoformat() if t.timestamp else None,
            "channel": t.channel,
            "risk_score": t.risk_score,
            "risk_flags": t.risk_flags,
            "time_from_origin": "0 mins (Origin)"
        })

    # Cascade forward up to 4 downstream hops
    max_hops = 4
    for hop_idx in range(2, max_hops + 1):
        if not current_accounts:
            break

        downstream_txns = db.query(Transaction).filter(
            Transaction.from_account.in_(list(current_accounts))
        ).order_by(Transaction.timestamp.asc()).all()

        if not downstream_txns:
            break

        next_accounts = set()
        for dt in downstream_txns:
            if dt.to_account not in seen_accounts:
                seen_accounts.add(dt.to_account)
                next_accounts.add(dt.to_account)

            hop_type = "SECONDARY_LAYER_MULE" if hop_idx == 2 else ("REGIONAL_CASHOUT_NODE" if hop_idx == 3 else "TERMINAL_WITHDRAWAL")
            hops.append({
                "hop_number": hop_idx,
                "hop_type": hop_type,
                "transaction_id": dt.transaction_id,
                "utr_number": dt.utr_number or dt.upi_ref,
                "from_account": dt.from_account,
                "from_bank": dt.from_bank,
                "to_account": dt.to_account,
                "to_bank": dt.to_bank,
                "amount": dt.amount,
                "timestamp": dt.timestamp.isoformat() if dt.timestamp else None,
                "channel": dt.channel,
                "risk_score": dt.risk_score,
                "risk_flags": dt.risk_flags,
                "time_from_origin": f"{hop_idx * 12} mins"
            })

        current_accounts = next_accounts

    # Build Cytoscape nodes and edges for money trail graph visualization
    trail_nodes = []
    trail_edges = []
    node_set = set()

    for h in hops:
        # Source node
        src_id = f"acc_{h['from_account']}"
        if src_id not in node_set:
            node_set.add(src_id)
            trail_nodes.append({
                "data": {
                    "id": src_id,
                    "label": f"{h['from_bank']}\n{h['from_account'][-6:]}",
                    "account_number": h['from_account'],
                    "bank": h['from_bank'],
                    "type": "account",
                    "color": "#38bdf8"
                }
            })

        # Target node
        tgt_id = f"acc_{h['to_account']}"
        if tgt_id not in node_set:
            node_set.add(tgt_id)
            is_mule = h["risk_score"] >= 50
            trail_nodes.append({
                "data": {
                    "id": tgt_id,
                    "label": f"{h['to_bank']}\n{h['to_account'][-6:]}",
                    "account_number": h['to_account'],
                    "bank": h['to_bank'],
                    "type": "mule" if is_mule else "account",
                    "color": "#ef4444" if is_mule else "#38bdf8"
                }
            })

        # Edge
        edge_id = f"trail_edge_{h['transaction_id']}"
        trail_edges.append({
            "data": {
                "id": edge_id,
                "source": src_id,
                "target": tgt_id,
                "label": f"₹{h['amount']:,.0f} ({h['channel']})",
                "utr": h["utr_number"],
                "color": "#dc2626" if h["risk_score"] >= 50 else "#94a3b8"
            }
        })

    return {
        "searched_reference": search_term,
        "total_hops": max([h["hop_number"] for h in hops]) if hops else 0,
        "total_traced_amount": total_traced_amount,
        "hops": hops,
        "graph": {
            "nodes": trail_nodes,
            "edges": trail_edges
        }
    }
