"""
Configuration and settings for Postern.
"""
import os
from pathlib import Path
from typing import Optional
from pydantic import BaseModel

try:
    from dotenv import load_dotenv
    possible_paths = [
        Path.cwd() / ".env",
        Path(__file__).resolve().parent.parent.parent / ".env",
        Path(__file__).resolve().parent.parent.parent.parent / ".env"
    ]
    for p in possible_paths:
        if p.exists():
            load_dotenv(dotenv_path=p)
            break
    else:
        load_dotenv()
except ImportError:
    pass

class Settings(BaseModel):
    APP_NAME: str = os.getenv("APP_NAME", "Postern")
    TAGLINE: str = os.getenv("TAGLINE", "Patch with proof.")
    VERSION: str = os.getenv("VERSION", "3.5.0-enterprise")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    PORT: int = int(os.getenv("PORT", "8008"))
    HOST: str = os.getenv("HOST", "0.0.0.0")

    # Persistent Storage
    DATABASE_PATH: str = os.getenv("DATABASE_PATH", "postern.duckdb")
    AUDIT_LEDGER_PATH: str = os.getenv("AUDIT_LEDGER_PATH", "audit_ledger.json")
    USER_AUDIT_LOG_PATH: str = os.getenv("USER_AUDIT_LOG_PATH", "user_actions.json")
    BACKUP_DIR: str = os.getenv("BACKUP_DIR", "backups")

    # Forensic & Compliance SLAs
    DEFAULT_LOOKBACK_DAYS: int = int(os.getenv("DEFAULT_LOOKBACK_DAYS", "45"))
    COVERAGE_THRESHOLD: float = float(os.getenv("COVERAGE_THRESHOLD", "0.85"))
    CERT_IN_EMERGENCY_HOURS: int = int(os.getenv("CERT_IN_EMERGENCY_HOURS", "12"))
    CERT_IN_HIGH_HOURS: int = int(os.getenv("CERT_IN_HIGH_HOURS", "24"))
    CERT_IN_STANDARD_HOURS: int = int(os.getenv("CERT_IN_STANDARD_HOURS", "72"))
    CISA_TRIAGE_HOURS: int = int(os.getenv("CISA_TRIAGE_HOURS", "72"))
    SIMULATED_BANNER: bool = os.getenv("SIMULATED_BANNER", "True").lower() in ("true", "1", "yes")

    # Enterprise Server Identity & Security
    SERVER_NODE_ID: str = os.getenv("SERVER_NODE_ID", "postern-prod-ap-south-node01")
    CLUSTER_REGION: str = os.getenv("CLUSTER_REGION", "ap-south-1")
    WEBHOOK_TARGET_URL: str = os.getenv("WEBHOOK_TARGET_URL", "https://itsm.internal.local/webhook")
    CORS_ALLOWED_ORIGINS: str = os.getenv(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:8008,http://127.0.0.1:8008,https://postern-five.vercel.app,https://postern-bwiq.onrender.com,https://book-end-pi.vercel.app,https://bookend-pp3k.onrender.com"
    )

    # Cryptographic Identity & Notary Specification
    SIGNING_KEY_PATH: str = os.getenv("SIGNING_KEY_PATH", ".signing_key")
    KEY_STORE_PATH: str = os.getenv("KEY_STORE_PATH", "published_keys.json")
    NOTARY_PROVIDER: str = os.getenv("NOTARY_PROVIDER", "Software Ed25519 Notary (Air-Gapped / HSM-Ready PKCS#11 Architecture)")

    # Security Controls: Auth, Docs, Metrics, Rate Limiting, SSRF
    REQUIRE_AUTH: bool = os.getenv("REQUIRE_AUTH", "False").lower() in ("true", "1", "yes")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "postern-enterprise-jwt-super-secret-key-32b-min")
    ENABLE_PUBLIC_DOCS: bool = os.getenv("ENABLE_PUBLIC_DOCS", "False").lower() in ("true", "1", "yes")
    ENABLE_PUBLIC_METRICS: bool = os.getenv("ENABLE_PUBLIC_METRICS", "False").lower() in ("true", "1", "yes")
    INTERNAL_METRICS_TOKEN: str = os.getenv("INTERNAL_METRICS_TOKEN", "postern-internal-scraper-token")
    RATE_LIMIT_ENABLED: bool = os.getenv("RATE_LIMIT_ENABLED", "True").lower() in ("true", "1", "yes")
    RATE_LIMIT_RPM: int = int(os.getenv("RATE_LIMIT_RPM", "240"))
    SSRF_PROTECTION_ENABLED: bool = os.getenv("SSRF_PROTECTION_ENABLED", "True").lower() in ("true", "1", "yes")
    ALLOW_LOOPBACK_WEBHOOKS_FOR_TEST: bool = os.getenv("ALLOW_LOOPBACK_WEBHOOKS_FOR_TEST", "True").lower() in ("true", "1", "yes")

    # Observability & Sentry
    SENTRY_DSN: Optional[str] = os.getenv("SENTRY_DSN", None)
    STRUCTURED_LOGS: bool = os.getenv("STRUCTURED_LOGS", "True").lower() in ("true", "1", "yes")

    # AI Provider Settings (Hybrid: Gemini <-> Ollama <-> Deterministic)
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "auto")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3:latest")
    AI_TIMEOUT_SECONDS: float = float(os.getenv("AI_TIMEOUT_SECONDS", "3.5"))

settings = Settings()
