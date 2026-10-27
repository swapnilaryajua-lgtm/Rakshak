def format_zap_report(raw_alerts: list) -> dict:
    """
    Format raw ZAP alerts into the schema expected by the frontend.
    """
    summary = {
        "critical": 0,
        "high": 0,
        "medium": 0,
        "low": 0,
        "info": 0,
        "total": 0
    }
    vulnerabilities = []

    risk_map = {
        "3": "high",       # High
        "2": "medium",     # Medium
        "1": "low",        # Low
        "0": "info"        # Informational
    }
    
    for alert in raw_alerts:
        risk_code = alert.get("riskcode", "0")
        severity = risk_map.get(risk_code, "info")
        
        # We manually map 'High' with a certain confidence to 'Critical' if needed,
        # but for now we follow the simple ZAP mapping (3=High).
        # We can simulate critical for demonstration purposes.
        if severity == "high" and alert.get("confidence", "0") == "3":
            severity = "critical"
            
        summary[severity] += 1
        summary["total"] += 1
        
        cwe = alert.get("cweid", "")
        cwe_formatted = f"CWE-{cwe}" if cwe and cwe != "-1" else "N/A"
        
        vuln = {
            "id": f"vuln_{alert.get('pluginId', 'unknown')}",
            "name": alert.get("name", "Unknown Vulnerability"),
            "severity": severity,
            "description": alert.get("description", "No description available."),
            "location": alert.get("url", "Unknown location"),
            "remediation": alert.get("solution", "No remediation provided."),
            "cweId": cwe_formatted,
            "references": [ref for ref in alert.get("reference", "").split("\n") if ref.strip()]
        }
        vulnerabilities.append(vuln)
        
    return {
        "summary": summary,
        "vulnerabilities": vulnerabilities
    }
