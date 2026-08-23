# PRAVAAH: AI-Powered Disaster Management Platform

PRAVAAH is an end-to-end AI-powered decision support platform designed to predict, assess, and manage disaster risks in real time. This repository hosts the core platform components, with a focus on the **Hazard Intelligence** module.

---

## 1. Overall System Architecture

PRAVAAH is built on a decoupled, pipeline-oriented architecture:

```
    [ Data Sources ] (Sensors, Satellites, Telemetry)
           │
           ▼
[ Hazard Intelligence ] (ML Module - Calculates Hazard Risks) <─── (This Module)
           │
           ▼
[ Impact Intelligence ] (GIS Exposure, Population exposed)
           │
           ▼
[ Command Console & App ] (Authority Command Dashboard & Citizen SOS Warn)
```

1. **Data Sources**: Collects real-time telemetry (rainfall, river level, soil moisture, and slope/terrain details).
2. **Hazard Intelligence**: Computes probability metrics for floods, flash floods, and landslides, and calculates an overall risk level.
3. **Impact Intelligence**: Uses spatial datasets to assess populations and infrastructure exposed to high-risk zones.
4. **Authority Dashboard & Citizen App**: Delivers emergency command consoles and early warning alerts to first responders and the public.

---

## 2. Directory Structure

This module is located in the `ml/` subfolder at the workspace root:

```
PRAVAAH/
├── ml/
│   ├── __init__.py           # Package entry point (exposes predict_hazard)
│   ├── config.py             # Central configuration constants (weights & thresholds)
│   ├── models.py             # Strongly typed input/output dataclasses (HazardInput, HazardPrediction)
│   ├── utilities.py          # Math utilities (clamp, normalize) and input validator
│   ├── flood/                # Flood risk predictor sub-module
│   │   ├── __init__.py
│   │   └── predictor.py
│   ├── flash_flood/          # Flash Flood risk predictor sub-module
│   │   ├── __init__.py
│   │   └── predictor.py
│   ├── landslide/            # Landslide risk predictor sub-module
│   │   ├── __init__.py
│   │   └── predictor.py
│   └── risk/                 # Aggregated risk scoring and level classifier
│       ├── __init__.py
│       └── predictor.py
├── tests/
│   ├── __init__.py
│   └── test_hazard_engine.py # Comprehensive unit test suite (zero-dependency)
├── examples/
│   ├── sample_input.json     # Mock payload for integration testing
│   └── sample_output.json    # Expected structured result payload
├── demo.py                   # Run-ready terminal demo script
└── README.md                 # Main platform documentation
```

---

## 3. Hazard Intelligence Prediction Flow

When the backend receives telemetry data and calls `predict_hazard(data)`:

1. **Input Validation**: The engine checks for missing keys, type correctness, null parameters, and checks that environmental measurements lie in realistic physical bounds.
2. **Dataclass Mapping**: Raw JSON dict is instantiated as a strongly typed `HazardInput` model.
3. **Feature Normalization**: Environmental parameters (rainfall, river levels, soil moisture, slope, elevation) are clamped and normalized to a `[0.0, 1.0]` scale using limits in `config.py`.
4. **Hazard Calculations**: Individual predictor modules compute risk probabilities based on deterministic formulas.
5. **Risk Aggregation**: A weighted average score is calculated and mapped to a category: `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL`.
6. **Diagnostics Generator**: A human-readable explanation is generated describing which environmental factor contributed to the risk.
7. **Metadata Mapping**: Metadata (engine version, prediction method, and execution latency) is injected before compiling the final `HazardPrediction` dictionary.

---

## 4. Mathematical Formulations

To ensure transparent calculations suitable for hackathon demonstrations, the modules implement physically informed, deterministic equations:

### 4.1 Flood Probability
Combines rainfall, river level, soil moisture, and historical hazard records:
$$\text{Flood Probability} = w_r \cdot \text{norm\_rainfall} + w_{rl} \cdot \text{norm\_river\_level} + w_{sm} \cdot \text{norm\_soil\_moisture} + w_{hr} \cdot \text{historical\_risk}$$
*Default Config Weights: Rainfall (40%), River Level (30%), Soil Moisture (15%), Historical Risk (15%).*

