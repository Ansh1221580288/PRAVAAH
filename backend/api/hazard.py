from fastapi import APIRouter, Query
from datetime import datetime, timezone

from ml.hazard_engine import predict_hazard


router = APIRouter()


SECTOR_TELEMETRY = {
    "S07": {
        "rainfall": 220.0,
        "river_level": 8.1,
        "soil_moisture": 75.0,
        "slope": 18.0,
        "elevation": 110.0,
        "historical_risk": 0.65
    },

    "S17": {
        "rainfall": 120.0,
        "river_level": 4.5,
        "soil_moisture": 55.0,
        "slope": 12.0,
        "elevation": 150.0,
        "historical_risk": 0.30
    }
}


@router.get("/hazard/current", tags=["Hazard"])
def get_current_hazard(
    sector_id: str = Query(
        ...,
        description="Sector identifier"
    )
):

    if sector_id not in SECTOR_TELEMETRY:
        return {
            "error": "Sector telemetry not found",
            "sector_id": sector_id
        }

    telemetry = {
        "sector_id": sector_id,
        **SECTOR_TELEMETRY[sector_id]
    }

    prediction = predict_hazard(telemetry)

    prediction["timestamp"] = datetime.now(
        timezone.utc
    ).isoformat()

    return prediction