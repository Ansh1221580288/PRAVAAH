from fastapi import APIRouter, Query, HTTPException

from geospatial.impact import calculate_sector_impact

router = APIRouter()


@router.get("/impact/current", tags=["Impact"])
def get_current_impact(
    sector_id: str = Query(
        ...,
        description="Sector identifier"
    )
):
    """
    Return impact intelligence calculated
    from the prepared GIS data.
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
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Impact calculation failed: {exc}"
        )