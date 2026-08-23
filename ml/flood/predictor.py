"""
Flood probability predictor module.
Calculates flood risk based on rainfall, river level, soil moisture, and historical risk.
"""

from ml.config import MAX_RAINFALL, MAX_RIVER_LEVEL, MAX_SOIL_MOISTURE, FLOOD_WEIGHTS
from ml.models import HazardInput
from ml.utilities import normalize, clamp


def predict_flood(input_data: HazardInput) -> float:
    """
    Calculates the probability of flooding based on telemetry inputs and weights.
    Returns a normalized probability [0.0, 1.0].
    """
    # Normalize features using limits from configuration
    norm_rainfall = normalize(input_data.rainfall, 0.0, MAX_RAINFALL)
    norm_river_level = normalize(input_data.river_level, 0.0, MAX_RIVER_LEVEL)
    norm_soil_moisture = normalize(input_data.soil_moisture, 0.0, MAX_SOIL_MOISTURE)
    norm_historical_risk = clamp(input_data.historical_risk, 0.0, 1.0)

    # Perform weighted linear combination
    prob = (
        FLOOD_WEIGHTS["rainfall"] * norm_rainfall
        + FLOOD_WEIGHTS["river_level"] * norm_river_level
        + FLOOD_WEIGHTS["soil_moisture"] * norm_soil_moisture
        + FLOOD_WEIGHTS["historical_risk"] * norm_historical_risk
    )

    return clamp(prob, 0.0, 1.0)
