from __future__ import annotations

import logging
import socket
import ssl
from datetime import datetime, timezone
from urllib.parse import urlparse
from typing import Any, Dict

from app.core import config

logger = logging.getLogger(__name__)

class SslChecker:
    """Checks the SSL certificate validity for a given hostname."""

    def __init__(self, timeout: int = getattr(config, 'SSL_TIMEOUT', 10)):
        """
        Initialize the SslChecker.

        Args:
            timeout (int): Socket connection timeout in seconds.
        """
        self.timeout = timeout

    def check(self, hostname: str) -> Dict[str, Any]:
        """
        Check the SSL certificate for the given hostname or URL.

        Args:
            hostname (str): The hostname or URL to check.

        Returns:
            dict: The result containing valid, expiry_date, days_remaining,
                  issuer, subject, and error.
        """
        logger.debug(f"Starting SSL check for: {hostname}")
        
        # Extract hostname if a full URL was provided
        parsed_url = urlparse(hostname)
        if parsed_url.netloc:
            hostname = parsed_url.netloc.split(':')[0]
        elif '/' in hostname:
            hostname = hostname.split('/')[0].split(':')[0]
            
        result: Dict[str, Any] = {
            "valid": False,
            "expiry_date": None,
            "days_remaining": None,
            "issuer": None,
            "subject": None,
            "error": None
        }

        context = ssl.create_default_context()
        try:
            with socket.create_connection((hostname, 443), timeout=self.timeout) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    cert = ssock.getpeercert()
                    
                    if not cert:
                        result["error"] = "No certificate retrieved"
                        return result
                        
                    # Extract common name (subject)
                    subject = dict(x[0] for x in cert.get('subject', ()))
                    result["subject"] = subject.get('commonName')
                    
                    # Extract issuer
                    issuer = dict(x[0] for x in cert.get('issuer', ()))
                    result["issuer"] = issuer.get('commonName')
                    
                    # Parse expiry date
                    not_after = cert.get('notAfter')
                    if not_after:
                        # Format example: 'Oct 19 23:59:59 2024 GMT'
                        expire_date = datetime.strptime(not_after, '%b %d %H:%M:%S %Y %Z')
                        expire_date = expire_date.replace(tzinfo=timezone.utc)
                        result["expiry_date"] = expire_date.isoformat()
                        
                        now = datetime.now(timezone.utc)
                        days_remaining = (expire_date - now).days
                        result["days_remaining"] = days_remaining
                        
                        if days_remaining < 7:
                            result["error"] = "Critical: Certificate expires in less than 7 days."
                            result["valid"] = False
                        elif days_remaining < 30:
                            result["error"] = "Warning: Certificate expires in less than 30 days."
                            result["valid"] = True
                        else:
                            result["valid"] = True
                    else:
                        result["error"] = "Could not parse notAfter date"

        except ssl.SSLError as e:
            logger.debug(f"SSL error for {hostname}: {e}")
            result["error"] = f"SSL Error: {e}"
        except socket.error as e:
            logger.debug(f"Socket error for {hostname}: {e}")
            result["error"] = f"Connection Error: {e}"
        except Exception as e:
            logger.debug(f"Unexpected error during SSL check for {hostname}: {e}")
            result["error"] = str(e)

        return result
