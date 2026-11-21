from typing import Dict, Any, List
from collections import defaultdict
from sqlalchemy.orm import Session
from ..models import Case, Complaint, URLAnalysis, APKAnalysis, Transaction, DigitalEntity, EvidenceLink

def build_investigation_graph(db: Session, filter_case_id: int = None, entity_type_filter: str = None) -> Dict[str, Any]:
    """
    Build interactive Cytoscape.js network graph connecting cases, complaints,
    suspect identifiers, bank accounts, UPI IDs, malicious URLs, and APK hashes.
    """
    nodes = []
    edges = []
    seen_nodes = set()
    seen_edges = set()

    # Query Cases
    case_query = db.query(Case)
    if filter_case_id:
        case_query = case_query.filter(Case.id == filter_case_id)
    cases = case_query.all()

    # Track entity connections across complaints to highlight multi-case syndicates
    entity_case_map = defaultdict(set)
    entity_loss_map = defaultdict(float)

    for c in cases:
        case_node_id = f"case_{c.id}"
        if case_node_id not in seen_nodes:
            seen_nodes.add(case_node_id)
            nodes.append({
                "data": {
                    "id": case_node_id,
                    "label": c.case_number,
                    "title": c.title,
                    "type": "case",
                    "category": c.category,
                    "priority": c.priority,
                    "status": c.status,
                    "district": c.district,
                    "loss": c.total_loss_amount,
                    "color": "#3b82f6"  # Blue
                }
            })

        # Process associated complaints
        for comp in c.complaints:
            comp_node_id = f"comp_{comp.id}"
            if comp_node_id not in seen_nodes:
                seen_nodes.add(comp_node_id)
                nodes.append({
                    "data": {
                        "id": comp_node_id,
                        "label": comp.complaint_number,
                        "title": f"Victim: {comp.complainant_name}",
                        "type": "complaint",
                        "victim": comp.complainant_name,
                        "district": comp.complainant_district,
                        "loss": comp.loss_amount,
                        "color": "#60a5fa"  # Light Blue
                    }
                })

            # Edge: Complaint -> Case
            edge_id = f"edge_comp_case_{comp.id}_{c.id}"
            if edge_id not in seen_edges:
                seen_edges.add(edge_id)
                edges.append({
                    "data": {
                        "id": edge_id,
                        "source": comp_node_id,
                        "target": case_node_id,
                        "label": "PART_OF_CASE",
                        "color": "#475569"
                    }
                })

            # 1. Suspect Phone
            if comp.suspect_phone:
                phone_id = f"phone_{comp.suspect_phone.replace('+', '').replace('-', '').replace(' ', '')}"
                entity_case_map[phone_id].add(c.case_number)
                entity_loss_map[phone_id] += comp.loss_amount
                if phone_id not in seen_nodes:
                    seen_nodes.add(phone_id)
                    nodes.append({
                        "data": {
                            "id": phone_id,
                            "label": comp.suspect_phone,
                            "type": "phone",
                            "entity_value": comp.suspect_phone,
                            "color": "#ef4444"  # Red
                        }
                    })
                edge_id = f"edge_{comp_node_id}_{phone_id}"
                if edge_id not in seen_edges:
                    seen_edges.add(edge_id)
                    edges.append({
                        "data": {
                            "id": edge_id,
                            "source": comp_node_id,
                            "target": phone_id,
                            "label": "CALLED_BY",
                            "color": "#ef4444"
                        }
                    })

            # 2. Suspect UPI ID
            if comp.suspect_upi:
                upi_clean = comp.suspect_upi.lower().strip()
                upi_id = f"upi_{upi_clean.replace('@', '_at_')}"
                entity_case_map[upi_id].add(c.case_number)
                entity_loss_map[upi_id] += comp.loss_amount
                if upi_id not in seen_nodes:
                    seen_nodes.add(upi_id)
                    nodes.append({
                        "data": {
                            "id": upi_id,
                            "label": upi_clean,
                            "type": "upi",
                            "entity_value": upi_clean,
                            "color": "#f97316"  # Orange
                        }
                    })
                edge_id = f"edge_{comp_node_id}_{upi_id}"
                if edge_id not in seen_edges:
                    seen_edges.add(edge_id)
                    edges.append({
                        "data": {
                            "id": edge_id,
                            "source": comp_node_id,
                            "target": upi_id,
                            "label": "PAID_TO_UPI",
                            "color": "#f97316"
                        }
                    })

            # 3. Suspect Bank Account
            if comp.suspect_bank_acc:
                bank_acc_id = f"bank_{comp.suspect_bank_acc.strip()}"
                entity_case_map[bank_acc_id].add(c.case_number)
                entity_loss_map[bank_acc_id] += comp.loss_amount
                if bank_acc_id not in seen_nodes:
                    seen_nodes.add(bank_acc_id)
                    nodes.append({
                        "data": {
                            "id": bank_acc_id,
                            "label": comp.suspect_bank_acc,
                            "type": "bank",
                            "entity_value": comp.suspect_bank_acc,
                            "color": "#eab308"  # Yellow
                        }
                    })
                edge_id = f"edge_{comp_node_id}_{bank_acc_id}"
                if edge_id not in seen_edges:
                    seen_edges.add(edge_id)
                    edges.append({
                        "data": {
                            "id": edge_id,
                            "source": comp_node_id,
                            "target": bank_acc_id,
                            "label": "TRANSFERRED_TO",
                            "color": "#eab308"
                        }
                    })

        # Process URLs linked to this case
        for u in c.urls:
            url_node_id = f"url_{u.id}"
            if url_node_id not in seen_nodes:
                seen_nodes.add(url_node_id)
                nodes.append({
                    "data": {
                        "id": url_node_id,
                        "label": u.domain or u.url[:30],
                        "full_url": u.url,
                        "type": "url",
                        "risk_score": u.risk_score,
                        "risk_category": u.risk_category,
                        "color": "#a855f7"  # Purple
                    }
                })
            edge_id = f"edge_case_url_{c.id}_{u.id}"
            if edge_id not in seen_edges:
                seen_edges.add(edge_id)
                edges.append({
                    "data": {
                        "id": edge_id,
                        "source": case_node_id,
                        "target": url_node_id,
                        "label": "EVIDENCE_URL",
                        "color": "#a855f7"
                    }
                })

        # Process APKs linked to this case
        for a in c.apks:
            apk_node_id = f"apk_{a.id}"
            if apk_node_id not in seen_nodes:
                seen_nodes.add(apk_node_id)
                nodes.append({
                    "data": {
                        "id": apk_node_id,
                        "label": a.app_name or a.filename,
                        "package_name": a.package_name,
                        "sha256": a.sha256_hash,
                        "type": "apk",
                        "risk_score": a.risk_score,
                        "risk_category": a.risk_category,
                        "color": "#ec4899"  # Pink
                    }
                })
            edge_id = f"edge_case_apk_{c.id}_{a.id}"
            if edge_id not in seen_edges:
                seen_edges.add(edge_id)
                edges.append({
                    "data": {
                        "id": edge_id,
                        "source": case_node_id,
                        "target": apk_node_id,
                        "label": "SEIZED_MALWARE",
                        "color": "#ec4899"
                    }
                })

            # APK C2 IPs
            if a.extracted_ips:
                for ip in a.extracted_ips[:3]:
                    ip_node_id = f"ip_{ip.replace('.', '_')}"
                    if ip_node_id not in seen_nodes:
                        seen_nodes.add(ip_node_id)
                        nodes.append({
                            "data": {
                                "id": ip_node_id,
                                "label": ip,
                                "type": "ip",
                                "color": "#14b8a6"  # Teal
                            }
                        })
                    edge_id = f"edge_apk_ip_{a.id}_{ip_node_id}"
                    if edge_id not in seen_edges:
                        seen_edges.add(edge_id)
                        edges.append({
                            "data": {
                                "id": edge_id,
                                "source": apk_node_id,
                                "target": ip_node_id,
                                "label": "C2_SERVER",
                                "color": "#14b8a6"
                            }
                        })

        # Process Transactions linked to this case
        for t in c.transactions:
            from_acc_id = f"bank_{t.from_account}"
            to_acc_id = f"bank_{t.to_account}"

            if from_acc_id not in seen_nodes:
                seen_nodes.add(from_acc_id)
                nodes.append({
                    "data": {
                        "id": from_acc_id,
                        "label": f"{t.from_bank}: {t.from_account[-6:]}",
                        "type": "bank",
                        "entity_value": t.from_account,
                        "color": "#eab308"
                    }
                })

            if to_acc_id not in seen_nodes:
                seen_nodes.add(to_acc_id)
                nodes.append({
                    "data": {
                        "id": to_acc_id,
                        "label": f"{t.to_bank}: {t.to_account[-6:]}",
                        "type": "bank",
                        "entity_value": t.to_account,
                        "is_mule": t.is_mule_account,
                        "color": "#dc2626" if t.is_mule_account else "#eab308"
                    }
                })

            edge_id = f"edge_tx_{t.transaction_id}"
            if edge_id not in seen_edges:
                seen_edges.add(edge_id)
                edges.append({
                    "data": {
                        "id": edge_id,
                        "source": from_acc_id,
                        "target": to_acc_id,
                        "label": f"₹{t.amount:,.0f} ({t.channel})",
                        "amount": t.amount,
                        "is_flagged": len(t.risk_flags) > 0 if t.risk_flags else False,
                        "color": "#dc2626" if (t.risk_flags and len(t.risk_flags) > 0) else "#94a3b8"
                    }
                })

    # Flag nodes that appear across multiple cases (Multi-Case Syndicates!)
    for n in nodes:
        nid = n["data"]["id"]
        linked_cases = list(entity_case_map.get(nid, []))
        if len(linked_cases) > 1:
            n["data"]["is_cross_case_syndicate"] = True
            n["data"]["linked_cases_count"] = len(linked_cases)
            n["data"]["linked_cases"] = linked_cases
            n["data"]["total_linked_loss"] = entity_loss_map.get(nid, 0.0)
            # Make the node visually prominent
            n["data"]["border_color"] = "#ff0055"
            n["data"]["border_width"] = 4

    # Filter by entity type if requested
    if entity_type_filter and entity_type_filter != "all":
        filtered_nodes = [n for n in nodes if n["data"]["type"] in (entity_type_filter, "case")]
        valid_node_ids = {n["data"]["id"] for n in filtered_nodes}
        filtered_edges = [e for e in edges if e["data"]["source"] in valid_node_ids and e["data"]["target"] in valid_node_ids]
        nodes = filtered_nodes
        edges = filtered_edges

    stats = {
        "total_nodes": len(nodes),
        "total_edges": len(edges),
        "cross_case_entities": sum(1 for n in nodes if n["data"].get("is_cross_case_syndicate")),
        "by_type": {
            "case": sum(1 for n in nodes if n["data"]["type"] == "case"),
            "complaint": sum(1 for n in nodes if n["data"]["type"] == "complaint"),
            "phone": sum(1 for n in nodes if n["data"]["type"] == "phone"),
            "upi": sum(1 for n in nodes if n["data"]["type"] == "upi"),
            "bank": sum(1 for n in nodes if n["data"]["type"] == "bank"),
            "url": sum(1 for n in nodes if n["data"]["type"] == "url"),
            "apk": sum(1 for n in nodes if n["data"]["type"] == "apk"),
            "ip": sum(1 for n in nodes if n["data"]["type"] == "ip"),
        }
    }

    return {
        "nodes": nodes,
        "edges": edges,
        "stats": stats
    }

