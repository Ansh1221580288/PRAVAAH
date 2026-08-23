# PRAVAAH Demo Scenario

## Scenario

A severe rainfall event occurs in a flood-prone region.

---

## 1. Initial State

Sector: S07

- Risk Level: LOW
- Rainfall: Normal
- River Level: Normal
- Soil Moisture: Normal

---

## 2. Disaster Trigger

Simulate heavy rainfall.

Environmental conditions change:

- Rainfall increases
- River level increases
- Soil moisture increases
- Flood probability increases

---

## 3. Hazard Intelligence

Expected output:

- Flood Probability: 91%
- Flash-Flood Probability: 84%
- Landslide Probability: 32%
- Overall Risk: CRITICAL

---

## 4. Impact Intelligence

### Sector S07

- Population Exposed: 8,420
- Vulnerable Population: 1,530
- Roads Affected: 7
- Bridges Affected: 2
- Hospitals Affected: 1
- Schools Affected: 3
- Priority: CRITICAL

### Sector S09

- Population Exposed: 6,210
- Priority: HIGH

---

## 5. Authority Response

Recommended resource allocation:

### S07

- Rescue Teams: 5
- Boats: 3
- Ambulances: 2

### S09

- Rescue Teams: 3
- Boats: 2
- Ambulances: 1

---

## 6. Citizen Warning

A citizen located in S07 receives:

> SEVERE FLOOD WARNING

The citizen can:

1. Listen to the warning
2. Find a safer route
3. Find a safe shelter
4. Send SOS
5. Report an incident

---

## 7. Feedback Event

Citizen reports:

> ROAD R102 BLOCKED

The system processes the report:

Citizen
↓
Backend
↓
Authority Dashboard
↓
Road R102 marked BLOCKED
↓
Safe route recalculated

---

## 8. Final Result

The authority receives updated situational information.

The citizen receives an updated safer route.

The system demonstrates:

Predict → Assess → Act → Receive Feedback → Update