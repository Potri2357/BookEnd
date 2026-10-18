"""
Configuration and settings for Patch Assurance (PatchGate).
"""
import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "Patch Assurance"
    TAGLINE: str = "Patch with proof."
    VERSION: str = "2.0.0"
    ENVIRONMENT: str = "development"
    DATABASE_PATH: str = os.getenv("DATABASE_PATH", "patchguard.duckdb")
    AUDIT_LEDGER_PATH: str = os.getenv("AUDIT_LEDGER_PATH", "audit_ledger.json")
    DEFAULT_LOOKBACK_DAYS: int = 45
    COVERAGE_THRESHOLD: float = 0.85
    CERT_IN_EMERGENCY_HOURS: int = 12
    CERT_IN_HIGH_HOURS: int = 24
    CERT_IN_STANDARD_HOURS: int = 72
    CISA_TRIAGE_HOURS: int = 72
    SIMULATED_BANNER: bool = True

settings = Settings()
