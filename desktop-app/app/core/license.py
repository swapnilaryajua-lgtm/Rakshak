from __future__ import annotations

import logging
from dataclasses import dataclass

"""License validation module for the Rakshak Desktop Application."""

logger = logging.getLogger(__name__)

@dataclass
class LicenseInfo:
    """Information about a validated license."""
    valid: bool
    plan: str = 'free'
    message: str = ''

def validate_license(license_key: str) -> LicenseInfo:
    """
    Validate a given license key.
    
    # TODO: Integrate with Rakshak web backend API for real license validation
    """
    logger.warning("License validation is currently stubbed.")
    
    if license_key and isinstance(license_key, str) and license_key.strip():
        return LicenseInfo(
            valid=True,
            plan='professional',
            message='License validated (stub)'
        )
    
    return LicenseInfo(
        valid=False,
        plan='free',
        message='No license key provided'
    )
