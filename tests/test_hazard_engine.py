"""
Unit tests for the Hazard Intelligence prediction engine.
Built using standard python library `unittest` for zero-dependency execution.
Compatible with `pytest` and standard python interpreters.
"""

import unittest
from ml.hazard_engine import predict_hazard


class TestHazardEngine(unittest.TestCase):

    def setUp(self):
        self.safe_weather_input = {
            "sector_id": "S10",
            "rainfall": 10.0,
            "river_level": 1.0,
            "soil_moisture": 20.0,
            "slope": 2.0,
            "elevation": 500.0,
            "historical_risk": 0.1
        }

    def test_safe_weather_scenario(self):
        """Verifies that normal, non-threatening telemetry yields low risk scores and low probabilities."""
        res = predict_hazard(self.safe_weather_input)
        self.assertEqual(res["sector_id"], "S10")
        self.assertLess(res["flood_probability"], 0.30)
        self.assertLess(res["flash_flood_probability"], 0.30)
        self.assertEqual(res["landslide_probability"], 0.0)  # Slope < 5.0 deg should scale to 0.0
        self.assertLess(res["risk_score"], 0.30)
        self.assertEqual(res["risk_level"], "LOW")
        self.assertIn("normal parameters", res["explanation"])

    def test_flood_scenario(self):
        """Verifies that high rainfall and river level trigger elevated flood probability."""
        data = {
            "sector_id": "S01",
            "rainfall": 260.0,
            "river_level": 9.2,
            "soil_moisture": 80.0,
            "slope": 4.0,
            "elevation": 400.0,
            "historical_risk": 0.70
        }
        res = predict_hazard(data)
        self.assertGreaterEqual(res["flood_probability"], 0.70)
        self.assertIn(res["risk_level"], ("HIGH", "CRITICAL"))
        self.assertIn("heavy rainfall", res["explanation"])
        self.assertIn("high river level", res["explanation"])

    def test_flash_flood_scenario(self):
        """Verifies low elevation, heavy rain, and high soil moisture trigger high flash flood risk."""
        data = {
            "sector_id": "S02",
            "rainfall": 280.0,
            "river_level": 8.5,
            "soil_moisture": 90.0,
            "slope": 15.0,
            "elevation": 20.0,
            "historical_risk": 0.50
        }
        res = predict_hazard(data)
        self.assertGreaterEqual(res["flash_flood_probability"], 0.80)
        self.assertEqual(res["risk_level"], "CRITICAL")
        self.assertIn("flash flooding", res["explanation"])

    def test_landslide_scenario(self):
        """Verifies steep terrain, rainfall, and high soil moisture trigger high landslide probability."""
        data = {
            "sector_id": "S03",
            "rainfall": 250.0,
            "river_level": 2.0,
            "soil_moisture": 85.0,
            "slope": 38.0,
            "elevation": 800.0,
            "historical_risk": 0.80
        }
        res = predict_hazard(data)
        self.assertGreaterEqual(res["landslide_probability"], 0.50)
        self.assertIn("steep terrain slope", res["explanation"])

    def test_extreme_rainfall_clamping(self):
        """Verifies that values exceeding configured maximums clamp safely and probabilities remain <= 1.0."""
        data = {
            "sector_id": "S04",
            "rainfall": 1200.0,  # far exceeds max 300
            "river_level": 50.0,   # far exceeds max 10
            "soil_moisture": 100.0,
            "slope": 90.0,        # exceeds max 45
            "elevation": 5000.0,  # exceeds max 1000
            "historical_risk": 1.0
        }
        res = predict_hazard(data)
        self.assertTrue(0.0 <= res["flood_probability"] <= 1.0)
        self.assertTrue(0.0 <= res["flash_flood_probability"] <= 1.0)
        self.assertTrue(0.0 <= res["landslide_probability"] <= 1.0)
        self.assertTrue(0.0 <= res["risk_score"] <= 1.0)
        self.assertEqual(res["risk_level"], "CRITICAL")

    def test_dry_season_minimums(self):
        """Verifies that minimum telemetry inputs yield zero or near-zero probabilities."""
        data = {
            "sector_id": "S05",
            "rainfall": 0.0,
            "river_level": 0.0,
            "soil_moisture": 0.0,
            "slope": 0.0,
            "elevation": 4000.0,
            "historical_risk": 0.0
        }
        res = predict_hazard(data)
        self.assertEqual(res["flood_probability"], 0.0)
        self.assertEqual(res["flash_flood_probability"], 0.0)
        self.assertEqual(res["landslide_probability"], 0.0)
        self.assertEqual(res["risk_score"], 0.0)
        self.assertEqual(res["risk_level"], "LOW")

    def test_determinism(self):
        """Verifies that the prediction engine is strictly deterministic (identical inputs yield identical outputs)."""
        res1 = predict_hazard(self.safe_weather_input)
        res2 = predict_hazard(self.safe_weather_input)
        
        # Exclude execution_time_ms as it depends on CPU latency
        res1_copy = {k: v for k, v in res1.items() if k != "execution_time_ms"}
        res2_copy = {k: v for k, v in res2.items() if k != "execution_time_ms"}
        
        self.assertEqual(res1_copy, res2_copy)

    def test_input_validation_missing_fields(self):
        """Verifies that missing fields raise a ValueError."""
        bad_input = self.safe_weather_input.copy()
        del bad_input["rainfall"]
        with self.assertRaises(ValueError) as context:
            predict_hazard(bad_input)
        self.assertIn("Missing required field", str(context.exception))

    def test_input_validation_invalid_types(self):
        """Verifies that invalid field types raise a TypeError."""
        bad_input = self.safe_weather_input.copy()
        bad_input["rainfall"] = "one hundred"
        with self.assertRaises(TypeError) as context:
            predict_hazard(bad_input)
        self.assertIn("Invalid type for field", str(context.exception))

    def test_input_validation_negative_rainfall(self):
        """Verifies that negative rainfall values raise a ValueError."""
        bad_input = self.safe_weather_input.copy()
        bad_input["rainfall"] = -5.0
        with self.assertRaises(ValueError) as context:
            predict_hazard(bad_input)
        self.assertIn("rainfall cannot be negative", str(context.exception))

    def test_input_validation_impossible_soil_moisture(self):
        """Verifies that soil moisture values exceeding 100% raise a ValueError."""
        bad_input = self.safe_weather_input.copy()
        bad_input["soil_moisture"] = 101.5
        with self.assertRaises(ValueError) as context:
            predict_hazard(bad_input)
        self.assertIn("soil_moisture percentage must be between 0.0 and 100.0", str(context.exception))

    def test_input_validation_impossible_slope(self):
        """Verifies that terrain slope values exceeding 90 degrees raise a ValueError."""
        bad_input = self.safe_weather_input.copy()
        bad_input["slope"] = -1.0
        with self.assertRaises(ValueError) as context:
            predict_hazard(bad_input)
        self.assertIn("slope in degrees must be between 0.0 and 90.0", str(context.exception))

    def test_input_validation_null_value(self):
        """Verifies that null/None values raise a ValueError."""
        bad_input = self.safe_weather_input.copy()
        bad_input["river_level"] = None
        with self.assertRaises(ValueError) as context:
            predict_hazard(bad_input)
        self.assertIn("cannot be null/None", str(context.exception))

    def test_risk_level_boundaries(self):
        """Verifies that risk levels map correctly according to the defined thresholds."""
        from ml.risk.predictor import calculate_risk
        
        boundaries = [
            (0.30, "LOW"),
            (0.31, "MEDIUM"),
            (0.60, "MEDIUM"),
            (0.61, "HIGH"),
            (0.80, "HIGH"),
            (0.81, "CRITICAL")
        ]
        
        for score, expected_level in boundaries:
            with self.subTest(score=score, expected_level=expected_level):
                res_score, res_level = calculate_risk(score, score, score)
                self.assertAlmostEqual(res_score, score, delta=1e-2)
                self.assertEqual(res_level, expected_level)


if __name__ == "__main__":
    unittest.main()
