import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    designation = Column(String(100), default="Investigating Officer (IO)")
    department = Column(String(150), default="Rajasthan Police Cyber Crime Police Station, Jaipur")
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="Investigator")  # Investigator, Cyber Specialist, Supervisor, Admin
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String(50), unique=True, index=True, nullable=False)  # e.g. RJ-CC-2025-0104
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=False)  # Investment Scam, Loan App Harassment, UPI Fraud, etc.
    priority = Column(String(20), default="Medium")  # Low, Medium, High, Critical
    status = Column(String(50), default="Active")  # Active, Under Investigation, Escalated, Closed
    police_station = Column(String(150), default="Jaipur Cyber Crime Police Station")
    district = Column(String(100), default="Jaipur")
    investigating_officer = Column(String(100), default="Insp. Vikram Rathore")
    total_loss_amount = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    complaints = relationship("Complaint", back_populates="case", cascade="all, delete-orphan")
    urls = relationship("URLAnalysis", back_populates="case")
    apks = relationship("APKAnalysis", back_populates="case")
    transactions = relationship("Transaction", back_populates="case")
    reports = relationship("InvestigationReport", back_populates="case")
    statements = relationship("StatementImport", back_populates="case")
    notices = relationship("LawfulNotice", back_populates="case")

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    complaint_number = Column(String(50), unique=True, index=True, nullable=False)  # e.g. NCRP-2025-0811
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="SET NULL"), nullable=True)
    complainant_name = Column(String(100), nullable=False)
    complainant_phone = Column(String(50), nullable=True)
    complainant_district = Column(String(100), default="Jaipur")
    incident_date = Column(DateTime, default=datetime.datetime.utcnow)
    loss_amount = Column(Float, default=0.0)
    category = Column(String(100), nullable=False)
    modus_operandi = Column(Text, nullable=True)
    
    # Primary suspect identifiers reported by victim
    suspect_phone = Column(String(50), nullable=True, index=True)
    suspect_upi = Column(String(100), nullable=True, index=True)
    suspect_bank_acc = Column(String(100), nullable=True, index=True)
    suspect_url = Column(String(500), nullable=True)
    initial_utr = Column(String(100), nullable=True, index=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    case = relationship("Case", back_populates="complaints")

class StatementImport(Base):
    """
    Provenance tracking for ingested bank and UPI statement files.
    """
    __tablename__ = "statement_imports"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="SET NULL"), nullable=True)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(20), default="CSV")  # CSV, XLSX, PDF
    file_size_bytes = Column(Integer, default=0)
    bank_name = Column(String(100), default="Unknown")
    account_number = Column(String(100), nullable=True)
    total_records = Column(Integer, default=0)
    valid_records = Column(Integer, default=0)
    duplicate_records = Column(Integer, default=0)
    invalid_records = Column(Integer, default=0)
    total_debit = Column(Float, default=0.0)
    total_credit = Column(Float, default=0.0)
    imported_by = Column(String(100), default="Insp. Vikram Rathore")
    validation_log = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    case = relationship("Case", back_populates="statements")
    transactions = relationship("Transaction", back_populates="statement_import")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="SET NULL"), nullable=True)
    statement_import_id = Column(Integer, ForeignKey("statement_imports.id", ondelete="SET NULL"), nullable=True)
    
    transaction_id = Column(String(100), unique=True, index=True, nullable=False)
    utr_number = Column(String(100), index=True, nullable=True)  # Core UTR reference
    
    from_account = Column(String(100), index=True, nullable=False)
    from_bank = Column(String(100), default="Unknown")
    counterparty_name = Column(String(150), nullable=True)
    
    to_account = Column(String(100), index=True, nullable=False)
    to_bank = Column(String(100), default="Unknown")
    
    amount = Column(Float, nullable=False)
    debit_amount = Column(Float, default=0.0)
    credit_amount = Column(Float, default=0.0)
    balance = Column(Float, default=0.0)
    
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    upi_ref = Column(String(100), nullable=True, index=True)
    channel = Column(String(50), default="UPI")  # UPI, IMPS, NEFT, RTGS, POS, ATM
    narration = Column(Text, nullable=True)
    
    # Forensic Money Trail & Mule Fields
    hop_level = Column(Integer, default=1)  # Hop 1 (Victim -> Mule 1), Hop 2 (Mule 1 -> Mule 2), etc.
    parent_transaction_id = Column(String(100), nullable=True)
    
    risk_score = Column(Integer, default=0)  # 0 to 100
    risk_flags = Column(JSON, default=list)  # Structuring, Layering, Velocity, Pass-Through
    is_mule_account = Column(Boolean, default=False)
    mule_risk_level = Column(String(20), default="Low")  # Low, Medium, High, Critical
    
    source_file = Column(String(255), nullable=True)
    source_record_ref = Column(String(50), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    case = relationship("Case", back_populates="transactions")
    statement_import = relationship("StatementImport", back_populates="transactions")

class URLAnalysis(Base):
    __tablename__ = "url_analyses"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="SET NULL"), nullable=True)
    url = Column(String(1000), nullable=False, index=True)
    domain = Column(String(255), index=True)
    ip_address = Column(String(100), nullable=True, index=True)
    scheme = Column(String(10), default="https")
    risk_score = Column(Integer, default=0)
    risk_category = Column(String(20), default="Low")
    indicators = Column(JSON, default=list)
    explanation = Column(Text, nullable=True)
    verification_steps = Column(JSON, default=list)
    is_shortener = Column(Boolean, default=False)
    is_ip_host = Column(Boolean, default=False)
    is_suspicious_tld = Column(Boolean, default=False)
    analysis_method = Column(String(100), default="Heuristic Static Engine (RFC 3986)")
    investigator_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    case = relationship("Case", back_populates="urls")

