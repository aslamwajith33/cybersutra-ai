# CyberSutra AI – Financial Crime Intelligence & Infrastructure Correlation Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-cybersutra--ai.vercel.app-2563eb?style=for-the-badge&logo=vercel)](https://cybersutra-ai.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-aslamwajith33%2Fcybersutra--ai-181717?style=for-the-badge&logo=github)](https://github.com/aslamwajith33/cybersutra-ai)
[![Python](https://img.shields.io/badge/FastAPI-Python%203.11+-3776AB?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React%2018-Vite%20%2B%20Tailwind-61DAFB?style=for-the-badge&logo=react)](https://react.dev)

> **Tagline:** *"Connecting Financial Trails. Tracing Digital Infrastructure."*  
> **Official Hackathon Problem Statement:** **PS05 – Financial Crime Infrastructure & Money-Trail Analysis System**  
> **Target Agency:** Rajasthan Police & Indian Law Enforcement Agencies  
> **🌐 Production URL:** [https://cybersutra-ai.vercel.app](https://cybersutra-ai.vercel.app)  
> **📦 GitHub Repository:** [https://github.com/aslamwajith33/cybersutra-ai](https://github.com/aslamwajith33/cybersutra-ai)

---

## 1. Executive Overview

**CyberSutra AI** is an end-to-end cybercrime intelligence and digital evidence correlation platform engineered specifically for the challenges faced by Rajasthan Police and Indian law enforcement agencies. Rather than presenting isolated, disjointed forensic utilities, CyberSutra AI introduces a **Unified Financial-to-Digital Evidence Graph** that links:

$$\text{Victim Complaint} \longrightarrow \text{Transaction / UTR} \longrightarrow \text{Mule Account} \longrightarrow \text{Rapid Layering Chain} \longrightarrow \text{Domain / IP Infrastructure} \longrightarrow \text{Statutory Sec 91 Notice}$$

The platform equips Investigating Officers (IOs) in cyber cells across Rajasthan (Jaipur, Jodhpur, Kota, Bharatpur, Mewat border, Udaipur) with automated money-trail tracking, digital infrastructure correlation, and automated statutory requisition drafting.

---

## 2. ⭐ Secret Weapon: "Fraud Network DNA"

CyberSutra AI features an automated syndicate attribution engine called **Fraud Network DNA**. Instead of analyzing isolated FIRs in silos, the engine synthesizes biometric-like digital signatures across complaints to uncover underlying criminal syndicates operating across state borders.

### Generated Syndicate Profile: `FNA-2026-001`
- **Syndicate Name:** *Mewat-Shekhawati Task & Crypto Laundering Ring*
- **Confidence Rating:** **96%**
- **First Identified:** `02-May-2025` | **Last Active:** `12 mins ago`
- **Estimated Financial Exposure:** ₹18,50,000.00
- **Cross-FIR Linkage:** FIR `RJ-CC-2025-0104` (Jaipur) and FIR `RJ-CC-2025-0210` (Kota)

```
[Common DNA Indicators Checklist]
✓ Same Hosting:           AS204957 (Bulletproof Hosting Services Ltd, NL) - IP 185.220.101.5
✓ Same DNS Nameservers:   ns1.offshore-dns.net / ns2.offshore-dns.net (.click & .site TLDs)
✓ Same Txn Pattern:       Sub-₹50,000 PMLA Smurfing (₹49,000 - ₹49,500) + 12-minute pass-through
✓ Same UPI Syntax:        RegEx: ^[a-z]+corp\.growth@(icici|axis|hdfc)$
```

### Visual Genetic Sequence
The platform visualizes the genetic markers of each criminal network:
`[HOST-AS204957]` ➔ `[DNS-OFFSHORE]` ➔ `[PMLA-SMURF-49K]` ➔ `[LAYER-12MIN]` ➔ `[UPI-CORP-GROWTH]` ➔ `[GEO-ALWAR-OTC]`

---

## 3. 🚀 Advanced Features That Stand Out

### 1. AI Investigation Copilot
An explainable forensic assistant tailored to Indian cyber investigation SOPs:
- **Natural Language Inquiry:** IO asks *"Why is Account HDFC-501004928172 suspicious?"*
- **Explainable Breakdown:** Copilot synthesizes pass-through ratio (66.5% flushed within 12 minutes), PMLA evasion deposits (₹49,500), and links to active FIRs in Kota and Jaipur.
- **Actionable Execution:** One-click chips to *"Draft Sec 91 Freeze Notice"*, *"Trace Money Trail"*, or *"Inspect in Evidence Graph"*.

### 2. Chronological Timeline Reconstruction
- Reconstructs multi-stage criminal operations into a coherent second-by-second timeline.
- Chains victim debits (`10:05 AM`) $\to$ Primary mule credit (`10:07 AM`) $\to$ Layering transfer (`10:09 AM`) $\to$ Cashout withdrawal (`10:15 AM`) $\to$ Police Section 91 freeze order (`10:45 AM`).

### 3. Multi-Hop UTR Money Trail Explorer
- Enter any 12-digit UTR (e.g., `UTR5010029101`) to trace fund movements across multiple hops:
  - **Hop 0:** Victim Debit (SBI Savings, Jaipur)
  - **Hop 1:** Primary Collector Mule (HDFC Bank)
  - **Hop 2:** Layering Conduit (ICICI Bank)
  - **Hop 3:** Regional Distribution Mule (Axis Bank, Alwar)
  - **Hop 4:** Terminal Cash-out (Over-the-counter ATM withdrawal)

### 4. Statement Intelligence & Ingestion
- Uploads polymorphic bank statements in **CSV**, **Excel (.xlsx)**, and **PDF** formats.
- Built-in heuristic auto-mapper for standard Indian banking formats (SBI, HDFC, ICICI, PNB, Axis, Paytm Payments Bank).
- Row-level validation logs detailing missing fields, duplicates, or corrupted lines without silent data loss.

### 5. Domain & IP Infrastructure Correlation
- Real-time DNS analysis (A, NS, MX, TXT), ASN lookup, and SSL certificate inspection.
- **Direct Linkage:** Connects deceptive domain infrastructure (e.g. `jvvnl-bijli-update.site`) directly to beneficiary mule bank accounts and UPI handles.

### 6. Cytoscape.js Interactive Evidence Graph
- Full-screen force-directed graph connecting Cases, Complaints, Suspect Mobile Numbers, UPI VPAs, Bank Accounts, Phishing URLs, Malicious APKs, and C2 IPs.
- Highlights cross-case syndicates with glowing red threat borders.

### 7. Statutory Lawful Notice Generator
Auto-generates legally sound notices compliant with Indian procedural laws:
- **Section 91 Cr.P.C.:** Summons to Bank Nodal Officers for KYC, account opening documents, IP logs, and ATM CCTV.
- **Section 102 Cr.P.C.:** Police debit freeze / lien-marking seizure order.
- **Section 69A IT Act:** Emergency takedown requisition to CERT-In / MeitY for malicious domains and apps.

### 8. Official ReportLab PDF Dossier Export
- Generates high-resolution, multi-page Rajasthan Police branded investigation dossiers with case metadata, loss quantification, visual evidence summary, and IO signature blocks.

---

## 4. System Architecture

```
cybersutra/
├── backend/
│   ├── main.py                  # FastAPI server, route registry & CORS
│   ├── models.py                # Relational schema (Cases, Complaints, Txns, Mules, Notices, Audit)
│   ├── database.py              # SQLite (Zero-config out of box) & PostgreSQL support
│   ├── services/
│   │   ├── fraud_dna.py            # Secret Weapon: Fraud Network DNA engine
│   │   ├── copilot_engine.py       # AI Investigation Copilot with actionable chips
│   │   ├── timeline_service.py     # Event-by-event chronological stream builder
│   │   ├── statement_parser.py     # CSV/XLSX/PDF statement parsing & auto-mapping
│   │   ├── financial_analyzer.py   # Mule detection, layering (<30m) & structuring (<₹50k)
│   │   ├── money_trail_tracker.py  # Multi-hop UTR cascade tracer
│   │   ├── infrastructure_intel.py # Domain & IP forensics + account correlation
│   │   ├── url_analyzer.py         # Static RFC 3986 heuristic URL analysis
│   │   ├── apk_analyzer.py         # Static Android APK permissions & C2 extraction
│   │   ├── evidence_correlation.py # Cytoscape.js relationship network builder
│   │   ├── notice_generator.py     # Section 91/102 Cr.P.C. & Section 69A IT Act notices
│   │   ├── report_generator.py     # ReportLab official PDF dossier engine
│   │   └── seed_data.py            # Synthetic Rajasthan cybercrime demonstration intelligence
│   └── routes/                  # 17 REST API routers
├── frontend/                    # React 19 + Vite + Tailwind CSS + Cytoscape.js + Recharts
│   ├── src/
│   │   ├── pages/               # 14 Dedicated Investigation Modules
│   │   │   ├── FraudDnaPage.jsx         # Secret Weapon UI: FNA-2026-001 DNA Card
│   │   │   ├── AiCopilotPage.jsx        # AI Investigation Copilot Chat
│   │   │   ├── TimelinePage.jsx         # Chronological Incident Timeline
│   │   │   ├── MoneyTrailExplorer.jsx   # Multi-hop UTR Fund Flow Tracker
│   │   │   ├── MuleDetection.jsx        # Mule Account Scoring & Alerting
│   │   │   ├── StatementIntelligence.jsx# Statement Upload & Ingestion
│   │   │   ├── EvidenceGraph.jsx        # Cytoscape.js Network Graph
│   │   │   ├── DomainIPIntelligence.jsx # Domain & IP Correlation
│   │   │   ├── CaseManagement.jsx       # Case Dossiers & Seized Inventory
│   │   │   ├── ReportsPage.jsx          # PDF Dossier Generation & Notices
│   │   │   └── AuditLogsPage.jsx        # Immutable Activity Audit Logs
│   │   ├── components/          # Persistent Sidebar, Navbar, RiskBadges, EmptyStates
│   │   └── api/client.js        # Axios API client
│   └── package.json
├── sample_data/                 # Sample malicious APK & bank statement CSV
└── tests/                       # Automated test suite (18 passing tests)
```

---

## 5. Quickstart & Installation

### Prerequisites
- Python 3.11+
- Node.js 18+

### Step 1: Start the Backend Server
```powershell
# Navigate to the project root
cd "d:\ANTIGRAVITY\hackathon\rajesthon hackathon"

# Install backend dependencies
pip install -r requirements.txt

# Start FastAPI server (Default database: SQLite with zero configuration required!)
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
- **Backend API:** `http://127.0.0.1:8000`
- **Swagger Documentation:** `http://127.0.0.1:8000/docs`

### Step 2: Start the Frontend Application
```powershell
# In a separate terminal
cd frontend
npm install
npm run dev
```
- **Frontend URL:** `http://localhost:5173`

---

## 6. Demonstration Walkthrough Guide for Judges

For evaluation during the hackathon demo:

1. **Law Enforcement Login:**
   - Click the blue **"Quick Login as Insp. Vikram Rathore"** button on the login screen (`/login`).
2. **Explore Secret Weapon: Fraud Network DNA:**
   - Navigate to **"Fraud Network DNA"** in the sidebar.
   - Inspect **Pattern ID `FNA-2026-001`**, verifying the **96% Confidence** rating and 4 verified common indicators:
     - Same Hosting (`AS204957`)
     - Same DNS (`ns1.offshore-dns.net`)
     - Same Txn Structuring (`₹49,000` - `₹49,500`)
     - Same UPI handle pattern (`^[a-z]+corp\.growth@...`)
3. **Query the AI Investigation Copilot:**
   - Navigate to **"AI Copilot"**.
   - Click the prompt chip: *"Why is Account HDFC-501004928172 suspicious?"*
   - Observe the explainable reasoning, retention analysis, risk score (95/100), and immediate action chips.
4. **Inspect the Multi-Hop Money Trail:**
   - Navigate to **"Money Trail Explorer"**.
   - Enter `UTR5010029101` and click **"Trace Fund Movement"** to observe the multi-hop cascade from victim to terminal cashout in Alwar.
5. **View the Chronological Timeline:**
   - Navigate to **"Timeline"** to view the second-by-second progression from victim transfer to police freeze.
6. **Interact with the Evidence Graph:**
   - Navigate to **"Evidence Graph"** to inspect Cytoscape.js interactive node-link relationships with layout switches (Concentric, Breadthfirst, Cose).
7. **Download Official PDF Report:**
   - Navigate to **"Reports & Notices"** and click **"Generate Official PDF Dossier"** to view and download the branded Rajasthan Police dossier.

---

## 7. Automated Verification & Testing

Execute the automated test suite covering all services and API routers:

```powershell
$env:PYTHONPATH="."
python -m pytest -v tests/
```

### Test Suite Execution Output:
```
============================= test session starts =============================
platform win32 -- Python 3.14.6, pytest-9.2.0, pluggy-1.7.0
rootdir: D:\ANTIGRAVITY\hackathon\rajesthon hackathon
collected 18 items

tests\test_api_endpoints.py .............                                [ 72%]
tests\test_core_features.py .....                                        [100%]

======================= 18 passed in 1.02s =======================
```

---

## 8. Evidentiary Standards & Legal Compliance

CyberSutra AI adheres to strict evidentiary standards under Indian law:
- **Explainability:** Verified forensic facts (cryptographic SHA-256 hashes, confirmed bank statement entries) are strictly segregated from algorithmic indicators (risk scores, heuristic patterns).
- **Audit Logging:** Every IO action, search query, and report generation is immutably logged with timestamp, user ID, and IP address.
- **Section 65B Indian Evidence Act Compliance:** Evidence items are preserved with timestamps, SHA-256 hashes, and source chain of custody documentation.
