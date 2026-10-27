from __future__ import annotations

import logging
from typing import List

try:
    from plyer import notification
except ImportError:
    notification = None

logger = logging.getLogger(__name__)

class DesktopNotifier:
    """Handles native Windows desktop notifications for the Rakshak app."""

    def __init__(self, enabled: bool = True) -> None:
        """
        Initialize the desktop notifier.

        Args:
            enabled: Whether notifications are enabled.
        """
        self._enabled = enabled

    @property
    def enabled(self) -> bool:
        """Getter for the enabled property."""
        return self._enabled

    @enabled.setter
    def enabled(self, value: bool) -> None:
        """Setter for the enabled property."""
        self._enabled = value

    def notify(self, title: str, message: str, timeout: int = 10) -> None:
        """
        Send a desktop notification.

        Args:
            title: The notification title.
            message: The notification message.
            timeout: Duration in seconds to show the notification.
        """
        if not self.enabled:
            return

        logger.debug(f"Attempting to send notification: {title} - {message}")

        if notification is None:
            logger.warning("plyer module not available. Cannot send desktop notification.")
            return

        try:
            notification.notify(
                title=title,
                message=message,
                app_name='Rakshak',
                timeout=timeout
            )
        except Exception as e:
            logger.warning(f"Failed to send desktop notification: {e}")

    def notify_issue_found(self, site_url: str, issues: list[str]) -> None:
        """
        Notify when issues are found on a monitored site.

        Args:
            site_url: URL of the site with issues.
            issues: List of issue descriptions.
        """
        title = '⚠️ Rakshak Alert'
        summary = ", ".join(issues)
        message = f'Issues found on {site_url}: {summary}'
        
        # Truncate message to 256 chars for Windows notification limits
        if len(message) > 256:
            message = message[:253] + '...'
            
        self.notify(title=title, message=message)

    def notify_issue_resolved(self, site_url: str) -> None:
        """
        Notify when previously found issues are resolved on a site.

        Args:
            site_url: URL of the resolved site.
        """
        title = '✅ Rakshak'
        message = f'{site_url} — All clear, issues resolved'
        self.notify(title=title, message=message)

    def notify_ssl_expiring(self, site_url: str, days_remaining: int) -> None:
        """
        Notify when a site's SSL certificate is nearing expiration.

        Args:
            site_url: URL of the site.
            days_remaining: Days remaining until SSL expiry.
        """
        title = '🔒 SSL Warning'
        message = f'{site_url} SSL certificate expires in {days_remaining} days'
        self.notify(title=title, message=message)
