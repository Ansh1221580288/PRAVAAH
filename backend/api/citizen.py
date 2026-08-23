from fastapi import APIRouter, Query

router = APIRouter()


@router.get("/citizen/warning", tags=["Citizen"])
def get_citizen_warning(
    sector_id: str = Query(..., description="Citizen's sector identifier")
):
    return {
        "sector_id": sector_id,
        "alert": True,
        "risk_level": "CRITICAL",
        "risk_score": 0.89,
        "message": "High flood risk detected. Move to a safe location.",
        "recommended_action": "Evacuate to the nearest designated shelter.",
    }


@router.get("/citizen/shelters", tags=["Citizen"])
def get_shelters(
    sector_id: str = Query(..., description="Citizen's sector identifier")
):
    return {
        "sector_id": sector_id,
        "shelters": [
            {
                "shelter_id": "SH001",
                "name": "Community Relief Center",
                "latitude": 26.1500,
                "longitude": 91.7400,
                "capacity": 500,
                "available_capacity": 320,
                "distance_km": 1.8
            },
            {
                "shelter_id": "SH002",
                "name": "Government School Relief Center",
                "latitude": 26.1550,
                "longitude": 91.7450,
                "capacity": 300,
                "available_capacity": 180,
                "distance_km": 2.4
            }
        ]
    }


@router.get("/citizen/route", tags=["Citizen"])
def get_safe_route(
    sector_id: str = Query(..., description="Citizen's sector identifier")
):
    return {
        "sector_id": sector_id,
        "route_status": "SAFE",
        "recommended_route": "Sector 17 → Main Road → Relief Center",
        "distance_km": 3.2,
        "blocked_roads": [],
        "estimated_time_minutes": 12
    }