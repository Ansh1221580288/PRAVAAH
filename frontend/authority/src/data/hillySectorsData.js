// Dataset for Indian Hilly Regions Multi-Source Hazard Intelligence (PS 26192)
// Covers Western Himalayas, Garhwal/Kumaon, Sikkim, & North-East Hilly States (Assam, Arunachal, Meghalaya)

export const HILLY_SECTORS_GEO = [
  {
    sector_id: "S01",
    name: "Shimla Urban & Ridge Slopes",
    state: "Himachal Pradesh",
    region: "Western Himalayas",
    center: [31.1048, 77.1734],
    polygon: [
      [31.115, 77.160],
      [31.120, 77.185],
      [31.095, 77.190],
      [31.090, 77.165],
    ],
    elevation: 2200,
    slope: 28.5,
    historical_risk: 0.72,
    population: 16950,
    vulnerable_population: 3400,
    hospitals: 3,
    schools: 8,
    bridges: 2,
    roads: ["NH-05 Shimla-Kalka", "Mall Road Bypass"],
    telemetry: {
      source: "Open-Meteo Telemetry Engine",
      rainfall_rate_mmh: 42.5,
      rainfall_24h_mm: 128.0,
      soil_moisture: 78.4,
      river_level: 4.8,
      temperature: 17.2
    },
    prediction: {
      sector_id: "S01",
      flood_probability: 0.58,
      flash_flood_probability: 0.52,
      landslide_probability: 0.64,
      risk_score: 0.72,
      risk_level: "HIGH",
      explanation: "Overall risk is classified as HIGH driven by heavy rainfall of 42.5 mm/hr and steep ridge slope of 28.5°."
    },
    shap_drivers: [
      { factor: "24h Cumulative Rainfall Anomaly", contribution: "+34%" },
      { factor: "Steep Ridge Slope (28.5°)", contribution: "+26%" },
      { factor: "Soil Moisture Saturation (78%)", contribution: "+18%" },
      { factor: "Drainage Siltation Factor", contribution: "+12%" }
    ],
    shelters: ["Shimla Ridge Relief Center", "Sanjauli Higher Ground School"],
    languages: {
      hi: "शिमला रिज़ एवं ढलान क्षेत्र - भारी वर्षा एवं भूस्खलन चेतावनी जारी।",
      pahari: "शिमला रीज ढलाणा री चेतावनी - भारी बरसाता रा अलर्ट।",
      as: "শ্বিমলা ৰিজ অঞ্চল - ধাৰাষাৰ বৰষুণ আৰু ভূমিস্খলনৰ সতৰ্কবাণী।",
      ne: "शिमला रिज क्षेत्र - भारी वर्षा र पहिरोको चेतावनी।",
      en: "Shimla Ridge Slopes - Heavy rainfall & landslide warning active."
    }
  },
  {
    sector_id: "S02",
    name: "Kullu Valley & Beas Basin",
    state: "Himachal Pradesh",
    region: "Western Himalayas",
    center: [31.9579, 77.1095],
    polygon: [
      [31.975, 77.095],
      [31.980, 77.125],
      [31.940, 77.130],
      [31.935, 77.100],
    ],
    elevation: 1279,
    slope: 34.0,
    historical_risk: 0.88,
    population: 22400,
    vulnerable_population: 4800,
    hospitals: 4,
    schools: 12,
    bridges: 5,
    roads: ["NH-21 Chandigarh-Manali", "Bhuntar Bridge Corridor"],
    telemetry: {
      source: "Open-Meteo Telemetry Engine",
      rainfall_rate_mmh: 68.2,
      rainfall_24h_mm: 195.4,
      soil_moisture: 91.2,
      river_level: 7.6,
      temperature: 18.5
    },
    prediction: {
      sector_id: "S02",
      flood_probability: 0.84,
      flash_flood_probability: 0.89,
      landslide_probability: 0.78,
      risk_score: 0.88,
      risk_level: "CRITICAL",
      explanation: "Overall risk is classified as CRITICAL driven by cloudburst rainfall of 68.2 mm/hr and Beas river surge."
    },
    shap_drivers: [
      { factor: "Upstream Cloudburst Discharge", contribution: "+41%" },
      { factor: "Beas River Level Spurt (+7.6m)", contribution: "+28%" },
      { factor: "Soil Saturation (91%)", contribution: "+17%" },
      { factor: "Bridge Pier Erosion Risk", contribution: "+14%" }
    ],
    shelters: ["Kullu High School Relief Camp", "Bhuntar Disaster Relief Hub"],
    languages: {
      hi: "कुल्लू घाटी व्यास नदी तट - आपातकालीन बाढ़ चेतावनी, तुरंत ऊंचे स्थान पर जाएं।",
      pahari: "कुल्लू घाटी ब्यास खड्ड - बाड़ी बाढ़ री चेतावनी, उच्छी ठारा जाओ।",
      as: "কুল্লু উপত্যকা বিয়াছ নদী - জৰুৰী কালীন বানপানীৰ সতৰ্কতা।",
      ne: "कुल्लू उपत्यका व्यास नदी - आपत्कालीन बाढीको चेतावनी, उच्च ठाउँमा जानुहोस्।",
      en: "Kullu Valley Beas Basin - Critical flash flood warning, evacuate to higher ground."
    }
  },
  {
    sector_id: "S03",
    name: "Mandi Uhl & Beas Confluence",
    state: "Himachal Pradesh",
    region: "Western Himalayas",
    center: [31.7084, 76.9318],
    polygon: [
      [31.720, 76.915],
      [31.725, 76.945],
      [31.690, 76.950],
      [31.685, 76.920],
    ],
    elevation: 850,
    slope: 22.0,
    historical_risk: 0.68,
    population: 18200,
    vulnerable_population: 3100,
    hospitals: 2,
    schools: 7,
    bridges: 3,
    roads: ["Mandi-Pandoh Highway", "Aut Tunnel Corridor"],
    telemetry: {
      source: "Open-Meteo Telemetry Engine",
      rainfall_rate_mmh: 38.0,
      rainfall_24h_mm: 110.5,
      soil_moisture: 72.0,
      river_level: 5.4,
      temperature: 20.1
    },
    prediction: {
      sector_id: "S03",
      flood_probability: 0.61,
      flash_flood_probability: 0.55,
      landslide_probability: 0.48,
      risk_score: 0.68,
      risk_level: "HIGH",
      explanation: "Overall risk is classified as HIGH primarily driven by river discharge at Uhl confluence."
    },
    shap_drivers: [
      { factor: "Hydraulic Reservoir Sluice Outflow", contribution: "+36%" },
      { factor: "Intense Downpour (38 mm/hr)", contribution: "+30%" },
      { factor: "River Bank Erosion", contribution: "+18%" }
    ],
    shelters: ["Mandi ITI Shelter Complex", "Pandoh Community Hall"],
    languages: {
      hi: "मंडी उहल संगम - नदी जलस्तर बढ़ा, किनारे जाने से बचें।",
      pahari: "मंडी उहल संगम - खड्डा रा पाणी बढ़्या, किनारे मत जाओ।",
      as: "মণ্ডী উহল নদী - নদীৰ পানী বৃদ্ধি পাইছে।",
      ne: "मंडी उहल संगम - नदीको जलस्तर बढेको छ।",
      en: "Mandi Uhl Confluence - Water level rising rapidly, stay away from riverbanks."
    }
  },
  {
    sector_id: "S04",
    name: "Chamoli Alaknanda Canyon",
    state: "Uttarakhand",
    region: "Garhwal Himalayas",
    center: [30.4042, 79.3275],
    polygon: [
      [30.415, 79.310],
      [30.420, 79.340],
      [30.390, 79.345],
      [30.385, 79.315],
    ],
    elevation: 1550,
    slope: 41.2,
    historical_risk: 0.94,
    population: 19800,
    vulnerable_population: 4100,
    hospitals: 3,
    schools: 9,
    bridges: 6,
    roads: ["NH-07 Badrinath Highway", "Joshimath Link Road"],
    telemetry: {
      source: "Open-Meteo Telemetry Engine",
      rainfall_rate_mmh: 74.0,
      rainfall_24h_mm: 220.0,
      soil_moisture: 94.5,
      river_level: 8.9,
      temperature: 15.0
    },
    prediction: {
      sector_id: "S04",
      flood_probability: 0.88,
      flash_flood_probability: 0.91,
      landslide_probability: 0.95,
      risk_score: 0.94,
      risk_level: "CRITICAL",
      explanation: "Overall risk is classified as CRITICAL driven by extreme slope of 41.2° and Alaknanda canyon flash torrents."
    },
    shap_drivers: [
      { factor: "NASA LHASA Landslide Susceptibility", contribution: "+39%" },
      { factor: "Steep Canyon Slope (41.2°)", contribution: "+31%" },
      { factor: "Alaknanda River Velocity", contribution: "+19%" }
    ],
    shelters: ["Chamoli Government College Shelter", "Gopeshwar Stadium Relief Base"],
    languages: {
      hi: "चमोली अलकनंदा घाटी - भीषण भूस्खलन एवं फ्लैश फ्लड अलर्ट।",
      garhwali: "चमोली अलकनंदा गाड़ - भारी भूस्खलन र बाड़ को अलर्ट, होशियार रवा।",
      as: "চামোলী অলকনন্দা উপত্যকা - ভূমিস্খলন আৰু পাহাৰীয়া বানৰ সতৰ্কবাণী।",
      ne: "चमोली अलकनंदा घाटी - पहिरो र बाढीको चेतावनी।",
      en: "Chamoli Alaknanda Canyon - Severe landslide and flash flood red alert."
    }
  },
  {
    sector_id: "S05",
    name: "Kedarnath Mandakini Corridor",
    state: "Uttarakhand",
    region: "Garhwal Himalayas",
    center: [30.7346, 79.0669],
    polygon: [
      [30.745, 79.050],
      [30.750, 79.080],
      [30.720, 79.085],
      [30.715, 79.055],
    ],
    elevation: 3583,
    slope: 45.0,
    historical_risk: 0.96,
    population: 9800,
    vulnerable_population: 2200,
    hospitals: 1,
    schools: 2,
    bridges: 3,
    roads: ["Gaurikund Trek Route", "Rudraprayag Corridor"],
    telemetry: {
      source: "Open-Meteo Telemetry Engine",
      rainfall_rate_mmh: 82.5,
      rainfall_24h_mm: 245.0,
      soil_moisture: 96.0,
      river_level: 9.4,
      temperature: 11.4
    },
    prediction: {
      sector_id: "S05",
      flood_probability: 0.91,
      flash_flood_probability: 0.96,
      landslide_probability: 0.92,
      risk_score: 0.96,
      risk_level: "CRITICAL",
      explanation: "Overall risk is classified as CRITICAL driven by cloudburst runoff and 45.0° Mandakini gorge gradient."
    },
    shap_drivers: [
      { factor: "Glacial Outflow Peak", contribution: "+44%" },
      { factor: "Extreme Slope Gradient (45°)", contribution: "+33%" },
      { factor: "Debris Flow Accumulation", contribution: "+13%" }
    ],
    shelters: ["Gaurikund NDRF Relief Camp", "Sonprayag Base Station Shelter"],
    languages: {
      hi: "केदारनाथ मंदाकिनी क्षेत्र - बादल फटने एवं तीव्र जलप्रवाह की आपात चेतावनी।",
      garhwali: "केदारनाथ मंदाकिनी गाड़ - बाण फूटना को खतरा, सुराक्षित ठै ठौ जाई जावा।",
      as: "কেদাৰনাথ মন্দাকিনী উপত্যকা - মেঘ বিস্ফোৰণ আৰু পাহাৰীয়া ধলৰ সতৰ্কতা।",
      ne: "केदारनाथ मन्दाकिनी क्षेत्र - बादल फुट्ने र बाढीको आपत्कालीन चेतावनी।",
      en: "Kedarnath Mandakini Corridor - Cloudburst & high-velocity torrent emergency alert."
    }
  },
  {
    sector_id: "S06",
    name: "Guwahati Brahmaputra Foothills",
    state: "Assam",
    region: "North-East India",
    center: [26.1445, 91.7362],
    polygon: [
      [26.160, 91.720],
      [26.165, 91.750],
      [26.130, 91.755],
      [26.125, 91.725],
    ],
    elevation: 55,
    slope: 18.0,
    historical_risk: 0.76,
    population: 31200,
    vulnerable_population: 6400,
    hospitals: 5,
    schools: 14,
    bridges: 4,
    roads: ["GS Road Bypass", "NH-37 East-West Corridor"],
    telemetry: {
      source: "Open-Meteo Telemetry Engine",
      rainfall_rate_mmh: 48.0,
      rainfall_24h_mm: 162.0,
      soil_moisture: 86.5,
      river_level: 8.2,
      temperature: 26.5
    },
    prediction: {
      sector_id: "S06",
      flood_probability: 0.79,
      flash_flood_probability: 0.62,
      landslide_probability: 0.45,
      risk_score: 0.76,
      risk_level: "HIGH",
      explanation: "Overall risk is classified as HIGH driven by Brahmaputra backwater surge and urban hill stream inundation."
    },
    shap_drivers: [
      { factor: "Brahmaputra Backwater Surcharging", contribution: "+37%" },
      { factor: "Urban Hill Stream Inundation", contribution: "+33%" },
      { factor: "Catchment Drainage Bottleneck", contribution: "+20%" }
    ],
    shelters: ["Khanapara Veterinary College Shelter", "Dispur Community Relief Center"],
    languages: {
      as: "গুৱাহাটী ব্ৰহ্মপুত্ৰ পাদদেশ - চহৰাঞ্চলৰ তীব্ৰ বান আৰু পাহাৰীয়া ঢলৰ সতৰ্কবাণী।",
      bn: "গুয়াহাটি ব্রহ্মপুত্র পাদদেশ - শহর এলাকায় দ্রুত জলবৃদ্ধির সতর্কবার্তা।",
      hi: "गुवाहाटी ब्रह्मपुत्र तलहटी - जलभराव एवं पहाड़ी नाले उफान पर, सतर्क रहें।",
      en: "Guwahati Brahmaputra Foothills - Severe urban inundation & hill creek flash flood alert."
    }
  },
  {
    sector_id: "S07",
    name: "Dima Hasao Haflong Landslide Zone",
    state: "Assam",
    region: "North-East Hills",
    center: [25.1764, 93.0163],
    polygon: [
      [25.190, 93.000],
      [25.195, 93.030],
      [25.160, 93.035],
      [25.155, 93.005],
    ],
    elevation: 960,
    slope: 37.8,
    historical_risk: 0.92,
    population: 14800,
    vulnerable_population: 3200,
    hospitals: 2,
    schools: 6,
    bridges: 5,
    roads: ["Lumding-Silchar Hill Railway Line", "NH-27 Hill Road"],
    telemetry: {
      source: "Open-Meteo Telemetry Engine",
      rainfall_rate_mmh: 62.0,
      rainfall_24h_mm: 215.0,
      soil_moisture: 93.8,
      river_level: 7.9,
      temperature: 22.0
    },
    prediction: {
      sector_id: "S07",
      flood_probability: 0.81,
      flash_flood_probability: 0.86,
      landslide_probability: 0.94,
      risk_score: 0.92,
      risk_level: "CRITICAL",
      explanation: "Overall risk is classified as CRITICAL driven by continuous heavy downpour (62mm/hr) and mass hill slump threat."
    },
    shap_drivers: [
      { factor: "Continuous Monsoonal Downpour (215mm/24h)", contribution: "+42%" },
      { factor: "Porous Shale Soil Saturation", contribution: "+32%" },
      { factor: "Railway Track Embankment Slump Risk", contribution: "+16%" }
    ],
    shelters: ["Haflong Stadium Relief Camp", "Jatinga Disaster Refuge"],
    languages: {
      as: "ডিমা হাছাও হাফলং - ধাৰাষাৰ বৰষুণত ভূমিস্খলনৰ তীব্ৰ আশংকা, ৰেলপথ আৰু পথ ব্যাহত।",
      hi: "डिमा हसाओ हाफलॉन्ग - भारी भूस्खलन का अलर्ट, पहाड़ी सड़कों पर जाने से बचें।",
      en: "Dima Hasao Haflong Zone - Red Alert for mass landslides & hill railway line breach."
    }
  },
  {
    sector_id: "S08",
    name: "Itanagar Papum Pare Ridge",
    state: "Arunachal Pradesh",
    region: "Eastern Himalayas",
    center: [27.0844, 93.6053],
    polygon: [
      [27.095, 93.590],
      [27.100, 93.620],
      [27.070, 93.625],
      [27.065, 93.595],
    ],
    elevation: 320,
    slope: 35.0,
    historical_risk: 0.81,
    population: 16400,
    vulnerable_population: 3100,
    hospitals: 3,
    schools: 7,
    bridges: 3,
    roads: ["NH-415 Itanagar-Naharlagun", "Nirjuli Highway"],
    telemetry: {
      source: "Open-Meteo Telemetry Engine",
      rainfall_rate_mmh: 52.0,
      rainfall_24h_mm: 175.0,
      soil_moisture: 84.7,
      river_level: 6.8,
      temperature: 23.4
    },
    prediction: {
      sector_id: "S08",
      flood_probability: 0.71,
      flash_flood_probability: 0.74,
      landslide_probability: 0.82,
      risk_score: 0.81,
      risk_level: "HIGH",
      explanation: "Overall risk is classified as HIGH driven by flash torrent stream discharge and steep hill cuts."
    },
    shap_drivers: [
      { factor: "Flash Torrent Stream Discharge", contribution: "+38%" },
      { factor: "Unstable Hill Cut Slope", contribution: "+35%" },
      { factor: "High Soil Erosion Index", contribution: "+17%" }
    ],
    shelters: ["Itanagar Raj Bhawan Higher Ground Shelter", "Naharlagun Community Center"],
    languages: {
      as: "ইটানগৰ পাপুম পাৰে - নদীৰ ধল আৰু ভূমিস্খলনৰ সতৰ্কবাণী।",
      hi: "ईटानगर पापुम पारे - पहाड़ी नाले उफान पर, सड़कों पर मिट्टी का कटाव।",
      en: "Itanagar Papum Pare Ridge - Flash flood torrents & hill slope erosion warning."
    }
  },
  {
    sector_id: "S09",
    name: "Gangtok Teesta Basin & Ranipool",
    state: "Sikkim",
    region: "Eastern Himalayas",
    center: [27.3389, 88.6065],
    polygon: [
      [27.350, 88.590],
      [27.355, 88.620],
      [27.320, 88.625],
      [27.315, 88.595],
    ],
    elevation: 1650,
    slope: 36.5,
    historical_risk: 0.87,
    population: 24100,
    vulnerable_population: 5200,
    hospitals: 4,
    schools: 11,
    bridges: 4,
    roads: ["NH-10 Siliguri-Gangtok", "Singtam-Ranipool Corridor"],
    telemetry: {
      source: "Open-Meteo Telemetry Engine",
      rainfall_rate_mmh: 58.4,
      rainfall_24h_mm: 198.0,
      soil_moisture: 88.2,
      river_level: 8.1,
      temperature: 17.8
    },
    prediction: {
      sector_id: "S09",
      flood_probability: 0.82,
      flash_flood_probability: 0.79,
      landslide_probability: 0.86,
      risk_score: 0.87,
      risk_level: "HIGH",
      explanation: "Overall risk is classified as HIGH driven by Teesta river surge and GLOF risk along NH-10."
    },
    shap_drivers: [
      { factor: "Teesta River Surge Outflow", contribution: "+43%" },
      { factor: "Glacial Lake Outburst Overflow (GLOF) Vulnerability", contribution: "+29%" },
      { factor: "NH-10 Highway Subsidence", contribution: "+18%" }
    ],
    shelters: ["Gangtok Paljor Stadium Shelter", "Ranipool Relief Camp"],
    languages: {
      ne: "गैंगटोक टिस्टा नदी - भीषण बाढी र राष्ट्रिय राजमार्ग-१० अवरुद्ध हुने खतरा।",
      as: "গেংটক তিস্তা নদী - তীব্ৰ বানপানী আৰু ৰাষ্ট্ৰীয় ঘাইপথ বন্ধৰ সতৰ্কতা।",
      hi: "गैंगटोक तीस्ता नदी - भारी बाढ़ एवं NH-10 मार्ग बाधित होने की चेतावनी।",
      en: "Gangtok Teesta Basin - Critical GLOF & river flood alert along NH-10 lifeline."
    }
  },
  {
    sector_id: "S10",
    name: "Shillong East Khasi Hills Canyon",
    state: "Meghalaya",
    region: "North-East Hills",
    center: [25.5788, 91.8933],
    polygon: [
      [25.590, 91.880],
      [25.595, 91.910],
      [25.560, 91.915],
      [25.555, 91.885],
    ],
    elevation: 1525,
    slope: 32.4,
    historical_risk: 0.79,
    population: 28900,
    vulnerable_population: 5800,
    hospitals: 4,
    schools: 13,
    bridges: 3,
    roads: ["GS Road Shillong-Guwahati", "Dawki Border Highway"],
    telemetry: {
      source: "Open-Meteo Telemetry Engine",
      rainfall_rate_mmh: 54.0,
      rainfall_24h_mm: 185.0,
      soil_moisture: 89.0,
      river_level: 7.2,
      temperature: 19.5
    },
    prediction: {
      sector_id: "S10",
      flood_probability: 0.74,
      flash_flood_probability: 0.72,
      landslide_probability: 0.78,
      risk_score: 0.79,
      risk_level: "HIGH",
      explanation: "Overall risk is classified as HIGH driven by cloudburst runoff in East Khasi canyons."
    },
    shap_drivers: [
      { factor: "Extreme Cloudburst Rainfall (54 mm/hr)", contribution: "+40%" },
      { factor: "Canyon Runoff Velocity", contribution: "+34%" },
      { factor: "Road Sub-grade Washing", contribution: "+16%" }
    ],
    shelters: ["Shillong State Central Library Refuge", "Mawkhar Relief Center"],
    languages: {
      as: "শ্বিলং পূব খাচী পাহাৰ - অতি ধাৰাষাৰ বৰষুণ আৰু তীব্ৰ বানৰ সতৰ্কবাণী।",
      hi: "शिलांग ईस्ट खासी हिल्स - अत्यधिक वर्षा एवं घाटियों में बाढ़ की चेतावनी।",
      en: "Shillong East Khasi Hills - Severe cloudburst runoff & canyon torrent alert."
    }
  }
];
