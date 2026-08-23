from fastapi import APIRouter
from pydantic import BaseModel, Field
from datetime import datetime, timezone

router = APIRouter()


class CitizenReport(BaseModel):
    sector_id: str = Field(..., description="Sector identifier")
    report_type: str = Field(..., description="Type of citizen report")
    description: str = Field(..., min_length=3)
    latitude: float | None = None
    longitude: float | None = None


@router.post("/feedback/report", tags=["Feedback"])
def submit_citizen_report(report: CitizenReport):

    return {
        "status": "received",
        "report_id": "RPT-001",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "sector_id": report.sector_id,
        "report_type": report.report_type,
        "description": report.description,
        "message": "Citizen report received successfully."
    }


class SOSRequest(BaseModel):
    sector_id: str
    latitude: float
    longitude: float
    message: str = "Emergency assistance required"


@router.post("/feedback/sos", tags=["Feedback"])
def submit_sos(request: SOSRequest):

    return {
        "status": "SOS_RECEIVED",
        "sos_id": "SOS-001",
        "sector_id": request.sector_id,
        "latitude": request.latitude,
        "longitude": request.longitude,
        "message": request.message,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }