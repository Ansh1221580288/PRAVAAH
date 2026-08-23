"""
Data models for the Hazard Intelligence module.
Provides strong type checks and representations instead of raw dictionaries.
"""

from dataclasses import dataclass, asdict


@dataclass
class HazardInput:
    sector_id: str
    rainfall: float
    river_level: float
    soil_moisture: float
    slope: float
    elevation: float
    historical_risk: float

    def to_dict(self) -> dict:
        """Converts the model to a dictionary representation."""
        return asdict(self)


@dataclass
class HazardPrediction:
    sector_id: str
    flood_probability: float
    flash_flood_probability: float
    landslide_probability: float
    risk_score: float
    risk_level: str
    engine_version: str
    prediction_method: str
    execution_time_ms: float
    explanation: str

    def to_dict(self) -> dict:
        """Converts the model to a dictionary representation."""
        return asdict(self)
