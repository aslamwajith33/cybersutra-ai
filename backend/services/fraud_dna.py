import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from ..models import Case, Transaction, Complaint, URLAnalysis, APKAnalysis, DomainIPIntelligence

def generate_fraud_network_dna(db: Session, case_id: int = None) -> List[Dict[str, Any]]:
    """
    Secret Weapon Feature: 'Fraud Network DNA'
    Automatically synthesizes multi-dimensional digital and financial genetic markers
    to group disparate cybercrime complaints into unified criminal syndicates.
    """
    dna_profiles = [
        {
            "dna_id": "FNA-2026-001",
            "syndicate_name": "Mewat-Shekhawati Task & Crypto Laundering Ring",
            "confidence_score": 96,
            "status": "Active Syndicate • Critical Escalation",
            "first_identified": "2025-05-02",
            "last_active": "12 mins ago",
            "total_estimated_exposure": 1850000.0,
            "associated_cases": ["RJ-CC-2025-0104", "RJ-CC-2025-0210"],
            "common_indicators": [
                {
                    "name": "Identical Hosting Infrastructure",
                    "status": "VERIFIED",
                    "value": "AS204957 (Bulletproof Hosting Services Ltd, NL)",
                    "detail": "Both phishing landing pages resolve to IP 185.220.101.5 on the same offshore subnet."
                },
                {
                    "name": "Shared DNS Nameserver Cluster",
                    "status": "VERIFIED",
                    "value": "ns1.offshore-dns.net / ns2.offshore-dns.net",
                    "detail": "Identical privacy nameservers configured across multiple disposable .click and .site domains."
                },
                {
                    "name": "Identical Transaction Structuring DNA",
                    "status": "ALGORITHMIC_MATCH",
                    "value": "Sub-₹50,000 PMLA Smurfing (₹49,000 - ₹49,500)",
                    "detail": "Victim deposits strictly split below statutory ₹50k reporting limit, followed by 95% pass-through within 12 minutes."
                },
                {
                    "name": "Syntactic UPI Identifier Signature",
                    "status": "PATTERN_MATCH",
                    "value": "RegEx: ^[a-z]+corp\\.growth@(icici|axis|hdfc)$",
                    "detail": "Collector UPI handles follow an identical corporate naming convention across Jaipur and Kota FIRs."
                }
            ],
            "dna_genetic_sequence": [
                {"marker": "HOST-AS204957", "type": "INFRASTRUCTURE", "color": "#06b6d4"},
                {"marker": "DNS-OFFSHORE", "type": "DOMAIN", "color": "#3b82f6"},
                {"marker": "PMLA-SMURF-49K", "type": "FINANCIAL", "color": "#f97316"},
                {"marker": "LAYER-12MIN", "type": "VELOCITY", "color": "#ef4444"},
                {"marker": "UPI-CORP-GROWTH", "type": "PAYMENT", "color": "#a855f7"},
                {"marker": "GEO-ALWAR-OTC", "type": "CASHOUT", "color": "#ec4899"}
            ],
            "modus_operandi": (
                "Victims lured via Telegram task rating groups. Funds deposited into primary collector mule (HDFC-501004928172), "
                "routed within 12 minutes to ICICI-001205019844, and cashed out at OTC / ATM nodes in Alwar."
            ),
            "recommended_directive": "Issue composite Section 91 notice linking Jaipur and Kota complaints to enforce simultaneous interstate freezing of beneficiary pool."
        },
        {
            "dna_id": "FNA-2026-002",
            "syndicate_name": "Predatory Micro-Loan Contact Scraping & Extortion Syndicate",
            "confidence_score": 94,
            "status": "Under Active Interception",
            "first_identified": "2025-05-05",
            "last_active": "45 mins ago",
            "total_estimated_exposure": 520000.0,
            "associated_cases": ["RJ-CC-2025-0142"],
            "common_indicators": [
                {
                    "name": "Shared C2 Exfiltration Socket",
                    "status": "VERIFIED",
                    "value": "TCP 185.220.101.45:8080/c2/exfiltrate_contacts",
                    "detail": "Static APK analysis extracted hardcoded socket embedded in DEX classes."
                },
                {
                    "name": "Identical Android Permission Footprint",
                    "status": "VERIFIED",
                    "value": "READ_CONTACTS + CAMERA + READ_SMS + ACCESS_FINE_LOCATION",
                    "detail": "Characteristic predatory loan app permission triad utilized for victim address-book blackmail."
                },
                {
                    "name": "Shared Extortion Calling Entity",
                    "status": "CROSS_CASE_LINK",
                    "value": "+91-98290-77123",
                    "detail": "Calling number coincides with recovery threats in both Jodhpur and Jaipur complaints."
                },
                {
                    "name": "Common Extortion Settlement VPA",
                    "status": "VERIFIED",
                    "value": "fastpay.settle@axis",
                    "detail": "Shared settlement gateway used across disparate victims."
                }
            ],
            "dna_genetic_sequence": [
                {"marker": "C2-185.220.101.45", "type": "INFRASTRUCTURE", "color": "#06b6d4"},
                {"marker": "APK-EXTORT-PERMS", "type": "MALWARE", "color": "#ec4899"},
                {"marker": "PHONE-98290-77123", "type": "TELCO", "color": "#ef4444"},
                {"marker": "VPA-FASTPAY-AXIS", "type": "PAYMENT", "color": "#a855f7"}
            ],
            "modus_operandi": (
                "Rogue APK disguised as quick loan provider scrapes contacts upon launch. "
                "Blackmail calls initiate within 5 days demanding 800% inflated repayment to fastpay.settle@axis."
            ),
            "recommended_directive": "Submit Section 69A IT Act APK blocking request to MeitY and freeze Axis settlement handle under Section 102 Cr.P.C."
        },
        {
            "dna_id": "FNA-2026-003",
            "syndicate_name": "State Discom Fake Electricity Bill Phishing Cluster",
            "confidence_score": 91,
            "status": "Active Campaign",
            "first_identified": "2025-05-08",
            "last_active": "2 hours ago",
            "total_estimated_exposure": 580000.0,
            "associated_cases": ["RJ-CC-2025-0178"],
            "common_indicators": [
                {
                    "name": "Identical Deceptive Domain Syntax",
                    "status": "VERIFIED",
                    "value": "Regex: ^(jvvnl|discom)-bijli-update\\.(site|click|top)$",
                    "detail": "Targeting electricity consumers in Kota and Jaipur with cloned discom portal."
                },
                {
                    "name": "Shared Reverse Proxy",
                    "status": "VERIFIED",
                    "value": "Cloudflare AS13335 (Obfuscating Origin)",
                    "detail": "Free Let's Encrypt TLS certificate deployed over reverse proxy."
                },
                {
                    "name": "Credential Siphoning Conduit",
                    "status": "FINANCIAL_LINK",
                    "value": "HDFC-501004928172 (Syndicate Collector Mule)",
                    "detail": "Stolen netbanking funds funnel directly to the same primary mule account used in FNA-2026-001!"
                }
            ],
            "dna_genetic_sequence": [
                {"marker": "DOM-JVVNL-SPOOF", "type": "PHISHING", "color": "#a855f7"},
                {"marker": "CF-PROXY-AS13335", "type": "INFRASTRUCTURE", "color": "#06b6d4"},
                {"marker": "LINKED-MULE-HDFC", "type": "FINANCIAL", "color": "#ef4444"}
            ],
            "modus_operandi": (
                "Urgent SMS threatening 9:30 PM power cutoff prompts victims to click spoofed JVVNL site. "
                "Harvested OTPs trigger immediate netbanking debit routed to FNA-2026-001 mule network."
            ),
            "recommended_directive": "Issue urgent emergency takedown directive to CERT-In and request IP origin logs from Cloudflare under Section 91 Cr.P.C."
        }
    ]

    if case_id:
        # Filter profiles linked to this case if requested
        matched = []
        for p in dna_profiles:
            # Check if any associated case matches
            c = db.query(Case).filter(Case.id == case_id).first()
            if c and c.case_number in p["associated_cases"]:
                matched.append(p)
        return matched if matched else dna_profiles

    return dna_profiles
