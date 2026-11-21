import re
import math
from urllib.parse import urlparse
from typing import Dict, Any, List

SUSPICIOUS_TLDS = {
    "xyz", "top", "work", "click", "rest", "support", "link", "buzz", "site",
    "club", "online", "live", "vip", "gq", "cf", "ml", "ga", "tk", "download"
}

KNOWN_SHORTENERS = {
    "bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "rb.gy", "shorturl.at",
    "ow.ly", "buff.ly", "goo.gl", "tiny.cc", "rebrand.ly"
}

TARGETED_BRANDS = [
    ("sbi", "State Bank of India"),
    ("yono", "SBI YONO Banking"),
    ("hdfc", "HDFC Bank"),
    ("icici", "ICICI Bank"),
    ("pnb", "Punjab National Bank"),
    ("bob", "Bank of Baroda"),
    ("paytm", "Paytm Payments Bank"),
    ("phonepe", "PhonePe"),
    ("gpay", "Google Pay"),
    ("police", "Law Enforcement / Police"),
    ("rajasthan", "Government of Rajasthan"),
    ("echallan", "Traffic E-Challan"),
    ("bijli", "Electricity Board / JVVNL"),
    ("jvvnl", "Jaipur Vidyut Vitran Nigam"),
    ("discom", "Electricity Discom"),
    ("aadhaar", "UIDAI Aadhaar"),
    ("income-tax", "Income Tax Department"),
    ("kyc", "KYC Verification"),
    ("lottery", "Lottery Prize"),
    ("telecom", "DoT / SIM Verification")
]

def calculate_entropy(text: str) -> float:
    """Calculate Shannon entropy to identify algorithmic/random domain generation."""
    if not text:
        return 0.0
    entropy = 0.0
    length = len(text)
    char_counts = {}
    for c in text.lower():
        char_counts[c] = char_counts.get(c, 0) + 1
    for count in char_counts.values():
        p = count / length
        entropy -= p * math.log2(p)
    return round(entropy, 2)

def is_ip_address(host: str) -> bool:
    """Check if host is an IPv4 or IPv6 address."""
    # IPv4 regex
    ipv4_pattern = r"^(\d{1,3}\.){3}\d{1,3}$"
    if re.match(ipv4_pattern, host):
        return True
    # IPv6 check
    if ":" in host and not any(c.isalpha() for c in host.replace(":", "").replace("[", "").replace("]", "")):
        return True
    return False

