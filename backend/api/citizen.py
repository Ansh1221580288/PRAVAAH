"""
PRAVAAH Citizen Portal & Two-Way Feedback Loop API Router
Handles emergency SOS dispatches, safe shelter lookup, and crowdsourced incident reporting.
"""

from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, HTTPException, Query
# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field

router = APIRouter()


# Pydantic Schemas for Request & Response Type Safety
class SOSReportCreate(BaseModel):
    sector_id: str = Field(default="S02", description="Sector identifier")
    location_name: str = Field(default="Current GPS Location", description="Location name or landmark")
    state: str = Field(default="Himachal Pradesh", description="State name")
    latitude: float = Field(default=31.9579, description="Latitude coordinate")
    longitude: float = Field(default=77.1095, description="Longitude coordinate")
    category: str = Field(default="Emergency SOS Alert", description="Emergency category")
    people_count: int = Field(default=1, ge=1, le=100, description="Number of trapped people")
    medical_assistance: bool = Field(default=True, description="Medical aid needed")


class CrowdReportCreate(BaseModel):
    sector_id: str = Field(default="S02", description="Sector identifier")
    reporter_name: str = Field(default="Anonymous Citizen", description="Reporter full name")
    hazard_type: str = Field(default="General Hazard", description="Type of hazard observed")
    location: str = Field(default="Unspecified Hill Location", description="Observation location")
    water_level_m: float = Field(default=0.0, ge=0.0, description="Water level surge in meters")
    description: str = Field(default="Field hazard report.", min_length=3, description="Hazard description")


# In-memory storage for Two-Way Feedback Loop
ACTIVE_SOS_REPORTS: List[Dict[str, Any]] = [
    {
        "id": "SOS-101",
        "sector_id": "S02",
        "location_name": "Kullu Valley - Bhuntar Bridge Sector",
        "state": "Himachal Pradesh",
        "latitude": 31.9579,
        "longitude": 77.1095,
        "priority": "CRITICAL",
        "category": "Flash Flood Evacuation Required",
        "people_count": 8,
        "medical_assistance": True,
        "time": "3 min ago",
        "timestamp": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "SOS-102",
        "sector_id": "S07",
        "location_name": "Dima Hasao - Haflong Hill Railway Crossing",
        "state": "Assam",
        "latitude": 25.1764,
        "longitude": 93.0163,
        "priority": "CRITICAL",
        "category": "Landslide Trap & Road Blockage",
        "people_count": 14,
        "medical_assistance": True,
        "time": "7 min ago",
        "timestamp": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "SOS-103",
        "sector_id": "S05",
        "location_name": "Kedarnath Mandakini Corridor - Gaurikund",
        "state": "Uttarakhand",
        "latitude": 30.7346,
        "longitude": 79.0669,
        "priority": "HIGH",
        "category": "Submerged River Bridge",
        "people_count": 5,
        "medical_assistance": False,
        "time": "12 min ago",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
]

CROWD_FIELD_REPORTS: List[Dict[str, Any]] = [
    {
        "id": "REP-201",
        "sector_id": "S02",
        "reporter_name": "Ramesh Thakur",
        "hazard_type": "Landslide Road Blockage",
        "location": "NH-21 Kullu-Manali Road near Aut",
        "water_level_m": 4.8,
        "description": "Boulders sliding from upper mountain slope onto highway lane.",
        "verified": True,
        "timestamp": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "REP-202",
        "sector_id": "S06",
        "reporter_name": "Bipul Sharma",
        "hazard_type": "Urban Water Inundation",
        "location": "Guwahati Khanapara Hill Creek",
        "water_level_m": 1.9,
        "description": "Flash rain overflowed drainage canal into low-lying housing colony.",
        "verified": True,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
]


@router.get("/citizen/sos", tags=["Citizen"])
def get_sos_reports():
    """
    Returns active citizen emergency SOS reports for authority dispatch console.
    """
    return {
        "status": "success",
        "active_sos_count": len(ACTIVE_SOS_REPORTS),
        "reports": ACTIVE_SOS_REPORTS
    }


@router.post("/citizen/sos", tags=["Citizen"])
def create_sos_report(payload: SOSReportCreate):
    """
    Dispatches a new citizen emergency SOS alert using strongly typed Pydantic schema.
    """
    new_sos = {
        "id": f"SOS-{len(ACTIVE_SOS_REPORTS) + 101}",
        "sector_id": payload.sector_id,
        "location_name": payload.location_name,
        "state": payload.state,
        "latitude": payload.latitude,
        "longitude": payload.longitude,
        "priority": "CRITICAL",
        "category": payload.category,
        "people_count": payload.people_count,
        "medical_assistance": payload.medical_assistance,
        "time": "Just now",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    ACTIVE_SOS_REPORTS.insert(0, new_sos)
    return {
        "status": "success",
        "message": "Emergency SOS alert broadcasted to National & State Disaster Operations Console",
        "sos_id": new_sos["id"],
        "report": new_sos
    }


@router.get("/citizen/shelters", tags=["Citizen"])
def get_safe_shelters(
    sector_id: str = Query(default="S02", description="Sector identifier")
):
    """
    Returns nearest verified relief shelters and evacuation routes for a sector.
    """
    shelters = [
        {
            "name": "Kullu High School Government Relief Camp",
            "sector_id": "S02",
            "capacity": 800,
            "current_occupancy": 210,
            "latitude": 31.9610,
            "longitude": 77.1120,
            "distance_km": 1.2,
            "supplies": "Food, Clean Water, Medical Aid, Power Generators",
            "contact": "+91-1902-222300"
        },
        {
            "name": "Haflong Stadium Emergency Disaster Shelter",
            "sector_id": "S07",
            "capacity": 1200,
            "current_occupancy": 450,
            "latitude": 25.1800,
            "longitude": 93.0200,
            "distance_km": 2.4,
            "supplies": "Blankets, First Aid Kits, Satellite Phone Station",
            "contact": "+91-3673-236222"
        },
        {
            "name": "Chamoli Municipal Higher Ground Auditorium",
            "sector_id": "S04",
            "capacity": 650,
            "current_occupancy": 180,
            "latitude": 30.4100,
            "longitude": 79.3300,
            "distance_km": 1.8,
            "supplies": "Emergency Meals, Warm Clothing, NDRF Doctor Onsite",
            "contact": "+91-1372-252100"
        }
    ]

    filtered = [s for s in shelters if s["sector_id"] == sector_id]
    return {
        "status": "success",
        "sector_id": sector_id,
        "shelters": filtered if filtered else shelters
    }


@router.post("/citizen/report", tags=["Citizen"])
def submit_crowd_report(payload: CrowdReportCreate):
    """
    Submits crowdsourced field reports feeding directly into the Two-Way Feedback Loop.
    """
    new_report = {
        "id": f"REP-{len(CROWD_FIELD_REPORTS) + 201}",
        "sector_id": payload.sector_id,
        "reporter_name": payload.reporter_name,
        "hazard_type": payload.hazard_type,
        "location": payload.location,
        "water_level_m": payload.water_level_m,
        "description": payload.description,
        "verified": False,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    CROWD_FIELD_REPORTS.insert(0, new_report)
    return {
        "status": "success",
        "message": "Field report registered in Two-Way Feedback Loop.",
        "report_id": new_report["id"]
    }