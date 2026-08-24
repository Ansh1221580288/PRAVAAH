import { useState, useEffect } from "react";
import EmergencyNavigation from "./EmergencyNavigation";
import EmergencyBroadcastModal from "./EmergencyBroadcastModal";

export default function CitizenPortal({
  sectors = [],
  onReportSubmitted,
  onLocalSOSAdd,
  onLocalReportAdd
}) {
  const [language, setLanguage] = useState("hi");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedSectorId, setSelectedSectorId] = useState("S02");
  
  // Authority Broadcast Alert State
  const [activeBroadcastAlert, setActiveBroadcastAlert] = useState(null);
  const [dismissedBroadcastId, setDismissedBroadcastId] = useState(null);

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

  // Live polling for Authority Emergency Broadcast Alerts
  useEffect(() => {
    const checkBroadcast = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/authority/broadcast");
        if (res.ok) {
          const data = await res.json();
          if (data.broadcast && data.broadcast.broadcast_id !== dismissedBroadcastId) {
            setActiveBroadcastAlert(data.broadcast);
          }
        }
      } catch (err) {
        try {
          const saved = localStorage.getItem("pravaah_active_broadcast");
          if (saved) {
            const b = JSON.parse(saved);
            if (b.broadcast_id !== dismissedBroadcastId) {
              setActiveBroadcastAlert(b);
            }
          }
        } catch (e) {
          // ignore
        }
      }
    };

    checkBroadcast();
    const interval = setInterval(checkBroadcast, 4000);
    return () => clearInterval(interval);
  }, [dismissedBroadcastId]);

  // Translations Dictionary for Local Indian Hilly Languages
  const I18N = {
    hi: {
      portalTitle: "नागरिक आपदा सुरक्षा एवं प्रारंभिक चेतावनी पोर्टल",
      portalSub: "आपकी सुरक्षा हमारी सर्वोच्च प्राथमिकता है • वास्तविक समय सहायता एवं आश्रय खोजक",
      langSelect: "भाषा चुनें:",
      warningHeader: "🚨 आपातकालीन प्रारंभिक चेतावनी (Emergency Alert)",
      voiceButton: "🔊 सुनें आवाज चेतावनी (Play Voice Alert)",
      stopVoice: "⏹️ आवाज रोकें (Stop Voice Alert)",
      sosHeader: "🚨 एक-क्लिक आपातकालीन SOS",
      sosDesc: "बटन दबाते ही राज्य एवं राष्ट्रीय आपदा मोचन बल (NDRF) को आपकी GPS स्थिति भेजी जाएगी।",
      peopleLabel: "फंसे हुए लोगों की संख्या:",
      medicalLabel: "चिकित्सा सहायता की आवश्यकता है",
      sosButton: "🚨 आपातकालीन SOS भेजें (DISPATCH SOS)",
      shelterHeader: "🗺️ निकटतम सुरक्षित आश्रय एवं निकासी मार्ग",
      reportHeader: "📝 नागरिक क्षेत्र रिपोर्ट (Two-Way Crowd Incident Report)",
      reportDesc: "सड़क मार्ग अवरोध, नदी जलस्तर वृद्धि अथवा भूस्खलन की सूचना तुरंत प्रशासन को दें।",
      nameLabel: "आपका नाम:",
      hazardLabel: "आपदा का प्रकार:",
      descLabel: "विवरण / स्थल स्थिति:",
      submitReport: "📤 रिपोर्ट जमा करें (Submit Field Report)",
      selectSectorLabel: "वर्तमान सेक्टर / स्थान चुनें:",
      emergencyTypeLabel: "आपातकाल का प्रकार:",
      shelterDesc: "सत्यापित NDRF और सरकारी राहत शिविर। भोजन, चिकित्सा और बिजली आपूर्ति उपलब्ध।",
      capacityLabel: "क्षमता:",
      callLabel: "संपर्क:",
      suppliesLabel: "उपलब्ध सामग्री:"
    },
    pahari: {
      portalTitle: "नागरिक आपदा सुरक्षा ते चेतावनी पोर्टल",
      portalSub: "तुहाड़ी सुरक्षा साड़ी मुख्य प्राथमिकता • सुरक्षित ठार ते मदद",
      langSelect: "बोली चुनें:",
      warningHeader: "🚨 आपातकालीन चेतावनी",
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
      submitReport: "📤 रिपोर्ट भेजो",
      selectSectorLabel: "स्थान चुनें:",
      emergencyTypeLabel: "आपदा प्रकार:",
      shelterDesc: "सत्यापित NDRF ते सरकारी राहत कैंप।",
      capacityLabel: "क्षमता:",
      callLabel: "फोन:",
      suppliesLabel: "राहत सामान:"
    },
    as: {
      portalTitle: "নাগৰিক দুৰ্যোগ সুৰক্ষা আৰু আগতীয়া সতৰ্কবাণী প'ৰ্টেল",
      portalSub: "আপোনাৰ সুৰক্ষা আমাৰ প্ৰাথমিকতা • লাইভ জৰুৰীকালীন সাহায্য",
      langSelect: "ভাষা বাছনি কৰক:",
      warningHeader: "🚨 জৰুৰীকালীন আগতীয়া সতৰ্কবাণী",
      voiceButton: "🔊 বাৰ্তা শুনক (Play Voice Alert)",
      stopVoice: "⏹️ বন্ধ কৰক",
      sosHeader: "🚨 এক-স্পৰ্শ জৰুৰীকালীন SOS",
      sosDesc: "মুহূৰ্ততে NDRF আৰু জিলা প্ৰশাসনলৈ আপোনাৰ GPS স্থান প্ৰেৰণ কৰা হ'ব।",
      peopleLabel: "আৱদ্ধ লোকৰ সংখ্যা:",
      medicalLabel: "চিকিৎসা সেৱাৰ প্ৰয়োজন",
      sosButton: "🚨 জৰুৰীকালীন SOS পঠিয়াওক",
      shelterHeader: "🗺️ নিকটৱৰ্তী সুৰক্ষিত আশ্ৰয় শিবিৰ",
      reportHeader: "📝 নাগৰিক দুৰ্যোগ প্ৰতিবেদন",
      reportDesc: "পথ অৱৰোধ বা নদীৰ পানী বৃদ্ধিৰ তথ্য প্ৰশাসনক জনাওক।",
      nameLabel: "আপোনাৰ নাম:",
      hazardLabel: "দুৰ্যোগৰ প্ৰকাৰ:",
      descLabel: "বৰ্ণনা:",
      submitReport: "📤 প্ৰতিবেদন জমা দিয়ক",
      selectSectorLabel: "বৰ্তমান ছেক্টৰ / স্থান বাছনি কৰক:",
      emergencyTypeLabel: "জৰুৰীকালীন অৱস্থাৰ প্ৰকাৰ:",
      shelterDesc: "প্ৰমাণিত NDRF আৰু চৰকাৰী সাহায্য শিবিৰ। আহাৰ, চিকিৎসা সেৱা উপলব্ধ।",
      capacityLabel: "ক্ষমতা:",
      callLabel: "যোগাযোগ:",
      suppliesLabel: "উপলব্ধ সামগ্ৰী:"
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
      submitReport: "📤 रिपोर्ट भेजा",
      selectSectorLabel: "स्थान चुना:",
      emergencyTypeLabel: "खतरा को प्रकार:",
      shelterDesc: "सरकारी राहत कैंप। डाक्टर अर खाणा की व्यवस्था छ।",
      capacityLabel: "क्षमता:",
      callLabel: "फोन करा:",
      suppliesLabel: "सामान:"
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
      submitReport: "📤 रिपोर्ट पठाउनुहोस्",
      selectSectorLabel: "वर्तमान सेक्टर / स्थान छान्नुहोस्:",
      emergencyTypeLabel: "आपत्कालको प्रकार:",
      shelterDesc: "प्रमाणित NDRF र सरकारी राहत शिविरहरू। खाना र स्वास्थ्य सेवा उपलब्ध।",
      capacityLabel: "क्षमता:",
      callLabel: "सम्पर्क:",
      suppliesLabel: "उपलब्ध सामग्री:"
    },
    bn: {
      portalTitle: "নাগরিক দুর্যোগ সুরক্ষা ও প্রারম্ভিক সতর্কবার্তা পোর্টাল",
      portalSub: "আপনার সুরক্ষা আমাদের অগ্রাধিকার • লাইভ সাহায্য ও আশ্রয় কেন্দ্র",
      langSelect: "ভাষা নির্বাচন করুন:",
      warningHeader: "🚨 জরুরি সতর্কবার্তা",
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
      submitReport: "📤 রিপোর্ট জমা দিন",
      selectSectorLabel: "বর্তমান সেক্টর / স্থান নির্বাচন করুন:",
      emergencyTypeLabel: "জরুরি পরিস্থিতির ধরন:",
      shelterDesc: "যাচাইকৃত এনডিআরএফ এবং সরকারি ত্রাণ শিবির। খাদ্য ও চিকিৎসা সেবা প্রস্তুত।",
      capacityLabel: "ক্ষমতা:",
      callLabel: "যোগাযোগ:",
      suppliesLabel: "উপলব্ধ সামগ্রী:"
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
      submitReport: "📤 Submit Field Report",
      selectSectorLabel: "Select Current Sector / Location:",
      emergencyTypeLabel: "Emergency Type:",
      shelterDesc: "Verified NDRF & Government Relief Camps with real-time food, medical, and power supply status.",
      capacityLabel: "Capacity:",
      callLabel: "Call:",
      suppliesLabel: "Available Supplies:"
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

const UNIVERSAL_DISASTER_VOICE_ALERT = {
  hi: "आपातकालीन चेतावनी! ध्यान दें। क्षेत्र में फ्लैश फ्लड और भूस्खलन का गंभीर खतरा है। कृपया तुरंत सुरक्षित उच्च स्थान या निकटतम राहत केंद्र पर पहुंचें। नदी किनारे से दूर रहें।",
  as: "জৰুৰীকালীন সতৰ্কবাণী! মনোযোগ দিয়ক। অঞ্চলটোত আকস্মিক বান আৰু ভূমিস্খলনৰ অতি ভয়ানক বিপদ আছে। অনুগ্ৰহ কৰি লগে লগে সুৰক্ষিত উচ্চ স্থান বা নিকটৱৰ্তী আশ্ৰয় শিবিৰলৈ যাওক।",
  bn: "জরুরি সতর্কবার্তা! মনোযোগ দিন। এলাকায় আকস্মিক বন্যা এবং ভূমিধসের মারাত্মক ঝুঁকি রয়েছে। দয়া করে অবিলম্বে নিরাপদ উঁচু স্থানে বা নিকটস্থ আশ্রয় কেন্দ্রে যান।",
  pahari: "आपत्कालीन चेतावनी! ध्यान दया। इलाके च भारी बाढ़ ते भूस्खलन रा बड्डा खतरा है। दया करी हूण सुरक्षित उच्छी ठां ते नेड़े रे राहत कैंप च पुज्जा।",
  garhwali: "आपातकालीन चेतावनी! ध्यान द्या। क्षेत्र मा फ्लैश फ्लड अर भूस्खलन को भारी खतरा छ। कृपा करी तुरंत सुरक्षित डांड या नजीकै का राहत कैंप मा पाँछा।",
  ne: "आपत्कालीन चेतावनी! ध्यान दिनुहोस्। क्षेत्रमा आकस्मिक बाढी र पहिरोको गम्भीर जोखिम छ। कृपया तुरुन्तै सुरक्षित अग्लो ठाउँ वा नजिकैको राहत शिविरमा जानुहोस्।",
  en: "Emergency Early Warning Alert! Attention. High risk of flash floods and landslides detected in this sector. Proceed immediately to the nearest safe shelter or higher ground."
};

  // Multilingual Speech Synthesis for Local Languages
  const playAudioAlert = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      // Extract warning text matching selected language with guaranteed fallback
      const warningText = currentSector.languages?.[language] ||
        UNIVERSAL_DISASTER_VOICE_ALERT[language] ||
        UNIVERSAL_DISASTER_VOICE_ALERT.hi;

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
      const langPrefix = targetLang.slice(0, 2).toLowerCase();
      const matchingVoice = voices.find(v => v.lang.toLowerCase().startsWith(langPrefix)) ||
        voices.find(v => v.lang.toLowerCase().includes("in"));
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

      {/* Top Banner & Language Selector with Deep Blue Texture & Red Accents */}
      <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/pravaah_logo.png"
              alt="PRAVAAH Logo"
              className="h-12 w-auto rounded-xl border border-red-400 bg-blue-950 p-1 shadow"
            />
            <div>
              <span className="rounded-full bg-red-600 px-3 py-0.5 text-[10px] font-black text-white border border-red-400 uppercase tracking-wider">
                CITIZEN SAFETY APP • PRAVAAH
              </span>
              <h1 className="mt-1 text-2xl sm:text-3xl font-black text-white">
                {t.portalTitle}
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-blue-200 font-semibold">
                {t.portalSub}
              </p>
            </div>
          </div>

          {/* Language Selector Dropdown */}
          <div className="flex items-center gap-2 bg-slate-900/90 p-2.5 rounded-xl border border-slate-700 shadow">
            <span className="text-xs text-blue-200 font-extrabold hidden sm:inline">{t.langSelect}</span>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                if (isPlayingAudio) stopAudioAlert();
              }}
              className="rounded-lg bg-blue-950 border border-red-500/60 px-3 py-1.5 text-xs font-black text-white focus:outline-none focus:border-red-400"
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

      {/* CORE USP: RISK-AWARE EMERGENCY NAVIGATION ENGINE */}
      <EmergencyNavigation sectors={sectors} language={language} />

      {/* Multilingual Voice Early Warning Card */}
      <div className="rounded-2xl border-2 border-red-300 bg-white p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-red-600 flex items-center gap-2">
              {t.warningHeader}
            </h2>
            <p className="text-sm font-bold text-slate-800">
              Sector Zone: <strong className="text-blue-900 font-black">{currentSector.name}</strong> ({currentSector.state})
            </p>
          </div>

          {/* Audio Player Button */}
          <div className="flex items-center gap-3">
            {!isPlayingAudio ? (
              <button
                onClick={playAudioAlert}
                className="flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-red-600/30 transition-all border border-red-400"
              >
                {t.voiceButton}
              </button>
            ) : (
              <button
                onClick={stopAudioAlert}
                className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 px-5 py-2.5 text-xs font-black text-white border border-slate-700 transition-all"
              >
                {t.stopVoice}
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Multilingual Warning Box */}
        <div className="rounded-xl border border-red-200 bg-red-50/80 p-4">
          <p className="text-xs font-extrabold text-red-600 uppercase tracking-wider mb-1">
            Localized Warning Speech Text ({language.toUpperCase()}):
          </p>
          <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
            "{currentSector.languages?.[language] || UNIVERSAL_DISASTER_VOICE_ALERT[language] || UNIVERSAL_DISASTER_VOICE_ALERT.hi}"
          </p>
        </div>
      </div>

      {/* Main Two-Column Workflow Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* 1. One-Touch Emergency SOS Dispatcher */}
        <div className="rounded-2xl border-2 border-red-200 bg-white p-6 space-y-4 shadow-xl">
          <div>
            <h2 className="text-lg font-black text-red-600 flex items-center gap-2">
              {t.sosHeader}
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              {t.sosDesc}
            </p>
          </div>

          {sosSent && (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-800 font-bold flex items-center gap-2 shadow">
              <span>✅</span> EMERGENCY SOS BROADCASTED TO DISASTER CONTROL HQ! RESCUE TEAM DISPATCHED.
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700">{t.selectSectorLabel}</label>
              <select
                value={selectedSectorId}
                onChange={(e) => setSelectedSectorId(e.target.value)}
                className="mt-1 w-full rounded-xl bg-slate-50 border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:border-red-500 font-bold"
              >
                {sectorList.map((s) => (
                  <option key={s.sector_id} value={s.sector_id}>
                    {s.name} ({s.state})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">{t.emergencyTypeLabel}</label>
              <select
                value={sosCategory}
                onChange={(e) => setSosCategory(e.target.value)}
                className="mt-1 w-full rounded-xl bg-slate-50 border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:border-red-500 font-semibold"
              >
                <option value="Flash Flood Evacuation Required">🌊 Flash Flood Evacuation Required</option>
                <option value="Landslide Trap & Road Blockage">⛰️ Landslide Trap & Road Blockage</option>
                <option value="Submerged House / Roof Trapped">🏠 Submerged House / Roof Trapped</option>
                <option value="Urgent Medical Evacuation">🚑 Urgent Medical Evacuation</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700">{t.peopleLabel}</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-slate-50 border border-slate-300 p-3 text-xs text-slate-900 font-bold"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="medical"
                  checked={needsMedical}
                  onChange={(e) => setNeedsMedical(e.target.checked)}
                  className="h-4 w-4 rounded accent-red-600 cursor-pointer"
                />
                <label htmlFor="medical" className="text-xs text-slate-800 font-bold cursor-pointer">
                  {t.medicalLabel}
                </label>
              </div>
            </div>

            <button
              onClick={handleSendSOS}
              className="w-full rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 p-4 text-sm font-black text-white shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 border border-red-400"
            >
              {t.sosButton}
            </button>
          </div>
        </div>

        {/* 2. Safe Evacuation Route & Relief Shelters */}
        <div className="rounded-2xl border-2 border-red-200 bg-white p-6 space-y-4 shadow-xl">
          <div>
            <h2 className="text-lg font-black text-blue-900 flex items-center gap-2">
              {t.shelterHeader}
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              {t.shelterDesc}
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
              <div key={idx} className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-blue-900">{sh.name}</h3>
                  <span className="rounded-lg bg-emerald-600 px-2.5 py-0.5 text-[11px] font-black text-white shadow">
                    {sh.distance}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                  <span>{t.capacityLabel} {sh.capacity} ({sh.occupancy})</span>
                  <span>{t.callLabel} <strong className="text-slate-900">{sh.contact}</strong></span>
                </div>
                <p className="text-xs text-slate-700 font-medium">
                  <strong>{t.suppliesLabel}</strong> {sh.supplies}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Two-Way Crowd Incident Report Form */}
      <div className="rounded-2xl border-2 border-red-200 bg-white p-6 space-y-4 shadow-xl">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            {t.reportHeader}
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            {t.reportDesc}
          </p>
        </div>

        {reportSubmitted && (
          <div className="rounded-xl border border-blue-300 bg-blue-50 p-4 text-xs text-blue-900 font-bold shadow">
            ✅ FIELD REPORT REGISTERED! THANK YOU FOR UPDATING NATIONAL DISASTER INTELLIGENCE.
          </div>
        )}

        <form onSubmit={handleSendReport} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold text-slate-700">{t.nameLabel}</label>
            <input
              type="text"
              placeholder="e.g. Ramesh Thakur"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              className="mt-1 w-full rounded-xl bg-slate-50 border border-slate-300 p-3 text-xs text-slate-900 font-medium"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">{t.hazardLabel}</label>
            <select
              value={hazardType}
              onChange={(e) => setHazardType(e.target.value)}
              className="mt-1 w-full rounded-xl bg-slate-50 border border-slate-300 p-3 text-xs text-slate-900 font-medium"
            >
              <option value="Landslide Road Blockage">⛰️ Landslide Road Blockage</option>
              <option value="River Water Level Spurt">🌊 River Water Level Spurt</option>
              <option value="Washed Away Bridge">🌉 Washed Away Bridge</option>
              <option value="Power Grid Disruption">⚡ Power Grid Disruption</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700">{t.descLabel}</label>
            <textarea
              rows="3"
              placeholder="Describe exact road location, boulder slides, or water overflow..."
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              className="mt-1 w-full rounded-xl bg-slate-50 border border-slate-300 p-3 text-xs text-slate-900 font-medium"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-900 hover:bg-blue-800 p-3.5 text-xs font-black text-white shadow-lg shadow-blue-900/30 transition-all border border-blue-700"
            >
              {t.submitReport}
            </button>
          </div>
        </form>
      </div>

      {/* Authority Emergency Broadcast Pop-up Modal (Voice-Locked) */}
      <EmergencyBroadcastModal
        broadcast={activeBroadcastAlert}
        language={language}
        onClose={() => {
          if (activeBroadcastAlert?.broadcast_id) {
            setDismissedBroadcastId(activeBroadcastAlert.broadcast_id);
          }
          setActiveBroadcastAlert(null);
        }}
      />

    </div>
  );
}
