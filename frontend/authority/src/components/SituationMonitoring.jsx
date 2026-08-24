import React from "react";

export default function SituationMonitoring({ data = {} }) {
  const rainfall = data.rainfall || "58.4 mm/hr";
  const waterLevel = data.waterLevel || "7.2 m";
  const floodExtent = data.floodExtent || "165 sq km";
  const situationList = data.situation && data.situation.length > 0
    ? data.situation
    : [
        "Open-Meteo & GloFAS rainfall anomaly telemetry active for Himalayan sectors",
        "Beas, Mandakini & Alaknanda rivers breaching warning thresholds",
        "NASA LHASA landslide vulnerability flagged high for Chamoli & Dima Hasao",
        "NDRF & SDRF response teams standing by across active mountain corridors"
      ];

  return (
    <section className="rounded-2xl border-2 border-red-200 bg-white p-6 shadow-xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-red-100 pb-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span>📡</span> Situation Monitoring & Physical Telemetry Gauges
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Real-time environmental telemetry, river gauge surge levels, & live alert intelligence feed
          </p>
        </div>

        <span className="rounded-full bg-blue-900 px-3.5 py-1 text-xs font-mono font-black text-white border border-blue-700 flex items-center gap-2 shadow">
          <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
          OPEN-METEO • GLOFAS • NASA LHASA
        </span>
      </div>

      {/* 3 Physical Telemetry Gauges Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* 1. Rainfall Intensity */}
        <div className="rounded-xl border-2 border-blue-100 bg-blue-50/50 p-5 space-y-2 shadow">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold uppercase text-blue-900">Rainfall Intensity</p>
            <span className="text-xl">🌧️</span>
          </div>

          <p className="text-2xl font-black text-blue-900 font-mono">
            {rainfall}
          </p>

          <p className="text-[11px] font-bold text-blue-700">
            Current precipitation rate
          </p>

          <div className="mt-2 h-2 w-full rounded-full bg-blue-100 overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full shadow" style={{ width: "78%" }} />
          </div>
        </div>

        {/* 2. Water Level */}
        <div className="rounded-xl border-2 border-amber-200 bg-amber-50/50 p-5 space-y-2 shadow">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold uppercase text-amber-900">River Water Level</p>
            <span className="text-xl">🌊</span>
          </div>

          <p className="text-2xl font-black text-amber-900 font-mono">
            {waterLevel}
          </p>

          <p className="text-[11px] font-bold text-amber-800">
            Current hydrological gauge level
          </p>

          <div className="mt-2 h-2 w-full rounded-full bg-amber-100 overflow-hidden">
            <div className="h-full bg-amber-600 rounded-full shadow" style={{ width: "84%" }} />
          </div>
        </div>

        {/* 3. Flood Extent */}
        <div className="rounded-xl border-2 border-red-200 bg-red-50/50 p-5 space-y-2 shadow">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold uppercase text-red-900">Estimated Flood Extent</p>
            <span className="text-xl">📐</span>
          </div>

          <p className="text-2xl font-black text-red-600 font-mono">
            {floodExtent}
          </p>

          <p className="text-[11px] font-bold text-red-800">
            Inundation & inundation spread
          </p>

          <div className="mt-2 h-2 w-full rounded-full bg-red-100 overflow-hidden">
            <div className="h-full bg-red-600 rounded-full shadow" style={{ width: "68%" }} />
          </div>
        </div>

      </div>

      {/* Situation Updates Feed */}
      <div className="rounded-xl border-2 border-red-100 bg-slate-50 p-5 space-y-3">
        <div className="flex items-center justify-between border-b-2 border-red-100 pb-2">
          <p className="text-xs font-black uppercase tracking-wider text-red-600 flex items-center gap-2">
            <span>🚨</span> Live Multi-Hazard Situation Updates Feed
          </p>
          <span className="text-[10px] font-mono text-slate-500 font-bold">Real-Time Operational Ticker</span>
        </div>

        <div className="space-y-2.5">
          {situationList.map((update, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-xl bg-white p-3.5 text-xs sm:text-sm text-slate-800 font-semibold border border-red-100 shadow-sm"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-red-600 shrink-0 mt-1.5 animate-pulse" />
              <p className="leading-relaxed">{update}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}