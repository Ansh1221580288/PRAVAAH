# PRAVAAH API Contract

This document defines the communication contract between the
Data Sources, Hazard Intelligence, Impact Intelligence,
Authority Console, Citizen Application, and Two-Way Feedback Loop.

The API contract must remain stable during development.

---

# 1. General API Rules

Base URL during local development:

http://localhost:8000/api

All API responses use JSON.

All timestamps use ISO 8601 format.

All geographic coordinates use:

latitude
longitude

Coordinate reference system for API coordinates:

WGS84 (EPSG:4326)

---

# 2. Hazard Intelligence API

## GET /api/hazard/current

Returns the current hazard assessment for a location/sector.

### Response

```json
{
  "sector_id": "S17",
  "timestamp": "2026-08-22T18:30:00Z",

  "flood_probability": 0.91,
  "flash_flood_probability": 0.84,
  "landslide_probability": 0.32,

  "risk_score": 0.89,
  "risk_level": "CRITICAL"
}