class DomainIPIntelligence(Base):
    """
    Forensic dossier for domain and IP digital infrastructure,
    connecting servers and hostnames to fraudulent mule accounts.
    """
    __tablename__ = "domain_ip_intelligence"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="SET NULL"), nullable=True)
    identifier = Column(String(255), index=True, nullable=False)  # domain name or IP address
    entity_type = Column(String(20), default="DOMAIN")  # DOMAIN or IP
    registrar_or_asn = Column(String(200), nullable=True)
    hosting_provider = Column(String(200), nullable=True)
    country_code = Column(String(10), default="IN")
    city = Column(String(100), nullable=True)
    dns_records = Column(JSON, default=dict)  # A, AAAA, MX, NS, TXT
    ssl_issuer = Column(String(200), nullable=True)
    ssl_valid_until = Column(String(100), nullable=True)
    
    # Financial Crime Infrastructure Correlations
    linked_bank_accounts = Column(JSON, default=list)
    linked_upi_ids = Column(JSON, default=list)
    linked_victim_loss = Column(Float, default=0.0)
    
    risk_score = Column(Integer, default=0)
    risk_category = Column(String(20), default="Low")
    threat_classification = Column(String(100), default="Phishing / C2 Infrastructure")
    technical_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class APKAnalysis(Base):
    __tablename__ = "apk_analyses"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="SET NULL"), nullable=True)
    filename = Column(String(255), nullable=False)
    package_name = Column(String(255), index=True, default="Unknown")
    app_name = Column(String(255), default="Unknown App")
    version_name = Column(String(50), default="1.0")
    sha256_hash = Column(String(64), index=True, nullable=False)
    md5_hash = Column(String(32), nullable=True)
    file_size_bytes = Column(Integer, default=0)
    risk_score = Column(Integer, default=0)
    risk_category = Column(String(20), default="Low")
    dangerous_permissions = Column(JSON, default=list)
    normal_permissions = Column(JSON, default=list)
    extracted_urls = Column(JSON, default=list)
    extracted_ips = Column(JSON, default=list)
    certificate_info = Column(JSON, default=dict)
    threat_indicators = Column(JSON, default=list)
    loan_shark_indicators = Column(JSON, default=list)
    investigator_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    case = relationship("Case", back_populates="apks")

