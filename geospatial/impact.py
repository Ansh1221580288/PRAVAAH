"""
PRAVAAH Impact Intelligence Engine

Reads prepared GeoJSON data and calculates:
- population exposed
- vulnerable population exposed
- roads affected
- bridges affected
- hospitals affected
- schools affected
- priority
- critical sectors
"""

import json
from pathlib import Path


# ---------------------------------------------------------
# DATA LOCATION
# ---------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data" / "sample"


# ---------------------------------------------------------
# GEOJSON LOADER
# ---------------------------------------------------------

def load_geojson(filename):
    """Load a GeoJSON file from data/sample."""

    path = DATA_DIR / filename

    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


# ---------------------------------------------------------
# LOAD ALL GIS DATA
# ---------------------------------------------------------

def load_gis_data():
    """Load all prepared GIS datasets."""

    return {
        "sectors": load_geojson("sectors.geojson"),
        "roads": load_geojson("roads.geojson"),
        "shelters": load_geojson("shelters.geojson"),
        "hospitals": load_geojson("hospitals.geojson"),
        "schools": load_geojson("schools.geojson"),
        "flood_extent": load_geojson("flood_extent.geojson"),
    }


# ---------------------------------------------------------
# FLOOD-AFFECTED SECTORS
# ---------------------------------------------------------

def get_flood_affected_sectors(flood_data):
    """
    Get sectors listed as affected by the prepared flood extent.
    """

    affected = set()

    for feature in flood_data.get("features", []):
        properties = feature.get("properties", {})

        sectors = properties.get("affected_sectors", [])

        for sector_id in sectors:
            affected.add(sector_id)

    return affected


# ---------------------------------------------------------
# SECTOR INFORMATION
# ---------------------------------------------------------

def get_sector_impact(sector_id, sectors_data, affected_sectors):
    """Calculate population impact for one sector."""

    for feature in sectors_data.get("features", []):

        properties = feature.get("properties", {})

        current_sector = properties.get("sector_id")

        if current_sector == sector_id:

            population = properties.get("population", 0)

            vulnerable = properties.get(
                "vulnerable_population",
                0
            )

            exposed = sector_id in affected_sectors

            return {
                "population_exposed": population if exposed else 0,
                "vulnerable_population": vulnerable if exposed else 0,
            }

    return {
        "population_exposed": 0,
        "vulnerable_population": 0,
    }


# ---------------------------------------------------------
# COUNT FEATURES BY SECTOR
# ---------------------------------------------------------

def count_features_by_sector(
    data,
    sector_id,
    affected_sectors,
):
    """
    Count GIS features belonging to an affected sector.
    """

    if sector_id not in affected_sectors:
        return 0

    count = 0

    for feature in data.get("features", []):

        properties = feature.get("properties", {})

        feature_sector = properties.get("sector_id")

        if feature_sector == sector_id:
            count += 1

    return count


# ---------------------------------------------------------
# BRIDGE COUNT
# ---------------------------------------------------------

def count_bridges(
    roads_data,
    sector_id,
    affected_sectors,
):
    """
    Count bridges within an affected sector.

    Supports common property names:
    road_type, type, infrastructure_type.
    """

    if sector_id not in affected_sectors:
        return 0

    count = 0

    for feature in roads_data.get("features", []):

        properties = feature.get("properties", {})

        feature_sector = properties.get("sector_id")

        if feature_sector != sector_id:
            continue

        road_type = str(
            properties.get(
                "road_type",
                properties.get(
                    "type",
                    properties.get(
                        "infrastructure_type",
                        ""
                    )
                )
            )
        ).lower()

        if "bridge" in road_type:
            count += 1

    return count


# ---------------------------------------------------------
# PRIORITY
# ---------------------------------------------------------

