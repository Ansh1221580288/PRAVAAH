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
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📡</span> Situation Monitoring & Physical Telemetry Gauges
          </h2>
          <p className="text-xs text-slate-400">
            Real-time environmental telemetry, river gauge surge levels, & live alert intelligence feed
          </p>
        </div>

        <span className="rounded-full bg-cyan-950 px-3 py-1 text-xs font-mono font-bold text-cyan-400 border border-cyan-800/60 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          OPEN-METEO • GLOFAS • NASA LHASA
        </span>
      </div>

      {/* 3 Physical Telemetry Gauges Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* 1. Rainfall Intensity */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-2 shadow-inner">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400">Rainfall Intensity</p>
            <span className="text-lg">🌧️</span>
          </div>

          <p className="text-2xl font-black text-cyan-400 font-mono">
            {rainfall}
          </p>

          <p className="text-[11px] font-semibold text-cyan-300/80">
            Current precipitation rate
          </p>

          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: "78%" }} />
          </div>
        </div>

        {/* 2. Water Level */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-2 shadow-inner">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400">River Water Level</p>
            <span className="text-lg">🌊</span>
          </div>

          <p className="text-2xl font-black text-amber-400 font-mono">
            {waterLevel}
          </p>

          <p className="text-[11px] font-semibold text-amber-300/80">
            Current hydrological gauge level
          </p>

          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: "84%" }} />
          </div>
        </div>

        {/* 3. Flood Extent */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-2 shadow-inner">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400">Estimated Flood Extent</p>
            <span className="text-lg">📐</span>
          </div>

          <p className="text-2xl font-black text-rose-400 font-mono">
            {floodExtent}
          </p>

          <p className="text-[11px] font-semibold text-rose-300/80">
            Inundation & inundation spread
          </p>

          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-rose-400 rounded-full" style={{ width: "68%" }} />
          </div>
        </div>

      </div>

      {/* Situation Updates Feed */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-900 pb-2">
          <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <span>🚨</span> Live Multi-Hazard Situation Updates Feed
          </p>
          <span className="text-[10px] font-mono text-slate-500">Real-Time Operational Ticker</span>
        </div>

        <div className="space-y-2.5">
          {situationList.map((update, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg bg-slate-900/60 p-3 text-xs sm:text-sm text-slate-200 border border-slate-800/80"
            >
              <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0 mt-1.5 animate-pulse" />
              <p className="leading-relaxed">{update}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}