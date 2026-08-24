"""
Main Hazard Intelligence prediction engine.
Coordinates validation, execution of sub-modules, and structured logging.
"""

import time
import logging
from typing import Dict, Any

from ml.config import ENGINE_VERSION, PREDICTION_METHOD
from ml.models import HazardInput, HazardPrediction
from ml.utilities import validate_hazard_input
from ml.flood.predictor import predict_flood
from ml.flash_flood.predictor import predict_flash_flood
from ml.landslide.predictor import predict_landslide
from ml.risk.predictor import calculate_risk

# Initialize module-level logger
logger = logging.getLogger("pravaah.hazard")
logger.propagate = False
if not logger.handlers:
    # Set default configuration if not already configured by root
    logger.setLevel(logging.INFO)
    handler = logging.StreamHandler()
    formatter = logging.Formatter("[%(asctime)s] [%(levelname)s] [PRAVAAH-ML] %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)


def _generate_explanation(
    input_data: HazardInput,
    flood_prob: float,
    flash_flood_prob: float,
    landslide_prob: float,
    risk_level: str
) -> str:
    """Generates a human-readable explanation based on input values and predictions."""
    factors = []
    
    if input_data.rainfall > 150.0:
        factors.append(f"heavy rainfall of {input_data.rainfall:.1f} mm")
    if input_data.river_level > 6.0:
        factors.append(f"high river level of {input_data.river_level:.1f} m")
    if input_data.soil_moisture > 70.0:
        factors.append(f"saturated soil ({input_data.soil_moisture:.1f}% moisture)")
    if input_data.slope > 20.0 and landslide_prob > 0.4:
        factors.append(f"steep terrain slope of {input_data.slope:.1f}°")
        
    if not factors:
        return f"All environmental and terrain indicators are within normal parameters. The overall risk level is {risk_level}."

    factor_str = ""
    if len(factors) == 1:
        factor_str = factors[0]
    elif len(factors) == 2:
        factor_str = f"{factors[0]} and {factors[1]}"
    else:
        factor_str = ", ".join(factors[:-1]) + f", and {factors[-1]}"

    explanation = f"Overall risk is classified as {risk_level} primarily driven by {factor_str}."

    # Add specific warnings for extreme scenarios
    warnings = []
    if flood_prob >= 0.80:
        warnings.append("Critical flooding is highly probable.")
    if flash_flood_prob >= 0.80:
        warnings.append("Immediate threat of flash flooding is active.")
    if landslide_prob >= 0.60:
        warnings.append("Landslide vulnerability is dangerously high.")

    if warnings:
        explanation += " " + " ".join(warnings)

    return explanation


def predict_hazard(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main entry point for hazard intelligence prediction.
    Validates input telemetry data, executes hazard sub-models,
    and returns a structured, explainable risk assessment.
    
    Raises:
        ValueError: For missing fields, out-of-bound ranges, or invalid data.
        TypeError: For incorrect field types.
    """
    start_time = time.perf_counter()
    logger.info(f"Received prediction request for sector: {data.get('sector_id', 'UNKNOWN')}")

    try:
        # Validate and parse input
        validate_hazard_input(data)
        
        # Instantiate strongly typed model
        input_model = HazardInput(
            sector_id=data["sector_id"],
            rainfall=float(data["rainfall"]),
            river_level=float(data["river_level"]),
            soil_moisture=float(data["soil_moisture"]),
            slope=float(data["slope"]),
            elevation=float(data["elevation"]),
            historical_risk=float(data["historical_risk"])
        )
        
        logger.debug(f"Input model successfully created for sector {input_model.sector_id}")

        # Execute predictions with 0.1% ground-zero precision
        flood_prob = round(predict_flood(input_model), 3)
        flash_prob = round(predict_flash_flood(input_model), 3)
        landslide_prob = round(predict_landslide(input_model), 3)

        # Calculate risk score and level
        risk_score, risk_level = calculate_risk(flood_prob, flash_prob, landslide_prob)

        # Log warnings if any individual probability is dangerously high
        if flood_prob >= 0.80 or flash_prob >= 0.80 or landslide_prob >= 0.60:
            logger.warning(
                f"Elevated risk detected in sector {input_model.sector_id}! "
                f"Flood: {flood_prob:.2f}, Flash: {flash_prob:.2f}, Landslide: {landslide_prob:.2f}"
            )

        # Generate human-readable explanation
        explanation = _generate_explanation(input_model, flood_prob, flash_prob, landslide_prob, risk_level)

        # Track execution time
        end_time = time.perf_counter()
        execution_time_ms = round((end_time - start_time) * 1000.0, 3)

        # Construct final strongly typed prediction model
        prediction = HazardPrediction(
            sector_id=input_model.sector_id,
            flood_probability=flood_prob,
            flash_flood_probability=flash_prob,
            landslide_probability=landslide_prob,
            risk_score=risk_score,
            risk_level=risk_level,
            engine_version=ENGINE_VERSION,
            prediction_method=PREDICTION_METHOD,
            execution_time_ms=execution_time_ms,
            explanation=explanation
        )

        logger.info(f"Successful prediction for sector {prediction.sector_id}: Risk Score={prediction.risk_score} ({prediction.risk_level})")
        return prediction.to_dict()

    except (ValueError, TypeError) as val_err:
        logger.error(f"Validation failure for input data: {str(val_err)}")
        raise
    except Exception as exc:
        logger.critical(f"Unexpected error in prediction pipeline: {str(exc)}", exc_info=True)
        raise
