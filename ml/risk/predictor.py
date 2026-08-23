"""
Risk scorer module.
Combines flood, flash flood, and landslide probabilities into a single risk score and risk level.
"""

from ml.config import RISK_WEIGHTS, LOW_THRESHOLD, MEDIUM_THRESHOLD, HIGH_THRESHOLD
from ml.utilities import clamp


def calculate_risk(flood_prob: float, flash_flood_prob: float, landslide_prob: float) -> tuple[float, str]:
    """
    Calculates the overall risk score using a weighted average of individual probabilities,
    and returns a tuple containing the (risk_score, risk_level).
    """
    # Validate probabilities are bounded
    f = clamp(flood_prob, 0.0, 1.0)
    ff = clamp(flash_flood_prob, 0.0, 1.0)
    l_ = clamp(landslide_prob, 0.0, 1.0)

    # Weighted average risk score
    raw_score = (
        RISK_WEIGHTS["flood"] * f
        + RISK_WEIGHTS["flash_flood"] * ff
        + RISK_WEIGHTS["landslide"] * l_
    )
    score = round(raw_score, 2)

    # Classify the risk level based on exclusive/inclusive ranges
    if score <= LOW_THRESHOLD:
        level = "LOW"
    elif score <= MEDIUM_THRESHOLD:
        level = "MEDIUM"
    elif score <= HIGH_THRESHOLD:
        level = "HIGH"
    else:
        level = "CRITICAL"

    return score, level
