"""
Root production entrypoint for Postern Core API Server.
Reads $PORT (default 8008 or 10000) and binds to 0.0.0.0.
"""
import os
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_path = str(Path(__file__).resolve().parent / "backend")
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

import uvicorn

if __name__ == "__main__":
    port_str = os.environ.get("PORT", "8008")
    try:
        port = int(port_str)
    except ValueError:
        port = 8008

    host = os.environ.get("HOST", "0.0.0.0")
    print(f"🚀 Postern Enterprise Server starting on {host}:{port}")
    uvicorn.run("main:app", host=host, port=port)
