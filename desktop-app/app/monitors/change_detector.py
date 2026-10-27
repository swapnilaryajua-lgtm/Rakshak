from __future__ import annotations

from typing import Any, Dict, Optional

from app.core.models import CheckResult

class ChangeDetector:
    """Detects changes between current and previous check results."""

    def detect_changes(self, current: CheckResult, previous: Optional[CheckResult]) -> Dict[str, Any]:
        """
        Compare the current CheckResult with the previous one to detect changes.

        Args:
            current (CheckResult): The most recent check result.
            previous (CheckResult, optional): The previous check result, if any.

        Returns:
            dict: A dictionary containing is_changed, new_issues, resolved_issues,
                  status_changed, previous_status, current_status, and summary.
        """
        result: Dict[str, Any] = {
            "is_changed": False,
            "new_issues": [],
            "resolved_issues": [],
            "status_changed": False,
            "previous_status": None,
            "current_status": current.status,
            "summary": ""
        }

        # Determine current issues
        current_issues = []
        if current.http_status and not (200 <= current.http_status < 400):
            current_issues.append(f"HTTP status {current.http_status}")
        if not current.ssl_valid:
            current_issues.append("SSL certificate is invalid")
        if current.headers_missing:
            current_issues.append(f"{len(current.headers_missing)} security header(s) missing")
        if current.issues:
            current_issues.extend(current.issues)

        if previous is None:
            result["is_changed"] = True
            result["new_issues"] = current_issues
            result["summary"] = "Initial check completed."
            return result
            
        result["previous_status"] = previous.status
        if current.status != previous.status:
            result["status_changed"] = True
            result["is_changed"] = True

        # Determine previous issues
        previous_issues = []
        if previous.http_status and not (200 <= previous.http_status < 400):
            previous_issues.append(f"HTTP status {previous.http_status}")
        if not previous.ssl_valid:
            previous_issues.append("SSL certificate is invalid")
        if previous.headers_missing:
            previous_issues.append(f"{len(previous.headers_missing)} security header(s) missing")
        if previous.issues:
            previous_issues.extend(previous.issues)

        # Compare issues
        for issue in current_issues:
            if issue not in previous_issues:
                result["new_issues"].append(issue)
                result["is_changed"] = True
                
        for issue in previous_issues:
            if issue not in current_issues:
                result["resolved_issues"].append(issue)
                result["is_changed"] = True
                
        # Generate summary
        summaries = []
        if result["status_changed"]:
            summaries.append(f"Status changed from {previous.status} to {current.status}.")
        
        if result["new_issues"]:
            summaries.append(f"{len(result['new_issues'])} new issue(s) found.")
            
        if result["resolved_issues"]:
            summaries.append(f"{len(result['resolved_issues'])} issue(s) resolved.")
            
        if not result["is_changed"]:
            result["summary"] = "No changes detected."
        else:
            result["summary"] = " ".join(summaries)

        return result
