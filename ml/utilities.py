"""
Common mathematical and validation utilities for the Hazard Intelligence engine.
"""

from typing import Any


def clamp(val: float, min_val: float, max_val: float) -> float:
    """Clamps a numeric value between a minimum and maximum threshold."""
    if min_val > max_val:
        raise ValueError(f"min_val ({min_val}) cannot be greater than max_val ({max_val})")
    return max(min_val, min(val, max_val))


def safe_division(numerator: float, denominator: float, default: float = 0.0) -> float:
    """Performs division, returning default if denominator is zero."""
    if abs(denominator) < 1e-9:
        return default
    return numerator / denominator


def normalize(val: float, min_val: float, max_val: float) -> float:
    """Normalizes a value to [0, 1] range after clamping it within bounds."""
    clamped_val = clamp(val, min_val, max_val)
    range_diff = max_val - min_val
    return safe_division(clamped_val - min_val, range_diff, default=0.0)


def validate_hazard_input(data: Any) -> None:
    """
    Validates the input dictionary against structure, types, and values constraints.
    Raises ValueError or TypeError if validation fails.
    """
    if not isinstance(data, dict):
        raise TypeError(f"Input data must be a dictionary, got {type(data).__name__}")

    required_fields = {
        "sector_id": str,
        "rainfall": (int, float),
        "river_level": (int, float),
        "soil_moisture": (int, float),
        "slope": (int, float),
        "elevation": (int, float),
        "historical_risk": (int, float),
    }

    # 1. Missing fields and null validation
    for field, expected_type in required_fields.items():
        if field not in data:
            raise ValueError(f"Missing required field: '{field}'")
        if data[field] is None:
            raise ValueError(f"Field '{field}' cannot be null/None")

        # 2. Type validation
        val = data[field]
        if not isinstance(val, expected_type):
            expected_type_name = (
                expected_type.__name__
                if isinstance(expected_type, type)
                else " or ".join(t.__name__ for t in expected_type)
            )
            raise TypeError(
                f"Invalid type for field '{field}': Expected {expected_type_name}, got {type(val).__name__}"
            )

    # 3. Value constraint checks
    sector_id = data["sector_id"]
    if not sector_id.strip():
        raise ValueError("sector_id cannot be an empty or whitespace string")

    rainfall = float(data["rainfall"])
    if rainfall < 0.0:
        raise ValueError(f"rainfall cannot be negative: {rainfall}")

    river_level = float(data["river_level"])
    if river_level < 0.0:
        raise ValueError(f"river_level cannot be negative: {river_level}")

    soil_moisture = float(data["soil_moisture"])
    if not (0.0 <= soil_moisture <= 100.0):
        raise ValueError(f"soil_moisture percentage must be between 0.0 and 100.0: {soil_moisture}")

    slope = float(data["slope"])
    if not (0.0 <= slope <= 90.0):
        raise ValueError(f"slope in degrees must be between 0.0 and 90.0: {slope}")

    elevation = float(data["elevation"])
    if not (-500.0 <= elevation <= 9000.0):
        raise ValueError(f"elevation in meters must be between -500.0 and 9000.0: {elevation}")

    historical_risk = float(data["historical_risk"])
    if not (0.0 <= historical_risk <= 1.0):
        raise ValueError(f"historical_risk must be a normalized value between 0.0 and 1.0: {historical_risk}")
