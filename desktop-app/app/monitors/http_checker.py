from __future__ import annotations

import logging
import time
import requests
from typing import Any, Dict

from app.core import config

logger = logging.getLogger(__name__)

class HttpChecker:
    """Checks the HTTP health and status of a website."""

    def __init__(self, timeout: int = getattr(config, 'HTTP_TIMEOUT', 10)):
        """
        Initialize the HttpChecker.

        Args:
            timeout (int): The timeout for the HTTP request in seconds.
        """
        self.timeout = timeout
        self.user_agent = getattr(config, 'USER_AGENT', 'RakshakMonitor/1.0')

    def check(self, url: str) -> Dict[str, Any]:
        """
        Perform an HTTP check against the given URL.

        Args:
            url (str): The URL to check.

        Returns:
            dict: The result containing status_code, response_time_ms,
                  redirect_chain, final_url, and error.
        """
        logger.debug(f"Starting HTTP check for URL: {url}")
        result: Dict[str, Any] = {
            "status_code": None,
            "response_time_ms": None,
            "redirect_chain": [],
            "final_url": url,
            "error": None,
            "headers": {},
        }

        headers = {"User-Agent": self.user_agent}
        start_time = time.time()

        try:
            response = requests.get(url, headers=headers, timeout=self.timeout, allow_redirects=True)
            end_time = time.time()

            result["status_code"] = response.status_code
            result["response_time_ms"] = (end_time - start_time) * 1000.0
            result["final_url"] = response.url
            result["redirect_chain"] = [resp.url for resp in response.history]
            result["headers"] = dict(response.headers)

            logger.debug(f"HTTP check for {url} completed with status {response.status_code}")

        except requests.RequestException as e:
            logger.debug(f"HTTP check for {url} failed: {e}")
            result["error"] = str(e)

        return result
