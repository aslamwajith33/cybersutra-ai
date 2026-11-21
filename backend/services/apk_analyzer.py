import os
import re
import hashlib
import zipfile
from typing import Dict, Any, List

DANGEROUS_PERMISSIONS_MAP = {
    "READ_SMS": {
        "severity": "Critical",
        "points": 25,
        "threat": "OTP & SMS Interception",
        "description": "Allows app to silently read incoming SMS messages, intercepting One Time Passwords (OTPs) and 2FA codes for fraudulent banking debits."
    },
    "RECEIVE_SMS": {
        "severity": "Critical",
        "points": 25,
        "threat": "Real-time OTP Stealing",
        "description": "Allows app to trigger background broadcast receivers the moment a bank SMS arrives, frequently deleting the notification before the victim notices."
    },
    "SEND_SMS": {
        "severity": "High",
        "points": 20,
        "threat": "Silent Premium SMS / SIM Registration",
        "description": "Enables sending SMS without victim knowledge, often used to activate UPI registrations on rogue devices."
    },
    "READ_CONTACTS": {
        "severity": "Critical",
        "points": 25,
        "threat": "Contacts Harvesting (Extortion / Loan Shark)",
        "description": "Harvests victim's entire phone address book. Commonly used in predatory instant loan rackets to blackmail family and colleagues with morphed photos."
    },
    "READ_CALL_LOG": {
        "severity": "High",
        "points": 15,
        "threat": "Social Engineering & Surveillance",
        "description": "Reads comprehensive call history to identify victim's intimate contacts, banks, and daily communication patterns."
    },
    "SYSTEM_ALERT_WINDOW": {
        "severity": "Critical",
        "points": 30,
        "threat": "Malicious Screen Overlay (Credential Theft)",
        "description": "Enables drawing windows over other apps. Banking trojans use this to superimpose fake SBI/HDFC/Paytm login screens over legitimate banking apps."
    },
    "BIND_ACCESSIBILITY_SERVICE": {
        "severity": "Critical",
        "points": 35,
        "threat": "Accessibility Service Hijack (Full Device Control)",
        "description": "Grants complete automated UI control: reading all screen text (keylogging), auto-clicking permission prompts, and executing unattended bank transfers."
    },
    "RECORD_AUDIO": {
        "severity": "High",
        "points": 15,
        "threat": "Acoustic Surveillance",
        "description": "Records ambient audio and telephone calls without status bar visibility in background."
    },
    "CAMERA": {
        "severity": "Medium",
        "points": 10,
        "threat": "Unauthorized Video / Photo Capture",
        "description": "Direct camera access. Frequently leveraged in sextortion and predatory loan app blackmail."
    },
    "ACCESS_FINE_LOCATION": {
        "severity": "Medium",
        "points": 10,
        "threat": "Precise GPS Geolocation Tracking",
        "description": "Captures exact latitude/longitude coordinates to map victim's home and workplace."
    },
    "REQUEST_INSTALL_PACKAGES": {
        "severity": "High",
        "points": 20,
        "threat": "Second-Stage Dropper Functionality",
        "description": "Permits downloading and installing secondary malicious APK payloads without Google Play vetting."
    },
    "RECEIVE_BOOT_COMPLETED": {
        "severity": "Low",
        "points": 5,
        "threat": "Reboot Persistence",
        "description": "Automatically restarts spyware daemons whenever the Android device is rebooted."
    }
}

def extract_strings_from_bytes(data: bytes, min_len: int = 4) -> List[str]:
    """Extract printable ASCII and UTF-8 strings from binary blobs (DEX, XML)."""
    result = []
    # Match printable ASCII
    pattern = re.compile(rb"[\x20-\x7E]{" + str(min_len).encode() + rb",}")
    for match in pattern.finditer(data):
        try:
            result.append(match.group().decode("ascii", errors="ignore"))
        except Exception:
            pass
    return result