def analyze_url(url: str, investigator_notes: str = None) -> Dict[str, Any]:
    """
    Perform deep static heuristic analysis of suspicious URL for cybercrime investigations.
    Distinguishes verifiable factual indicators from algorithmic risk scoring.
    """
    raw_url = url.strip()
    if not re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*://", raw_url):
        raw_url = "http://" + raw_url

    parsed = urlparse(raw_url)
    scheme = parsed.scheme.lower()
    netloc = parsed.netloc.lower()
    path = parsed.path
    query = parsed.query

    # Split host and port
    host = netloc.split(":")[0]
    port = parsed.port

    indicators: List[Dict[str, Any]] = []
    risk_score = 0
    verification_steps: List[str] = []

    # 1. Scheme Check (HTTP vs HTTPS)
    if scheme == "http":
        risk_score += 15
        indicators.append({
            "code": "INSECURE_SCHEME_HTTP",
            "name": "Unencrypted HTTP Scheme",
            "severity": "Medium",
            "risk_points": 15,
            "description": "The URL uses plaintext HTTP instead of secure TLS/HTTPS, exposing user inputs and credentials."
        })
        verification_steps.append("Verify if server redirects to HTTPS or permits cleartext submission of sensitive data.")
    elif scheme == "https":
        indicators.append({
            "code": "SCHEME_HTTPS_PRESENT",
            "name": "HTTPS Encryption Present",
            "severity": "Info",
            "risk_points": 0,
            "description": "URL specifies HTTPS. Note: Modern phishing sites frequently use free Let's Encrypt certificates."
        })

    # 2. IP Address as Hostname
    is_ip = is_ip_address(host)
    if is_ip:
        risk_score += 40
        indicators.append({
            "code": "IP_BASED_HOSTNAME",
            "name": "Direct IP Address Host",
            "severity": "Critical",
            "risk_points": 40,
            "description": f"Hostname '{host}' is a raw IP address bypassing standard DNS registration, typical of C2 nodes or phishing kits."
        })
        verification_steps.append(f"Execute IP WHOIS and query ASN geolocation for host '{host}'.")

    # Check for suspicious path patterns (c2, sms, kyc, apk, pay)
    c2_keywords = ["c2", "receive_sms", "payload", "stealer", "trojan", "dropper", "gate.php"]
    if any(k in path.lower() for k in c2_keywords):
        risk_score += 25
        indicators.append({
            "code": "MALWARE_C2_PATH_SIGNATURE",
            "name": "Malware C2 Communication Path Signature",
            "severity": "Critical",
            "risk_points": 25,
            "description": f"URL path '{path}' matches known command-and-control exfiltration endpoints."
        })

    # 3. URL Shortener Detection
    is_shortener = host in KNOWN_SHORTENERS
    if is_shortener:
        risk_score += 25
        indicators.append({
            "code": "URL_SHORTENER_DETECTED",
            "name": "Known URL Shortening Service",
            "severity": "High",
            "risk_points": 25,
            "description": f"URL uses shortening domain '{host}' to obfuscate the real destination page."
        })
        verification_steps.append("Expand shortened URL using safe HTTP HEAD redirection inspection (do not execute JavaScript).")

    # 4. Suspicious or High-Abuse TLD
    tld = host.split(".")[-1] if "." in host else ""
    is_sus_tld = tld in SUSPICIOUS_TLDS
    if is_sus_tld:
        risk_score += 20
        indicators.append({
            "code": "SUSPICIOUS_TLD",
            "name": f"High-Risk Top Level Domain (.{tld})",
            "severity": "Medium",
            "risk_points": 20,
            "description": f"The top-level domain '.{tld}' has a statistically high correlation with disposable cybercrime infrastructure."
        })
        verification_steps.append(f"Inspect registrar details for the '.{tld}' registry and check abuse contact.")

    # 5. Excessive URL Length
    total_len = len(raw_url)
    if total_len > 120:
        risk_score += 15
        indicators.append({
            "code": "EXCESSIVE_URL_LENGTH",
            "name": f"Abnormally Long URL ({total_len} characters)",
            "severity": "Medium",
            "risk_points": 15,
            "description": "URL length exceeds 120 characters, commonly used to conceal payload tokens or push malicious domains off screen on mobile displays."
        })
    elif total_len > 75:
        risk_score += 5
        indicators.append({
            "code": "ELEVATED_URL_LENGTH",
            "name": f"Elevated URL Length ({total_len} characters)",
            "severity": "Low",
            "risk_points": 5,
            "description": "URL is longer than standard navigation links."
        })

    # 6. Deep Subdomain Nesting
    subdomain_parts = host.split(".")
    if len(subdomain_parts) >= 4 and not is_ip:
        risk_score += 20
        indicators.append({
            "code": "DEEP_SUBDOMAIN_NESTING",
            "name": f"Excessive Subdomain Depth ({len(subdomain_parts)} levels)",
            "severity": "High",
            "risk_points": 20,
            "description": f"Subdomain structure '{host}' exhibits deep nesting, frequently used to mimic legitimate corporate or government domains."
        })
        verification_steps.append("Identify the root registrable domain (SLD+TLD) to ascertain ownership.")

    # 7. Brand Impersonation / Typosquatting in Hostname or Path
    is_gov_in = host.endswith(".gov.in") or host.endswith(".nic.in")
    detected_brands = []
    if not is_gov_in:
        for brand_key, brand_title in TARGETED_BRANDS:
            if brand_key in host or (brand_key in path and ("kyc" in path or "login" in path or "pay" in path)):
                # Check if it's the legitimate official domain
                legitimate_domains = [f"{brand_key}.co.in", f"{brand_key}.com", f"{brand_key}.gov.in", f"{brand_key}.in"]
                if not any(host == legit or host.endswith("." + legit) for legit in legitimate_domains):
                    detected_brands.append((brand_key, brand_title))
    else:
        indicators.append({
            "code": "VERIFIED_GOV_DOMAIN",
            "name": "Verified Indian Government Domain (.gov.in / .nic.in)",
            "severity": "Info",
            "risk_points": 0,
            "description": "Host resides under the restricted government top-level domain managed by National Informatics Centre (NIC)."
        })
    
    if detected_brands:
        risk_score += 30
        brands_str = ", ".join([b[1] for b in detected_brands])
        indicators.append({
            "code": "BRAND_IMPERSONATION_HEURISTIC",
            "name": "Targeted Brand / Entity Impersonation Pattern",
            "severity": "Critical",
            "risk_points": 30,
            "description": f"URL exhibits patterns mimicking recognized brands or public entities: {brands_str} on an unverified third-party domain."
        })
        verification_steps.append(f"Issue an advisory to the affected institutional nodal officer ({brands_str}) for takedown confirmation.")

    # 8. Suspicious Characters (@ symbol, hyphen stuffing, multiple slashes)
    if "@" in raw_url:
        risk_score += 25
        indicators.append({
            "code": "USERINFO_DELIMITER_AT",
            "name": "Embedded '@' Delimiter",
            "severity": "High",
            "risk_points": 25,
            "description": "The URL contains an '@' symbol. Browsers treat characters preceding '@' as credentials and navigate to whatever follows, creating severe visual deception."
        })
    
    hyphen_count = host.count("-")
    if hyphen_count >= 3:
        risk_score += 15
        indicators.append({
            "code": "HYPHEN_STUFFING",
            "name": f"Heavy Hyphenation in Hostname ({hyphen_count} hyphens)",
            "severity": "Medium",
            "risk_points": 15,
            "description": "Multiple hyphens are commonly used by phishing syndicates to chain keywords (e.g. 'sbi-online-kyc-approval-portal')."
        })

    # 9. Non-standard HTTP Ports
    if port and port not in (80, 443, 8080):
        risk_score += 15
        indicators.append({
            "code": "NON_STANDARD_PORT",
            "name": f"Non-Standard Port ({port})",
            "severity": "Medium",
            "risk_points": 15,
            "description": f"URL routes to an unusual network port ({port}), which is atypical for legitimate public consumer portals."
        })
        verification_steps.append(f"Port-scan host '{host}' via authorized network forensics tools to identify daemon behind port {port}.")

    # 10. Domain Entropy Analysis (DGA detection)
    host_no_tld = subdomain_parts[0] if subdomain_parts else host
    entropy = calculate_entropy(host_no_tld)
    if entropy > 4.2 and len(host_no_tld) > 10 and not is_ip:
        risk_score += 20
        indicators.append({
            "code": "HIGH_DOMAIN_ENTROPY",
            "name": f"High Domain Randomness / Entropy ({entropy})",
            "severity": "High",
            "risk_points": 20,
            "description": "Domain name exhibits high Shannon entropy, indicating machine-generated domain names (DGA) used by malware command channels."
        })

    # Cap risk score between 0 and 100
    risk_score = min(100, max(0, risk_score))

    # Categorize Risk
    if risk_score >= 75:
        risk_category = "Critical"
    elif risk_score >= 50:
        risk_category = "High"
    elif risk_score >= 25:
        risk_category = "Medium"
    else:
        risk_category = "Low"

    # Default verification steps if none triggered
    if not verification_steps:
        verification_steps.append("Validate domain registration date and registrant organization via ICANN Lookup.")
        verification_steps.append("Cross-reference host against National Cyber Crime Reporting Portal (NCRP) repository.")

    explanation = (
        f"Automated static heuristic analysis assessed this URL with a risk score of {risk_score}/100 ({risk_category}). "
        f"Identified {len(indicators)} diagnostic indicators. "
        "Important: Heuristic scores reflect structural anomalies and threat patterns, not definitive malware execution proof."
    )

    return {
        "url": raw_url,
        "domain": host,
        "ip_address": host if is_ip else None,
        "scheme": scheme,
        "risk_score": risk_score,
        "risk_category": risk_category,
        "indicators": indicators,
        "explanation": explanation,
        "verification_steps": verification_steps,
        "is_shortener": is_shortener,
        "is_ip_host": is_ip,
        "is_suspicious_tld": is_sus_tld,
        "analysis_method": "Heuristic Static Engine (RFC 3986 & CyberSutra Threat Signatures)",
        "investigator_notes": investigator_notes
    }
