"""
Central configuration settings for the Hazard Intelligence engine.
Defines range limits, weights, and risk score thresholds.
"""

from typing import Dict

# Maximum expected values for feature normalization and input clamping
MAX_RAINFALL: float = 300.0  # in mm
MAX_RIVER_LEVEL: float = 10.0  # in meters
MAX_SOIL_MOISTURE: float = 100.0  # in percentage
MAX_SLOPE: float = 45.0  # in degrees
MAX_ELEVATION: float = 4000.0  # in meters
MAX_HISTORICAL_RISK: float = 1.0  # normalized [0, 1]

# Predictor weights for individual hazard estimation
# Weights must sum to 1.0 for weighted linear combination
FLOOD_WEIGHTS: Dict[str, float] = {
    "rainfall": 0.40,
    "river_level": 0.30,
    "soil_moisture": 0.15,
    "historical_risk": 0.15,
}

FLASH_FLOOD_WEIGHTS: Dict[str, float] = {
    "rainfall": 0.45,
    "river_level": 0.20,
    "elevation": 0.20,
    "soil_moisture": 0.15,
}

LANDSLIDE_WEIGHTS: Dict[str, float] = {
    "slope": 0.40,
    "rainfall": 0.30,
    "soil_moisture": 0.15,
    "historical_risk": 0.15,
}

# Weights to combine individual hazard probabilities into the overall risk score
# Weights must sum to 1.0
RISK_WEIGHTS: Dict[str, float] = {
    "flood": 0.40,
    "flash_flood": 0.40,
    "landslide": 0.20,
}

# Risk level classification thresholds
LOW_THRESHOLD: float = 0.30
MEDIUM_THRESHOLD: float = 0.60
HIGH_THRESHOLD: float = 0.80

# Engine metadata
ENGINE_VERSION: str = "1.0.0"
PREDICTION_METHOD: str = "Explainable Rule-Based Logic"
