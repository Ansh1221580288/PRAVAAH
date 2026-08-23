export const disasterData = {
  normal: {
    label: "NORMAL",
    risk: "LOW",
    riskScore: 0.21,
    population: 2500,
    criticalSectors: 2,
    sos: 3,
    blockedRoads: 0,

    rainfall: "12 mm/hr",
    waterLevel: "1.2 m",
    floodExtent: "Minimal",

    sectors: [
      { name: "S01", level: "LOW" },
      { name: "S02", level: "LOW" },
    ],

    sosReports: [
      {
        location: "S01",
        priority: "LOW",
        time: "10 min ago",
      },
      {
        location: "S02",
        priority: "LOW",
        time: "18 min ago",
      },
      {
        location: "S04",
        priority: "LOW",
        time: "25 min ago",
      },
    ],

    roads: [],

    resources: {
      rescueTeams: 4,
      boats: 2,
      ambulances: 3,
    },

    situation: [
      "Rainfall within normal range",
      "Water levels stable",
      "No major incidents reported",
    ],
  },

  heavy: {
    label: "HEAVY RAINFALL",
    risk: "HIGH",
    riskScore: 0.65,
    population: 12500,
    criticalSectors: 5,
    sos: 17,
    blockedRoads: 4,

    rainfall: "72 mm/hr",
    waterLevel: "3.8 m",
    floodExtent: "Moderate",

    sectors: [
      { name: "S03", level: "HIGH" },
      { name: "S05", level: "HIGH" },
      { name: "S07", level: "MEDIUM" },
      { name: "S09", level: "HIGH" },
      { name: "S11", level: "MEDIUM" },
    ],

    sosReports: [
      {
        location: "S03",
        priority: "HIGH",
        time: "2 min ago",
      },
      {
        location: "S05",
        priority: "HIGH",
        time: "5 min ago",
      },
      {
        location: "S09",
        priority: "MEDIUM",
        time: "8 min ago",
      },
    ],

    roads: [
      {
        name: "MG Road",
        status: "PARTIAL",
      },
      {
        name: "Station Road",
        status: "BLOCKED",
      },
      {
        name: "Ring Road",
        status: "PARTIAL",
      },
      {
        name: "NH-48",
        status: "BLOCKED",
      },
    ],

    resources: {
      rescueTeams: 8,
      boats: 5,
      ambulances: 5,
    },

    situation: [
      "Heavy rainfall detected",
      "Water level rising rapidly",
      "Multiple SOS reports received",
    ],
  },

  critical: {
    label: "CRITICAL FLOOD",
    risk: "CRITICAL",
    riskScore: 0.89,
    population: 24580,
    criticalSectors: 7,
    sos: 32,
    blockedRoads: 11,

    rainfall: "118 mm/hr",
    waterLevel: "6.4 m",
    floodExtent: "Severe",

    sectors: [
      {
        name: "S17",
        level: "CRITICAL",
      },
      {
        name: "S03",
        level: "CRITICAL",
      },
      {
        name: "S05",
        level: "HIGH",
      },
      {
        name: "S07",
        level: "CRITICAL",
      },
      {
        name: "S09",
        level: "HIGH",
      },
      {
        name: "S11",
        level: "CRITICAL",
      },
      {
        name: "S12",
        level: "HIGH",
      },
    ],

    sosReports: [
      {
        location: "S17",
        priority: "CRITICAL",
        time: "1 min ago",
      },
      {
        location: "S03",
        priority: "CRITICAL",
        time: "2 min ago",
      },
      {
        location: "S07",
        priority: "CRITICAL",
        time: "3 min ago",
      },
      {
        location: "S11",
        priority: "HIGH",
        time: "5 min ago",
      },
    ],

    roads: [
      {
        name: "MG Road",
        status: "BLOCKED",
      },
      {
        name: "Station Road",
        status: "BLOCKED",
      },
      {
        name: "Ring Road",
        status: "BLOCKED",
      },
      {
        name: "NH-48",
        status: "BLOCKED",
      },
      {
        name: "Airport Road",
        status: "BLOCKED",
      },
    ],

    resources: {
      rescueTeams: 12,
      boats: 8,
      ambulances: 6,
    },

    situation: [
      "Critical flood conditions detected",
      "Water level above danger mark",
      "Emergency response activated",
      "Multiple sectors require evacuation",
    ],
  },
};