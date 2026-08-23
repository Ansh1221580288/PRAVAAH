"""
Lightweight test runner to execute the test suite without requiring external dependencies (like pytest).
"""

import sys
import logging
from tests.test_hazard_engine import (
    test_safe_weather_scenario,
    test_flood_scenario,
    test_flash_flood_scenario,
    test_landslide_scenario,
    test_extreme_rainfall_clamping,
    test_dry_season_minimums,
    test_determinism,
    test_input_validation_missing_fields,
    test_input_validation_invalid_types,
    test_input_validation_negative_rainfall,
    test_input_validation_impossible_soil_moisture,
    test_input_validation_impossible_slope,
    test_input_validation_null_value,
    test_risk_level_boundaries
)

# Disable logging during test execution to keep stdout clean
logging.getLogger("pravaah.hazard").setLevel(logging.ERROR)


def run_test_suite():
    safe_input = {
        "sector_id": "S10",
        "rainfall": 10.0,
        "river_level": 1.0,
        "soil_moisture": 20.0,
        "slope": 2.0,
        "elevation": 500.0,
        "historical_risk": 0.1
    }

    tests = [
        ("test_safe_weather_scenario", lambda: test_safe_weather_scenario(safe_input)),
        ("test_flood_scenario", test_flood_scenario),
        ("test_flash_flood_scenario", test_flash_flood_scenario),
        ("test_landslide_scenario", test_landslide_scenario),
        ("test_extreme_rainfall_clamping", test_extreme_rainfall_clamping),
        ("test_dry_season_minimums", test_dry_season_minimums),
        ("test_determinism", lambda: test_determinism(safe_input)),
        ("test_input_validation_missing_fields", lambda: test_input_validation_missing_fields(safe_input)),
        ("test_input_validation_invalid_types", lambda: test_input_validation_invalid_types(safe_input)),
        ("test_input_validation_negative_rainfall", lambda: test_input_validation_negative_rainfall(safe_input)),
        ("test_input_validation_impossible_soil_moisture", lambda: test_input_validation_impossible_soil_moisture(safe_input)),
        ("test_input_validation_impossible_slope", lambda: test_input_validation_impossible_slope(safe_input)),
        ("test_input_validation_null_value", lambda: test_input_validation_null_value(safe_input)),
    ]

    # Add parameterized boundaries
    boundaries = [
        (0.30, "LOW"),
        (0.31, "MEDIUM"),
        (0.60, "MEDIUM"),
        (0.61, "HIGH"),
        (0.80, "HIGH"),
        (0.81, "CRITICAL")
    ]
    for idx, (score, lvl) in enumerate(boundaries):
        tests.append((
            f"test_risk_level_boundaries_{idx} (score={score}, level={lvl})",
            lambda s=score, l=lvl: test_risk_level_boundaries(s, l)
        ))

    passed = 0
    failed = 0

    print("=" * 70)
    print("            PRAVAAH HAZARD ENGINE UNIT TESTS")
    print("=" * 70)

    for name, func in tests:
        try:
            func()
            print(f"[ PASS ] {name}")
            passed += 1
        except Exception as e:
            print(f"[ FAIL ] {name}")
            print(f"         Error: {str(e)}")
            failed += 1

    print("=" * 70)
    print(f"Results: {passed} passed, {failed} failed")
    print("=" * 70)

    if failed > 0:
        sys.exit(1)


if __name__ == "__main__":
    run_test_suite()
