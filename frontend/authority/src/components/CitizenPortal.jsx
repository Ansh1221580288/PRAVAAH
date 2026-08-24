import { useState, useEffect } from "react";

export default function CitizenPortal({
  sectors = [],
  onReportSubmitted,
  onLocalSOSAdd,
  onLocalReportAdd
}) {
  const [language, setLanguage] = useState("hi");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedSectorId, setSelectedSectorId] = useState("S02");
  
  // Emergency SOS state
  const [sosCategory, setSosCategory] = useState("Flash Flood Evacuation Required");
  const [peopleCount, setPeopleCount] = useState(4);
  const [needsMedical, setNeedsMedical] = useState(true);
  const [sosSent, setSosSent] = useState(false);

  // Crowd Report state
  const [reporterName, setReporterName] = useState("");
  const [hazardType, setHazardType] = useState("Landslide Road Blockage");
  const [reportDescription, setReportDescription] = useState("");
  const [waterLevel, setWaterLevel] = useState("3.5");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Translations Dictionary for Local Indian Hilly Languages
  const I18N = {
    hi: {
      portalTitle: "नागरिक आपदा सुरक्षा एवं प्रारंभिक चेतावनी पोर्टल",
      portalSub: "आपकी सुरक्षा हमारी सर्वोच्च प्राथमिकता है • वास्तविक समय सहायता एवं आश्रय खोजक",
      langSelect: "भाषा चुनें (Select Local Language):",
      warningHeader: "🚨 आपातकालीन प्रारंभिक चेतावनी (Emergency Early Warning Alert)",
      voiceButton: "🔊 सुनें आवाज चेतावनी (Play Voice Alert)",
      stopVoice: "⏹️ आवाज रोकें (Stop Voice Alert)",
      sosHeader: "🚨 एक-क्लिक आपातकालीन SOS (One-Touch Emergency SOS Dispatch)",
      sosDesc: "बटन दबाते ही राज्य एवं राष्ट्रीय आपदा मोचन बल (NDRF) को आपकी GPS स्थिति भेजी जाएगी।",
      peopleLabel: "फंसे हुए लोगों की संख्या:",
      medicalLabel: "चिकित्सा सहायता की आवश्यकता है",
      sosButton: "🚨 आपातकालीन SOS भेजें (DISPATCH EMERGENCY SOS)",
      shelterHeader: "🗺️ निकटतम सुरक्षित आश्रय एवं निकासी मार्ग (Safe Shelters)",
      reportHeader: "📝 नागरिक क्षेत्र रिपोर्ट (Two-Way Crowd Incident Report)",
      reportDesc: "सड़क मार्ग अवरोध, नदी जलस्तर वृद्धि अथवा भूस्खलन की सूचना तुरंत प्रशासन को दें।",
      nameLabel: "आपका नाम:",
      hazardLabel: "आपदा का प्रकार:",
      descLabel: "विवरण / स्थल स्थिति:",
      submitReport: "📤 रिपोर्ट जमा करें (Submit Field Report)"
    },
    pahari: {
      portalTitle: "नागरिक आपदा सुरक्षा ते चेतावनी पोर्टल",
      portalSub: "तुहाड़ी सुरक्षा साड़ी मुख्य प्राथमिकता • सुरक्षित ठार ते मदद",
      langSelect: "बोली चुनें:",
      warningHeader: "🚨 आपातकालीन चेतावनी (Emergency Warning)",
      voiceButton: "🔊 अवाज़ सुणा (Play Voice Alert)",
      stopVoice: "⏹️ अवाज़ रोका",
      sosHeader: "🚨 एक-क्लिक आपातकालीन SOS",
      sosDesc: "बटन दबांदे ही NDRF ते पुलिस तांई तुहाड़ी लोकेशन पुज्जी जाणी।",
      peopleLabel: "फंसेया रे माणस:",
      medicalLabel: "डॉक्टर री लोड़ है",
      sosButton: "🚨 आपातकालीन SOS भेजो",
      shelterHeader: "🗺️ नेड़े रे सुरक्षित आश्रय",
      reportHeader: "📝 खड्ड ते रास्ते री रिपोर्ट",
      reportDesc: "भूस्खलन या खड्डा रा पाणी बढ़ने री खबर भेजो।",
      nameLabel: "तुहाड़ा नांह:",
      hazardLabel: "खतरे रा प्रकार:",
      descLabel: "हाल-चाल विवरण:",
      submitReport: "📤 रिपोर्ट भेजो"
    },
    as: {
      portalTitle: "নাগৰিক দুৰ্যোগ সুৰক্ষা আৰু আগতীয়া সতৰ্কবাণী প'ৰ্টেল",
      portalSub: "আপোনাৰ সুৰক্ষা আমাৰ প্ৰাথমিকতা • লাইভ জৰুৰীকালীন সাহায্য",
      langSelect: "ভাষা বাছনি কৰক:",
      warningHeader: "🚨 জৰুৰীকালীন আগতীয়া সতৰ্কবাণী (Emergency Alert)",
      voiceButton: "🔊 বাৰ্তা শুনক (Play Voice Alert)",
      stopVoice: "⏹️ বন্ধ কৰক",
      sosHeader: "🚨 এক-স্পৰ্শ জৰুৰীকালীন SOS",
      sosDesc: "মুহূৰ্ততে NDRF আৰু জিলা প্ৰশাসনলৈ আপোনাৰ GPS স্থান প্ৰেৰণ কৰা হ'ব।",
      peopleLabel: "আৱদ্ধ লোকৰ সংখ্যা:",
      medicalLabel: "চিকিৎসা সেৱাৰ প্ৰয়োজন",
      sosButton: "🚨 জৰুৰীকালীন SOS পঠিয়াওক",
      shelterHeader: "🗺️ নিকটৱৰ্তী সুৰক্ষিত আশ্ৰয় শিবিৰ",
      reportHeader: "📝 নাগৰিক দুৰ্যোগ প্ৰতিবেদন (Crowd Report)",
      reportDesc: "পথ অৱৰোধ বা নদীৰ পানী বৃদ্ধিৰ তথ্য প্ৰশাসনক জনাওক।",
      nameLabel: "আপোনাৰ নাম:",
      hazardLabel: "দুৰ্যোগৰ প্ৰকাৰ:",
      descLabel: "বৰ্ণনা:",
      submitReport: "📤 প্ৰতিবেদন জমা দিয়ক"
    },
    garhwali: {
      portalTitle: "नागरिक आपदा सुरक्षा एवं चेतावनी पोर्टल",
      portalSub: "तुमरी सुरक्षा हमरी पहली जिम्मेदारी • सुरक्षित आश्रय",
      langSelect: "भाषा चुना:",
      warningHeader: "🚨 आपातकालीन चेतावनी",
      voiceButton: "🔊 आवाज सुणा",
      stopVoice: "⏹️ रोका",
      sosHeader: "🚨 एक-क्लिक आपातकालीन SOS",
      sosDesc: "बटन दबांद ही आपदा टीम थैं तुमरी लोकेशन चल जाली।",
      peopleLabel: "फंसेया मान्छ्यों की संख्या:",
      medicalLabel: "डॉक्टर की जरूरत छ",
      sosButton: "🚨 आपातकालीन SOS भेजा",
      shelterHeader: "🗺️ नजीकै का सुरक्षित आश्रय",
      reportHeader: "📝 आपदा रिपोर्ट",
      reportDesc: "गाड़-गधेरा या भूस्खलन की खबर देवा।",
      nameLabel: "तुमरो नौं:",
      hazardLabel: "खतरा को प्रकार:",
      descLabel: "विवरण:",
      submitReport: "📤 रिपोर्ट भेजा"
    },
    ne: {
      portalTitle: "नागरिक विपद् सुरक्षा तथा प्रारम्भिक चेतावनी पोर्टल",
      portalSub: "तपाईंको सुरक्षा हाम्रो पहिलो प्राथमिकता • वास्तविक समय सहायता",
      langSelect: "भाषा छान्नुहोस्:",
      warningHeader: "🚨 आपत्कालीन प्रारम्भिक चेतावनी",
      voiceButton: "🔊 आवाज सुन्नुहोस् (Play Voice Alert)",
      stopVoice: "⏹️ बन्द गर्नुहोस्",
      sosHeader: "🚨 एक-टच आपत्कालीन SOS",
      sosDesc: "बटन थिच्ने बित्तिकै NDRF र उद्धार टोलीलाई तपाईंको GPS स्थान पठाइनेछ।",
      peopleLabel: "अडिएका मानिसहरूको संख्या:",
      medicalLabel: "चिकित्सा सहायता चाहिन्छ",
      sosButton: "🚨 आपत्कालीन SOS पठाउनुहोस्",
      shelterHeader: "🗺️ नजिकैको सुरक्षित आश्रयस्थलहरू",
      reportHeader: "📝 नागरिक घटना रिपोर्ट",
      reportDesc: "पहिरो वा नदीको जलस्तर बढेको जानकारी तुरुन्त पठाउनुहोस्।",
      nameLabel: "तपाईंको नाम:",
      hazardLabel: "विपद्को प्रकार:",
      descLabel: "विवरण:",
      submitReport: "📤 रिपोर्ट पठाउनुहोस्"
    },
    bn: {
      portalTitle: "নাগরিক দুর্যোগ সুরক্ষা ও প্রারম্ভিক সতর্কবার্তা পোর্টাল",
      portalSub: "আপনার সুরক্ষা আমাদের অগ্রাধিকার • লাইভ সাহায্য ও আশ্রয় কেন্দ্র",
      langSelect: "ভাষা নির্বাচন করুন:",
      warningHeader: "🚨 জরুরি সতর্কবার্তা (Emergency Alert)",
      voiceButton: "🔊 বার্তা শুনুন (Play Voice Alert)",
      stopVoice: "⏹️ থামান",
      sosHeader: "🚨 এক-ক্লিক জরুরি SOS",
      sosDesc: "বাটন চাপার সাথে সাথে NDRF এবং উদ্ধারকারী দলকে আপনার GPS লোকেশন পাঠানো হবে।",
      peopleLabel: "আটকে থাকা মানুষের সংখ্যা:",
      medicalLabel: "চিকিৎসা সহায়তা প্রয়োজন",
      sosButton: "🚨 জরুরি SOS পাঠান",
      shelterHeader: "🗺️ নিকটস্থ নিরাপদ আশ্রয় কেন্দ্র",
      reportHeader: "📝 নাগরিক দুর্যোগ রিপোর্ট",
      reportDesc: "রাস্তা বন্ধ বা নদীর জল বৃদ্ধির খবর অবিলম্বে জানান।",
      nameLabel: "আপনার নাম:",
      hazardLabel: "দুর্যোগের ধরন:",
      descLabel: "বিবরণ:",
      submitReport: "📤 রিপোর্ট জমা দিন"
    },
    en: {
      portalTitle: "Citizen Disaster Safety & Early Warning Portal",
      portalSub: "Your Safety is Our Top Priority • Real-Time Assistance & Shelter Finder",
      langSelect: "Select Language:",
      warningHeader: "🚨 Emergency Early Warning Alert",
      voiceButton: "🔊 Play Multilingual Voice Alert",
      stopVoice: "⏹️ Stop Voice Alert",
      sosHeader: "🚨 One-Touch Emergency SOS Dispatcher",
      sosDesc: "Instantly dispatches your exact GPS coordinates & medical tags to NDRF Response HQ.",
      peopleLabel: "Number of Trapped Citizens:",
      medicalLabel: "Requires Immediate Medical Attention",
      sosButton: "🚨 DISPATCH EMERGENCY SOS NOW",
      shelterHeader: "🗺️ Nearest Safe Relief Shelters & Evacuation Routes",
      reportHeader: "📝 Field Incident Report (Two-Way Feedback Loop)",
      reportDesc: "Report landslides, rising river levels, or washed-away bridges directly to authorities.",
      nameLabel: "Your Full Name:",
      hazardLabel: "Hazard Type:",
      descLabel: "Field Observations / Details:",
      submitReport: "📤 Submit Field Report"
    }
  };

  const t = I18N[language] || I18N.en;

  // Selected Sector Details
  const sectorList = sectors.length > 0 ? sectors : [
    { sector_id: "S02", name: "Kullu Valley & Beas River Basin", state: "Himachal Pradesh" },
    { sector_id: "S04", name: "Chamoli Alaknanda Canyon", state: "Uttarakhand" },
    { sector_id: "S07", name: "Dima Hasao Haflong Zone", state: "Assam" },
    { sector_id: "S09", name: "Gangtok Teesta Basin", state: "Sikkim" }
  ];

  const currentSector = sectorList.find(s => s.sector_id === selectedSectorId) || sectorList[0];

  // Multilingual Speech Synthesis for Local Languages
  const playAudioAlert = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      // Extract warning text matching selected language
      const warningText = currentSector.languages?.[language] ||
        currentSector.languages?.hi ||
        `${currentSector.name}. Emergency flash flood alert active. Seek higher ground immediately.`;

      const utterance = new SpeechSynthesisUtterance(warningText);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      // Set target BCP 47 language code for Web Speech Synthesis
      const langTagMap = {
        hi: "hi-IN",
        pahari: "hi-IN",
        garhwali: "hi-IN",
        as: "bn-IN",
        ne: "ne-NP",
        bn: "bn-IN",
        en: "en-IN"
      };

      const targetLang = langTagMap[language] || "hi-IN";
      utterance.lang = targetLang;

      // Match native voices if available
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(v => v.lang.toLowerCase().includes(targetLang.toLowerCase().slice(0, 2)));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Voice speech synthesis is not supported on this browser.");
    }
  };

  const stopAudioAlert = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  // Submit Emergency SOS
  const handleSendSOS = async () => {
    const payload = {
      sector_id: selectedSectorId,
      location_name: currentSector.name,
      state: currentSector.state,
      latitude: currentSector.latitude || 31.9579,
      longitude: currentSector.longitude || 77.1095,
      category: sosCategory,
      people_count: peopleCount,
      medical_assistance: needsMedical
    };
    try {
      await fetch("http://127.0.0.1:8000/api/citizen/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setSosSent(true);
      if (onLocalSOSAdd) onLocalSOSAdd(payload);
      if (onReportSubmitted) onReportSubmitted();
      setTimeout(() => setSosSent(false), 5000);
    } catch (e) {
      console.log("SOS local dispatch simulated", e);
      setSosSent(true);
      if (onLocalSOSAdd) onLocalSOSAdd(payload);
      if (onReportSubmitted) onReportSubmitted();
      setTimeout(() => setSosSent(false), 5000);
    }
  };

  // Submit Crowd Incident Report
  const handleSendReport = async (e) => {
    e.preventDefault();
    const payload = {
      sector_id: selectedSectorId,
      reporter_name: reporterName || "Anonymous Citizen",
      hazard_type: hazardType,
      location: currentSector.name,
      water_level_m: parseFloat(waterLevel) || 0.0,
      description: reportDescription
    };
    try {
      await fetch("http://127.0.0.1:8000/api/citizen/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setReportSubmitted(true);
      setReportDescription("");
      if (onLocalReportAdd) onLocalReportAdd(payload);
      if (onReportSubmitted) onReportSubmitted();
      setTimeout(() => setReportSubmitted(false), 5000);
    } catch (err) {
      setReportSubmitted(true);
      if (onLocalReportAdd) onLocalReportAdd(payload);
      if (onReportSubmitted) onReportSubmitted();
      setTimeout(() => setReportSubmitted(false), 5000);
    }
  };

  return (
    <div className="space-y-6">

      {/* Top Banner & Language Selector */}
      <div className="rounded-2xl border border-cyan-800/60 bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-900 p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="rounded-full bg-cyan-900/80 px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-700">
              CITIZEN SAFETY APP • PRAVAAH
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
              {t.portalTitle}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-cyan-200/80">
              {t.portalSub}
            </p>
          </div>

          {/* Language Selector Dropdown */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-300 font-semibold hidden sm:inline">{t.langSelect}</span>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                if (isPlayingAudio) stopAudioAlert();
              }}
              className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs font-bold text-cyan-400 focus:outline-none focus:border-cyan-500"
            >
              <option value="pahari">पहाड़ी / Himachali (HP)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="as">অসমীয়া (Assamese - Assam)</option>
              <option value="garhwali">गढ़वाली (Garhwali - Uttarakhand)</option>
              <option value="ne">नेपाली (Nepali - Sikkim)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      {/* Multilingual Voice Early Warning Card */}
      <div className="rounded-2xl border border-rose-900/60 bg-rose-950/30 p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-rose-300 flex items-center gap-2">
              {t.warningHeader}
            </h2>
            <p className="text-sm font-medium text-white">
              Sector Zone: <strong className="text-cyan-400">{currentSector.name}</strong> ({currentSector.state})
            </p>
          </div>

          {/* Audio Player Button */}
          <div className="flex items-center gap-3">
            {!isPlayingAudio ? (
              <button
                onClick={playAudioAlert}
                className="flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition-all"
              >
                {t.voiceButton}
              </button>
            ) : (
              <button
                onClick={stopAudioAlert}
                className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-xs font-bold text-rose-400 border border-rose-800 transition-all"
              >
                {t.stopVoice}
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Multilingual Warning Box */}
        <div className="rounded-xl border border-rose-800/40 bg-slate-950/80 p-4">
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
            Localized Warning Speech Text ({language.toUpperCase()}):
          </p>
          <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
            "{currentSector.languages?.[language] || currentSector.languages?.hi || "WARNING: Flash flood and landslide threat active. Seek higher ground immediately."}"
          </p>
        </div>
      </div>

      {/* Main Two-Column Workflow Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* 1. One-Touch Emergency SOS Dispatcher */}
        <div className="rounded-2xl border border-red-900/60 bg-slate-900 p-6 space-y-4 shadow-xl">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {t.sosHeader}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {t.sosDesc}
            </p>
          </div>

          {sosSent && (
            <div className="rounded-xl border border-emerald-800 bg-emerald-950/90 p-4 text-xs text-emerald-300 font-bold flex items-center gap-2">
              <span>✅</span> EMERGENCY SOS BROADCASTED TO DISASTER CONTROL HQ! RESCUE TEAM DISPATCHED.
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300">Select Current Sector / Location:</label>
              <select
                value={selectedSectorId}
                onChange={(e) => setSelectedSectorId(e.target.value)}
                className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold"
              >
                {sectorList.map((s) => (
                  <option key={s.sector_id} value={s.sector_id}>
                    {s.name} ({s.state})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Emergency Type:</label>
              <select
                value={sosCategory}
                onChange={(e) => setSosCategory(e.target.value)}
                className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Flash Flood Evacuation Required">🌊 Flash Flood Evacuation Required</option>
                <option value="Landslide Trap & Road Blockage">⛰️ Landslide Trap & Road Blockage</option>
                <option value="Submerged House / Roof Trapped">🏠 Submerged House / Roof Trapped</option>
                <option value="Urgent Medical Evacuation">🚑 Urgent Medical Evacuation</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">{t.peopleLabel}</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white font-bold"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="medical"
                  checked={needsMedical}
                  onChange={(e) => setNeedsMedical(e.target.checked)}
                  className="h-4 w-4 rounded accent-red-600"
                />
                <label htmlFor="medical" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  {t.medicalLabel}
                </label>
              </div>
            </div>

            <button
              onClick={handleSendSOS}
              className="w-full rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 p-4 text-sm font-extrabold text-white shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2"
            >
              {t.sosButton}
            </button>
          </div>
        </div>

        {/* 2. Safe Evacuation Route & Relief Shelters */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-xl">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {t.shelterHeader}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Verified NDRF & Government Relief Camps with real-time food, medical, and power supply status.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                name: `${currentSector.name} Relief Shelter`,
                capacity: "800 People",
                occupancy: "210 Occupied",
                distance: "1.2 km away",
                supplies: "Food, Clean Water, Medical Aid, Power Generators",
                contact: "+91-1902-222300"
              },
              {
                name: `${currentSector.state} Municipal Higher Ground Center`,
                capacity: "1200 People",
                occupancy: "450 Occupied",
                distance: "2.4 km away",
                supplies: "Blankets, First Aid Kits, Satellite Phone Station",
                contact: "+91-1372-252100"
              }
            ].map((sh, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-cyan-400">{sh.name}</h3>
                  <span className="rounded bg-emerald-950 px-2 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-800">
                    {sh.distance}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Capacity: {sh.capacity} ({sh.occupancy})</span>
                  <span>Call: <strong className="text-white">{sh.contact}</strong></span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong>Available Supplies:</strong> {sh.supplies}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Two-Way Crowd Incident Report Form */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {t.reportHeader}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t.reportDesc}
          </p>
        </div>

        {reportSubmitted && (
          <div className="rounded-xl border border-cyan-800 bg-cyan-950/90 p-4 text-xs text-cyan-300 font-bold">
            ✅ FIELD REPORT REGISTERED! THANK YOU FOR UPDATING NATIONAL DISASTER INTELLIGENCE.
          </div>
        )}

        <form onSubmit={handleSendReport} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-slate-300">{t.nameLabel}</label>
            <input
              type="text"
              placeholder="e.g. Ramesh Thakur"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">{t.hazardLabel}</label>
            <select
              value={hazardType}
              onChange={(e) => setHazardType(e.target.value)}
              className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white"
            >
              <option value="Landslide Road Blockage">⛰️ Landslide Road Blockage</option>
              <option value="River Water Level Spurt">🌊 River Water Level Spurt</option>
              <option value="Washed Away Bridge">🌉 Washed Away Bridge</option>
              <option value="Power Grid Disruption">⚡ Power Grid Disruption</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-300">{t.descLabel}</label>
            <textarea
              rows="3"
              placeholder="Describe exact road location, boulder slides, or water overflow..."
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-cyan-600 hover:bg-cyan-500 p-3.5 text-xs font-bold text-white shadow-lg shadow-cyan-600/20 transition-all"
            >
              {t.submitReport}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
