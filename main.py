"""
Root entrypoint for Postern Core API Server.
Enables 'uvicorn main:app' and standard cloud deployments from repository root.
"""
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_path = str(Path(__file__).resolve().parent / "backend")
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from backend.app.main import app

__all__ = ["app"]
