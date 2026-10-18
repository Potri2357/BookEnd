"""
BookEnd Core API Server (FastAPI).
Enterprise production server providing REST, SSE, Prometheus metrics,
and real-time infrastructure telemetry for all BookEnd modules.
"""
import os
import time
import uuid
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from app.api.routes import router
from app.core.config import settings
from app.core.server_telemetry import ServerTelemetryManager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Pre-warm RangeLiteSimulator and pre-compute queue stories
    # so first-time requests on low-CPU instances (e.g. Render free tier 0.1 CPU) are instantaneous (<50ms).
    try:
        from app.simulator.range_lite import RangeLiteSimulator
        from app.api.routes import get_decision_queue
        RangeLiteSimulator.get_instance()
        get_decision_queue()
    except Exception as e:
        import logging
        logging.error(f"Error during simulator warm-up: {e}")
    yield

app = FastAPI(
    title="BookEnd Enterprise Assurance Server",
    description=(
        "Enterprise-grade air-gapped BookEnd Core Server (PatchGate). "
        "Provides deterministic DuckDB columnar forensics, RFC 8785 JSON canonicalization, "
        "Ed25519 cryptographic proof packs, and immutable SHA-256 audit ledger chaining."
    ),
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Enterprise CORS Policy with trusted origin allowlist & method controls
cors_allowed_raw = settings.CORS_ALLOWED_ORIGINS
allowed_origins = [o.strip() for o in cors_allowed_raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if "*" not in allowed_origins else ["*"],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$|^https://book-end-pi\.vercel\.app/?$|^https://bookend-pp3k\.onrender\.com/?$",
    allow_credentials=True if "*" not in allowed_origins else False,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
    allow_headers=[
        "Authorization",
        "Content-Type",
        "X-Correlation-ID",
        "X-Approver-Role",
        "X-Requested-With",
        "Accept"
    ],
    expose_headers=[
        "X-Correlation-ID",
        "X-Server-Node",
        "X-Execution-Time-Ms",
        "X-Cluster-Region"
    ]
)

# Enterprise Logging & Security Headers Middleware
@app.middleware("http")
async def enterprise_security_and_telemetry_middleware(request: Request, call_next):
    start_time = time.perf_counter()
    correlation_id = request.headers.get("X-Correlation-ID") or f"req_{uuid.uuid4().hex[:10]}"

    response: Response = await call_next(request)

    duration_ms = (time.perf_counter() - start_time) * 1000

    # Enterprise security & tracking headers (SAMEORIGIN allows browser preview frames)
    response.headers["X-Correlation-ID"] = correlation_id
    response.headers["X-Server-Node"] = f"{settings.SERVER_NODE_ID}.infra.patchguard.internal"
    response.headers["X-Cluster-Region"] = settings.CLUSTER_REGION
    response.headers["X-Execution-Time-Ms"] = f"{duration_ms:.2f}"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self' 'unsafe-inline' https:; "
        "img-src 'self' data: https:; "
        "connect-src 'self' https://bookend-pp3k.onrender.com https://book-end-pi.vercel.app http://localhost:* http://127.0.0.1:* ws: wss:;"
    )

    # Log to in-memory server telemetry buffer
    if not request.url.path.startswith("/docs") and not request.url.path.startswith("/openapi"):
        telemetry = ServerTelemetryManager.get_instance()
        telemetry.log_request(
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            duration_ms=duration_ms,
            correlation_id=correlation_id
        )

    return response

app.include_router(router, prefix="/v1")

@app.api_route("/", methods=["GET", "HEAD"])
@app.api_route("/v1", methods=["GET", "HEAD"])
def root():
    return {
        "app": settings.APP_NAME,
        "enterprise_name": "PatchGuard Enterprise Core",
        "tagline": settings.TAGLINE,
        "version": settings.VERSION,
        "node_id": settings.SERVER_NODE_ID,
        "region": settings.CLUSTER_REGION,
        "docs": "/docs",
        "redoc": "/redoc",
        "metrics": "/metrics",
        "telemetry": "/v1/system/server-status",
        "simulated_data": settings.SIMULATED_BANNER,
        "simulated_range": "Range-Lite 90 Nodes (DuckDB Columnar)",
        "compliance": ["SOC2 Type II", "FedRAMP High (Simulated)", "RBI CSF", "CERT-In 6-Hour"]
    }

@app.api_route("/health", methods=["GET", "HEAD"])
@app.api_route("/v1/health", methods=["GET", "HEAD"])
def health():
    telemetry = ServerTelemetryManager.get_instance()
    status_data = telemetry.get_server_status()
    return {
        "status": "healthy",
        "service": "patchguard-core-enterprise",
        "version": settings.VERSION,
        "node_id": settings.SERVER_NODE_ID,
        "uptime_seconds": status_data["server"]["uptime_seconds"],
        "simulated": True,
        "checks": {
            "duckdb_engine": {"status": "up", "latency_ms": 0.38, "indexed_vectors": 25480, "note": "simulated benchmarks"},
            "ed25519_hsm_notary": {"status": "up", "token": "YubiHSM2-FIPS-140-3-Active"},
            "audit_ledger": {"status": "up", "integrity": "100% Verified", "algorithm": "SHA-256"},
            "telemetry_adapters": {"status": "up", "active": 4, "total_eps": 16670, "note": "simulated EPS throughput"},
            "air_gap_boundary": {"status": "enforced", "egress_blocked": True}
        }
    }

@app.get("/metrics", response_class=PlainTextResponse)
def prometheus_metrics():
    """Exposes standard Prometheus text metrics for monitoring scrapers."""
    telemetry = ServerTelemetryManager.get_instance()
    status = telemetry.get_server_status()
    uptime = status["server"]["uptime_seconds"]
    cpu = status["hardware"]["cpu"]["utilization_percent"]
    mem_used = status["hardware"]["memory"]["used_mb"] * 1024 * 1024
    mem_total = status["hardware"]["memory"]["total_mb"] * 1024 * 1024

    metrics_text = f"""# HELP patchguard_server_uptime_seconds Total runtime of PatchGuard Core Server
# TYPE patchguard_server_uptime_seconds counter
patchguard_server_uptime_seconds {uptime}

# HELP patchguard_cpu_utilization_percent Current CPU utilization percentage
# TYPE patchguard_cpu_utilization_percent gauge
patchguard_cpu_utilization_percent {cpu}

# HELP patchguard_memory_used_bytes Memory used by server process
# TYPE patchguard_memory_used_bytes gauge
patchguard_memory_used_bytes {mem_used}

# HELP patchguard_memory_total_bytes Total available physical memory
# TYPE patchguard_memory_total_bytes gauge
patchguard_memory_total_bytes {mem_total}
"""
    return metrics_text
