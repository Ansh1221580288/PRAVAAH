# PRAVAAH Database Schema

## 1. Database Technology

PRAVAAH uses:

- PostgreSQL
- PostGIS

PostGIS is used for geographic and spatial data.

---

# 2. Core Entities

The main database entities are:

1. users
2. sectors
3. weather_observations
4. river_observations
5. satellite_observations
6. terrain_features
7. hazard_predictions
8. impact_assessments
9. infrastructure
10. roads
11. shelters
12. resources
13. citizen_reports
14. sos_reports
15. rescue_updates
16. alerts
17. road_closures

---

# 3. Users

Stores application users and authority/rescue accounts.

## users

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| name | VARCHAR | User name |
| phone | VARCHAR | Phone number |
| email | VARCHAR | Email |
| role | VARCHAR | citizen / authority / rescue / admin |
| language | VARCHAR | Preferred language |
| created_at | TIMESTAMP | Account creation time |

---

# 4. Sectors

The disaster-prone area is divided into geographic sectors.

## sectors

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| sector_code | VARCHAR | Example: S17 |
| name | VARCHAR | Sector name |
| population | INTEGER | Total population |
| vulnerable_population | INTEGER | Vulnerable population |
| geometry | GEOMETRY(POLYGON,4326) | Sector boundary |

---

# 5. Weather Observations

Stores weather information.

## weather_observations

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| observed_at | TIMESTAMP | Observation time |
| latitude | DOUBLE | Latitude |
| longitude | DOUBLE | Longitude |
| rainfall_mm | DOUBLE | Rainfall |
| temperature_c | DOUBLE | Temperature |
| humidity | DOUBLE | Humidity |
| wind_speed | DOUBLE | Wind speed |
| pressure_hpa | DOUBLE | Atmospheric pressure |
| source | VARCHAR | Data source |

---

# 6. River Observations

Stores river and water-level information.

## river_observations

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| observed_at | TIMESTAMP | Observation time |
| river_name | VARCHAR | River |
| water_level_m | DOUBLE | Water level |
| danger_level_m | DOUBLE | Danger threshold |
| latitude | DOUBLE | Latitude |
| longitude | DOUBLE | Longitude |
| source | VARCHAR | Data source |

---

# 7. Satellite Observations

Stores satellite-derived information.

## satellite_observations

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| captured_at | TIMESTAMP | Capture time |
| satellite | VARCHAR | Satellite name |
| image_id | VARCHAR | Image identifier |
| cloud_percentage | DOUBLE | Cloud coverage |
| flood_detected | BOOLEAN | Flood detected |
| flood_area_km2 | DOUBLE | Estimated flooded area |
| geometry | GEOMETRY(MULTIPOLYGON,4326) | Detected area |

---

# 8. Terrain Features

Stores terrain information.

## terrain_features

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| sector_id | UUID | Related sector |
| elevation_m | DOUBLE | Elevation |
| slope_degree | DOUBLE | Slope |
| soil_moisture | DOUBLE | Soil moisture |
| land_use | VARCHAR | Land-use class |

---

# 9. Hazard Predictions

Stores AI/ML predictions.

## hazard_predictions

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| sector_id | UUID | Related sector |
| predicted_at | TIMESTAMP | Prediction time |
| flood_probability | DOUBLE | 0–1 |
| flash_flood_probability | DOUBLE | 0–1 |
| landslide_probability | DOUBLE | 0–1 |
| risk_score | DOUBLE | 0–1 |
| risk_level | VARCHAR | LOW / MODERATE / HIGH / CRITICAL |
| model_version | VARCHAR | ML model version |
| confidence | DOUBLE | Model confidence |

---

# 10. Impact Assessments

Stores estimated disaster impact.

## impact_assessments

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| sector_id | UUID | Related sector |
| assessed_at | TIMESTAMP | Assessment time |
| hazard_area_km2 | DOUBLE | Hazard extent |
| population_exposed | INTEGER | Population exposed |
| vulnerable_population | INTEGER | Vulnerable population |
| roads_affected | INTEGER | Affected roads |
| bridges_affected | INTEGER | Affected bridges |
| hospitals_affected | INTEGER | Affected hospitals |
| schools_affected | INTEGER | Affected schools |
| priority | VARCHAR | LOW / MODERATE / HIGH / CRITICAL |

---

# 11. Infrastructure

Stores important infrastructure.

## infrastructure

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| name | VARCHAR | Infrastructure name |
| type | VARCHAR | hospital / school / bridge / etc. |
| capacity | INTEGER | Capacity if applicable |
| latitude | DOUBLE | Latitude |
| longitude | DOUBLE | Longitude |
| status | VARCHAR | ACTIVE / AFFECTED / CLOSED |
| geometry | GEOMETRY(POINT,4326) | Location |

