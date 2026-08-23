"""
Demonstration script for the PRAVAAH Hazard Intelligence engine.
Loads sample telemetry data, runs the prediction pipeline, and prints explainable outputs.
"""

import os
import json
import logging
from ml import predict_hazard


def main():
    # Configure logging for demo output
    logging.basicConfig(
        level=logging.INFO,
        format="[%(asctime)s] [%(levelname)s] %(message)s",
        datefmt="%H:%M:%S"
    )

    print("=" * 70)
    print("         PRAVAAH HAZARD INTELLIGENCE ENGINE DEMO")
    print("=" * 70)

    # Resolve paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    input_path = os.path.join(base_dir, "examples", "sample_input.json")

    # Load sample input
    if not os.path.exists(input_path):
        print(f"Error: Could not find sample input file at {input_path}")
        return

    with open(input_path, "r") as f:
        input_data = json.load(f)

    print("\n--- INPUT TELEMETRY ---")
    print(json.dumps(input_data, indent=2))

    print("\n--- RUNNING HAZARD PREDICTION PIPELINE ---")
    try:
        result = predict_hazard(input_data)
        
        print("\n--- OUTPUT RISK ASSESSMENT ---")
        print(json.dumps(result, indent=2))

        print("\n" + "=" * 70)
        print("EXPLANATION & ANALYSIS:")
        print(result["explanation"])
        print("=" * 70)

    except Exception as e:
        print(f"\nPipeline execution failed: {str(e)}")


if __name__ == "__main__":
    main()
