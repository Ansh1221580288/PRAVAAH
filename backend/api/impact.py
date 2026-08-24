"""
PRAVAAH Geospatial Impact Intelligence API Router
Calculates population exposure and infrastructure impact from GIS vector datasets.
"""

from typing import Dict, Any, List
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Query, HTTPException
from geospatial.impact import calculate_sector_impact, calculate_all_sector_impacts

router = APIRouter()


@router.get("/impact/all", tags=["Impact"])
def get_all_impacts() -> Dict[str, Any]:
    """
    Returns calculated impact intelligence for all prepared GIS sectors.
    """
    try:
        results = calculate_all_sector_impacts()
        return {
            "total_sectors": len(results),
            "impacts": results
        }
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Impact calculation failed: {exc}"
        ) from exc


@router.get("/impact/current", tags=["Impact"])
def get_current_impact(
    sector_id: str = Query(
        default="S01",
        description="Sector identifier (e.g. S01 to S10)"
    )
) -> Dict[str, Any]:
    """
    Return impact intelligence calculated from prepared GIS data for a given sector.
    """
    try:
        result = calculate_sector_impact(sector_id)

        if result is None:
            raise HTTPException(
                status_code=404,
                detail=f"Sector {sector_id} not found"
            )

        return result

    except HTTPException:
        raise

    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=500,
            detail=f"GIS data file missing: {exc}"
        ) from exc

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Impact calculation failed: {exc}"
        ) from exc