def analyze_apk_file(file_path: str, original_filename: str = None) -> Dict[str, Any]:
    """
    Perform deep static analysis of an Android APK file using safe ZIP inspection
    and heuristic indicator extraction.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    filename = original_filename or os.path.basename(file_path)
    file_size = os.path.getsize(file_path)

    # Compute cryptographic hashes for digital evidence chain-of-custody
    sha256_h = hashlib.sha256()
    md5_h = hashlib.md5()
    with open(file_path, "rb") as f:
        while chunk := f.read(65536):
            sha256_h.update(chunk)
            md5_h.update(chunk)

    sha256_hex = sha256_h.hexdigest()
    md5_hex = md5_h.hexdigest()

    manifest_content = b""
    dex_strings: List[str] = []
    cert_files: List[str] = []
    zip_entries: List[str] = []

    try:
        with zipfile.ZipFile(file_path, "r") as z:
            zip_entries = z.namelist()
            for entry in zip_entries:
                if entry.endswith("AndroidManifest.xml"):
                    manifest_content = z.read(entry)
                elif entry.endswith(".dex") and len(dex_strings) < 5000:
                    dex_data = z.read(entry)
                    # Extract strings from primary dex
                    dex_strings.extend(extract_strings_from_bytes(dex_data[:2000000]))
                elif "META-INF" in entry and (entry.endswith(".RSA") or entry.endswith(".DSA") or entry.endswith(".EC")):
                    cert_files.append(entry)
    except zipfile.BadZipFile:
        return {
            "filename": filename,
            "package_name": "Invalid APK Structure",
            "app_name": "Corrupt or Obfuscated Archive",
            "version_name": "0.0",
            "sha256_hash": sha256_hex,
            "md5_hash": md5_hex,
            "file_size_bytes": file_size,
            "risk_score": 85,
            "risk_category": "Critical",
            "dangerous_permissions": [],
            "normal_permissions": [],
            "extracted_urls": [],
            "extracted_ips": [],
            "certificate_info": {"status": "Archive Corrupted / Anti-Analysis Zip Packing"},
            "threat_indicators": [{
                "name": "Anti-Analysis Archive Tampering",
                "severity": "Critical",
                "description": "File does not comply with standard ZIP format or deliberately exploits zip parser differences."
            }],
            "loan_shark_indicators": []
        }

    # Extract all strings from manifest
    manifest_strings = extract_strings_from_bytes(manifest_content)
    all_strings = set(manifest_strings + dex_strings)

    # Find permissions
    declared_permissions = set()
    for s in all_strings:
        if "android.permission." in s:
            match = re.search(r"android\.permission\.([A-Z_]+)", s)
            if match:
                declared_permissions.add(match.group(1))

    # Package name detection
    package_name = "com.suspect.app"
    for s in manifest_strings:
        if re.match(r"^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*){2,}$", s):
            if not any(prefix in s for prefix in ["android.support", "androidx", "com.google", "kotlin"]):
                package_name = s
                break

    # App name heuristic
    app_name = filename.replace(".apk", "").replace("_", " ").title()

    # Network indicators extraction
    extracted_urls = set()
    extracted_ips = set()
    url_pattern = re.compile(r"https?://[a-zA-Z0-9.-]+(?::\d+)?(?:/[^\s\"'<>]*)?")
    ip_pattern = re.compile(r"\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b")

    for s in all_strings:
        for u in url_pattern.findall(s):
            if not any(safe in u for safe in ["w3.org", "schemas.android.com", "apache.org", "github.com"]):
                extracted_urls.add(u[:120])
        for ip in ip_pattern.findall(s):
            if not ip.startswith("127.") and not ip.startswith("0.") and not ip.startswith("255."):
                extracted_ips.add(ip)

    # Categorize permissions
    dangerous_perms_list = []
    normal_perms_list = []
    risk_score = 0
    threat_indicators = []
    loan_shark_indicators = []

    for perm in declared_permissions:
        if perm in DANGEROUS_PERMISSIONS_MAP:
            info = DANGEROUS_PERMISSIONS_MAP[perm]
            risk_score += info["points"]
            dangerous_perms_list.append({
                "permission": f"android.permission.{perm}",
                "name": perm,
                "severity": info["severity"],
                "threat": info["threat"],
                "description": info["description"]
            })
        else:
            normal_perms_list.append(f"android.permission.{perm}")

    # Heuristic 1: Loan Shark Extortion Syndicate Signature
    # If app asks for Contacts + Camera/Storage + SMS
    has_contacts = "READ_CONTACTS" in declared_permissions
    has_sms = "READ_SMS" in declared_permissions or "RECEIVE_SMS" in declared_permissions
    has_camera = "CAMERA" in declared_permissions
    
    if has_contacts and (has_sms or has_camera):
        risk_score += 25
        loan_ind = {
            "name": "Predatory Loan Extortion Profile Detected",
            "severity": "Critical",
            "description": "App requests simultaneous access to victim contacts, camera and SMS messages. This signature matches predatory instant-loan syndicates that harvest contact lists for blackmail and defamation."
        }
        loan_shark_indicators.append(loan_ind)
        threat_indicators.append(loan_ind)

    # Heuristic 2: Banking Overlay Trojan
    has_overlay = "SYSTEM_ALERT_WINDOW" in declared_permissions
    has_accessibility = "BIND_ACCESSIBILITY_SERVICE" in declared_permissions
    if (has_overlay or has_accessibility) and has_sms:
        risk_score += 30
        trojan_ind = {
            "name": "Banking Trojan & OTP Interception Architecture",
            "severity": "Critical",
            "description": "App possesses overlay display capabilities and SMS broadcast listeners, allowing real-time credential spoofing and automated OTP exfiltration."
        }
        threat_indicators.append(trojan_ind)

    # Heuristic 3: Dropper / Out-of-Store Updates
    if "REQUEST_INSTALL_PACKAGES" in declared_permissions:
        risk_score += 15
        threat_indicators.append({
            "name": "Payload Dropper Mechanism",
            "severity": "High",
            "description": "App can prompt silent or deceptive installation of additional APK binaries, bypassing static analysis safeguards."
        })

    # Certificate Info
    cert_info = {
        "certificates_found": len(cert_files),
        "files": cert_files,
        "is_debug_signed": any("debug" in s.lower() for s in all_strings),
        "status": "Self-Signed / Developer Key" if cert_files else "Unsigned / Tampered"
    }
    if cert_info["is_debug_signed"]:
        risk_score += 15
        threat_indicators.append({
            "name": "Debug Keystore Signature",
            "severity": "Medium",
            "description": "APK was signed with a generic Android debug key instead of a verified organization certificate."
        })

    # Cap risk score
    risk_score = min(100, max(0, risk_score))
    if risk_score >= 70:
        risk_category = "Critical"
    elif risk_score >= 45:
        risk_category = "High"
    elif risk_score >= 20:
        risk_category = "Medium"
    else:
        risk_category = "Low"

    return {
        "filename": filename,
        "package_name": package_name,
        "app_name": app_name,
        "version_name": "1.0.4",
        "sha256_hash": sha256_hex,
        "md5_hash": md5_hex,
        "file_size_bytes": file_size,
        "risk_score": risk_score,
        "risk_category": risk_category,
        "dangerous_permissions": dangerous_perms_list,
        "normal_permissions": normal_perms_list,
        "extracted_urls": list(extracted_urls)[:25],
        "extracted_ips": list(extracted_ips)[:25],
        "certificate_info": cert_info,
        "threat_indicators": threat_indicators,
        "loan_shark_indicators": loan_shark_indicators
    }
