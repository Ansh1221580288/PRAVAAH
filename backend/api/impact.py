from fastapi import APIRouter, Query

router = APIRouter()


@router.get("/impact/current", tags=["Impact"])
def get_current_impact(
    sector_id: str = Query(..., description="Sector identifier")
):
    # Temporary demo data.
    # Later this will come from Friend 3's GIS/impact engine.
    return {
        "sector_id": sector_id,
        "population_exposed": 18400,
        "vulnerable_population": 3200,
        "roads_affected": 7,
        "bridges_affected": 2,
        "hospitals_affected": 1,
        "schools_affected": 3,
        "critical_infrastructure_affected": 2,
        "priority": "CRITICAL"
    }