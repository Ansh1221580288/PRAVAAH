"""
PRAVAAH Multi-Hazard Intelligence API Router
Exposes live-sectors weather telemetry and AI hazard predictions for Indian Hilly Regions.
"""

from datetime import datetime, timezone
from typing import Dict, Any, List
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Query

from backend.services.weather_service import get_all_hilly_sectors_telemetry, HILLY_SECTORS, fetch_open_meteo_telemetry
from ml.hazard_engine import predict_hazard


router = APIRouter()


@router.get("/hazard/live-sectors", tags=["Hazard"])
def get_live_hilly_sectors() -> Dict[str, Any]:
    """
    Returns real-time weather telemetry and AI hazard predictions
    for all Indian Hilly sectors across Western & Eastern Himalayas and North-East India.
    """
    sectors_data = get_all_hilly_sectors_telemetry()
    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "total_sectors": len(sectors_data),
        "region_coverage": "Western Himalayas, Garhwal/Kumaon, Sikkim, & North-East Hilly States (Assam, Arunachal, Meghalaya)",
        "sectors": sectors_data
    }


@router.get("/hazard/current", tags=["Hazard"])
def get_current_hazard(
    sector_id: str = Query(
        default="S01",
        description="Sector identifier (e.g., S01 to S10)"
    )
) -> Dict[str, Any]:
    """
    Returns live weather telemetry, open-meteo readings, and ML hazard prediction for a specific sector.
    """
    if sector_id not in HILLY_SECTORS:
        return {
            "error": "Sector telemetry not found",
            "sector_id": sector_id
        }

    sector_info = HILLY_SECTORS[sector_id]
    # pyrefly: ignore [bad-argument-type]
    telemetry_live = fetch_open_meteo_telemetry(sector_info["latitude"], sector_info["longitude"])

    telemetry_input = {
        "sector_id": sector_id,
        "rainfall": telemetry_live["rainfall_rate_mmh"] * 2.8,
        "river_level": telemetry_live["river_level"],
        "soil_moisture": telemetry_live["soil_moisture"],
        "slope": sector_info["slope"],
        "elevation": sector_info["elevation"],
        "historical_risk": sector_info["historical_risk"]
    }

    prediction = predict_hazard(telemetry_input)
    prediction["timestamp"] = datetime.now(timezone.utc).isoformat()
    prediction["telemetry_live"] = telemetry_live
    prediction["sector_metadata"] = sector_info

    return prediction