class DigitalEntity(Base):
    __tablename__ = "digital_entities"

    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String(50), index=True, nullable=False)  # PHONE, UPI, BANK_ACCOUNT, UTR, DOMAIN, IP, APK
    entity_value = Column(String(255), index=True, nullable=False)
    label = Column(String(255), nullable=True)
    risk_level = Column(String(20), default="Low")
    occurrences_count = Column(Integer, default=1)
    metadata_json = Column(JSON, default=dict)
    first_seen = Column(DateTime, default=datetime.datetime.utcnow)
    last_seen = Column(DateTime, default=datetime.datetime.utcnow)

class EvidenceLink(Base):
    __tablename__ = "evidence_links"

    id = Column(Integer, primary_key=True, index=True)
    source_entity_id = Column(Integer, ForeignKey("digital_entities.id", ondelete="CASCADE"), nullable=False)
    target_entity_id = Column(Integer, ForeignKey("digital_entities.id", ondelete="CASCADE"), nullable=False)
    relation_type = Column(String(100), default="ASSOCIATED_WITH")
    weight = Column(Float, default=1.0)
    confidence = Column(Float, default=0.9)
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="SET NULL"), nullable=True)
    evidence_source = Column(String(100), default="Bank Statement Ingestion")
    notes = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class LawfulNotice(Base):
    """
    Statutory Section 91 / Section 102 Cr.P.C. and Section 69A IT Act notices
    generated for banks, payment aggregators, TSPs and domain registrars.
    """
    __tablename__ = "lawful_notices"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    notice_number = Column(String(100), unique=True, index=True, nullable=False)
    notice_type = Column(String(50), default="SECTION_91_CRPC")  # SECTION_91_CRPC, SECTION_102_CRPC, SECTION_69A_IT
    target_institution = Column(String(150), nullable=False)  # HDFC Bank Nodal Officer, Airtel, etc.
    target_identifier = Column(String(150), nullable=False)  # Account No, Phone, UPI ID, Domain
    subject = Column(String(255), nullable=False)
    legal_statute = Column(String(100), default="Section 91 Code of Criminal Procedure, 1973")
    urgency = Column(String(20), default="Immediate")
    content_text = Column(Text, nullable=False)
    issuing_officer = Column(String(100), default="Insp. Vikram Rathore, IO")
    status = Column(String(30), default="Issued")  # Draft, Issued, Complied
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    case = relationship("Case", back_populates="notices")

class InvestigationReport(Base):
    __tablename__ = "investigation_reports"

    id = Column(Integer, primary_key=True, index=True)
    report_number = Column(String(50), unique=True, index=True, nullable=False)
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    generated_by = Column(String(100), default="Insp. Vikram Rathore, IO")
    status = Column(String(50), default="Final")
    summary = Column(Text, nullable=False)
    findings = Column(JSON, default=dict)
    recommendations = Column(JSON, default=list)
    pdf_filename = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    case = relationship("Case", back_populates="reports")

class AuditLog(Base):
    """
    Immutable audit trail for investigative integrity and evidentiary admissibility.
    """
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(100), nullable=False)  # STATEMENT_IMPORTED, MULE_FLAGGED, NOTICE_GENERATED, etc.
    actor_name = Column(String(100), default="Insp. Vikram Rathore")
    actor_role = Column(String(50), default="Investigating Officer")
    details = Column(Text, nullable=False)
    ip_address = Column(String(50), default="10.24.1.88 (Rajasthan Police Intranet)")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class SystemAlert(Base):
    __tablename__ = "system_alerts"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(20), default="Medium")
    alert_type = Column(String(50), default="Correlation")
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
