import datetime
from typing import Dict, Any
from ..models import LawfulNotice, Case

def generate_lawful_notice_text(
    notice_type: str,
    case: Case,
    target_institution: str,
    target_identifier: str,
    issuing_officer: str = "Insp. Vikram Rathore, IO"
) -> Dict[str, Any]:
    """
    Generate formal legal notices under Indian Criminal Procedure Code (Cr.P.C.)
    and Information Technology Act for financial institutions and telecom providers.
    """
    now_str = datetime.datetime.utcnow().strftime("%d-%b-%Y")
    rand_suffix = datetime.datetime.utcnow().strftime("%H%M")
    notice_num = f"NOTICE/{notice_type[:6]}/{case.case_number}/{rand_suffix}"

    if notice_type == "SECTION_91_CRPC":
        statute = "Section 91, Code of Criminal Procedure, 1973 (Cr.P.C.)"
        subject = f"URGENT REQUISITION OF BANK TRANSACTION LOGS & KYC PARTICULARS - A/C: {target_identifier}"
        content = (
            f"OFFICE OF THE INVESTIGATING OFFICER\n"
            f"CYBER CRIME POLICE STATION, {case.police_station.upper()}\n"
            f"RAJASTHAN POLICE\n\n"
            f"NOTICE UNDER SECTION 91 OF THE CODE OF CRIMINAL PROCEDURE, 1973\n\n"
            f"Notice No: {notice_num}\t\tDate: {now_str}\n\n"
            f"TO:\n"
            f"The Nodal Officer / Fraud Risk Management,\n"
            f"{target_institution}\n\n"
            f"REF: FIR / Case No. {case.case_number} registered under Section 66D IT Act & Section 318 BNS.\n\n"
            f"Sir/Madam,\n\n"
            f"Whereas the investigation of the above referenced cyber crime case reveals that the suspect beneficiary account "
            f"'{target_identifier}' maintained with your bank has been utilized to siphon fraudulent funds totaling ₹{case.total_loss_amount:,.2f} "
            f"originating from cyber victims in Rajasthan.\n\n"
            f"You are hereby directed under Section 91 Cr.P.C. to forthwith furnish the following certified records within 24 hours:\n"
            f"1. Account Opening Form (AOF) along with certified KYC documents (Aadhaar, PAN, Passport, Driving License).\n"
            f"2. Complete itemized account statement with IP address logs and MAC addresses utilized for NetBanking/Mobile Banking logins.\n"
            f"3. ATM location details and CCTV footage for cash withdrawals executed on this account.\n"
            f"4. Immediate status report on whether lien has been marked on the current available balance under Section 102 Cr.P.C.\n\n"
            f"Failure to comply with this statutory directive shall invite penal proceedings under Section 175 of the Indian Penal Code / BNS.\n\n"
            f"Yours faithfully,\n\n"
            f"{issuing_officer}\n"
            f"Investigating Officer, Cyber Crime PS\n"
            f"Rajasthan Police"
        )
    elif notice_type == "SECTION_102_CRPC":
        statute = "Section 102, Code of Criminal Procedure, 1973 (Cr.P.C.)"
        subject = f"FORMAL POLICE LIEN-MARKING & FREEZE DIRECTIVE - A/C: {target_identifier}"
        content = (
            f"OFFICE OF THE INVESTIGATING OFFICER\n"
            f"CYBER CRIME POLICE STATION, {case.police_station.upper()}\n"
            f"RAJASTHAN POLICE\n\n"
            f"SEIZURE & FREEZE ORDER UNDER SECTION 102 Cr.P.C.\n\n"
            f"Notice No: {notice_num}\t\tDate: {now_str}\n\n"
            f"TO: The Nodal Officer, {target_institution}\n\n"
            f"In exercise of powers conferred under Section 102 of the Code of Criminal Procedure, 1973, you are hereby ordered "
            f"to IMMEDIATELY FREEZE / PUT ON TOTAL DEBIT LIEN the bank account / UPI VPA '{target_identifier}' "
            f"standing in the books of your institution, as the same constitutes proceeds of cybercrime under FIR No. {case.case_number}.\n\n"
            f"No debit transactions, ATM withdrawals or outward transfers shall be permitted without prior written authorization from this office "
            f"or the competent jurisdictional Magistrate court.\n\n"
            f"{issuing_officer}\nRajasthan Police"
        )
    else:  # SECTION_69A_IT
        statute = "Section 69A, Information Technology Act, 2000"
        subject = f"EMERGENCY TAKEDOWN DIRECTIVE FOR FRAUDULENT INFRASTRUCTURE - {target_identifier}"
        content = (
            f"STATE CYBER CRIME INVESTIGATION DIVISION\n"
            f"RAJASTHAN POLICE HEADQUARTERS, JAIPUR\n\n"
            f"TAKEDOWN REQUISITION UNDER SECTION 69A IT ACT\n\n"
            f"Notice No: {notice_num}\t\tDate: {now_str}\n\n"
            f"TO: The Designated Officer (Section 69A IT Act), CERT-In / Ministry of Electronics & IT (MeitY)\n\n"
            f"Digital forensics in Case {case.case_number} establish that domain / infrastructure '{target_identifier}' "
            f"is actively masquerading as government/utility portals to execute financial fraud on citizens of Rajasthan.\n\n"
            f"Urgent blocking of this digital resource under the IT (Procedure and Safeguards for Blocking for Access of Information by Public) "
            f"Rules, 2009 is requested in the interest of preventing ongoing cyber offense.\n\n"
            f"{issuing_officer}\nRajasthan Police"
        )

    return {
        "notice_number": notice_num,
        "notice_type": notice_type,
        "legal_statute": statute,
        "subject": subject,
        "content_text": content,
        "target_institution": target_institution,
        "target_identifier": target_identifier,
        "issuing_officer": issuing_officer
    }
