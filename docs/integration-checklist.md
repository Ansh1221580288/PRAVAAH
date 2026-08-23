# PRAVAAH Integration Checklist

## 1. Data/GIS → AI/ML

- [ ] Rainfall data available
- [ ] River-level data available
- [ ] Soil-moisture data available
- [ ] Elevation available
- [ ] Slope available
- [ ] Sector IDs are consistent

---

## 2. AI/ML → Backend

- [ ] Hazard engine works
- [ ] Flood prediction available
- [ ] Flash-flood prediction available
- [ ] Landslide prediction available
- [ ] Risk score available
- [ ] Risk level available
- [ ] Standard JSON response used

---

## 3. GIS/Data → Backend

- [ ] sectors.geojson
- [ ] roads.geojson
- [ ] flood_extent.geojson
- [ ] shelters.geojson
- [ ] hospitals.geojson
- [ ] schools.geojson

---

## 4. Backend → Authority

- [ ] Current hazard API
- [ ] Impact API
- [ ] Priority-sector API
- [ ] Resource API
- [ ] SOS API
- [ ] Road-closure data

---

## 5. Backend → Citizen

- [ ] Warning API
- [ ] Shelter API
- [ ] Safe-route API
- [ ] SOS API
- [ ] Citizen-report API

---

## 6. Citizen → Backend

- [ ] SOS works
- [ ] Citizen report works
- [ ] Road-block report works
- [ ] Location is attached

---

## 7. Feedback Loop

- [ ] Citizen report reaches backend
- [ ] Authority receives report
- [ ] Road status changes
- [ ] Safe route changes
- [ ] Risk/impact state can be updated

---

## 8. Final Demo

- [ ] Disaster simulation
- [ ] Hazard update
- [ ] Impact update
- [ ] Authority response
- [ ] Citizen warning
- [ ] Voice warning
- [ ] Safe route
- [ ] Shelter
- [ ] SOS
- [ ] Citizen report
- [ ] Authority receives report
- [ ] Route update

---

## 9. Feature Freeze

After the MVP works:

- No major new features
- Only bug fixes
- Only UI polish
- Only testing
- Only presentation preparation