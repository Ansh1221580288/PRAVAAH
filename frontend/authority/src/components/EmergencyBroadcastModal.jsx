import { useState, useEffect } from "react";

// Localized Speech Translation Dictionary for Emergency Broadcast Alerts
const BROADCAST_I18N = {
  hi: {
    header: "🚨 अधिकारी आपातकालीन प्रसारित चेतावनी",
    subHeader: "राज्य आपदा संचालन केंद्र (SDOC) द्वारा जारी",
    readingStatus: "🔊 आवाज चेतावनी पढ़ी जा रही है... कृपया संदेश पूरा होने तक प्रतीक्षा करें।",
    readComplete: "✅ आवाज चेतावनी पूरी हुई — [ ✕ स्वीकार करें और बंद करें ]",
    readingProgress: "🔒 आवाज चेतावनी पढ़ी जा रही है (सुरक्षा नियम: संदेश पूरा होने तक बंद नहीं किया जा सकता)"
  },
  as: {
    header: "🚨 কৰ্তৃপক্ষৰ জৰুৰীকালীন প্ৰচাৰ সতৰ্কবাণী",
    subHeader: "ৰাজ্যিক দুৰ্যোগ পৰিচালনা কেন্দ্ৰ (SDOC) দ্বাৰা জাৰি",
    readingStatus: "🔊 বাৰ্তাটি কণ্ঠস্বৰেৰে পঢ়ি থকা হৈছে... অনুগ্ৰহ কৰি শেষ নোহোৱালৈ অপেক্ষা কৰক।",
    readComplete: "✅ বাৰ্তা পঢ়া সম্পূৰ্ণ হ'ল — [ ✕ গ্ৰহণ কৰক আৰু বন্ধ কৰক ]",
    readingProgress: "🔒 অডিঅ' পঢ়ি থকা হৈছে (সুৰক্ষা নীতি: বাৰ্তা শেষ নোহোৱালৈ বন্ধ কৰিব নোৱাৰি)"
  },
  bn: {
    header: "🚨 কর্তৃপক্ষের জরুরি সম্প্রচার সতর্কবার্তা",
    subHeader: "রাজ্য দুর্যোগ মোকাবিলা কেন্দ্র (SDOC) কর্তৃক জারি",
    readingStatus: "🔊 জরুরি বার্তাটি কণ্ঠে পড়া হচ্ছে... বার্তা সম্পূর্ণ হওয়া পর্যন্ত অপেক্ষা করুন।",
    readComplete: "✅ কণ্ঠস্বরে বার্তা পাঠ সম্পন্ন — [ ✕ স্বীকার করুন ও বন্ধ করুন ]",
    readingProgress: "🔒 অডিও সতর্কবার্তা পড়া হচ্ছে (সুরক্ষা নিয়ম: শেষ না হওয়া পর্যন্ত বন্ধ করা যাবে না)"
  },
  pahari: {
    header: "🚨 अधिकारी आपातकालीन चेतावनी",
    subHeader: "आपदा ऑपरेशन सेंटर द्वारा जारी",
    readingStatus: "🔊 अवाज़ चेतावनी सुणाई जांदी है... कृपया संदेश पूरा होने तक रुआ।",
    readComplete: "✅ अवाज़ चेतावनी पूरी हुई — [ ✕ स्वीकार करा ते बंद करा ]",
    readingProgress: "🔒 अवाज़ चेतावनी सुणाई जांदी है (सुरक्षा नियम: संदेश पूरा होने तक बंद नी हुंदा)"
  },
  garhwali: {
    header: "🚨 अधिकारी आपातकालीन चेतावनी",
    subHeader: "आपदा कंट्रोल रूम द्वारा जारी",
    readingStatus: "🔊 आवाज चेतावनी सुणाई जांणी छ... संदेश पूरा होणा तक रोका।",
    readComplete: "✅ आवाज चेतावनी पूरी हुई — [ ✕ स्वीकार करा अर बंद करा ]",
    readingProgress: "🔒 आवाज चेतावनी सुणाई जांणी छ (सुरक्षा नियम: संदेश पूरा होणा तक बंद न्हैं होंदु)"
  },
  ne: {
    header: "🚨 अधिकारी आपत्कालीन प्रसारण चेतावनी",
    subHeader: "राज्य विपद् सञ्चालन केन्द्र (SDOC) द्वारा जारी",
    readingStatus: "🔊 आवाज चेतावनी पढिँदैछ... कृपया सन्देश पूरा नभएसम्म पर्खनुहोस्।",
    readComplete: "✅ आवाज चेतावनी पूरा भयो — [ ✕ स्वीकार गर्नुहोस् र बन्द गर्नुहोस् ]",
    readingProgress: "🔒 आवाज चेतावनी पढिँदैछ (सुरक्षा नियम: सन्देश पूरा नभएसम्म बन्द गर्न मिल्दैन)"
  },
  en: {
    header: "🚨 OFFICIAL AUTHORITY EMERGENCY BROADCAST",
    subHeader: "Issued by State Disaster Operations Center (SDOC)",
    readingStatus: "🔊 Voice alert reading in progress... Please listen until audio completes.",
    readComplete: "✅ Voice alert completed — [ ✕ ACKNOWLEDGE & DISMISS ]",
    readingProgress: "🔒 VOICE ALERT READING IN PROGRESS (Mandatory Safety Rule: Modal locked until speech completes)"
  }
};

