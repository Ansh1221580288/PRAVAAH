import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, CircleMarker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom Leaflet SVG Icons for crisp, zero-dependency map rendering
const createCustomIcon = (color, labelText, emoji) => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="14" fill="${color}" stroke="#ffffff" stroke-width="2.5" />
      <text x="18" y="22" font-size="14" text-anchor="middle" fill="#ffffff">${emoji}</text>
    </svg>
  `;
  return L.icon({
    iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

const userIcon = createCustomIcon("#0284c7", "U", "👤");
const safeCampIcon = createCustomIcon("#16a34a", "C", "🏕️");
const emergencyCenterIcon = createCustomIcon("#ea580c", "E", "🏥");
const hazardPointIcon = createCustomIcon("#dc2626", "H", "⚠️");
const sosPointIcon = createCustomIcon("#ec4899", "S", "🚨");

// Multilingual Dictionary for Emergency Navigation Component
const NAV_I18N = {
  hi: {
    badge: "प्रवाह आपातकालीन सुरक्षा नेविगेटर",
    safetyTag: "सुरक्षा > गति 🛡️",
    title: "आपदा के दौरान सुरक्षित मार्ग नेविगेशन",
    subTitle: "भारतीय पहाड़ी क्षेत्रों में वास्तविक आपदा स्थिति पर आधारित AI-सहायता प्राप्त निकासी नेविगेशन।",
    principleTitle: "राष्ट्रीय आपदा सिद्धांत",
    principleTag: '"सबसे तेज़ मार्ग हमेशा सबसे सुरक्षित नहीं होता।"',
    principleSub: "यात्रा समय की तुलना में सुरक्षा को प्राथमिकता देने के लिए बाढ़, भूस्खलन और जल स्तर का मूल्यांकन करता है।",
    simScenario: "आपातकालीन सिमुलेशन परिदृश्य:",
    simLabel: "सिमुलेटेड आपात स्थिति",
    activeWarningTitle: "सेक्टर S07 में सक्रिय बाढ़ आपात स्थिति",
    activeWarningSub: "प्रवाह ने 3.8 मीटर नदी उछाल और उच्च बाढ़ जोखिम का पता लगाया। निचली घाटी की सड़कें बंद हैं।",
    findSafestCta: "आश्रय के लिए सबसे सुरक्षित मार्ग खोजें",
    currentPosLabel: "वर्तमान उपयोगकर्ता स्थिति:",
    locateMeBtn: "मेरी स्थिति खोजें (लाइव GPS)",
    locateMeDetecting: "सैटेलाइट GPS खोजा जा रहा है...",
    sheltersHeader: "निकटतम नामित सुरक्षित आश्रय और राहत शिविर",
    mapHeader: "आपातकालीन नेविगेशन मानचित्र • सेक्टर S07",
    safestCardTitle: "सर्वश्रेष्ठ सुरक्षित मार्ग अनुशंसा",
    evalHeader: "प्रवाह मूल्यांकन",
    targetShelter: "लक्ष्य निकासी आश्रय:",
    safetyScoreLabel: "कुल सुरक्षा स्कोर",
    travelMetrics: "यात्रा विवरण",
    whyRecHeader: "प्रवाह इस मार्ग की अनुशंसा क्यों करता है:",
    startNavBtn: "अब सुरक्षित नेविगेशन शुरू करें",
    analysisHeader: "मार्ग सुरक्षा विश्लेषण तुलना",
    algoNotice: "सुरक्षा स्कोर एल्गोरिथम: स्कोर = 100 - (बाढ़ जोखिम 35% + भूस्खलन 25% + सड़क अवरोध 20% + जल स्तर 10% + ढलान 10%)",
    navActiveTitle: "प्रवाह सुरक्षित नेविगेशन सक्रिय",
    exitNavBtn: "⏹️ नेविगेशन समाप्त करें",
    routeCName: "मार्ग C — उच्च ऊंचाई रिज बाईपास",
    routeCReason: "मार्ग C की सिफारिश की जाती है क्योंकि इसमें सबसे कम आपदा जोखिम (94/100) है। यह निचले राजमार्ग पर सक्रिय 3.8 मीटर बाढ़ क्षेत्र और भूस्खलन को पूरी तरह से बचाता है। यद्यपि यह 16 मिनट लंबा है, यह आपदा जोखिम को 52% कम करता है।",
    routeBName: "मार्ग B — मध्य-रिज द्वितीयक मार्ग",
    routeBReason: "मुख्य नदी बेसिन से बचता है, लेकिन मध्यम वर्षा जल निकासी और 14° ढलान का अनुभव करता है।",
    routeAName: "मार्ग A — निचली घाटी राजमार्ग (सबसे तेज़)",
    routeAReason: "खतरनाक! 3.8 मीटर गहरे बाढ़ क्षेत्र और 2 भूस्खलन सड़क धंसाव से होकर गुजरता है।"
  },
  as: {
    badge: "প্ৰবাহ জৰুৰীকালীন সুৰক্ষা নেভিগেটৰ",
    safetyTag: "সুৰক্ষা > গতি 🛡️",
    title: "দুৰ্যোগৰ সময়ত সুৰক্ষিত পথ নিৰ্ধাৰণ",
    subTitle: "ভাৰতীয় পাহাৰীয়া অঞ্চলৰ সজীৱ দুৰ্যোগ পৰিস্থিতিৰ ওপৰত আধাৰিত AI-সাহায্যপ্ৰাপ্ত খালীকৰণ পথ।",
    principleTitle: "ৰাষ্ট্ৰীয় দুৰ্যোগ নীতি",
    principleTag: '"আটাইতকৈ দ্ৰুত পথ সদায় সুৰক্ষিত নহয়।"',
    principleSub: "ভ্ৰমণৰ সময়তকৈ সুৰক্ষাক অগ্ৰাধিকাৰ দিবলৈ বানপানী, ভূমিস্খলন আৰু পানীৰ গভীৰতা মূল্যায়ণ কৰে।",
    simScenario: "জৰুৰীকালীন অনুকৰণ পৰিস্থিতি:",
    simLabel: "অনুকৰণ কৰা জৰুৰীকালীন অৱস্থা",
    activeWarningTitle: "ছেক্টৰ S07ত সক্ৰিয় বান জৰুৰীকালীন অৱস্থা",
    activeWarningSub: "প্ৰবাহে ৩.৮ মিটাৰ নদীৰ পানী বৃদ্ধি আৰু উচ্চ বানৰ আশংকা ধৰা পেলাইছে। উপত্যকাৰ তলৰ পথসমূহ বন্ধ।",
    findSafestCta: "আশ্রয় শিবিৰলৈ সুৰক্ষিত পথ বিচাৰক",
    currentPosLabel: "বৰ্তমান ব্যৱহাৰকাৰীৰ অৱস্থান:",
    locateMeBtn: "মোৰ স্থান চিনাক্ত কৰক (GPS)",
    locateMeDetecting: "চেটেলাইট GPS বিচাৰি থকা হৈছে...",
    sheltersHeader: "নিকটৱৰ্তী চিহ্নিত সুৰক্ষিত আশ্ৰয় আৰু সাহায্য শিবিৰ",
    mapHeader: "জৰুৰীকালীন পথ প্ৰদৰ্শন মানচিত্ৰ • ছেক্টৰ S07",
    safestCardTitle: "সৰ্বাধিক সুৰক্ষিত পথৰ পৰামৰ্শ",
    evalHeader: "প্ৰবাহ মূল্যায়ণ",
    targetShelter: "গন্তব্য খালীকৰণ আশ্ৰয় শিবিৰ:",
    safetyScoreLabel: "মুঠ সুৰক্ষা নম্বৰ",
    travelMetrics: "ভ্ৰমণৰ বিৱৰণ",
    whyRecHeader: "প্ৰবাহে এই পথ কিয় পৰামৰ্শ দিয়ে:",
    startNavBtn: "এতিয়াই সুৰক্ষিত পথ প্ৰদৰ্শন আৰম্ভ কৰক",
    analysisHeader: "পথৰ সুৰক্ষা বিশ্লেষণৰ তুলনা",
    algoNotice: "সুৰক্ষা স্কোৰ পদ্ধতি: স্কোৰ = ১০০ - (বানপানীৰ আশংকা ৩৫% + ভূমিস্খলন ২৫% + পথ অৱৰোধ ২০% + পানীৰ স্তৰ ১০% + হালি পৰা ১০%)",
    navActiveTitle: "প্ৰবাহ সুৰক্ষিত নেভিগেচন সক্ৰিয়",
    exitNavBtn: "⏹️ নেভিগেচন বন্ধ কৰক",
    routeCName: "পথ C — উচ্চ পাহাৰীয়া ৰিজ বাইপাছ",
    routeCReason: "আটাইতকৈ কম দুৰ্যোগৰ বিপদ (৯৪/১০০) থকাৰ বাবে পথ C পৰামৰ্শ দিয়া হৈছে, যিয়ে ৩.৮ মিটাৰ বানপানীৰ স্থান আৰু ভূমিস্খলনৰ পথ সম্পূৰ্ণৰূপে এৰাই চলে। যদিও ১৬ মিনিট বেছি সময় লাগে, ই দুৰ্যোগৰ আশংকা ৫২% হ্ৰাস কৰে।",
    routeBName: "পথ B — মধ্য-ৰিজ দ্বিতীয় পথ",
    routeBReason: "মূল নদীৰ অৱবাহিকা এৰাই চলে, কিন্তু মধ্যম বৰষুণৰ পানী নিষ্কাশন আৰু ১৪° ঢালৰ সন্মুখীন হয়।",
    routeAName: "পথ A — তলৰ উপত্যকা ঘাইপথ (আটাইতকৈ দ্ৰুত)",
    routeAReason: "বিপজ্জনক! ৩.৮ মিটাৰ গভীৰ বানপানী এলেকা আৰু ২ টা ভূমিস্খলন পথ ধ্বংসৰ মাজেৰে পাৰ হৈ যায়।"
  },
  pahari: {
    badge: "प्रवाह आपातकालीन सुरक्षा नेविगेटर",
    safetyTag: "सुरक्षा > गति 🛡️",
    title: "आपदा बेला सुरक्षित रास्ता नेविगेशन",
    subTitle: "पहाड़ी इलाकों में वास्तविक आपदा स्थिति पर आधारित AI निकासी नेविगेशन।",
    principleTitle: "राष्ट्रीय आपदा नियम",
    principleTag: '"सभ्भै तेज़ रास्ता हमेशा सुरक्षित नी हुंदा।"' ,
    principleSub: "यात्रा समय भन्दा सुरक्षा री प्राथमिकता दिने तांई बाढ़ ते भूस्खलन रा मूल्यांकन करदा।",
    simScenario: "आपत्कालीन सिमुलेशन:",
    simLabel: "सिमुलेटेड आपात स्थिति",
    activeWarningTitle: "सेक्टर S07 च बाढ़ आपात स्थिति",
    activeWarningSub: "प्रवाह ने 3.8 मीटर खड्ड पाणी ते भारी बाढ़ रा खतरा देख्या। तल्ली घाटी री सड़कां बंद हन।",
    findSafestCta: "सुरक्षित आश्रय तांई सबसे सुरक्षित रास्ता गोहा",
    currentPosLabel: "तुहाड़ी हूण री लोकेशन:",
    locateMeBtn: "मीरी लोकेशन गोहा (GPS)",
    locateMeDetecting: "सैटेलाइट GPS गोहा तांई...",
    sheltersHeader: "नेड़े रे सुरक्षित आश्रय ते राहत कैंप",
    mapHeader: "आपातकालीन नेविगेशन नक्शा • सेक्टर S07",
    safestCardTitle: "सब से सुरक्षित रास्ता री सिफारिश",
    evalHeader: "प्रवाह मूल्यांकन",
    targetShelter: "पुज्जने रा सुरक्षित आश्रय:",
    safetyScoreLabel: "कुल सुरक्षा स्कोर",
    travelMetrics: "यात्रा विवरण",
    whyRecHeader: "प्रवाह इस रास्ता री सिफारिश क्यों करदा:",
    startNavBtn: "हूण सुरक्षित नेविगेशन शुरू करा",
    analysisHeader: "रास्ता री सुरक्षा रा विश्लेषण",
    algoNotice: "सुरक्षा स्कोर सूत्र: स्कोर = 100 - (बाढ़ खतरा 35% + भूस्खलन 25% + रास्ता बंद 20% + पाणी स्तर 10% + ढलान 10%)",
    navActiveTitle: "प्रवाह सुरक्षित नेविगेशन चालू",
    exitNavBtn: "⏹️ नेविगेशन बंद करा",
    routeCName: "रास्ता C — उच्च पहाड़ी रिज बाईपास",
    routeCReason: "रास्ता C री सिफारिश की जांदी क्योंकि इस च सबसे घट आपदा खतरा (94/100) है, जो निचले राजमार्ग पर बाढ़ ते भूस्खलन गी पूरी ढांचा बचांदा।",
    routeBName: "रास्ता B — संझला पहाड़ी रास्ता",
    routeBReason: "मुख्य खड्ड पाणी बचांदा, पर भारी बारिश ते 14° ढलान री दिक्कत है।",
    routeAName: "रास्ता A — तल्ली घाटी रास्ता (सभ्भै तेज़)",
    routeAReason: "खतरनाक! 3.8 मीटर बाढ़ ते भूस्खलन रास्ता च आता।"
  },
  garhwali: {
    badge: "प्रवाह आपातकालीन सुरक्षा नेविगेटर",
    safetyTag: "सुरक्षा > गति 🛡️",
    title: "आपदा का बखत सुरक्षित बाटो",
    subTitle: "पहाड़ी क्षेत्रों मा वास्तविक आपदा स्थिति पर आधारित AI निकासी बाटो।",
    principleTitle: "राष्ट्रीय आपदा नियम",
    principleTag: '"सब्सु तेज़ बाटो हमेशा सुरक्षित न्हैं होंदु।"' ,
    principleSub: "सुरक्षा थैं पहली प्राथमिकता दिण खातिर बाढ अर भूस्खलन का खतरा का आकलन करदु।",
    simScenario: "आपातकालीन सिमुलेशन:",
    simLabel: "सिमुलेटेड आपात स्थिति",
    activeWarningTitle: "सेक्टर S07 मा गंभीर बाढ़ आपात स्थिति",
    activeWarningSub: "प्रवाह न 3.8 मीटर नदी का पाणी की बढ़त अर भारी बाढ़ को खतरा देखि। तल्ली घाटी की सड़क बंद छिन।",
    findSafestCta: "सुरक्षित आश्रय खातिर सब से सुरक्षित बाटो खोजा",
    currentPosLabel: "तुमरी अभी की लोकेशन:",
    locateMeBtn: "हमरी लोकेशन खोजा (GPS)",
    locateMeDetecting: "सैटेलाइट GPS ढूँढणा छां...",
    sheltersHeader: "नजीकै का सुरक्षित आश्रय अर राहत कैंप",
    mapHeader: "आपातकालीन नेविगेशन नक्शा • सेक्टर S07",
    safestCardTitle: "सब से सुरक्षित बाटो की सिफारिश",
    evalHeader: "प्रवाह मूल्यांकन",
    targetShelter: "पहुंचण को सुरक्षित आश्रय:",
    safetyScoreLabel: "कुल सुरक्षा स्कोर",
    travelMetrics: "यात्रा विवरण",
    whyRecHeader: "प्रवाह या बाटो की सिफारिश क्यों करदू:",
    startNavBtn: "अबे सुरक्षित नेविगेशन शुरू करा",
    analysisHeader: "बाटो की सुरक्षा का विश्लेषण",
    algoNotice: "सुरक्षा स्कोर सूत्र: स्कोर = 100 - (बाढ़ खतरा 35% + भूस्खलन 25% + रास्ता बंद 20% + पाणी स्तर 10% + ढलान 10%)",
    navActiveTitle: "प्रवाह सुरक्षित बाटो चालू छ",
    exitNavBtn: "⏹️ बाटो बंद करा",
    routeCName: "बाटो C — ऊंचा डांड का बाईपास",
    routeCReason: "बाटो C की सिफारिश करी जाणी छिन क्योंकि यां मा सब से कम आपदा खतरा (94/100) छिन, जो तल्ली सड़क का बाढ़ अर भूस्खलन थैं बचांदू।",
    routeBName: "बाटो B — बीच को डांड बाटो",
    routeBReason: "गाड़-गधेरा का पाणी थैं बचांदू, पर 14° ढलान छ।",
    routeAName: "बाटो A — तल्ली घाटी सड़क (सब्सु तेज़)",
    routeAReason: "खतरनाक! 3.8 मीटर बाढ़ अर भूस्खलन का रास्ता मा छ।"
  },
  ne: {
    badge: "प्रवाह आपत्कालीन सुरक्षा नेभिगेटर",
    safetyTag: "सुरक्षा > गति 🛡️",
    title: "विपद्को समयमा सुरक्षित मार्ग नेभिगेसन",
    subTitle: "नेपाली/पहाडी क्षेत्रहरूमा वास्तविक आपदा स्थिति आधारित AI सुरक्षित मार्ग।",
    principleTitle: "राष्ट्रिय विपद् सिद्धान्त",
    principleTag: '"सबैभन्दा छिटो मार्ग सधैं सुरक्षित हुँदैन।"',
    principleSub: "यात्रा समयभन्दा सुरक्षालाई प्राथमिकता दिन बाढी, पहिरो र पानीको गहिराइ मूल्याङ्कन गर्दछ।",
    simScenario: "आपत्कालीन सिमुलेशन:",
    simLabel: "सिमुलेटेड आपत्कालीन",
    activeWarningTitle: "सेक्टर S07 मा सक्रिय बाढी आपत्कालीन",
    activeWarningSub: "प्रवाहले ३.८ मिटर नदीको जलस्तर वृद्धि र उच्च बाढीको जोखिम पत्ता लगाएको छ। तल्लो उपत्यकाका सडकहरू बन्द छन्।",
    findSafestCta: "आश्रयस्थलका लागि सबैभन्दा सुरक्षित मार्ग खोज्नुहोस्",
    currentPosLabel: "वर्तमान प्रयोगकर्ता स्थिति:",
    locateMeBtn: "मेरो स्थान पत्ता लगाउनुहोस् (GPS)",
    locateMeDetecting: "स्याटेलाइट GPS खोजिँदैछ...",
    sheltersHeader: "नजिकैका तोकिएका सुरक्षित आश्रयस्थल र राहत शिविरहरू",
    mapHeader: "आपत्कालीन नेभिगेसन मानचित्र • सेक्टर S07",
    safestCardTitle: "सबैभन्दा सुरक्षित मार्ग सिफारिस",
    evalHeader: "प्रवाह मूल्याङ्कन",
    targetShelter: "लक्ष्य खाली गर्ने आश्रयस्थल:",
    safetyScoreLabel: "कुल सुरक्षा स्कोर",
    travelMetrics: "यात्रा तथ्याङ्क",
    whyRecHeader: "प्रवाहले किन यो मार्ग सिफारिस गर्दछ:",
    startNavBtn: "अहिले नै सुरक्षित नेभिगेसन सुरु गर्नुहोस्",
    analysisHeader: "मार्ग सुरक्षा विश्लेषण तुलना",
    algoNotice: "सुरक्षा स्कोर एल्गोरिदम: स्कोर = १०० - (बाढी जोखिम ३५% + पहिरो २५% + सडक अवरोध २०% + जलस्तर १०% + भिरालो १०%)",
    navActiveTitle: "प्रवाह सुरक्षित नेभिगेसन सक्रिय",
    exitNavBtn: "⏹️ नेभिगेसन बन्द गर्नुहोस्",
    routeCName: "मार्ग C — उच्च पहाडी रिज बाइपास",
    routeCReason: "मार्ग C सिफारिस गरिएको छ किनभने यसमा सबैभन्दा कम विपद् जोखिम (९४/१००) छ, जसले ३.८ मिटर बाढी क्षेत्र र पहिरोलाई पूर्ण रूपमा पन्छाउँछ।",
    routeBName: "मार्ग B — मध्य-रिज दोस्रो सडक",
    routeBReason: "मुख्य नदी क्षेत्र बचाउँछ, तर मध्यम वर्षा र १४° भिरालो सडक छ।",
    routeAName: "मार्ग A — तल्लो उपत्यका राजमार्ग (छिटो)",
    routeAReason: "खतरनाक! ३.८ मिटर गहिरो बाढी र पहिरो सडक क्षेत्रबाट जान्छ।"
  },
  bn: {
    badge: "প্রবাহ জরুরি সুরক্ষা নেভিগেটর",
    safetyTag: "সুরক্ষা > গতি 🛡️",
    title: "দুর্যোগের সময় নিরাপদ পথ নির্ধারণ",
    subTitle: "পাহাড়ি অঞ্চলে লাইভ দুর্যোগ পরিস্থিতির উপর ভিত্তি করে AI-সহায়তা প্রাপ্ত নিরাপদ পথ।",
    principleTitle: "জাতীয় দুর্যোগ নীতি",
    principleTag: '"সবচেয়ে দ্রুত পথ সর্বদা নিরাপদ নয়।"' ,
    principleSub: "ভ্রমণের সময়ের চেয়ে সুরক্ষাকে প্রাধান্য দিতে বন্যা, ভূমিধস ও জলের গভীরতা মূল্যায়ন করে।",
    simScenario: "জরুরি সিমুলেশন পরিস্থিতি:",
    simLabel: "সিমুলেটেড জরুরি পরিস্থিতি",
    activeWarningTitle: "সেক্টর S07-এ সক্রিয় বন্যা জরুরি পরিস্থিতি",
    activeWarningSub: "প্রবাহ ৩.৮ মিটার নদীর জল বৃদ্ধি এবং উচ্চ বন্যার ঝুঁকি শনাক্ত করেছে। উপত্যকার নীচের রাস্তাগুলি বন্ধ।",
    findSafestCta: "আশ্রয় কেন্দ্রে যাওয়ার সবচেয়ে নিরাপদ পথ খুঁজুন",
    currentPosLabel: "বর্তমান ব্যবহারকারীর অবস্থান:",
    locateMeBtn: "আমার অবস্থান সনাক্ত করুন (GPS)",
    locateMeDetecting: "স্যাটেলাইট GPS অনুসন্ধান করা হচ্ছে...",
    sheltersHeader: "নিকটস্থ নির্দিষ্ট নিরাপদ আশ্রয় এবং ত্রাণ শিবির",
    mapHeader: "জরুরি নেভিগেশন মানচিত্র • সেক্টর S07",
    safestCardTitle: "সর্বাধিক নিরাপদ পথের সুপারিশ",
    evalHeader: "প্রবাহ মূল্যায়ন",
    targetShelter: "লক্ষ্য স্থানান্তর আশ্রয় কেন্দ্র:",
    safetyScoreLabel: "মোট সুরক্ষা স্কোর",
    travelMetrics: "ভ্রমণ সংক্রান্ত তথ্য",
    whyRecHeader: "প্রবাহ কেন এই পথের সুপারিশ করে:",
    startNavBtn: "এখনই নিরাপদ নেভিগেশন শুরু করুন",
    analysisHeader: "পথের সুরক্ষা বিশ্লেষণ তুলনা",
    algoNotice: "সুরক্ষা স্কোর অ্যালগরিদম: স্কোর = ১০০ - (বন্যা ঝুঁকি ৩৫% + ভূমিধস ২৫% + রাস্তা অবরোধ ২০% + জলের স্তর ১০% + ঢাল ১০%)",
    navActiveTitle: "প্রবাহ নিরাপদ নেভিগেশন সক্রিয়",
    exitNavBtn: "⏹️ নেভিগেশন বন্ধ করুন",
    routeCName: "পথ C — উচ্চ পাহাড়ি রিজ বাইপাস",
    routeCReason: "পথ C সুপারিশ করা হচ্ছে কারণ এটিতে সর্বনিম্ন দুর্যোগের ঝুঁকি (৯৪/১০০) রয়েছে, যা নিম্ন মহাসড়কের ৩.৮ মিটার বন্যা অঞ্চল এবং ভূমিধস সম্পূর্ণরূপে এড়িয়ে চলে।",
    routeBName: "পথ B — মধ্য-রিজ দ্বিতীয় পথ",
    routeBReason: "প্রধান নদীর অববাহিকা এড়িয়ে চলে, তবে মাঝারি বৃষ্টিপাত এবং ১৪° ঢালের সম্মুখীন হয়।",
    routeAName: "পথ A — নীচের উপত্যকা মহাসড়ক (দ্রুততম)",
    routeAReason: "বিপজ্জনক! ৩.৮ মিটার গভীর বন্যা এবং ২টি ভূমিধসের মধ্য দিয়ে গেছে।"
  },
  en: {
    badge: "PRAVAAH EMERGENCY SAFETY NAVIGATOR",
    safetyTag: "SAFETY > SPEED 🛡️",
    title: "SAFE ROUTING DURING DISASTER",
    subTitle: "AI-assisted evacuation navigation based on live hazard conditions in Indian hilly regions.",
    principleTitle: "NATIONAL DISASTER PRINCIPLE",
    principleTag: '"FASTEST IS NOT ALWAYS SAFEST."',
    principleSub: "Evaluates flood, landslide & water depth to prioritize safety over travel time.",
    simScenario: "EMERGENCY SIMULATION SCENARIO:",
    simLabel: "SIMULATED EMERGENCY",
    activeWarningTitle: "ACTIVE FLOOD EMERGENCY IN SECTOR S07",
    activeWarningSub: "PRAVAAH detected 3.8m river surge & high flood risk. Lower valley roads are unpassable.",
    findSafestCta: "FIND SAFEST ROUTE TO SHELTER",
    currentPosLabel: "Current User Position:",
    locateMeBtn: "Locate Me (Live GPS)",
    locateMeDetecting: "Detecting Satellite GPS...",
    sheltersHeader: "NEARBY DESIGNATED SAFE SHELTERS & RELIEF CAMPS",
    mapHeader: "EMERGENCY NAVIGATION MAP • SECTOR S07",
    safestCardTitle: "SAFEST ROUTE RECOMMENDATION",
    evalHeader: "PRAVAAH EVALUATION",
    targetShelter: "Target Evacuation Shelter:",
    safetyScoreLabel: "Overall Safety Score",
    travelMetrics: "Travel Metrics",
    whyRecHeader: "WHY PRAVAAH RECOMMENDS THIS ROUTE:",
    startNavBtn: "START SAFE NAVIGATION NOW",
    analysisHeader: "ROUTE SAFETY ANALYSIS COMPARISON",
    algoNotice: "Safety Score Algorithm: Score = 100 - (Flood Risk 35% + Landslide 25% + Road Blockage 20% + Water Level 10% + Slope 10%)",
    navActiveTitle: "PRAVAAH SAFE NAVIGATION ACTIVE",
    exitNavBtn: "⏹️ Exit Navigation",
    routeCName: "Route C — High Elevation Ridge Bypass",
    routeCReason: "Route C is recommended because it has the lowest overall disaster risk (94/100). It completely avoids the active 3.8m flood corridor, rising Alaknanda river crossings, and lower highway landslide breaches. Although it takes approximately 16 minutes longer than Route A, it reduces estimated disaster risk by 52%.",
    routeBName: "Route B — Mid-Ridge Secondary Road",
    routeBReason: "Bypasses primary flood river basin, but experiences moderate rainwater runoff and steep mountain grade.",
    routeAName: "Route A — Lower Valley Highway (Fastest)",
    routeAReason: "DANGEROUS! Shortest route passes directly through 3.8m deep flooded river basin and 2 landslide road collapses."
  }
};

export default function EmergencyNavigation({ sectors = [], language = "hi" }) {
  const tNav = NAV_I18N[language] || NAV_I18N.en;

  // Disaster Condition Simulation State (Demo Mode / Real-time hazard sync)
  const [disasterMode, setDisasterMode] = useState("CRITICAL_FLOOD"); // "NORMAL" | "HEAVY_RAINFALL" | "FLASH_FLOOD" | "CRITICAL_FLOOD"
  const [toastMessage, setToastMessage] = useState(null);
  const [hazardAlertModal, setHazardAlertModal] = useState(null);

  // GPS Geolocation State (Live GPS vs Demo Location)
  const [userCoords, setUserCoords] = useState({ lat: 30.1200, lng: 78.3000 });
  const [isLiveGps, setIsLiveGps] = useState(false);
  const [locationStatus, setLocationStatus] = useState("Sector S07 Garhwal Base (30.1200° N, 78.3000° E)");
  const [gpsErrorMsg, setGpsErrorMsg] = useState(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  // Selected Shelter & Route State
  const [selectedShelterId, setSelectedShelterId] = useState(1);
  const [selectedRouteId, setSelectedRouteId] = useState("r3"); // Default to Safest Route R3
  const [isNavigating, setIsNavigating] = useState(false);
  const [navStep, setNavStep] = useState(0);

  // Safe Camps & Relief Centers list for map & selection
  const safeShelters = [
    {
      id: 1,
      name: "Relief Camp Alpha (NDRF High Ground Base)",
      lat: 30.1850,
      lng: 78.3600,
      type: "camp",
      status: "SAFE & OPERATIONAL",
      distance_km: "7.9 km",
      eta_min: "28 min",
      capacity: "800 Capacity (210 Occupied)",
      supplies: "Food, Clean Water, Medical Aid, Power Generators",
      contact: "+91-1372-252100",
      safetyScore: 94
    },
    {
      id: 2,
      name: "Garhwal Municipal Higher Shelter",
      lat: 30.1720,
      lng: 78.3880,
      type: "camp",
      status: "SAFE & OPEN",
      distance_km: "9.2 km",
      eta_min: "32 min",
      capacity: "1200 Capacity (450 Occupied)",
      supplies: "Blankets, First Aid Kits, Satellite Phone Station",
      contact: "+91-1372-252200",
      safetyScore: 91
    },
    {
      id: 3,
      name: "State Emergency Logistics Center",
      lat: 30.1450,
      lng: 78.3950,
      type: "emergency",
      status: "OPERATIONAL",
      distance_km: "6.5 km",
      eta_min: "22 min",
      capacity: "500 Capacity (180 Occupied)",
      supplies: "Emergency Rations, NDRF Rescue Team Onsite",
      contact: "+91-1372-252300",
      safetyScore: 78
    }
  ];

  const currentShelter = safeShelters.find(s => s.id === selectedShelterId) || safeShelters[0];

  // Danger Zones & Blocked Roads
  const floodExtentPolygon = [
    [30.1350, 78.3150],
    [30.1480, 78.3280],
    [30.1680, 78.3450],
    [30.1580, 78.3220]
  ];

  const landslideRiskPolygon = [
    [30.1550, 78.3300],
    [30.1650, 78.3420],
    [30.1720, 78.3380],
    [30.1600, 78.3260]
  ];

  const blockedRoads = [
    { id: "b1", lat: 30.1500, lng: 78.3300, name: "Highway Breach #1 — Submerged 3.8m Water" },
    { id: "b2", lat: 30.1620, lng: 78.3380, name: "Highway Breach #2 — Landslide Boulder Collapse" }
  ];

  const activeSosPoints = [
    { id: "sos1", lat: 30.1420, lng: 78.3240, label: "SOS #101: 8 Trapped in Submerged Vehicle" }
  ];

  // Dynamic Route Safety Engine based on Live Disaster Scenario
  const getRoutes = (mode) => {
    const isFlood = mode === "CRITICAL_FLOOD" || mode === "FLASH_FLOOD";
    const isHeavyRain = mode === "HEAVY_RAINFALL";

    return [
      {
        id: "r3",
        name: tNav.routeCName,
        tag: "SAFEST ROUTE",
        tagColor: "bg-emerald-500 text-white border-emerald-400 font-black",
        eta: "28 min",
        distance: "7.9 km",
        safetyScore: isFlood ? 94 : (isHeavyRain ? 96 : 98),
        riskLevel: "LOW",
        status: "RECOMMENDED",
        color: "#22c55e",
        strokeWidth: 6,
        floodRisk: "VERY LOW",
        landslideRisk: "LOW",
        roadBlockageRisk: "LOW",
        waterLevelRisk: "LOW",
        terrainSlopeRisk: "LOW (Elevated Ridge)",
        coordinates: [
          [userCoords.lat, userCoords.lng],
          [30.1000, 78.3200],
          [30.1150, 78.3700],
          [30.1600, 78.3850],
          [30.1850, 78.3600]
        ],
        reason: tNav.routeCReason,
        avoidedHazards: [
          "• Active 3.8m High-Depth Flood Zone",
          "• Landslide-Prone Mountain Slope",
          "• Submerged Highway Junction Breach",
          "• Overflowing River Channel Crossing"
        ],
        badges: ["✅ 100% High Elevation Ridge", "✅ Avoids Active Flood Extent", "✅ Zero Blocked Roads"],
        warnings: ["Elevation gain +140m (High Ground)"]
      },
      {
        id: "r2",
        name: tNav.routeBName,
        tag: "BALANCED",
        tagColor: "bg-amber-500 text-slate-950 border-amber-400 font-bold",
        eta: "19 min",
        distance: "5.8 km",
        safetyScore: isFlood ? 76 : (isHeavyRain ? 84 : 92),
        riskLevel: isFlood ? "MODERATE" : "LOW",
        status: "ACCEPTABLE",
        color: "#f59e0b",
        strokeWidth: 4,
        floodRisk: "LOW-MODERATE",
        landslideRisk: "MEDIUM",
        roadBlockageRisk: "LOW",
        waterLevelRisk: "LOW",
        terrainSlopeRisk: "MEDIUM (14° Slope)",
        coordinates: [
          [userCoords.lat, userCoords.lng],
          [30.1250, 78.3400],
          [30.1550, 78.3650],
          [30.1850, 78.3600]
        ],
        reason: tNav.routeBReason,
        avoidedHazards: ["• Primary River Overflow"],
        badges: ["⚠️ Moderate Rain Runoff", "⚠️ Steep 14° Slope Grade"],
        warnings: ["Drive with caution near km 4.2"]
      },
      {
        id: "r1",
        name: tNav.routeAName,
        tag: "FASTEST",
        tagColor: "bg-rose-600 text-white border-rose-400 font-bold",
        eta: "12 min",
        distance: "4.1 km",
        safetyScore: isFlood ? 42 : (isHeavyRain ? 58 : 92),
        riskLevel: isFlood ? "HIGH" : (isHeavyRain ? "MODERATE-HIGH" : "LOW"),
        status: isFlood ? "NOT RECOMMENDED" : (isHeavyRain ? "HIGH RISK" : "FASTEST"),
        color: "#ef4444",
        strokeWidth: 4,
        floodRisk: isFlood ? "HIGH (3.8m Water)" : "MODERATE",
        landslideRisk: "MEDIUM",
        roadBlockageRisk: isFlood ? "HIGH" : "LOW",
        waterLevelRisk: isFlood ? "CRITICAL SURGE" : "MODERATE",
        terrainSlopeRisk: "LOW (Valley Floor)",
        coordinates: [
          [userCoords.lat, userCoords.lng],
          [30.1400, 78.3200],
          [30.1600, 78.3350],
          [30.1850, 78.3600]
        ],
        reason: tNav.routeAReason,
        warningMsg: "WARNING: Shortest route passes through a high-risk flood zone and blocked highway breach.",
        avoidedHazards: [],
        badges: ["⛔ Active Flood Zone (3.8m)", "⛔ 2 Blocked Highway Roads", "⛔ Landslide Risk"],
        warnings: ["HIGH RISK OF VEHICLE SUBMERSION"]
      }
    ];
  };

  const routes = getRoutes(disasterMode);
  const activeRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  // Handle Disaster Simulation Switcher with Route Recalculation Notification
  const handleDisasterChange = (newMode) => {
    setDisasterMode(newMode);
    if (newMode === "CRITICAL_FLOOD" || newMode === "FLASH_FLOOD") {
      setSelectedRouteId("r3"); // Auto-select Safest Route R3
      setHazardAlertModal({
        title: "⚠️ ROUTE HAZARD DETECTED",
        message: "Heavy rainfall & flash flood has increased disaster risk on lower valley roads. PRAVAAH has recalculated safety scores.",
        newRouteName: `${tNav.routeCName} (Safety Score: 94/100)`,
        recRouteId: "r3"
      });
      showToast(`⚡ ROUTE UPDATED: ${tNav.routeCName} RECOMMENDED!`);
    } else if (newMode === "HEAVY_RAINFALL") {
      setSelectedRouteId("r3");
      showToast("⚡ ROUTE UPDATED: Heavy rainfall active. Route safety scores recalculated.");
    } else {
      setSelectedRouteId("r1");
      showToast("ℹ️ Conditions normal. Route A (Fastest) is now safe.");
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Browser Geolocation Detection with Fallback
  const detectLiveGPS = () => {
    setIsDetectingGps(true);
    setGpsErrorMsg(null);

    if (!navigator.geolocation) {
      setGpsErrorMsg("Geolocation is not supported by your browser. Using manual Demo Location.");
      setIsLiveGps(false);
      setIsDetectingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        setIsLiveGps(true);
        setLocationStatus(`Live GPS (${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E)`);
        setIsDetectingGps(false);
        showToast("📍 Live GPS Location acquired!");
      },
      (error) => {
        setIsDetectingGps(false);
        setIsLiveGps(false);
        console.warn("GPS Permission error:", error);
        setGpsErrorMsg("Location access denied. Using manual Demo Location.");
        setLocationStatus("Sector S07 Garhwal Base (30.1200° N, 78.3000° E)");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Turn-by-Turn Steps for Active Navigation Mode
  const navSteps = [
    { title: "Depart Current Location", detail: "Head East on High Elevation Bypass Access Road towards NH-58 Bypass." },
    { title: "Elevation Checkpoint (1.8 km)", detail: "Pass Checkpoint #2 (Elevation 540m). Clear of Alaknanda River flood plain." },
    { title: "Avoid Valley Breach Junction (4.2 km)", detail: "Stay on High Ridge Highway. DO NOT take lower valley turn (Breach Active)." },
    { title: "High Elevation Ridge (6.5 km)", detail: "Paved road, clear visibility, 100% dry elevated terrain." },
    { title: "Arrive at Safe Relief Camp (7.9 km)", detail: "Welcome to Relief Camp Alpha (NDRF High Ground Base). Emergency team ready." }
  ];

  return (
    <div className="space-y-6 font-sans text-slate-100">

      {/* Dynamic Toast Alert Banner */}
      {toastMessage && (
        <div className="animate-bounce rounded-xl border border-cyan-500/80 bg-gradient-to-r from-cyan-950 via-slate-900 to-cyan-950 p-4 shadow-2xl text-xs sm:text-sm font-extrabold text-cyan-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📢</span>
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-cyan-400 hover:text-white font-bold">✕</button>
        </div>
      )}

      {/* Emergency Hazard Alert Modal */}
      {hazardAlertModal && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="max-w-md w-full rounded-2xl border-2 border-rose-600 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-bounce">⚠️</span>
              <div>
                <h3 className="text-lg font-black text-rose-400">{hazardAlertModal.title}</h3>
                <p className="text-xs text-slate-300">{hazardAlertModal.message}</p>
              </div>
            </div>

            <div className="rounded-xl bg-emerald-950/90 border border-emerald-800 p-3 text-xs font-bold text-emerald-300">
              PRAVAAH RECOMMENDATION:<br />
              <span className="text-white text-sm font-black">{hazardAlertModal.newRouteName}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedRouteId(hazardAlertModal.recRouteId);
                  setHazardAlertModal(null);
                  showToast("✅ SAFEST ROUTE RECALCULATED & SELECTED!");
                }}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-500 p-3 text-xs font-black text-white shadow-lg shadow-emerald-600/30"
              >
                [ RECALCULATE SAFEST ROUTE ]
              </button>
              <button
                onClick={() => setHazardAlertModal(null)}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 p-3 text-xs font-bold text-slate-300 border border-slate-700"
              >
                [ CONTINUE ANYWAY ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CORE USP PRODUCT HEADER */}
      <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 p-6 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white border border-red-400 tracking-wider uppercase shadow">
                {tNav.badge}
              </span>
              <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-black text-white shadow">
                {tNav.safetyTag}
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-4xl font-black text-white tracking-tight">
              {tNav.title}
            </h1>
            <p className="mt-1 text-xs sm:text-base text-blue-200 font-semibold">
              {tNav.subTitle}
            </p>
          </div>

          {/* Core USP Tagline Box */}
          <div className="rounded-xl border border-red-500/40 bg-slate-900/90 p-4 shadow-inner text-right">
            <p className="text-[10px] uppercase font-black text-red-400 tracking-widest">{tNav.principleTitle}</p>
            <p className="text-sm sm:text-lg font-black text-white mt-0.5">
              {tNav.principleTag}
            </p>
            <p className="text-[11px] text-slate-300 font-semibold mt-1">
              {tNav.principleSub}
            </p>
          </div>
        </div>

        {/* Disaster Mode Switcher (Demo Controls) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-red-900/40">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <span>🌦️ {tNav.simScenario}</span>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-cyan-400 border border-slate-700">{tNav.simLabel}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "NORMAL", label: "🟢 Normal" },
              { id: "HEAVY_RAINFALL", label: "🟡 Heavy Rain" },
              { id: "FLASH_FLOOD", label: "⚡ Flash Flood" },
              { id: "CRITICAL_FLOOD", label: "🔴 Critical Flood" }
            ].map(b => (
              <button
                key={b.id}
                onClick={() => handleDisasterChange(b.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
                  disasterMode === b.id
                    ? "bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-600/30"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIVE EMERGENCY WARNING BANNER */}
      {(disasterMode === "CRITICAL_FLOOD" || disasterMode === "FLASH_FLOOD") && (
        <div className="rounded-2xl border-2 border-rose-600 bg-rose-950/90 p-5 shadow-2xl text-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-rose-600 flex items-center justify-center text-2xl font-black animate-bounce shadow-lg">
              ⚠️
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-rose-200 uppercase tracking-wide">
                {tNav.activeWarningTitle}
              </h2>
              <p className="text-xs sm:text-sm text-rose-100 font-medium">
                {tNav.activeWarningSub}
              </p>
            </div>
          </div>

          {/* Primary CTA Button */}
          <button
            onClick={() => {
              setSelectedRouteId("r3");
              setIsNavigating(true);
              setNavStep(0);
              showToast("🚀 SAFE ROUTE TO SHELTER ACTIVATED!");
            }}
            className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-6 py-3 text-xs sm:text-sm font-black text-white shadow-xl shadow-emerald-600/40 border border-emerald-400 transform active:scale-95 flex items-center gap-2"
          >
            <span>🛡️</span>
            <span>{tNav.findSafestCta}</span>
          </button>
        </div>
      )}

      {/* 1. REAL-TIME USER LOCATION BAR & GEOLOCATION */}
      <div className="rounded-2xl border-2 border-red-200 bg-white p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`h-3.5 w-3.5 rounded-full ${isLiveGps ? "bg-emerald-500 animate-ping" : "bg-red-600"}`}></div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{tNav.currentPosLabel}</p>
              <span className={`px-2 py-0.2 text-[10px] font-bold rounded ${isLiveGps ? "bg-emerald-600 text-white" : "bg-blue-900 text-white"}`}>
                {isLiveGps ? "LIVE GPS ACTIVE" : "DEMO LOCATION"}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">{locationStatus}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={detectLiveGPS}
            disabled={isDetectingGps}
            className="flex items-center gap-2 rounded-xl bg-blue-900 hover:bg-blue-800 px-4 py-2.5 text-xs font-black text-white shadow-lg transition-all disabled:opacity-50 border border-blue-700"
          >
            <span>📍</span>
            <span>{isDetectingGps ? tNav.locateMeDetecting : tNav.locateMeBtn}</span>
          </button>
        </div>
      </div>

      {gpsErrorMsg && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 font-bold flex items-center justify-between shadow">
          <span>⚠️ {gpsErrorMsg}</span>
          <button onClick={() => setGpsErrorMsg(null)} className="text-amber-900 font-black">✕</button>
        </div>
      )}

      {/* 3. SAFE SHELTER SELECTION BAR */}
      <div className="rounded-2xl border-2 border-red-200 bg-white p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b-2 border-red-100 pb-2">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span>🏕️</span> {tNav.sheltersHeader}
          </h3>
          <span className="text-[11px] text-slate-500 font-bold">Select target shelter</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {safeShelters.map((sh) => {
            const isSelected = sh.id === selectedShelterId;
            return (
              <div
                key={sh.id}
                onClick={() => setSelectedShelterId(sh.id)}
                className={`cursor-pointer rounded-xl p-3.5 border-2 transition-all space-y-1.5 ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-50 shadow-lg shadow-emerald-500/10"
                    : "border-slate-200 bg-slate-50 hover:border-slate-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-emerald-700 uppercase">{sh.status}</span>
                  <span className="text-[10px] font-black text-blue-900">{sh.distance_km} ({sh.eta_min})</span>
                </div>
                <h4 className="text-xs font-black text-slate-900 leading-snug">{sh.name}</h4>
                <p className="text-[11px] font-semibold text-slate-600">{sh.capacity}</p>
                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-700">
                  <span>Call: <strong className="text-slate-900">{sh.contact}</strong></span>
                  <span className="font-black text-emerald-700">Safety: {sh.safetyScore}/100</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN TWO-COLUMN EMERGENCY ROUTING VIEW */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

        {/* LEFT 7 COLS: LEAFLET MAP & TURN-BY-TURN */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* MAP VISUALIZATION */}
          <div className="overflow-hidden rounded-2xl border-2 border-slate-800 bg-slate-950 shadow-2xl relative">
            
            {/* Map Header Toolbar */}
            <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between text-xs font-bold text-slate-300 z-10 relative gap-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>{tNav.mapHeader}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-cyan-400">🔵 Location</span>
                <span className="text-emerald-400">🟩 Route C (Safest)</span>
                <span className="text-amber-400">🟨 Route B</span>
                <span className="text-rose-500">🔴 Route A (High Risk)</span>
              </div>
            </div>

            {/* LEAFLET MAP CONTAINER */}
            <div className="h-[440px] sm:h-[500px] w-full">
              <MapContainer
                center={[userCoords.lat + 0.03, userCoords.lng + 0.03]}
                zoom={12}
                scrollWheelZoom={true}
                className="h-full w-full z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Flood Extent Inundation Zone Overlay (Red Polygon) */}
                {(disasterMode === "CRITICAL_FLOOD" || disasterMode === "FLASH_FLOOD") && (
                  <Polygon
                    positions={floodExtentPolygon}
                    pathOptions={{ color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.4, weight: 2, dashArray: "4,4" }}
                  >
                    <Popup>
                      <div className="text-xs space-y-1 font-sans">
                        <strong className="text-rose-600 block">⚠️ ACTIVE FLOOD INUNDATION ZONE</strong>
                        <p>Alaknanda River overflow. Water depth: <strong>3.8 meters</strong>.</p>
                        <p className="text-red-700 font-bold">STRICTLY UNPASSABLE</p>
                      </div>
                    </Popup>
                  </Polygon>
                )}

                {/* Landslide Hazard Polygon Overlay (Orange Polygon) */}
                {disasterMode !== "NORMAL" && (
                  <Polygon
                    positions={landslideRiskPolygon}
                    pathOptions={{ color: "#f97316", fillColor: "#f97316", fillOpacity: 0.35, weight: 2 }}
                  >
                    <Popup>
                      <div className="text-xs space-y-1 font-sans">
                        <strong className="text-orange-600 block">⛰️ HIGH LANDSLIDE SLOPE RISK</strong>
                        <p>Steep 18° mountain grade with active boulder slides.</p>
                      </div>
                    </Popup>
                  </Polygon>
                )}

                {/* Candidate Route Polylines */}
                {routes.map((r) => {
                  const isSelected = r.id === selectedRouteId;
                  return (
                    <Polyline
                      key={r.id}
                      positions={r.coordinates}
                      pathOptions={{
                        color: r.color,
                        weight: isSelected ? 7 : 4,
                        opacity: isSelected ? 0.95 : 0.45,
                        dashArray: r.id === "r3" ? "6, 4" : null
                      }}
                      eventHandlers={{
                        click: () => setSelectedRouteId(r.id)
                      }}
                    >
                      <Tooltip sticky>
                        <div className="font-sans text-xs">
                          <strong>{r.name}</strong><br />
                          ETA: {r.eta} | Safety: {r.safetyScore}/100<br />
                          <span style={{ color: r.color, fontWeight: "bold" }}>{r.status}</span>
                        </div>
                      </Tooltip>
                    </Polyline>
                  );
                })}

                {/* User Live Location Marker */}
                <Marker position={[userCoords.lat, userCoords.lng]} icon={userIcon}>
                  <Popup>
                    <div className="font-sans text-xs">
                      <strong className="text-cyan-600">👤 {isLiveGps ? "Your Live GPS Location" : "Your Current Location (Demo)"}</strong><br />
                      Sector S07 Garhwal Base<br />
                      Status: Seeking Safe Evacuation
                    </div>
                  </Popup>
                </Marker>

                {/* Safe Camps & Relief Centers */}
                {safeShelters.map((sh) => (
                  <Marker
                    key={sh.id}
                    position={[sh.lat, sh.lng]}
                    icon={sh.type === "camp" ? safeCampIcon : emergencyCenterIcon}
                  >
                    <Popup>
                      <div className="font-sans text-xs space-y-1">
                        <strong className="text-emerald-700 block">{sh.name}</strong>
                        <p>Status: <span className="font-bold text-emerald-600">{sh.status}</span></p>
                        <p>Capacity: {sh.capacity}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Blocked Road Hazards */}
                {disasterMode !== "NORMAL" && blockedRoads.map((br) => (
                  <Marker key={br.id} position={[br.lat, br.lng]} icon={hazardPointIcon}>
                    <Popup>
                      <div className="font-sans text-xs">
                        <strong className="text-red-600">🚧 ROAD BLOCKED</strong><br />
                        {br.name}
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Active SOS Points */}
                {activeSosPoints.map((sos) => (
                  <Marker key={sos.id} position={[sos.lat, sos.lng]} icon={sosPointIcon}>
                    <Popup>
                      <div className="font-sans text-xs">
                        <strong className="text-rose-600">🚨 ACTIVE SOS REPORT</strong><br />
                        {sos.label}
                      </div>
                    </Popup>
                  </Marker>
                ))}

              </MapContainer>
            </div>

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-800 p-3 rounded-xl shadow-xl z-[1000] text-[10px] font-bold text-slate-300 space-y-1">
              <div className="text-[10px] text-cyan-400 font-extrabold uppercase border-b border-slate-800 pb-1 mb-1">MAP LEGEND</div>
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-cyan-500"></span> <span>🔵 Location ({isLiveGps ? "Live GPS" : "Demo"})</span></div>
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> <span>🟩 Safe Shelter Camp</span></div>
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> <span>🟢 Route C: Safest (High Ridge)</span></div>
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span> <span>🟡 Route B: Balanced</span></div>
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span> <span>🔴 Route A: Dangerous (Valley)</span></div>
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-600"></span> <span>🔴 Flood Zone (3.8m Water)</span></div>
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-orange-500"></span> <span>🟠 Landslide Zone</span></div>
            </div>

          </div>

          {/* LIVE ROUTE STATUS & NAVIGATION DISPLAY */}
          {isNavigating && (
            <div className="rounded-2xl border-2 border-emerald-500 bg-slate-900 p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500 animate-ping"></span>
                  <h3 className="text-sm font-black text-emerald-400 uppercase tracking-wider">{tNav.navActiveTitle}</h3>
                </div>
                <button
                  onClick={() => setIsNavigating(false)}
                  className="rounded-lg bg-rose-950 text-rose-400 border border-rose-800 px-3 py-1 text-xs font-bold hover:bg-rose-900"
                >
                  {tNav.exitNavBtn}
                </button>
              </div>

              <div className="rounded-xl bg-slate-950 p-4 border border-emerald-900/60 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Navigation Flow: Step {navStep + 1} of {navSteps.length}</span>
                  <span className="text-emerald-400 font-bold">Destination: {currentShelter.name}</span>
                </div>
                <h4 className="text-base font-black text-white">{navSteps[navStep].title}</h4>
                <p className="text-xs text-emerald-300 font-semibold">{navSteps[navStep].detail}</p>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setNavStep(Math.max(0, navStep - 1))}
                  disabled={navStep === 0}
                  className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white disabled:opacity-40"
                >
                  ◀ Previous Step
                </button>
                <button
                  onClick={() => setNavStep(Math.min(navSteps.length - 1, navStep + 1))}
                  disabled={navStep === navSteps.length - 1}
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-black text-white hover:bg-emerald-500 disabled:opacity-40"
                >
                  Next Step ▶
                </button>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT 5 COLS: "SAFEST ROUTE" CARD, COMPARISON PANEL & EXPLAINABLE REASONING */}
        <div className="lg:col-span-5 space-y-6">

          {/* PROMINENT "SAFEST ROUTE" CARD & EXPLAINABLE RECOMMENDATION */}
          <div className="rounded-2xl border-2 border-emerald-500 bg-gradient-to-b from-slate-900 via-emerald-950/30 to-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-black text-slate-950 border border-emerald-300">
                🟢 {tNav.safestCardTitle}
              </span>
              <span className="text-xs font-bold text-emerald-400">{tNav.evalHeader}</span>
            </div>

            <div>
              <p className="text-xs text-slate-400 font-semibold">{tNav.targetShelter}</p>
              <h2 className="text-lg font-black text-white mt-0.5">{currentShelter.name}</h2>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">{tNav.safetyScoreLabel}</p>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400">{activeRoute.safetyScore} <span className="text-xs font-bold text-slate-400">/ 100</span></p>
                <span className="inline-block mt-1 rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-800 uppercase">
                  {activeRoute.riskLevel} RISK
                </span>
              </div>

              <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">{tNav.travelMetrics}</p>
                <p className="text-2xl sm:text-3xl font-black text-cyan-300">{activeRoute.eta}</p>
                <p className="text-xs font-semibold text-slate-400 mt-1">{activeRoute.distance}</p>
              </div>
            </div>

            {/* Why Recommended Explainable Reasoning Box */}
            <div className="rounded-xl border border-emerald-800/60 bg-emerald-950/50 p-4 space-y-2">
              <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">{tNav.whyRecHeader}</p>
              <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                "{activeRoute.reason}"
              </p>
              {activeRoute.avoidedHazards && activeRoute.avoidedHazards.length > 0 && (
                <div className="pt-2 border-t border-emerald-900/60 space-y-1 text-[11px] text-emerald-200">
                  <p className="font-bold text-emerald-300">Hazards Avoided By Taking Route C:</p>
                  {activeRoute.avoidedHazards.map((h, i) => (
                    <p key={i}>{h}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5">
              {activeRoute.badges.map((b, idx) => (
                <span key={idx} className="rounded-lg bg-slate-950 px-2.5 py-1 text-[11px] font-bold text-emerald-300 border border-slate-800">
                  {b}
                </span>
              ))}
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => {
                setIsNavigating(true);
                setNavStep(0);
                showToast("🚀 SAFE ROUTE TO SHELTER STARTED!");
              }}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 p-4 text-sm font-black text-white shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <span>🚀</span>
              <span>{tNav.startNavBtn}</span>
            </button>
          </div>

          {/* ROUTE COMPARISON PANEL ("ROUTE SAFETY ANALYSIS") */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>📊</span> {tNav.analysisHeader}
              </h3>
              <span className="text-[10px] text-cyan-400 font-bold">SAFETY SCORE ENGINE</span>
            </div>

            {/* Safety Scoring Formula Explanation */}
            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-[10px] text-slate-300 font-semibold space-y-1">
              <p className="font-bold text-cyan-300">Safety Scoring Algorithm:</p>
              <p>{tNav.algoNotice}</p>
            </div>

            {/* Alternative Routes Cards */}
            <div className="space-y-3">
              {routes.map((r) => {
                const isSelected = r.id === selectedRouteId;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRouteId(r.id)}
                    className={`cursor-pointer rounded-xl p-4 border transition-all space-y-2.5 ${
                      isSelected
                        ? "border-emerald-500 bg-slate-950 shadow-lg shadow-emerald-950/30"
                        : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 text-[10px] rounded ${r.tagColor}`}>
                          {r.tag}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-white">{r.name}</h4>
                      </div>
                      <span className="text-xs font-black text-cyan-400">{r.eta} ({r.distance})</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Safety Score: <strong className={`font-black ${r.safetyScore >= 80 ? "text-emerald-400" : r.safetyScore >= 60 ? "text-amber-400" : "text-rose-400"}`}>{r.safetyScore}/100</strong></span>
                      <span className="font-bold text-slate-300">Status: <span style={{ color: r.color }}>{r.status}</span></span>
                    </div>

                    {/* Detailed Risk Breakdown Matrix */}
                    <div className="grid grid-cols-2 gap-1.5 text-[10px] bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <div>Flood Risk: <strong className={r.floodRisk.includes("HIGH") || r.floodRisk.includes("VERY LOW") ? (r.floodRisk.includes("VERY LOW") ? "text-emerald-400" : "text-rose-400") : "text-amber-400"}>{r.floodRisk}</strong></div>
                      <div>Landslide: <strong className={r.landslideRisk === "LOW" ? "text-emerald-400" : "text-amber-400"}>{r.landslideRisk}</strong></div>
                      <div>Road Blockage: <strong className={r.roadBlockageRisk === "LOW" ? "text-emerald-400" : "text-rose-400"}>{r.roadBlockageRisk}</strong></div>
                      <div>Terrain/Slope: <strong className="text-slate-300">{r.terrainSlopeRisk}</strong></div>
                    </div>

                    {r.warningMsg && (
                      <p className="text-[11px] font-bold text-rose-400 bg-rose-950/60 p-2 rounded border border-rose-900">
                        {r.warningMsg}
                      </p>
                    )}

                    {isSelected && (
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-emerald-400 font-bold">
                        <span>✓ ACTIVE ROUTE ON MAP</span>
                        <span>SELECT TO NAVIGATE</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
