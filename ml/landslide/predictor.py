"""
Landslide probability predictor module.
Calculates landslide risk based on terrain slope, rainfall, soil moisture, and historical risk.
"""

from ml.config import MAX_RAINFALL, MAX_SOIL_MOISTURE, MAX_SLOPE, LANDSLIDE_WEIGHTS
from ml.models import HazardInput
from ml.utilities import normalize, clamp


def predict_landslide(input_data: HazardInput) -> float:
    """
    Calculates the probability of a landslide.
    Steeper slope, high rainfall, high soil moisture, and high historical risk increase probability.
    """
    # Normalize features using config parameters
    norm_slope = normalize(input_data.slope, 0.0, MAX_SLOPE)
    norm_rainfall = normalize(input_data.rainfall, 0.0, MAX_RAINFALL)
    norm_soil_moisture = normalize(input_data.soil_moisture, 0.0, MAX_SOIL_MOISTURE)
    norm_historical_risk = clamp(input_data.historical_risk, 0.0, 1.0)

    # Compute physically informed slope multiplier (extremely low slopes have near-zero landslide risk)
    # If slope < 5 degrees, multiplier scales down linearly to 0
    slope_multiplier = clamp((input_data.slope - 5.0) / 10.0, 0.0, 1.0)

    prob = (
        LANDSLIDE_WEIGHTS["slope"] * norm_slope
        + LANDSLIDE_WEIGHTS["rainfall"] * norm_rainfall
        + LANDSLIDE_WEIGHTS["soil_moisture"] * norm_soil_moisture
        + LANDSLIDE_WEIGHTS["historical_risk"] * norm_historical_risk
    ) * slope_multiplier

    return clamp(prob, 0.0, 1.0)
