import datetime
from sqlalchemy.orm import Session
from ..models import (
    User, Case, Complaint, URLAnalysis, APKAnalysis, Transaction, DigitalEntity, EvidenceLink, SystemAlert, InvestigationReport
)
from ..services.url_analyzer import analyze_url
from ..services.financial_analyzer import analyze_transaction_batch

def seed_demo_data(db: Session, force_reset: bool = False):
    """
    Populate realistic, synthetic demonstration cybercrime investigations
    tailored for Rajasthan Police cyber cells.
    """
    # Check if data already exists
    existing_cases = db.query(Case).count()
    if existing_cases > 0 and not force_reset:
        return {"status": "exists", "message": "Demo data already initialized"}

    if force_reset:
        db.query(SystemAlert).delete()
        db.query(InvestigationReport).delete()
        db.query(EvidenceLink).delete()
        db.query(DigitalEntity).delete()
        db.query(Transaction).delete()
        db.query(APKAnalysis).delete()
        db.query(URLAnalysis).delete()
        db.query(Complaint).delete()
        db.query(Case).delete()
        db.query(User).delete()
        db.commit()

    # 1. Create Demo Investigators
    demo_io = User(
        username="io_jaipur",
        full_name="Insp. Vikram Rathore",
        designation="Investigating Officer (IO), Cyber Crime PS",
        department="Rajasthan Police Cyber Crime Police Station, Jaipur",
        email="io.jaipur@police.rajasthan.gov.in",
        password_hash="demo_password_hash_2025",
        role="Investigator"
    )
    demo_dsp = User(
        username="dsp_cyber",
        full_name="Shri Arvind Bhati, RPS",
        designation="Deputy Superintendent of Police (DSP), Cyber Cell",
        department="State Cyber Crime Investigation Division, Jaipur",
        email="dsp.cyber@police.rajasthan.gov.in",
        password_hash="demo_password_hash_2025",
        role="Supervisor"
    )
    db.add_all([demo_io, demo_dsp])
    db.commit()

    # 2. Case 1: Telegram Task & Investment Scam (Jaipur / Kota)
    case_1 = Case(
        case_number="RJ-CC-2025-0104",
        title="Operation Golden Falcon: Telegram Part-Time Task & VIP Investment Syndicate",
        description="Victims lured through Telegram and WhatsApp groups promising daily earnings for rating hotels/apps. Funds layered through structured UPI transfers into mule bank accounts across Jaipur and Kota.",
        category="Investment Scam / Task Fraud",
        priority="Critical",
        status="Active",
        police_station="Cyber Crime Police Station Jaipur",
        district="Jaipur",
        investigating_officer="Insp. Vikram Rathore",
        total_loss_amount=1850000.0,
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=12)
    )

    # 3. Case 2: Loan App Harassment & Extortion (Jodhpur / Udaipur)
    case_2 = Case(
        case_number="RJ-CC-2025-0142",
        title="Operation DhanRaksha: InstantRupee Predatory Loan App & Contact Scraping Extortion",
        description="Victims lured into installing rogue loan APK offering instant ₹5,000 credit. App exfiltrated 800+ phone contacts and photo gallery, followed by abusive extortion calls and threats to circulate morphed photographs.",
        category="Loan App Harassment",
        priority="High",
        status="Under Investigation",
        police_station="Jodhpur Range Cyber Police Station",
        district="Jodhpur",
        investigating_officer="Sub-Insp. Priyanka Shekhawat",
        total_loss_amount=340000.0,
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=8)
    )

    # 4. Case 3: JVVNL Fake Electricity Bill Phishing (Kota)
    case_3 = Case(
        case_number="RJ-CC-2025-0178",
        title="Operation Bijli Mitra: Fake JVVNL Electricity Disconnection Phishing SMS Ring",
        description="Spoofed SMS sent to electricity consumers in Kota claiming power will be disconnected at 9:30 PM due to unpaid bills. Link prompts NetBanking credential entry on fake utility site.",
        category="Phishing / Net Banking Theft",
        priority="High",
        status="Active",
        police_station="Cyber Crime Cell, Kota",
        district="Kota",
        investigating_officer="Insp. Rajesh Tanwar",
        total_loss_amount=580000.0,
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=4)
    )

    # 5. Case 4: SIM Swap & Mule Layering Ring (Bharatpur / Alwar)
    case_4 = Case(
        case_number="RJ-CC-2025-0210",
        title="Operation Mewat Falcon: High-Velocity Mule Ring & Rapid Layering Network",
        description="Organized cyber syndicate operating mule accounts in Bharatpur and Alwar receiving siphoned funds from multi-state cyber victims and routing them via POS/crypto OTC agents within 15 minutes.",
        category="Mule Account Ring / SIM Swap",
        priority="Critical",
        status="Escalated",
        police_station="Range Cyber Police Station Bharatpur",
        district="Bharatpur",
        investigating_officer="DSP Arvind Bhati",
        total_loss_amount=2200000.0,
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=2)
    )

    db.add_all([case_1, case_2, case_3, case_4])
    db.commit()

    # 6. Seed Complaints (With intentional cross-case entity overlaps!)
    # Notice: suspect_phone '+91-98290-77123' appears in both Case 1 and Case 2!
    # Notice: suspect_upi 'taskcorp.growth@icici' appears in Case 1 across multiple complaints!
    c1 = Complaint(
        complaint_number="NCRP-2025-0811",
        case_id=case_1.id,
        complainant_name="Ramesh Sharma",
        complainant_phone="+91-94140-12891",
        complainant_district="Jaipur",
        loss_amount=650000.0,
        category="Investment Scam / Task Fraud",
        modus_operandi="Joined Telegram group 'VIP Daily Crypto Tasks', invested small amounts initially and received minor returns, then made large deposits which were frozen.",
        suspect_phone="+91-98290-77123",  # Shared suspect entity
        suspect_upi="taskcorp.growth@icici",
        suspect_bank_acc="HDFC-501004928172",
        suspect_url="http://vip-task-earn.click/login",
        notes="Complainant deposited funds via Google Pay to UPI taskcorp.growth@icici.",
        incident_date=datetime.datetime.utcnow() - datetime.timedelta(days=10)
    )

    c2 = Complaint(
        complaint_number="NCRP-2025-0824",
        case_id=case_1.id,
        complainant_name="Sunita Meena",
        complainant_phone="+91-98291-55201",
        complainant_district="Jaipur",
        loss_amount=480000.0,
        category="Investment Scam / Task Fraud",
        modus_operandi="Contacted via WhatsApp for hotel review rating jobs. Asked to recharge trading account with increasing amounts to release commission.",
        suspect_phone="+91-98290-77123",  # Shared suspect entity
        suspect_upi="taskcorp.growth@icici",
        suspect_bank_acc="ICICI-001205019844",
        suspect_url="http://vip-task-earn.click/login",
        notes="Transferred ₹4.8 Lakhs across 3 transactions.",
        incident_date=datetime.datetime.utcnow() - datetime.timedelta(days=7)
    )

    c3 = Complaint(
        complaint_number="NCRP-2025-0850",
        case_id=case_1.id,
        complainant_name="Amit Verma",
        complainant_phone="+91-74424-38190",
        complainant_district="Kota",
        loss_amount=720000.0,
        category="Investment Scam / Task Fraud",
        modus_operandi="Telegram channel admin 'Prof. Robert Wealth Coach' guided trading on bogus portal. When attempted withdrawal, demanded 30% tax penalty.",
        suspect_phone="+91-94140-88321",
        suspect_upi="taskcorp.growth@icici",
        suspect_bank_acc="HDFC-501004928172",
        suspect_url="http://185.220.101.5/tg-invest/app.php",
        notes="Linked with Jaipur complaints via same collector UPI ID.",
        incident_date=datetime.datetime.utcnow() - datetime.timedelta(days=5)
    )

    c4 = Complaint(
        complaint_number="NCRP-2025-0914",
        case_id=case_2.id,
        complainant_name="Dinesh Gehlot",
        complainant_phone="+91-94141-66230",
        complainant_district="Jodhpur",
        loss_amount=180000.0,
        category="Loan App Harassment",
        modus_operandi="Downloaded InstantRupee APK from SMS link. Applied for ₹5,000; received ₹2,800 after deductions. Within 5 days, recovery agents demanded ₹45,000 and threatened to send vulgar morphed images to his contact list.",
        suspect_phone="+91-98290-77123",  # CROSS-CASE LINK TO CASE 1!
        suspect_upi="fastpay.settle@axis",
        suspect_bank_acc="AXIS-919010045211",
        suspect_url="http://get-instantrupee-cash.xyz/download.apk",
        notes="Complainant handed over WhatsApp audio recordings and APK file.",
        incident_date=datetime.datetime.utcnow() - datetime.timedelta(days=6)
    )

    c5 = Complaint(
        complaint_number="NCRP-2025-1045",
        case_id=case_3.id,
        complainant_name="Mahendra Singh",
        complainant_phone="+91-74425-99120",
        complainant_district="Kota",
        loss_amount=580000.0,
        category="Phishing / Net Banking Theft",
        modus_operandi="Received SMS claiming JVVNL power supply will be cut at 9:30 PM. Clicked link to update electricity bill, entered OTP on phishing page, resulting in unauthorized debit.",
        suspect_phone="+91-70140-33219",
        suspect_upi="jvvnl.billdesk@kotak",
        suspect_bank_acc="PNB-12890001002341",
        suspect_url="http://jvvnl-bijli-update.site/pay",
        notes="Phishing portal cloned official Jaipur Vidyut Vitran Nigam logo.",
        incident_date=datetime.datetime.utcnow() - datetime.timedelta(days=3)
    )

    db.add_all([c1, c2, c3, c4, c5])
    db.commit()

    # 7. Seed Suspicious URLs
    url1_data = analyze_url("http://vip-task-earn.click/login?ref=tg_channel_89")
    url1 = URLAnalysis(
        case_id=case_1.id,
        url="http://vip-task-earn.click/login?ref=tg_channel_89",
        domain=url1_data["domain"],
        ip_address="185.220.101.5",
        scheme=url1_data["scheme"],
        risk_score=url1_data["risk_score"],
        risk_category=url1_data["risk_category"],
        indicators=url1_data["indicators"],
        explanation=url1_data["explanation"],
        verification_steps=url1_data["verification_steps"],
        is_shortener=url1_data["is_shortener"],
        is_ip_host=url1_data["is_ip_host"],
        is_suspicious_tld=url1_data["is_suspicious_tld"],
        analysis_method=url1_data["analysis_method"],
        investigator_notes="Landing portal for fake crypto task earnings platform. Registered 14 days ago via privacy proxy."
    )

    url2_data = analyze_url("http://jvvnl-bijli-update.site/pay-bill-online?consumer_no=1800291")
    url2 = URLAnalysis(
        case_id=case_3.id,
        url="http://jvvnl-bijli-update.site/pay-bill-online?consumer_no=1800291",
        domain=url2_data["domain"],
        ip_address="104.21.48.91",
        scheme=url2_data["scheme"],
        risk_score=url2_data["risk_score"],
        risk_category=url2_data["risk_category"],
        indicators=url2_data["indicators"],
        explanation=url2_data["explanation"],
        verification_steps=url2_data["verification_steps"],
        is_shortener=url2_data["is_shortener"],
        is_ip_host=url2_data["is_ip_host"],
        is_suspicious_tld=url2_data["is_suspicious_tld"],
        analysis_method=url2_data["analysis_method"],
        investigator_notes="Phishing clone of Jaipur Vidyut Vitran Nigam Ltd (JVVNL). Harvesting NetBanking credentials and OTPs."
    )

    url3_data = analyze_url("http://185.220.101.5:8080/c2/receive_sms.php")
    url3 = URLAnalysis(
        case_id=case_2.id,
        url="http://185.220.101.5:8080/c2/receive_sms.php",
        domain=url3_data["domain"],
        ip_address="185.220.101.5",
        scheme=url3_data["scheme"],
        risk_score=url3_data["risk_score"],
        risk_category=url3_data["risk_category"],
        indicators=url3_data["indicators"],
        explanation=url3_data["explanation"],
        verification_steps=url3_data["verification_steps"],
        is_shortener=url3_data["is_shortener"],
        is_ip_host=url3_data["is_ip_host"],
        is_suspicious_tld=url3_data["is_suspicious_tld"],
        analysis_method=url3_data["analysis_method"],
        investigator_notes="Hardcoded Command & Control server extracted from seized InstantRupee Android APK."
    )

    db.add_all([url1, url2, url3])
    db.commit()

    # 8. Seed APK Analysis
    apk1 = APKAnalysis(
        case_id=case_2.id,
        filename="InstantRupee_QuickCredit_v2.4.apk",
        package_name="com.fastrupee.cashcredit.app",
        app_name="InstantRupee Fast Cash",
        version_name="2.4.1",
        sha256_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        md5_hash="4a8a08f09d37b73795649038408b5f33",
        file_size_bytes=8412900,
        risk_score=92,
        risk_category="Critical",
        dangerous_permissions=[
            {"permission": "android.permission.READ_CONTACTS", "threat": "Contacts Scraping", "severity": "Critical", "description": "Harvests complete phone book for family/colleague extortion."},
            {"permission": "android.permission.READ_SMS", "threat": "OTP Interception", "severity": "Critical", "description": "Exfiltrates incoming banking SMS and OTPs to remote server."},
            {"permission": "android.permission.CAMERA", "threat": "Unauthorized Photo Access", "severity": "Medium", "description": "Captures photo gallery media for morphing/blackmail."},
            {"permission": "android.permission.ACCESS_FINE_LOCATION", "threat": "GPS Geofencing", "severity": "Medium", "description": "Tracks real-time device location."}
        ],
        normal_permissions=["android.permission.INTERNET", "android.permission.ACCESS_NETWORK_STATE"],
        extracted_urls=["http://185.220.101.5:8080/c2/sync_contacts", "http://api.fastrupee.xyz/v1/auth"],
        extracted_ips=["185.220.101.5", "104.21.48.91"],
        certificate_info={"status": "Self-Signed Debug Certificate", "is_debug_signed": True, "certificates_found": 1},
        threat_indicators=[
            {"name": "Predatory Loan Extortion Profile", "severity": "Critical", "description": "Excessive permission footprint (Contacts + Camera + SMS) characteristic of predatory micro-loan syndicates."},
            {"name": "Remote C2 Contact Exfiltration", "severity": "Critical", "description": "Hardcoded endpoints to external unverified IP address 185.220.101.5."}
        ],
        loan_shark_indicators=[
            {"name": "Aggressive Contact Harvesting", "severity": "Critical", "description": "Triggers immediate background dump of contact database upon installation."}
        ],
        investigator_notes="APK extracted from complainant Dinesh Gehlot's mobile device. Exhibits classic predatory loan extortion MO."
    )
    db.add(apk1)
    db.commit()

    # 9. Seed Financial Transactions (With Layering & Smurfing Patterns!)
    now = datetime.datetime.utcnow()
    txns = [
        # Structuring below Rs 50,000 threshold into Mule 1
        Transaction(
            case_id=case_1.id,
            transaction_id="TXN-2025-0104-001",
            from_account="SBI-3091004921",
            from_bank="State Bank of India (Victim Ramesh)",
            to_account="HDFC-501004928172",
            to_bank="HDFC Bank (Primary Mule)",
            amount=49500.0,
            timestamp=now - datetime.timedelta(hours=48),
            upi_ref="UPI/504819280112",
            channel="UPI",
            risk_score=75,
            risk_flags=["Structuring / Smurfing Pattern (Evading Rs 50,000 PMLA statutory reporting threshold)"],
            is_mule_account=True,
            mule_risk_level="Critical",
            notes="Structured victim transfer into primary collector mule account."
        ),
        Transaction(
            case_id=case_1.id,
            transaction_id="TXN-2025-0104-002",
            from_account="SBI-3091004921",
            from_bank="State Bank of India (Victim Ramesh)",
            to_account="HDFC-501004928172",
            to_bank="HDFC Bank (Primary Mule)",
            amount=49000.0,
            timestamp=now - datetime.timedelta(hours=47, minutes=50),
            upi_ref="UPI/504819280199",
            channel="UPI",
            risk_score=80,
            risk_flags=["Structuring / Smurfing Pattern (Evading Rs 50,000 PMLA statutory reporting threshold)", "High Velocity Deposit"],
            is_mule_account=True,
            mule_risk_level="Critical",
            notes="Second structured deposit within 10 minutes."
        ),
        # Immediate Layering from Mule 1 to Secondary Mule 2 within 12 minutes!
        Transaction(
            case_id=case_1.id,
            transaction_id="TXN-2025-0104-003",
            from_account="HDFC-501004928172",
            from_bank="HDFC Bank (Primary Mule)",
            to_account="ICICI-001205019844",
            to_bank="ICICI Bank (Secondary Layer Mule)",
            amount=95000.0,
            timestamp=now - datetime.timedelta(hours=47, minutes=38),
            upi_ref="IMPS/504819389101",
            channel="IMPS",
            risk_score=90,
            risk_flags=["Rapid Layering (< 15 mins)", "Zero Retention Pass-Through (> 95% drained)"],
            is_mule_account=True,
            mule_risk_level="Critical",
            notes="Rapid layering: ₹95,000 transferred out 12 minutes after victim credits."
        ),
        # Layering from Mule 2 to Mule 3 in Alwar
        Transaction(
            case_id=case_1.id,
            transaction_id="TXN-2025-0104-004",
            from_account="ICICI-001205019844",
            from_bank="ICICI Bank (Secondary Layer Mule)",
            to_account="AXIS-919010045211",
            to_bank="Axis Bank (Alwar Mule Node)",
            amount=90000.0,
            timestamp=now - datetime.timedelta(hours=47, minutes=20),
            upi_ref="IMPS/504819441029",
            channel="IMPS",
            risk_score=95,
            risk_flags=["Multi-Hop Layering Chain", "Pass-Through Account"],
            is_mule_account=True,
            mule_risk_level="Critical",
            notes="Third hop in layering chain. Terminating at cash-out terminal in Alwar."
        ),
        # Case 3 transaction
        Transaction(
            case_id=case_3.id,
            transaction_id="TXN-2025-0178-001",
            from_account="PNB-12890001002341",
            from_bank="Punjab National Bank (Victim Mahendra)",
            to_account="HDFC-501004928172",  # SAME PRIMARY MULE AS CASE 1!
            to_bank="HDFC Bank (Syndicate Collector Mule)",
            amount=185000.0,
            timestamp=now - datetime.timedelta(hours=14),
            upi_ref="NEFT/504910029311",
            channel="NEFT",
            risk_score=95,
            risk_flags=["Cross-Case Syndicate Mule Account Link", "High-Value Transfer"],
            is_mule_account=True,
            mule_risk_level="Critical",
            notes="Crucial cross-case link: Kota electricity phishing victim funds routed to same HDFC account used in Jaipur investment fraud."
        )
    ]
    db.add_all(txns)
    db.commit()

    # 10. Seed System Alerts
    alerts = [
        SystemAlert(
            case_id=case_1.id,
            title="Cross-Case Syndicate Correlation Identified",
            message="Suspect phone '+91-98290-77123' linked across Case RJ-CC-2025-0104 (Jaipur) and Case RJ-CC-2025-0142 (Jodhpur). Combined victim loss exceeds ₹21.9 Lakhs.",
            severity="Critical",
            alert_type="Correlation",
            created_at=now - datetime.timedelta(hours=6)
        ),
        SystemAlert(
            case_id=case_1.id,
            title="Mule Account Ring Detected: HDFC-501004928172",
            message="Account HDFC-501004928172 exhibits classic zero-retention layering (₹95,000 flushed within 12 minutes) and connects victims from both Jaipur and Kota.",
            severity="Critical",
            alert_type="Mule Detected",
            created_at=now - datetime.timedelta(hours=12)
        ),
        SystemAlert(
            case_id=case_3.id,
            title="Active Phishing Campaign Detected (JVVNL Discom)",
            message="Domain 'jvvnl-bijli-update.site' impersonating Jaipur Vidyut Vitran Nigam with risk score 85/100. Urgent Section 69A takedown recommended.",
            severity="High",
            alert_type="High-Risk URL",
            created_at=now - datetime.timedelta(hours=18)
        )
    ]
    db.add_all(alerts)
    db.commit()

    return {"status": "success", "message": "Successfully seeded synthetic demonstration intelligence data"}