def get_cross_case_correlations(db: Session) -> List[Dict[str, Any]]:
    """
    Find identifiers appearing across distinct cases to detect organized cyber crime rings.
    """
    complaints = db.query(Complaint).all()
    phone_map = defaultdict(list)
    upi_map = defaultdict(list)
    bank_map = defaultdict(list)

    for c in complaints:
        case = c.case
        case_info = {
            "case_id": case.id if case else None,
            "case_number": case.case_number if case else "Unassigned",
            "case_title": case.title if case else "Unassigned",
            "district": c.complainant_district,
            "complainant": c.complainant_name,
            "loss": c.loss_amount
        }
        if c.suspect_phone:
            phone_map[c.suspect_phone].append(case_info)
        if c.suspect_upi:
            upi_map[c.suspect_upi.lower().strip()].append(case_info)
        if c.suspect_bank_acc:
            bank_map[c.suspect_bank_acc.strip()].append(case_info)

    alerts = []

    # Check phones with multiple distinct cases
    for phone, cases_list in phone_map.items():
        distinct_case_ids = {item["case_id"] for item in cases_list if item["case_id"]}
        if len(distinct_case_ids) > 1:
            total_loss = sum(item["loss"] for item in cases_list)
            alerts.append({
                "entity_value": phone,
                "entity_type": "PHONE",
                "matched_cases": cases_list,
                "total_complaints": len(cases_list),
                "total_financial_loss": total_loss,
                "urgency": "Critical" if total_loss > 500000 else "High",
                "modus_operandi_summary": f"Phone number active across {len(distinct_case_ids)} separate police station investigations in Rajasthan with combined victim loss of ₹{total_loss:,.2f}."
            })

    # Check UPI IDs with multiple distinct cases
    for upi, cases_list in upi_map.items():
        distinct_case_ids = {item["case_id"] for item in cases_list if item["case_id"]}
        if len(distinct_case_ids) > 1:
            total_loss = sum(item["loss"] for item in cases_list)
            alerts.append({
                "entity_value": upi,
                "entity_type": "UPI",
                "matched_cases": cases_list,
                "total_complaints": len(cases_list),
                "total_financial_loss": total_loss,
                "urgency": "Critical",
                "modus_operandi_summary": f"Syndicate Collector UPI handle detected in {len(distinct_case_ids)} independent cybercrime cases. Immediate freeze under CrPC / IT Act warranted."
            })

    # Check Bank accounts with multiple distinct cases
    for bank_acc, cases_list in bank_map.items():
        distinct_case_ids = {item["case_id"] for item in cases_list if item["case_id"]}
        if len(distinct_case_ids) > 1:
            total_loss = sum(item["loss"] for item in cases_list)
            alerts.append({
                "entity_value": bank_acc,
                "entity_type": "BANK_ACCOUNT",
                "matched_cases": cases_list,
                "total_complaints": len(cases_list),
                "total_financial_loss": total_loss,
                "urgency": "Critical",
                "modus_operandi_summary": f"Suspect bank account shared across {len(distinct_case_ids)} FIRs. Primary node in cyber mule laundering network."
            })

    return alerts
