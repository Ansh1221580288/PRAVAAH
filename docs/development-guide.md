# PRAVAAH Development Guide

## 1. Architecture Rule

The PRAVAAH architecture is frozen.

No member should independently change the system architecture.

Refer to:

docs/architecture.md

---

## 2. Team Ownership

### Project Lead
Overall coordination, integration, research, testing and SIH presentation.

### Backend
FastAPI, PostgreSQL, PostGIS, APIs and integration.

### AI/ML
Flood, flash-flood, landslide prediction and risk scoring.

### Data/GIS
Weather, satellite, terrain, GIS processing, impact analysis.

### Authority
Authority command dashboard and disaster operations interface.

### Citizen
Citizen application, warnings, routing, shelter, SOS and reporting.

---

## 3. Git Rules

Never directly develop on main.

Each member works on their assigned feature branch.

Branches:

feature/backend
feature/hazard-ml
feature/data-gis
feature/authority
feature/citizen

---

## 4. Commit Rules

Use clear commit messages.

Examples:

Add flood prediction model

Add rainfall preprocessing

Create hazard API

Add authority risk dashboard

Add citizen warning screen

---

## 5. Pull Request Rules

Before merging:

1. Test the code.
2. Confirm it follows the architecture.
3. Confirm existing functionality still works.
4. Create a Pull Request.
5. At least one teammate reviews it.
6. Merge only after approval.

---

## 6. API Rule

Frontend must communicate with the backend through APIs.

Frontend must NOT directly access PostgreSQL.

AI/ML outputs must follow:

docs/api-contract.md

---

## 7. Database Rule

The backend/database owner manages schema changes.

Database changes should be documented.

Do not randomly change database columns without informing the integration owner.

---

## 8. Environment Variables

Never commit:

.env

Never commit API keys, passwords or secret tokens.

Use:

.env.example

for required environment variable names.

---

## 9. Testing

Every module must provide at least one working test/demo.

The final system must be tested as one complete flow:

Data
↓
Hazard
↓
Impact
↓
Authority/Citizen
↓
Feedback
↓
Updated Risk

---

## 10. Prototype First

The team should first build a working MVP using:

- sample data
- simulated real-time values
- pretrained/trained prototype models
- limited geographic area

After the MVP works, add more sophisticated data sources and models.

---

## 11. Integration Principle

Do not wait until the final day to integrate modules.

Integration should happen progressively:

Data → ML

ML → Backend

GIS → Backend

Backend → Authority

Backend → Citizen

Citizen → Feedback

Feedback → Hazard/Impact

---

## 12. Safety Principle

PRAVAAH is a prototype decision-support system.

AI predictions should assist authorities and citizens, not be presented as guaranteed predictions.

Warnings should include appropriate uncertainty handling and should not claim absolute certainty.