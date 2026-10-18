"""
Patch Assurance Core API Server (FastAPI).
Provides full REST and SSE API endpoints for all Patch Assurance modules.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    description="Patch Assurance Core API (PatchGate) - Patch with proof.",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/v1")

@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "tagline": settings.TAGLINE,
        "version": settings.VERSION,
        "docs": "/docs",
        "simulated_data": settings.SIMULATED_BANNER
    }

@app.get("/health")
def health():
    return {"status": "healthy", "service": "patch-assurance-core-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
