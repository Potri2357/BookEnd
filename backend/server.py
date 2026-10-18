"""
Production entrypoint for Postern Core API Server on Render and Cloud environments.
Reads the dynamic PORT environment variable (defaulting to 10000) and binds to 0.0.0.0.
"""
import os
import sys

# Ensure backend directory is in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

import uvicorn

if __name__ == "__main__":
    port_str = os.environ.get("PORT", "10000")
    try:
        port = int(port_str)
    except ValueError:
        port = 10000

    host = os.environ.get("HOST", "0.0.0.0")
    print(f"🚀 Postern Enterprise Server starting on {host}:{port} (Render entrypoint)")
    uvicorn.run("app.main:app", host=host, port=port, app_dir=current_dir)
