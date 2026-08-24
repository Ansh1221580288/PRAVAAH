import React from "react";

export default function PrioritySectors({ sectors = [], onSelectSector }) {
  const getLevelStyle = (level) => {
    if (level === "CRITICAL") {
      return "border-red-500/40 bg-red-500/10 text-red-400 font-bold";
    }
    if (level === "HIGH") {
      return "border-amber-500/40 bg-amber-500/10 text-amber-400 font-bold";
    }
    if (level === "MEDIUM") {
      return "border-yellow-500/40 bg-yellow-500/10 text-yellow-400 font-bold";
    }
    return "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-bold";
  };

  return (
    <section className="rounded-2xl border-2 border-red-200 bg-white p-6 shadow-xl">
      <div className="flex items-center justify-between border-b-2 border-red-100 pb-4 mb-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span>⚠️</span> Priority Emergency Sectors (Multi-Hazard Focus)
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Real-time monitoring of Flash Floods 🌊, River Surge 🌧️, and Landslides ⛰️ across Himalayan sectors
          </p>
        </div>
        <span className="rounded-full bg-red-600 px-3.5 py-1 text-xs font-black text-white shadow border border-red-400 uppercase">
          {sectors.length} ACTIVE ZONES
        </span>
      </div>

      <div className="space-y-3">
        {sectors.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500">
            No critical risk sectors flagged in this region. System monitoring active.
          </div>
        ) : (
          sectors.map((sec) => {
            const riskLevel = sec.prediction?.risk_level || sec.risk_level || "HIGH";
            const rawScore = Number(sec.prediction?.risk_score ?? sec.risk_score ?? sec.historical_risk ?? 0.75);
            const riskScorePct = (rawScore * 100).toFixed(1).replace(/\.0$/, "");
            
            const flashProb = ((sec.prediction?.flash_flood_probability ?? 0.76) * 100).toFixed(1).replace(/\.0$/, "");
            const riverProb = ((sec.prediction?.flood_probability ?? 0.70) * 100).toFixed(1).replace(/\.0$/, "");
            const slideProb = ((sec.prediction?.landslide_probability ?? 0.82) * 100).toFixed(1).replace(/\.0$/, "");
            
            const rainRate = sec.telemetry?.rainfall_rate_mmh || 45.0;

            return (
              <div
                key={sec.sector_id || sec.name}
                className="group flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 transition-all hover:border-slate-700 hover:bg-slate-900/60"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800/80 text-sm font-black text-cyan-400 border border-slate-700 font-mono">
                    {sec.sector_id || "S00"}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {sec.name || `Sector ${sec.sector_id}`}
                      </p>
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {sec.state || "Himalayan Region"}
                      </span>
                    </div>

                    {/* Multi-hazard risk pills */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="rounded bg-cyan-950/80 text-cyan-300 px-2 py-0.5 text-[10px] border border-cyan-800/40">
                        🌊 Flash: <strong>{flashProb}%</strong>
                      </span>
                      <span className="rounded bg-blue-950/80 text-blue-300 px-2 py-0.5 text-[10px] border border-blue-800/40">
                        🌧️ River: <strong>{riverProb}%</strong>
                      </span>
                      <span className="rounded bg-rose-950/80 text-rose-300 px-2 py-0.5 text-[10px] border border-rose-800/40">
                        ⛰️ Slide: <strong>{slideProb}%</strong>
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        🌧️ Rain: <strong className="text-cyan-400">{rainRate} mm/h</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className={`inline-block rounded-full border px-3 py-1 text-xs ${getLevelStyle(riskLevel)}`}>
                      {riskLevel} ({riskScorePct}%)
                    </span>
                  </div>

                  {onSelectSector && (
                    <button
                      onClick={() => onSelectSector(sec)}
                      className="rounded-lg bg-cyan-950 hover:bg-cyan-600 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:text-white border border-cyan-800/60 transition-all shadow"
                    >
                      Inspect Zone ➔
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}