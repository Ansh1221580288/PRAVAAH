
from backend.api.feedback import router as feedback_router
from backend.api.citizen import router as citizen_router
from backend.api.authority import router as authority_router
from backend.api.impact import router as impact_router
from backend.api.hazard import router as hazard_router
from backend.api.auth import router as auth_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.health import router as health_router


app = FastAPI(
    title="PRAVAAH Disaster Intelligence Platform",
    description="AI-powered disaster early warning and response platform",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    health_router,
    prefix="/api"
)

app.include_router(
    hazard_router,
    prefix="/api"
)
app.include_router(
    impact_router,
    prefix="/api"
)
app.include_router(
    authority_router,
    prefix="/api"
)
app.include_router(
    citizen_router,
    prefix="/api"
)

app.include_router(
    feedback_router,
    prefix="/api"
)
app.include_router(
    auth_router,
    prefix="/api"
)
@app.get("/", tags=["Root"])
def root():
    return {
        "project": "PRAVAAH",
        "status": "running"
    }