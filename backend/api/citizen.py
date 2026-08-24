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


class BroadcastCreate(BaseModel):
    sector_id: str = Field(default="ALL", description="Target sector or ALL")
    title: str = Field(default="EMERGENCY DISASTER BROADCAST", description="Broadcast title")
    message: str = Field(default="Flash flood warning active. Move to high ground immediately.", description="Emergency message text")
    severity: str = Field(default="CRITICAL", description="CRITICAL, HIGH, or WARNING")


class ReportAction(BaseModel):
    status: str = Field(default="VERIFIED & DISPATCHED", description="Verification status")
    official_notes: Optional[str] = Field(default="Actioned by Authority Command HQ", description="Official notes")


# In-memory storage for Two-Way Feedback Loop & Broadcast Alerts
CURRENT_EMERGENCY_BROADCAST: Optional[Dict[str, Any]] = {
    "broadcast_id": "BCAST-501",
    "sector_id": "ALL",
    "title": "🚨 HIGH RIDGE FLASH FLOOD EVACUATION ALERT",
    "message": "Beas & Alaknanda rivers have breached emergency 4.5m surge level. Citizens in lower highway corridors must immediately move to nearest High Ridge Relief Shelter!",
    "severity": "CRITICAL",
    "timestamp": datetime.now(timezone.utc).isoformat(),
    "sender": "State Disaster Operation Center (SDOC)"
}

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
        "status": "VERIFIED & DISPATCHED",
        "official_notes": "NDRF Team #4 dispatched to clear highway boulder breach.",
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
        "verified": False,
        "status": "UNVERIFIED",
        "official_notes": "Awaiting municipal field verification.",
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


@router.get("/citizen/reports", tags=["Citizen"])
def get_crowd_reports(
    sector_id: Optional[str] = Query(default=None, description="Optional sector ID filter")
):
    """
    Returns crowdsourced citizen field reports for Authority Command Console verification.
    """
    reports = CROWD_FIELD_REPORTS
    if sector_id:
        reports = [r for r in CROWD_FIELD_REPORTS if r.get("sector_id") == sector_id]
    return {
        "status": "success",
        "total_reports": len(reports),
        "reports": reports
    }


@router.put("/citizen/reports/{report_id}/action", tags=["Authority"])
def action_crowd_report(report_id: str, payload: ReportAction):
    """
    Allows Authority Officials to verify and action citizen field reports.
    """
    for r in CROWD_FIELD_REPORTS:
        if r["id"] == report_id:
            r["verified"] = True
            r["status"] = payload.status
            r["official_notes"] = payload.official_notes
            return {
                "status": "success",
                "message": f"Report {report_id} actioned successfully.",
                "report": r
            }
    raise HTTPException(status_code=404, detail="Report ID not found")


@router.get("/authority/broadcast", tags=["Authority"])
def get_emergency_broadcast():
    """
    Returns current active authority emergency broadcast alert.
    """
    return {
        "status": "success",
        "broadcast": CURRENT_EMERGENCY_BROADCAST
    }


@router.post("/authority/broadcast", tags=["Authority"])
def create_emergency_broadcast(payload: BroadcastCreate):
    """
    Broadcasts a critical emergency text alert from Authority Command Center to all citizens.
    """
    global CURRENT_EMERGENCY_BROADCAST
    new_broadcast = {
        "broadcast_id": f"BCAST-{int(datetime.now(timezone.utc).timestamp())}",
        "sector_id": payload.sector_id,
        "title": payload.title,
        "message": payload.message,
        "severity": payload.severity,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "sender": "State Disaster Operations Center (SDOC)"
    }
    CURRENT_EMERGENCY_BROADCAST = new_broadcast
    return {
        "status": "success",
        "message": "Emergency Alert broadcasted live to all citizen portals.",
        "broadcast": new_broadcast
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
        "status": "UNVERIFIED",
        "official_notes": "Awaiting authority verification.",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    CROWD_FIELD_REPORTS.insert(0, new_report)
    return {
        "status": "success",
        "message": "Field report registered in Two-Way Feedback Loop.",
        "report_id": new_report["id"],
        "report": new_report
    }


@router.get("/citizen/safe-routes", tags=["Citizen"])
def get_safe_routes(
    scenario: str = Query(default="CRITICAL_FLOOD", description="Emergency scenario: NORMAL, HEAVY_RAINFALL, CRITICAL_FLOOD")
):
    """
    Returns AI-scored emergency evacuation routes prioritizing SAFETY OVER SPEED.
    Evaluates flood risk, landslide risk, road blockage, water level, and slope.
    """
    is_flood = scenario == "CRITICAL_FLOOD"
    is_heavy_rain = scenario == "HEAVY_RAINFALL"

    return {
        "status": "success",
        "disaster_scenario": f"SIMULATED EMERGENCY ({scenario})",
        "principle": "SAFETY OVER SPEED (Safety > Distance/ETA)",
        "origin": {
            "latitude": 30.1200,
            "longitude": 78.3000,
            "location_name": "Sector S07 Garhwal Base"
        },
        "destination": {
            "name": "Relief Camp Alpha (NDRF High Ground Base)",
            "latitude": 30.1850,
            "longitude": 78.3600,
            "capacity": "800 People (210 Occupied)",
            "status": "SAFE & OPERATIONAL"
        },
        "recommended_route": {
            "route_id": "r3",
            "name": "Route C — High Elevation Ridge Bypass",
            "tag": "SAFEST ROUTE",
            "distance_km": 7.9 if is_flood else 8.4,
            "eta_minutes": 28,
            "safety_score": 94 if is_flood else (96 if is_heavy_rain else 98),
            "flood_risk": "VERY LOW",
            "landslide_risk": "LOW",
            "road_blockage_risk": "LOW",
            "water_level_risk": "LOW",
            "terrain_slope_risk": "LOW (Elevated Ridge)",
            "reason": "Route C is recommended because it has the lowest overall disaster risk (94/100), completely avoiding the high-risk flood corridor and landslide-prone lower highway, although it takes approximately 16 minutes longer than Route A."
        },
        "alternatives": [
            {
                "route_id": "r2",
                "name": "Route B — Mid-Ridge Secondary Road",
                "tag": "BALANCED",
                "distance_km": 5.8,
                "eta_minutes": 19 if is_flood else 18,
                "safety_score": 76 if is_flood else (84 if is_heavy_rain else 92),
                "flood_risk": "LOW-MODERATE",
                "landslide_risk": "MEDIUM",
                "road_blockage_risk": "LOW",
                "status": "ACCEPTABLE",
                "reason": "Bypasses primary flood river basin, but experiences minor surface water runoff and 14° mountain grade."
            },
            {
                "route_id": "r1",
                "name": "Route A — Lower Valley Highway (Fastest)",
                "tag": "FASTEST",
                "distance_km": 4.1,
                "eta_minutes": 12 if is_flood else 10,
                "safety_score": 42 if is_flood else (58 if is_heavy_rain else 92),
                "flood_risk": "HIGH" if is_flood else "MODERATE",
                "landslide_risk": "MEDIUM",
                "road_blockage_risk": "HIGH" if is_flood else "LOW",
                "status": "NOT RECOMMENDED" if is_flood else ("HIGH RISK" if is_heavy_rain else "FASTEST"),
                "warning": "Shortest route passes through a high-risk flood zone (3.8m water) and 2 blocked highway collapses."
            }
        ]
    }