const BROADCAST_VOICE_TRANSLATIONS = {
  hi: {
    header: "आपातकालीन प्रसारित चेतावनी!",
    defaultTitle: "हाई रिज बाढ़ निकासी अलर्ट",
    defaultMsg: "आपदा संचालन केंद्र द्वारा जारी सूचना: ब्यास एवं अलकनंदा नदियों का जलस्तर 4.5 मीटर के खतरे के निशान से ऊपर पहुंच गया है। निचले क्षेत्र के नागरिक तुरंत निकटतम हाई रिज राहत शिविर में जाएं।",
    noticeLabel: "आवाज बोली (Hindi):"
  },
  as: {
    header: "জৰুৰীকালীন প্ৰচাৰ সতৰ্কবাণী!",
    defaultTitle: "উচ্চ পাহাৰীয়া জৰুৰী খালীকৰণ সতৰ্কবাণী",
    defaultMsg: "ৰাজ্যিক দুৰ্যোগ পৰিচালনা কেন্দ্ৰৰ জৰুৰীকালীন বাৰ্তা: বীন আৰু অলকানন্দা নদীৰ পানী ৪.৫ মিটাৰ বিপদসীমাৰ ওপৰলৈ বৃদ্ধি পাইছে। উপত্যকাৰ তলৰ পথত থকা সকলো নাগৰিকক লগে লগে সুৰক্ষিত আশ্ৰয় শিবিৰলৈ যাবলৈ অনুৰোধ জনোৱা হৈছে।",
    noticeLabel: "বাৰ্তাৰ ভাষা (Assamese):"
  },
  bn: {
    header: "জরুরি সম্প্রচার সতর্কবার্তা!",
    defaultTitle: "উচ্চ পাহাড়ি জরুরি স্থানান্তর সতর্কবার্তা",
    defaultMsg: "রাজ্য দুর্যোগ মোকাবিলা কেন্দ্রের জরুরি বার্তা: বিয়াস এবং অলকানন্দা নদীর জলস্তর ৪.৫ মিটার বিপদসীমার উপরে চলে গেছে। নীচের উপত্যকার সব নাগরিক অবিলম্বে নিকটস্থ নিরাপদ আশ্রয় কেন্দ্রে যান।",
    noticeLabel: "বার্তার ভাষা (Bengali):"
  },
  pahari: {
    header: "आपत्कालीन चेतावनी!",
    defaultTitle: "आपदा निकासी चेतावनी",
    defaultMsg: "आपदा कंट्रोल रूम री सूचना: ब्यास ते अलकनंदा खड्डा रा पाणी 4.5 मीटर खतरे भन्दा ऊपर चला गया। तल्ली घाटी रे सब माणस हूण सुरक्षित उच्छी ठां रे राहत कैंप च पुज्जा।",
    noticeLabel: "बोली (Pahari):"
  },
  garhwali: {
    header: "आपातकालीन चेतावनी!",
    defaultTitle: "आपदा निकासी चेतावनी",
    defaultMsg: "आपदा कंट्रोल रूम की सूचना: अलकनंदा अर ब्यास नदी को पाणी 4.5 मीटर का खतरा का निशान से ऊपर चलिग्या। तल्ली घाटी का लोग तुरंत नजीकै का सुरक्षित राहत कैंप मा जांवा।",
    noticeLabel: "बोली (Garhwali):"
  },
  ne: {
    header: "आपत्कालीन प्रसारण चेतावनी!",
    defaultTitle: "आपत्कालीन उद्धार चेतावनी",
    defaultMsg: "राज्य विपद् सञ्चालन केन्द्रको आपत्कालीन सूचना: व्यास र अलकनन्द नदीको जलस्तर ४.५ मिटरको खतराको चिन्हभन्दा माथि गएको छ। तल्लो क्षेत्रका मानिसहरू तुरुन्तै नजिकैको सुरक्षित राहत शिविरमा जानुहोस्।",
    noticeLabel: "भाषा (Nepali):"
  },
  en: {
    header: "OFFICIAL EMERGENCY BROADCAST!",
    defaultTitle: "HIGH RIDGE FLASH FLOOD EVACUATION ALERT",
    defaultMsg: "State Disaster Operations Center message: Beas & Alaknanda rivers have breached emergency 4.5m surge level. Citizens in lower highway corridors must immediately move to nearest High Ridge Relief Shelter!",
    noticeLabel: "Language (English):"
  }
};

