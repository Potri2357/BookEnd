"""
Configuration and settings for BookEnd (PatchGate).
"""
import os
from pathlib import Path
from pydantic import BaseModel

try:
    from dotenv import load_dotenv
    # Look for .env in current directory, backend directory, or workspace root
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
    APP_NAME: str = os.getenv("APP_NAME", "BookEnd")
    TAGLINE: str = os.getenv("TAGLINE", "Patch with proof.")
    VERSION: str = os.getenv("VERSION", "3.4.1-enterprise")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    PORT: int = int(os.getenv("PORT", "8008"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    DATABASE_PATH: str = os.getenv("DATABASE_PATH", "patchguard.duckdb")
    AUDIT_LEDGER_PATH: str = os.getenv("AUDIT_LEDGER_PATH", "audit_ledger.json")
    DEFAULT_LOOKBACK_DAYS: int = int(os.getenv("DEFAULT_LOOKBACK_DAYS", "45"))
    COVERAGE_THRESHOLD: float = float(os.getenv("COVERAGE_THRESHOLD", "0.85"))
    CERT_IN_EMERGENCY_HOURS: int = int(os.getenv("CERT_IN_EMERGENCY_HOURS", "12"))
    CERT_IN_HIGH_HOURS: int = int(os.getenv("CERT_IN_HIGH_HOURS", "24"))
    CERT_IN_STANDARD_HOURS: int = int(os.getenv("CERT_IN_STANDARD_HOURS", "72"))
    CISA_TRIAGE_HOURS: int = int(os.getenv("CISA_TRIAGE_HOURS", "72"))
    SIMULATED_BANNER: bool = os.getenv("SIMULATED_BANNER", "True").lower() in ("true", "1", "yes")

    # Enterprise Server Identity & Integrations
    SERVER_NODE_ID: str = os.getenv("SERVER_NODE_ID", "pg-prod-ap-south-node01")
    CLUSTER_REGION: str = os.getenv("CLUSTER_REGION", "ap-south-1")
    WEBHOOK_TARGET_URL: str = os.getenv("WEBHOOK_TARGET_URL", "https://itsm.internal.local/webhook")
    CORS_ALLOWED_ORIGINS: str = os.getenv(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:8008,http://127.0.0.1:8008,https://book-end-pi.vercel.app,https://bookend-pp3k.onrender.com"
    )

    # AI Provider Settings (Hybrid: Gemini <-> Ollama <-> Deterministic)
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "auto")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3:latest")
    AI_TIMEOUT_SECONDS: float = float(os.getenv("AI_TIMEOUT_SECONDS", "3.5"))

settings = Settings()

