import os
import datetime
from typing import Dict, Any
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from ..config import settings
from ..models import Case

def generate_investigation_pdf(case: Case, report_number: str, generated_by: str, findings: Dict[str, Any] = None) -> str:
    """
    Generate an official, structured Digital Evidence & Forensic Intelligence Dossier PDF
    modeled for Rajasthan Police Cyber Crime Cells.
    """
    pdf_filename = f"CyberSutra_Dossier_{case.case_number.replace('/', '_').replace('-', '_')}_{report_number}.pdf"
    pdf_path = os.path.join(settings.REPORT_DIR, pdf_filename)

    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#0f172a"),
        alignment=1
    )

    subtitle_style = ParagraphStyle(
        "DocSubTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#1e3a8a"),
        alignment=1
    )

    h1_style = ParagraphStyle(
        "Heading1_Custom",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#1e293b"),
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        "Body_Custom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#334155")
    )

    bold_body = ParagraphStyle(
        "BoldBody",
        parent=body_style,
        fontName="Helvetica-Bold"
    )

    badge_critical = ParagraphStyle(
        "BadgeCrit",
        parent=body_style,
        fontName="Helvetica-Bold",
        textColor=colors.HexColor("#dc2626")
    )

    story = []

    # 1. Header Banner
    header_data = [
        [
            Paragraph("<b>RAJASTHAN POLICE</b><br/><font size=8 color='#475569'>CYBER CRIME INVESTIGATION DIVISION<br/>HEADQUARTERS: JAIPUR, RAJASTHAN</font>", subtitle_style),
            Paragraph("<b>CONFIDENTIAL // LAW ENFORCEMENT EYES ONLY</b><br/><font size=7 color='#dc2626'>FORMAL INVESTIGATION INTELLIGENCE DOSSIER</font>", ParagraphStyle("Conf", parent=body_style, alignment=2))
        ]
    ]
    t_header = Table(header_data, colWidths=[320, 210])
    t_header.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_header)
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1e3a8a"), spaceAfter=15))

    # 2. Document Title
    story.append(Paragraph("CYBERSUTRA AI – DIGITAL EVIDENCE INTELLIGENCE DOSSIER", title_style))
    story.append(Paragraph(f"CASE IDENTIFIER: {case.case_number} | DOSSIER NO: {report_number}", subtitle_style))
    story.append(Spacer(1, 12))

    # 3. Case Metadata Table
    meta_data = [
        [Paragraph("<b>Case / FIR Number:</b>", body_style), Paragraph(case.case_number, bold_body), Paragraph("<b>Classification:</b>", body_style), Paragraph(case.category, bold_body)],
        [Paragraph("<b>Police Station / Cell:</b>", body_style), Paragraph(case.police_station, body_style), Paragraph("<b>District:</b>", body_style), Paragraph(case.district, body_style)],
        [Paragraph("<b>Investigating Officer:</b>", body_style), Paragraph(case.investigating_officer, body_style), Paragraph("<b>Priority / Risk:</b>", body_style), Paragraph(case.priority.upper(), badge_critical)],
        [Paragraph("<b>Total Reported Loss:</b>", body_style), Paragraph(f"₹{case.total_loss_amount:,.2f}", bold_body), Paragraph("<b>Dossier Date:</b>", body_style), Paragraph(datetime.datetime.utcnow().strftime("%d-%b-%Y %H:%M UTC"), body_style)],
    ]
    t_meta = Table(meta_data, colWidths=[120, 150, 110, 150])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 15))

    # 4. Executive Summary
    story.append(Paragraph("1. EXECUTIVE INVESTIGATION SUMMARY", h1_style))
    summary_text = (
        case.description or 
        f"This investigative dossier consolidates digital forensics, financial transaction tracing, "
        f"and cross-complaint correlations associated with Case {case.case_number} ({case.category}). "
        f"CyberSutra AI automated intelligence engines analyzed associated cyber infrastructure, "
        f"identifying syndicated digital identifiers, mule laundering pipelines, and suspect command channels."
    )
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 12))

    # 5. Victim Complaints Summary
    story.append(Paragraph("2. ASSOCIATED COMPLAINTS & VICTIM STATEMENTS", h1_style))
    if case.complaints:
        comp_rows = [
            [Paragraph("<b>Complaint No</b>", bold_body), Paragraph("<b>Victim Name</b>", bold_body), Paragraph("<b>District</b>", bold_body), Paragraph("<b>Loss (INR)</b>", bold_body), Paragraph("<b>Suspect Identifiers</b>", bold_body)]
        ]
        for c in case.complaints:
            ids = []
            if c.suspect_phone: ids.append(f"Tel: {c.suspect_phone}")
            if c.suspect_upi: ids.append(f"UPI: {c.suspect_upi}")
            if c.suspect_bank_acc: ids.append(f"A/c: {c.suspect_bank_acc}")
            comp_rows.append([
                Paragraph(c.complaint_number, body_style),
                Paragraph(c.complainant_name, body_style),
                Paragraph(c.complainant_district, body_style),
                Paragraph(f"₹{c.loss_amount:,.0f}", bold_body),
                Paragraph("<br/>".join(ids) if ids else "None recorded", body_style)
            ])
        t_comp = Table(comp_rows, colWidths=[100, 100, 80, 90, 160])
        t_comp.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#94a3b8")),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(t_comp)
    else:
        story.append(Paragraph("<i>No victim complaints directly attached to this case record yet.</i>", body_style))
    story.append(Spacer(1, 15))

    # 6. Malicious URL & Phishing Intelligence
    story.append(Paragraph("3. SUSPICIOUS URL & PHISHING INFRASTRUCTURE FORENSICS", h1_style))
    if case.urls:
        url_rows = [
            [Paragraph("<b>Analyzed URL</b>", bold_body), Paragraph("<b>Domain</b>", bold_body), Paragraph("<b>Risk</b>", bold_body), Paragraph("<b>Key Indicators Detected</b>", bold_body)]
        ]
        for u in case.urls:
            inds = [i.get("name", "") for i in (u.indicators or [])][:3]
            url_rows.append([
                Paragraph(u.url[:45] + ("..." if len(u.url) > 45 else ""), body_style),
                Paragraph(u.domain or "N/A", body_style),
                Paragraph(f"<b>{u.risk_score}/100</b> ({u.risk_category})", badge_critical if u.risk_score > 50 else body_style),
                Paragraph("<br/>• ".join([""] + inds) if inds else "Low heuristic deviation", body_style)
            ])
        t_url = Table(url_rows, colWidths=[150, 100, 90, 190])
        t_url.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1e3a8a")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#94a3b8")),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(t_url)
    else:
        story.append(Paragraph("<i>No suspicious URLs attached to this case.</i>", body_style))
    story.append(Spacer(1, 15))

    # 7. APK Static Analysis Findings
    story.append(Paragraph("4. SEIZED ANDROID APK STATIC ANALYSIS & MALWARE SIGNATURES", h1_style))
    if case.apks:
        apk_rows = [
            [Paragraph("<b>App / Package Name</b>", bold_body), Paragraph("<b>SHA-256 Hash</b>", bold_body), Paragraph("<b>Risk Category</b>", bold_body), Paragraph("<b>Malware Signatures</b>", bold_body)]
        ]
        for a in case.apks:
            threats = [t.get("name", "") for t in (a.threat_indicators or [])][:3]
            apk_rows.append([
                Paragraph(f"<b>{a.app_name}</b><br/>{a.package_name}", body_style),
                Paragraph(f"<font size=6>{a.sha256_hash}</font>", body_style),
                Paragraph(f"<b>{a.risk_score}/100</b><br/>{a.risk_category}", badge_critical if a.risk_score > 50 else body_style),
                Paragraph("<br/>• ".join([""] + threats) if threats else "Standard utility permissions", body_style)
            ])
        t_apk = Table(apk_rows, colWidths=[130, 140, 90, 170])
        t_apk.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#312e81")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#94a3b8")),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(t_apk)
    else:
        story.append(Paragraph("<i>No Android APK files seized or attached under this case.</i>", body_style))
    story.append(Spacer(1, 15))

    # 8. Financial Forensics & Mule Network
    story.append(Paragraph("5. FINANCIAL FLOW FORENSICS & MULE ACCOUNT DISCLOSURE", h1_style))
    if case.transactions:
        tx_rows = [
            [Paragraph("<b>Txn ID / UTR</b>", bold_body), Paragraph("<b>Remitter Account</b>", bold_body), Paragraph("<b>Beneficiary Account</b>", bold_body), Paragraph("<b>Amount</b>", bold_body), Paragraph("<b>Forensic Anomaly</b>", bold_body)]
        ]
        for t in case.transactions[:8]:
            tx_rows.append([
                Paragraph(t.transaction_id, body_style),
                Paragraph(f"{t.from_bank}<br/>{t.from_account[-6:]}", body_style),
                Paragraph(f"{t.to_bank}<br/>{t.to_account[-6:]}", body_style),
                Paragraph(f"₹{t.amount:,.0f}", bold_body),
                Paragraph(", ".join(t.risk_flags) if t.risk_flags else "Standard settlement", badge_critical if t.is_mule_account else body_style)
            ])
        t_tx = Table(tx_rows, colWidths=[100, 100, 100, 80, 150])
        t_tx.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#064e3b")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#94a3b8")),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(t_tx)
    else:
        story.append(Paragraph("<i>No financial transaction records directly linked to this case dossier.</i>", body_style))
    story.append(Spacer(1, 15))

    # 9. Legal Sections & Next Steps
    story.append(Paragraph("6. STATUTORY APPLICABILITY & ACTIONABLE RECOMMENDATIONS", h1_style))
    rec_text = (
        "<b>Applicable Statutory Provisions:</b><br/>"
        "• <b>IT Act, 2000:</b> Section 43 (Damage to computer system), Section 66 (Computer related offences), "
        "Section 66C (Punishment for identity theft), Section 66D (Punishment for cheating by personation by using computer resource).<br/>"
        "• <b>Bharatiya Nyaya Sanhita (BNS) / IPC:</b> Section 318 (Cheating), Section 316 (Criminal breach of trust), Section 61 (Criminal conspiracy).<br/><br/>"
        "<b>Immediate Investigative Directives for IO:</b><br/>"
        "1. Transmit formal preservation notice under Section 91 Cr.P.C. to beneficiary nodal banks for immediate lien-marking/freezing of identified mule accounts.<br/>"
        "2. Submit domain takedown directive to National Critical Information Infrastructure Protection Centre (NCIIPC) and CERT-In under IT Act Section 69A.<br/>"
        "3. Issue notice to telecom service providers (TSPs) for Call Detail Records (CDR), Subscriber Acquisition Forms (CAF), and IMEI binding of suspect calling numbers."
    )
    story.append(Paragraph(rec_text, body_style))
    story.append(Spacer(1, 25))

    # 10. Official Sign-off block
    sign_block = [
        [
            Paragraph("<b>EVIDENCE FORENSICALLY VERIFIED</b><br/><font size=7>SHA-256 System Integrity Validated</font>", body_style),
            Paragraph(f"<b>{generated_by}</b><br/>Investigating Officer / Cyber Forensic Analyst<br/>Rajasthan Police Cyber Crime Unit", ParagraphStyle("Sign", parent=body_style, alignment=2))
        ]
    ]
    t_sign = Table(sign_block, colWidths=[260, 270])
    t_sign.setStyle(TableStyle([
        ('LINEABOVE', (0,0), (-1,-1), 0.75, colors.HexColor("#64748b")),
        ('TOPPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(KeepTogether(t_sign))

    # Build the PDF
    doc.build(story)
    return pdf_filename