export default function EmergencyBroadcastModal({ broadcast, language = "hi", onClose }) {
  const [isVoiceReading, setIsVoiceReading] = useState(true);
  const [speechProgress, setSpeechProgress] = useState(0);

  const tModal = BROADCAST_I18N[language] || BROADCAST_I18N.en;
  const vTrans = BROADCAST_VOICE_TRANSLATIONS[language] || BROADCAST_VOICE_TRANSLATIONS.en;

  // Auto-play speech synthesis on mount and lock close button until completion
  useEffect(() => {
    if (!broadcast) return;
    setIsVoiceReading(true);

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      // Check if default broadcast message or custom text
      const msgLower = (broadcast.message || "").toLowerCase();
      const isDefaultAlert = !broadcast.message || msgLower.includes("beas") || msgLower.includes("breached") || msgLower.includes("surge") || msgLower.includes("evacuate");

      const speechText = isDefaultAlert
        ? `${vTrans.header} ${vTrans.defaultTitle}. ${vTrans.defaultMsg}`
        : `${vTrans.header} ${broadcast.title || ""}. ${broadcast.message || ""}`;

      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      // Select target BCP 47 language tag
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

      const voices = window.speechSynthesis.getVoices();
      const langPrefix = targetLang.slice(0, 2).toLowerCase();
      const matchingVoice = voices.find(v => v.lang.toLowerCase().startsWith(langPrefix)) ||
        voices.find(v => v.lang.toLowerCase().includes("in"));

      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onend = () => {
        setIsVoiceReading(false);
        setSpeechProgress(100);
      };

      utterance.onerror = () => {
        setIsVoiceReading(false);
        setSpeechProgress(100);
      };

      // Progress animation fallback
      const interval = setInterval(() => {
        setSpeechProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + 5;
        });
      }, 500);

      window.speechSynthesis.speak(utterance);

      return () => {
        clearInterval(interval);
        window.speechSynthesis.cancel();
      };
    } else {
      setIsVoiceReading(false);
    }
  }, [broadcast, language]);

  if (!broadcast) return null;

  const msgLower = (broadcast.message || "").toLowerCase();
  const isDefaultAlert = !broadcast.message || msgLower.includes("beas") || msgLower.includes("breached") || msgLower.includes("surge") || msgLower.includes("evacuate");
  const displayTitle = isDefaultAlert ? vTrans.defaultTitle : broadcast.title;
  const displayMsg = isDefaultAlert ? vTrans.defaultMsg : broadcast.message;

  return (
    <div className="fixed inset-0 z-[8000] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-lg">
      <div className="max-w-xl w-full rounded-2xl border-4 border-red-600 bg-white p-6 shadow-2xl space-y-5 animate-pulse-subtle">
        
        {/* Header & Siren */}
        <div className="flex items-center justify-between border-b-2 border-red-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-red-600 flex items-center justify-center text-xl font-black animate-bounce shadow-lg shadow-red-600/40 text-white">
              📢
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-red-600 uppercase tracking-wide">
                {tModal.header}
              </h2>
              <p className="text-[11px] text-slate-500 font-bold">
                {tModal.subHeader} • {broadcast.timestamp ? new Date(broadcast.timestamp).toLocaleTimeString() : "Live"}
              </p>
            </div>
          </div>

          <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white shadow uppercase border border-red-400">
            {broadcast.severity || "CRITICAL"}
          </span>
        </div>

        {/* Broadcast Content Localized in User Selected Language */}
        <div className="rounded-xl border-2 border-red-200 bg-red-50/60 p-5 space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-[11px] text-blue-900 font-black border-b border-red-200 pb-1">
            <span>{vTrans.noticeLabel}</span>
            <span className="uppercase font-mono bg-blue-900 text-white px-2 py-0.5 rounded border border-blue-700">{language}</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
            {displayTitle}
          </h3>
          <p className="text-xs sm:text-base font-bold text-slate-800 leading-relaxed">
            "{displayMsg}"
          </p>
        </div>

        {/* Live Voice Status Indicator & Reading Lock Notice */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-2 text-white">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className={isVoiceReading ? "text-amber-400 flex items-center gap-2" : "text-emerald-400 flex items-center gap-2"}>
              <span className={isVoiceReading ? "animate-spin" : ""}>{isVoiceReading ? "🔊" : "✅"}</span>
              <span>{isVoiceReading ? tModal.readingStatus : tModal.readComplete}</span>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              {isVoiceReading ? `${speechProgress}%` : "100% READ"}
            </span>
          </div>

          {/* Reading Progress Bar */}
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isVoiceReading ? "bg-red-500 animate-pulse" : "bg-emerald-500"
              }`}
              style={{ width: `${isVoiceReading ? speechProgress : 100}%` }}
            ></div>
          </div>
        </div>

        {/* Locked Close Button (Disabled until voice finishes) */}
        <div className="pt-2">
          <button
            onClick={onClose}
            disabled={isVoiceReading}
            className={`w-full rounded-xl p-4 text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 shadow-xl ${
              isVoiceReading
                ? "bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-80"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400 transform active:scale-95 shadow-emerald-600/30"
            }`}
          >
            <span>{isVoiceReading ? "🔒" : "✅"}</span>
            <span>{isVoiceReading ? tModal.readingProgress : tModal.readComplete}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
