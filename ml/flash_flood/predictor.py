"""
Flash Flood probability predictor module.
Calculates flash flood risk based on heavy rainfall, river level, elevation, and soil moisture.
"""

from ml.config import MAX_RAINFALL, MAX_RIVER_LEVEL, MAX_SOIL_MOISTURE, MAX_ELEVATION, FLASH_FLOOD_WEIGHTS
from ml.models import HazardInput
from ml.utilities import normalize, clamp


def predict_flash_flood(input_data: HazardInput) -> float:
    """
    Calculates the probability of flash flooding.
    Lower elevation, high rainfall, high soil moisture, and high river level increase probability.
    """
    # Normalize features using config parameters
    norm_rainfall = normalize(input_data.rainfall, 0.0, MAX_RAINFALL)
    norm_river_level = normalize(input_data.river_level, 0.0, MAX_RIVER_LEVEL)
    norm_soil_moisture = normalize(input_data.soil_moisture, 0.0, MAX_SOIL_MOISTURE)

    # Flash flooding is more likely at lower elevations (water accumulation)
    norm_elevation = normalize(input_data.elevation, 0.0, MAX_ELEVATION)
    elevation_factor = 1.0 - norm_elevation

    prob = (
        FLASH_FLOOD_WEIGHTS["rainfall"] * norm_rainfall
        + FLASH_FLOOD_WEIGHTS["river_level"] * norm_river_level
        + FLASH_FLOOD_WEIGHTS["elevation"] * elevation_factor
        + FLASH_FLOOD_WEIGHTS["soil_moisture"] * norm_soil_moisture
    )

    return clamp(prob, 0.0, 1.0)
