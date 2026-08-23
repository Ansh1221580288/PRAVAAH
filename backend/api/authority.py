from fastapi import APIRouter
from datetime import datetime, timezone

router = APIRouter()


@router.get("/authority/dashboard", tags=["Authority"])
def get_authority_dashboard():

    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),

        "total_sectors": 10,

        "critical_sectors": 3,

        "high_risk_sectors": 2,

        "total_population_exposed": 25830,

        "active_sos_count": 0,

        "blocked_roads_count": 0,

        "priority_sectors": [
            {
                "sector_id": "S17",
                "name": "Sector 17 Riverside Lowlands",
                "population": 18400,
                "vulnerable_population": 3200,
                "latitude": 26.1445,
                "longitude": 91.7362,
                "risk_level": "CRITICAL",
                "risk_score": 0.89
            },
            {
                "sector_id": "S09",
                "name": "Sector 09 - East Basin Valley",
                "population": 14500,
                "vulnerable_population": 2100,
                "latitude": 26.1800,
                "longitude": 91.7800,
                "risk_level": "HIGH",
                "risk_score": 0.76
            }
        ]
    }
    