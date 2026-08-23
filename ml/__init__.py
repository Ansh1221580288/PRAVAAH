"""
Hazard Intelligence Module for the PRAVAAH platform.
Exposes the main prediction engine and typed data models.
"""

from ml.hazard_engine import predict_hazard
from ml.models import HazardInput, HazardPrediction

__all__ = ["predict_hazard", "HazardInput", "HazardPrediction"]