def calculate_priority(
    population_exposed,
    vulnerable_population,
    roads_affected,
    bridges_affected,
    hospitals_affected,
    schools_affected,
):
    """
    Calculate operational priority.

    This is a prototype rule-based scoring system.
    """

    score = 0

    # Population impact
    if population_exposed >= 15000:
        score += 3
    elif population_exposed >= 5000:
        score += 2
    elif population_exposed > 0:
        score += 1

    # Vulnerable population
    if vulnerable_population >= 3000:
        score += 3
    elif vulnerable_population >= 1000:
        score += 2
    elif vulnerable_population > 0:
        score += 1

    # Roads
    if roads_affected >= 5:
        score += 2
    elif roads_affected > 0:
        score += 1

    # Bridges
    if bridges_affected >= 2:
        score += 2
    elif bridges_affected > 0:
        score += 1

    # Hospitals
    if hospitals_affected > 0:
        score += 3

    # Schools
    if schools_affected >= 3:
        score += 2
    elif schools_affected > 0:
        score += 1

    # Final classification
    if score >= 8:
        return "CRITICAL"

    if score >= 5:
        return "HIGH"

    if score >= 2:
        return "MEDIUM"

    return "LOW"


# ---------------------------------------------------------
# MAIN IMPACT CALCULATION
# ---------------------------------------------------------

def calculate_sector_impact(sector_id):
    """
    Calculate complete impact intelligence for a sector.
    """

    gis = load_gis_data()

    affected_sectors = get_flood_affected_sectors(
        gis["flood_extent"]
    )

    sector_impact = get_sector_impact(
        sector_id,
        gis["sectors"],
        affected_sectors,
    )

    population_exposed = sector_impact[
        "population_exposed"
    ]

    vulnerable_population = sector_impact[
        "vulnerable_population"
    ]

    roads_affected = count_features_by_sector(
        gis["roads"],
        sector_id,
        affected_sectors,
    )

    bridges_affected = count_bridges(
        gis["roads"],
        sector_id,
        affected_sectors,
    )

    hospitals_affected = count_features_by_sector(
        gis["hospitals"],
        sector_id,
        affected_sectors,
    )

    schools_affected = count_features_by_sector(
        gis["schools"],
        sector_id,
        affected_sectors,
    )

    priority = calculate_priority(
        population_exposed,
        vulnerable_population,
        roads_affected,
        bridges_affected,
        hospitals_affected,
        schools_affected,
    )

    return {
        "sector_id": sector_id,
        "population_exposed": population_exposed,
        "vulnerable_population": vulnerable_population,
        "roads_affected": roads_affected,
        "bridges_affected": bridges_affected,
        "hospitals_affected": hospitals_affected,
        "schools_affected": schools_affected,
        "priority": priority,
    }


# ---------------------------------------------------------
# ALL SECTOR IMPACT
# ---------------------------------------------------------

def calculate_all_sector_impacts():
    """Calculate impact intelligence for all sectors."""

    gis = load_gis_data()

    results = []

    for feature in gis["sectors"].get("features", []):

        properties = feature.get("properties", {})

        sector_id = properties.get("sector_id")

        if sector_id:
            results.append(
                calculate_sector_impact(sector_id)
            )

    return results


# ---------------------------------------------------------
# CRITICAL SECTORS
# ---------------------------------------------------------

def get_critical_sectors():
    """Return sectors classified as CRITICAL."""

    results = calculate_all_sector_impacts()

    return [
        result
        for result in results
        if result["priority"] == "CRITICAL"
    ]


# ---------------------------------------------------------
# DEMO
# ---------------------------------------------------------

if __name__ == "__main__":

    print("=" * 70)
    print("PRAVAAH IMPACT INTELLIGENCE ENGINE")
    print("=" * 70)

    results = calculate_all_sector_impacts()

    for result in results:

        print("\nSector:", result["sector_id"])

        print(
            "Population exposed:",
            result["population_exposed"]
        )

        print(
            "Vulnerable population:",
            result["vulnerable_population"]
        )

        print(
            "Roads affected:",
            result["roads_affected"]
        )

        print(
            "Bridges affected:",
            result["bridges_affected"]
        )

        print(
            "Hospitals affected:",
            result["hospitals_affected"]
        )

        print(
            "Schools affected:",
            result["schools_affected"]
        )

        print(
            "Priority:",
            result["priority"]
        )

    print("\n" + "=" * 70)
    print("CRITICAL SECTORS")
    print("=" * 70)

    critical = get_critical_sectors()

    for sector in critical:
        print(sector)