### 4.2 Flash Flood Probability
Factors in intense heavy rainfall and low elevation terrain where runoff accumulates:
$$\text{Flash Flood Probability} = w_r \cdot \text{norm\_rainfall} + w_{rl} \cdot \text{norm\_river\_level} + w_e \cdot (1.0 - \text{norm\_elevation}) + w_{sm} \cdot \text{norm\_soil\_moisture}$$
*Default Config Weights: Rainfall (45%), River Level (20%), Elevation Factor (20%), Soil Moisture (15%).*

### 4.3 Landslide Probability
Factors in terrain slope and moisture levels, scaling down linearly to $0.0$ for slopes less than $5^\circ$ using a slope threshold factor:
$$\text{Slope Multiplier} = \text{clamp}\left(\frac{\text{slope} - 5.0}{10.0}, 0.0, 1.0\right)$$
$$\text{Landslide Probability} = (w_s \cdot \text{norm\_slope} + w_r \cdot \text{norm\_rainfall} + w_{sm} \cdot \text{norm\_soil\_moisture} + w_{hr} \cdot \text{historical\_risk}) \cdot \text{slope\_multiplier}$$
*Default Config Weights: Slope (40%), Rainfall (30%), Soil Moisture (15%), Historical Risk (15%).*

### 4.4 Aggregated Risk Score
Combines individual probabilities into an overall score:
$$\text{Risk Score} = w_{flood} \cdot \text{flood\_prob} + w_{flash\_flood} \cdot \text{flash\_flood\_prob} + w_{landslide} \cdot \text{landslide\_prob}$$
*Default Config Weights: Flood (40%), Flash Flood (40%), Landslide (20%).*

---

## 5. API Schemas

### 5.1 Input Schema
```json
{
  "sector_id": "S07",
  "rainfall": 220.0,
  "river_level": 8.1,
  "soil_moisture": 75.0,
  "slope": 18.0,
  "elevation": 110.0,
  "historical_risk": 0.65
}
```

### 5.2 Output Schema
```json
{
  "sector_id": "S07",
  "flood_probability": 0.75,
  "flash_flood_probability": 0.78,
  "landslide_probability": 0.59,
  "risk_score": 0.73,
  "risk_level": "HIGH",
  "engine_version": "1.0.0",
  "prediction_method": "Explainable Rule-Based Logic",
  "execution_time_ms": 0.288,
  "explanation": "Overall risk is classified as HIGH primarily driven by heavy rainfall of 220.0 mm, high river level of 8.1 m, and saturated soil (75.0% moisture)."
}
```

---

## 6. Backend Integration Example

FastAPI backend routers can import the module and use it inside endpoints:

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from ml import predict_hazard

app = FastAPI()

class TelemetryPayload(BaseModel):
    sector_id: str
    rainfall: float = Field(..., ge=0.0)
    river_level: float = Field(..., ge=0.0)
    soil_moisture: float = Field(..., ge=0.0, le=100.0)
    slope: float = Field(..., ge=0.0, le=90.0)
    elevation: float = Field(..., ge=-500.0, le=9000.0)
    historical_risk: float = Field(..., ge=0.0, le=1.0)

@app.post("/api/hazard/current")
async def get_current_hazard(payload: TelemetryPayload):
    try:
        # Convert Pydantic object to dict and call prediction engine
        input_data = payload.dict()
        result = predict_hazard(input_data)
        return result
    except (ValueError, TypeError) as val_error:
        raise HTTPException(status_code=400, detail=str(val_error))
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Internal prediction pipeline failure")
```

---

## 7. Execution and Verification

### 7.1 Running the Demonstration
To execute the pipeline manually against simulated telemetry data, run:
```bash
python demo.py
```

### 7.2 Running Unit Tests
To run the zero-dependency test suite verify bounds, typing, clamping, and edge cases:
```bash
python -m unittest tests/test_hazard_engine.py
```

---

## 8. Prototype Limitations and Future Improvements

*   **Prototype Status**: This implementation functions as a transparent, explainable rule-based prototype engine designed for Smart India Hackathon demonstrations. No machine learning models have been trained, and no dataset-specific accuracy is claimed.
*   **Swappable Design**: The architecture enforces decoupling via strongly typed schemas (`HazardInput` and `HazardPrediction`). This allows future models (e.g., gradient boosted trees, neural networks) to be swapped directly into the `ml/` sub-directories without changing the API contract or requiring backend refactoring.
*   **Configurability**: All physical boundaries, mapping thresholds, and equations weights are defined centrally in `ml/config.py`. They can be dynamically adjusted or tuned to reflect different target geographic sectors.