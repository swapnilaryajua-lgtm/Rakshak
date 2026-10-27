from __future__ import annotations

from typing import Any, Dict, List, Optional

from app.core import config

class HeaderChecker:
    """Checks for the presence of required security headers in HTTP responses."""

    def __init__(self, required_headers: Optional[List[str]] = None):
        """
        Initialize the HeaderChecker.

        Args:
            required_headers (list[str], optional): A list of required header names.
                                                    Defaults to config.SECURITY_HEADERS.
        """
        self.required_headers = required_headers if required_headers is not None else getattr(config, 'SECURITY_HEADERS', [])
        self._lower_required = [h.lower() for h in self.required_headers]

    def check(self, response_headers: Dict[str, str]) -> Dict[str, Any]:
        """
        Check the given headers against the required security headers.

        Args:
            response_headers (dict): The headers returned by an HTTP response.

        Returns:
            dict: The result containing present, missing, score, and details.
        """
        lower_response_headers = {k.lower(): v for k, v in response_headers.items()}
        
        present = []
        missing = []
        details = {}
        
        for i, header_lower in enumerate(self._lower_required):
            original_header = self.required_headers[i]
            if header_lower in lower_response_headers:
                present.append(original_header)
                details[original_header] = lower_response_headers[header_lower]
            else:
                missing.append(original_header)
                details[original_header] = None
                
        score = len(present)
        
        return {
            "present": present,
            "missing": missing,
            "score": score,
            "details": details
        }
