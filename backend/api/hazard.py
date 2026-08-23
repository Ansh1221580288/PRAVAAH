from fastapi import APIRouter, Query
from datetime import datetime, timezone

router = APIRouter()


@router.get("/hazard/current", tags=["Hazard"])
def get_current_hazard(
    sector_id: str = Query(..., description="Sector identifier")
):
    # Temporary demo values.
    # Later these will come from Friend 2's ML model.
    return {
        "sector_id": sector_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "flood_probability": 0.91,
        "flash_flood_probability": 0.84,
        "landslide_probability": 0.32,
        "risk_score": 0.89,
        "risk_level": "CRITICAL"
    }