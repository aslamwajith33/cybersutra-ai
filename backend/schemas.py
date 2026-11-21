from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- USER SCHEMAS ---
class UserBase(BaseModel):
    username: str
    full_name: str
    email: str
    designation: Optional[str] = "Investigating Officer"
    department: Optional[str] = "Cyber Crime Police Station, Jaipur"
    role: Optional[str] = "Investigator"

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# --- CASE SCHEMAS ---
class CaseBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    priority: str = "Medium"
    status: str = "Active"
    police_station: Optional[str] = "Jaipur Cyber Crime Police Station"
    district: Optional[str] = "Jaipur"
    investigating_officer: Optional[str] = "Insp. Vikram Rathore"
    total_loss_amount: Optional[float] = 0.0

class CaseCreate(CaseBase):
    case_number: Optional[str] = None

class CaseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    police_station: Optional[str] = None
    district: Optional[str] = None
    investigating_officer: Optional[str] = None
    total_loss_amount: Optional[float] = None

class CaseResponse(CaseBase):
    id: int
    case_number: str
    created_at: datetime
    updated_at: datetime
    complaints_count: Optional[int] = 0
    evidence_count: Optional[int] = 0
    flagged_transactions_count: Optional[int] = 0
    class Config:
        from_attributes = True

# --- COMPLAINT SCHEMAS ---
class ComplaintCreate(BaseModel):
    complaint_number: Optional[str] = None
    case_id: Optional[int] = None
    complainant_name: str
    complainant_phone: Optional[str] = None
    complainant_district: Optional[str] = "Jaipur"
    loss_amount: float = 0.0
    category: str
    modus_operandi: Optional[str] = None
    suspect_phone: Optional[str] = None
    suspect_upi: Optional[str] = None
    suspect_bank_acc: Optional[str] = None
    suspect_url: Optional[str] = None
    notes: Optional[str] = None

class ComplaintResponse(ComplaintCreate):
    id: int
    complaint_number: str
    incident_date: datetime
    created_at: datetime
    class Config:
        from_attributes = True

# --- URL ANALYSIS SCHEMAS ---
class URLAnalyzeRequest(BaseModel):
    url: str
    case_id: Optional[int] = None
    investigator_notes: Optional[str] = None

class URLIndicator(BaseModel):
    code: str
    name: str
    severity: str  # Critical, High, Medium, Low, Info
    description: str
    risk_points: int

class URLAnalysisResponse(BaseModel):
    id: Optional[int] = None
    case_id: Optional[int] = None
    url: str
    domain: str
    ip_address: Optional[str] = None
    scheme: str
    risk_score: int
    risk_category: str
    indicators: List[Dict[str, Any]]
    explanation: str
    verification_steps: List[str]
    is_shortener: bool
    is_ip_host: bool
    is_suspicious_tld: bool
    analysis_method: str
    investigator_notes: Optional[str] = None
    analyzed_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# --- APK ANALYSIS SCHEMAS ---
class APKAnalysisResponse(BaseModel):
    id: int
    case_id: Optional[int] = None
    filename: str
    package_name: str
    app_name: str
    version_name: str
    sha256_hash: str
    md5_hash: Optional[str] = None
    file_size_bytes: int
    risk_score: int
    risk_category: str
    dangerous_permissions: List[Dict[str, Any]]
    normal_permissions: List[str]
    extracted_urls: List[str]
    extracted_ips: List[str]
    certificate_info: Dict[str, Any]
    threat_indicators: List[Dict[str, Any]]
    loan_shark_indicators: List[Dict[str, Any]]
    investigator_notes: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

# --- TRANSACTION & MULE ACCOUNT SCHEMAS ---
class TransactionCreate(BaseModel):
    transaction_id: str
    case_id: Optional[int] = None
    from_account: str
    from_bank: Optional[str] = "Unknown"
    to_account: str
    to_bank: Optional[str] = "Unknown"
    amount: float
    timestamp: Optional[datetime] = None
    upi_ref: Optional[str] = None
    channel: Optional[str] = "UPI"
    notes: Optional[str] = None

class TransactionResponse(BaseModel):
    id: int
    case_id: Optional[int] = None
    transaction_id: str
    from_account: str
    from_bank: str
    to_account: str
    to_bank: str
    amount: float
    timestamp: datetime
    upi_ref: Optional[str] = None
    channel: str
    risk_score: int
    risk_flags: List[str]
    is_mule_account: bool
    mule_risk_level: str
    notes: Optional[str] = None
    class Config:
        from_attributes = True

class MuleAccountAnalysis(BaseModel):
    account_number: str
    bank_name: str
    total_inflow: float
    total_outflow: float
    retention_ratio: float
    rapid_velocity_count: int
    structuring_count: int
    mule_score: int
    mule_risk_level: str
    indicators: List[str]
    associated_cases: List[str]

# --- EVIDENCE & GRAPH SCHEMAS ---
class GraphNode(BaseModel):
    data: Dict[str, Any]  # id, label, type, risk, metadata

class GraphEdge(BaseModel):
    data: Dict[str, Any]  # id, source, target, label, weight, confidence

class GraphDataResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    stats: Dict[str, Any]

class CorrelationAlert(BaseModel):
    entity_value: str
    entity_type: str
    matched_cases: List[Dict[str, Any]]
    total_complaints: int
    total_financial_loss: float
    urgency: str
    modus_operandi_summary: str

# --- REPORT SCHEMAS ---
class ReportCreateRequest(BaseModel):
    case_id: int
    title: str
    generated_by: Optional[str] = "Insp. Vikram Rathore, IO"
    notes: Optional[str] = None

class ReportResponse(BaseModel):
    id: int
    report_number: str
    case_id: int
    case_title: Optional[str] = None
    title: str
    generated_by: str
    status: str
    summary: str
    findings: Dict[str, Any]
    recommendations: List[str]
    pdf_filename: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

# --- DASHBOARD & ALERTS ---
class DashboardStats(BaseModel):
    total_cases: int
    active_investigations: int
    high_risk_cases: int
    flagged_transactions: int
    suspicious_urls: int
    analyzed_apks: int
    total_loss_prevented_or_reported: float
    complaints_trend: List[Dict[str, Any]]
    fraud_distribution: List[Dict[str, Any]]
    transaction_risk_distribution: List[Dict[str, Any]]
    status_distribution: List[Dict[str, Any]]
    recent_cases: List[Dict[str, Any]]
    priority_alerts: List[Dict[str, Any]]

class AlertResponse(BaseModel):
    id: int
    case_id: Optional[int] = None
    title: str
    message: str
    severity: str
    alert_type: str
    is_read: bool
    created_at: datetime
    class Config:
        from_attributes = True