---

# 12. Roads

Stores road network information.

## roads

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| road_code | VARCHAR | Road identifier |
| name | VARCHAR | Road name |
| road_type | VARCHAR | highway / local / bridge |
| status | VARCHAR | OPEN / BLOCKED / RESTRICTED |
| risk_score | DOUBLE | Current risk |
| geometry | GEOMETRY(LINESTRING,4326) | Road geometry |

---

# 13. Shelters

Stores evacuation shelters.

## shelters

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| name | VARCHAR | Shelter name |
| latitude | DOUBLE | Latitude |
| longitude | DOUBLE | Longitude |
| capacity | INTEGER | Maximum capacity |
| occupancy | INTEGER | Current occupancy |
| status | VARCHAR | OPEN / FULL / CLOSED |
| geometry | GEOMETRY(POINT,4326) | Location |

---

# 14. Resources

Stores disaster-response resources.

## resources

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| sector_id | UUID | Current sector |
| resource_type | VARCHAR | boat / ambulance / team / etc. |
| quantity | INTEGER | Quantity |
| available | INTEGER | Currently available |
| status | VARCHAR | AVAILABLE / DEPLOYED / UNAVAILABLE |

---

# 15. Citizen Reports

Stores citizen field reports.

## citizen_reports

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | Reporting citizen |
| created_at | TIMESTAMP | Report time |
| report_type | VARCHAR | ROAD_BLOCKED / FLOOD / DAMAGE / WATER_LEVEL |
| severity | VARCHAR | LOW / MODERATE / HIGH / CRITICAL |
| description | TEXT | Report description |
| latitude | DOUBLE | Latitude |
| longitude | DOUBLE | Longitude |
| geometry | GEOMETRY(POINT,4326) | Report location |
| status | VARCHAR | NEW / VERIFIED / RESOLVED |

---

# 16. SOS Reports

Stores emergency requests.

## sos_reports

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | User |
| created_at | TIMESTAMP | SOS time |
| latitude | DOUBLE | Latitude |
| longitude | DOUBLE | Longitude |
| emergency_type | VARCHAR | TRAPPED / MEDICAL / OTHER |
| severity | VARCHAR | HIGH / CRITICAL |
| message | TEXT | Emergency message |
| status | VARCHAR | ACTIVE / ASSIGNED / RESOLVED |

---

# 17. Rescue Updates

Stores rescue-team updates.

## rescue_updates

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| team_id | VARCHAR | Rescue team |
| sector_id | UUID | Sector |
| updated_at | TIMESTAMP | Update time |
| status | VARCHAR | DISPATCHED / ARRIVED / COMPLETED |
| people_rescued | INTEGER | Number rescued |
| notes | TEXT | Additional information |

---

# 18. Alerts

Stores warning notifications.

## alerts

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| sector_id | UUID | Target sector |
| created_at | TIMESTAMP | Alert creation |
| severity | VARCHAR | LOW / MODERATE / HIGH / CRITICAL |
| title | VARCHAR | Alert title |
| message | TEXT | Alert message |
| language | VARCHAR | Alert language |
| voice_enabled | BOOLEAN | Voice alert |
| status | VARCHAR | ACTIVE / EXPIRED |

---

# 19. Road Closures

Stores authority-confirmed road closures.

## road_closures

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| road_id | UUID | Related road |
| created_at | TIMESTAMP | Closure time |
| reason | TEXT | Reason |
| status | VARCHAR | BLOCKED / REOPENED |
| reported_by | UUID | Authority user |

---

# 20. Important Relationships

The main relationships are:

users
↓
citizen_reports
↓
sectors

sectors
↓
hazard_predictions
↓
impact_assessments

sectors
↓
alerts

sectors
↓
resources

roads
↓
road_closures

citizen_reports
↓
feedback
↓
hazard/impact update

---

# 21. Spatial Data

PostGIS is used for:

- Sector boundaries
- Flood extent
- Roads
- Infrastructure
- Shelters
- Citizen reports
- SOS locations
- Satellite-derived flood polygons

All API coordinates use:

WGS84 / EPSG:4326.

---

# 22. Database Ownership

Friend 1 owns:

- Database creation
- SQLAlchemy models
- Database migrations
- PostgreSQL configuration
- PostGIS configuration
- Database API integration

Other members provide data/model requirements but should not independently change the core schema.

---

# 23. Prototype Principle

The initial prototype may use a smaller subset of these tables.

Required MVP tables:

- sectors
- weather_observations
- hazard_predictions
- impact_assessments
- roads
- shelters
- resources
- citizen_reports
- sos_reports
- alerts

Additional tables can be enabled as the system expands.