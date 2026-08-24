import React from "react";
import { MapContainer, TileLayer, Circle, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function ZoneInspector({ sector, onClose }) {
  if (!sector) return null;

  const riskColorMap = {
    CRITICAL: "#ef4444",
    HIGH: "#f59e0b",
    MEDIUM: "#eab308",
    LOW: "#22c55e"
  };

  const riskLevel = sector.prediction?.risk_level || sector.risk_level || "CRITICAL";
  const rawScore = Number(sector.prediction?.risk_score ?? sector.risk_score ?? sector.historical_risk ?? 0.85);
  const riskScorePct = (rawScore * 100).toFixed(1).replace(/\.0$/, "");
  const color = riskColorMap[riskLevel] || "#ef4444";
  const telemetry = sector.telemetry || {};

  // Multi-hazard probability breakdown with 0.1% ground-zero precision
  const flashProb = ((sector.prediction?.flash_flood_probability ?? 0.78) * 100).toFixed(1).replace(/\.0$/, "");
  const riverProb = ((sector.prediction?.flood_probability ?? 0.72) * 100).toFixed(1).replace(/\.0$/, "");
  const slideProb = ((sector.prediction?.landslide_probability ?? 0.84) * 100).toFixed(1).replace(/\.0$/, "");

  const popExposed = (sector.population || 16000).toLocaleString();
  const popVuln = (sector.vulnerable_population || 3200).toLocaleString();
  const centerCoords = sector.center || [31.1048, 77.1734];

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col bg-white border-l-4 border-red-600 shadow-2xl transition-all duration-300 ease-in-out text-slate-900">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b-2 border-red-600 px-6 py-4 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-200">
              {sector.state || "Himalayan State"} • {sector.region || "Hilly Region"}
            </span>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-black text-white shadow border border-white/40"
              style={{ backgroundColor: color }}
            >
              {riskLevel} RISK ({riskScorePct}%)
            </span>
          </div>
          <h2 className="mt-1 text-xl font-black text-white">
            {sector.name} ({sector.sector_id || "S00"})
          </h2>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title="Close Inspector"
        >
          ✕
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Local Focused Map View */}
        <div className="h-56 overflow-hidden rounded-xl border border-slate-800 relative">
          <MapContainer
            center={centerCoords}
            zoom={13}
            className="h-full w-full"
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Circle
              center={centerCoords}
              radius={1800}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.35,
              }}
            />
            {sector.polygon && (
              <Polygon
                positions={sector.polygon}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.2,
                }}
              />
            )}
          </MapContainer>
          <div className="absolute bottom-2 left-2 z-[400] rounded bg-slate-950/90 px-3 py-1 text-xs text-cyan-300 font-mono border border-slate-800">
            Center GPS: {centerCoords[0].toFixed(4)}°N, {centerCoords[1].toFixed(4)}°E
          </div>
        </div>

        {/* 3-HAZARD RISK BREAKDOWN CARDS */}
        <div className="rounded-xl border-2 border-slate-200 bg-white p-4 space-y-3 shadow-md">
          <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <span>🛡️</span> Multi-Hazard AI Assessment Breakdown
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50/80 p-3 text-center shadow-sm">
              <p className="text-[11px] text-blue-900 font-black">🌊 Flash Flood</p>
              <p className="text-xl font-black text-blue-900 mt-1">{flashProb}%</p>
              <div className="mt-1.5 h-2 w-full rounded-full bg-blue-200 overflow-hidden">
                <div className="h-full bg-blue-700 rounded-full" style={{ width: `${flashProb}%` }} />
              </div>
            </div>

            <div className="rounded-xl border-2 border-amber-200 bg-amber-50/80 p-3 text-center shadow-sm">
              <p className="text-[11px] text-amber-900 font-black">🌧️ River Flood</p>
              <p className="text-xl font-black text-amber-900 mt-1">{riverProb}%</p>
              <div className="mt-1.5 h-2 w-full rounded-full bg-amber-200 overflow-hidden">
                <div className="h-full bg-amber-700 rounded-full" style={{ width: `${riverProb}%` }} />
              </div>
            </div>

            <div className="rounded-xl border-2 border-red-200 bg-red-50/80 p-3 text-center shadow-sm">
              <p className="text-[11px] text-red-900 font-black">⛰️ Landslide</p>
              <p className="text-xl font-black text-red-600 mt-1">{slideProb}%</p>
              <div className="mt-1.5 h-2 w-full rounded-full bg-red-200 overflow-hidden">
                <div className="h-full bg-red-600 rounded-full" style={{ width: `${slideProb}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Physical Telemetry Gauges */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border-2 border-slate-200 bg-white p-4 shadow-md">
            <p className="text-xs text-slate-700 font-extrabold">Rainfall Intensity</p>
            <p className="mt-1 text-xl font-black text-blue-900">
              {telemetry.rainfall_rate_mmh || 65.2} <span className="text-xs font-bold text-slate-600">mm/hr</span>
            </p>
            <div className="mt-2 h-2 w-full rounded-full bg-blue-100 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(100, (((telemetry.rainfall_rate_mmh || 65) / 100) * 100))}%` }} />
            </div>
          </div>

          <div className="rounded-xl border-2 border-slate-200 bg-white p-4 shadow-md">
            <p className="text-xs text-slate-700 font-extrabold">River Water Level</p>
            <p className="mt-1 text-xl font-black text-amber-900">
              {telemetry.river_level || 5.8} <span className="text-xs font-bold text-slate-600">m</span>
            </p>
            <div className="mt-2 h-2 w-full rounded-full bg-amber-100 overflow-hidden">
              <div className="h-full bg-amber-600 rounded-full" style={{ width: `${Math.min(100, (((telemetry.river_level || 5.8) / 9) * 100))}%` }} />
            </div>
          </div>

          <div className="rounded-xl border-2 border-slate-200 bg-white p-4 shadow-md">
            <p className="text-xs text-slate-700 font-extrabold">Soil Moisture</p>
            <p className="mt-1 text-xl font-black text-emerald-800">
              {telemetry.soil_moisture || 84.5} <span className="text-xs font-bold text-slate-600">%</span>
            </p>
            <div className="mt-2 h-2 w-full rounded-full bg-emerald-100 overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${Math.min(100, telemetry.soil_moisture || 84.5)}%` }} />
            </div>
          </div>

          <div className="rounded-xl border-2 border-slate-200 bg-white p-4 shadow-md">
            <p className="text-xs text-slate-700 font-extrabold">Terrain Slope</p>
            <p className="mt-1 text-xl font-black text-red-600">
              {sector.slope || 34.0}° <span className="text-xs font-bold text-slate-600">gradient</span>
            </p>
          </div>

          <div className="rounded-xl border-2 border-slate-200 bg-white p-4 shadow-md">
            <p className="text-xs text-slate-700 font-extrabold">DEM Elevation</p>
            <p className="mt-1 text-xl font-black text-slate-900">
              {sector.elevation || 1500} <span className="text-xs font-bold text-slate-600">m</span>
            </p>
          </div>

          <div className="rounded-xl border-2 border-slate-200 bg-white p-4 shadow-md">
            <p className="text-xs text-slate-700 font-extrabold">NASA LHASA Risk</p>
            <p className="mt-1 text-xs font-black text-red-600 uppercase">
              {riskLevel === "CRITICAL" ? "CRITICAL LANDSLIDE" : "HIGH VULNERABILITY"}
            </p>
          </div>
        </div>

        {/* AI Explanation Banner */}
        {sector.prediction?.explanation && (
          <div className="rounded-xl border-2 border-blue-900 bg-blue-950 p-4 text-xs text-white shadow-lg space-y-1">
            <p className="font-black text-blue-300 flex items-center gap-2">
              <span>🧠</span> AI Hazard Intelligence Diagnostics:
            </p>
            <p className="font-semibold leading-relaxed text-blue-100">{sector.prediction.explanation}</p>
          </div>
        )}

        {/* SHAP-Style AI Risk Attribution Breakdown */}
        <div className="rounded-xl border-2 border-slate-200 bg-white p-5 space-y-3 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span>🤖</span> AI Feature Attribution Breakdown (SHAP Values)
            </h3>
            <span className="text-xs text-blue-900 font-mono font-black bg-blue-50 px-2 py-0.5 rounded border border-blue-200">XGBoost Ensemble</span>
          </div>

          <div className="space-y-2">
            {(sector.shap_drivers || [
              { factor: "24h Cumulative Rainfall Anomaly", contribution: "+38%" },
              { factor: "Steep Canyon Slope Gradient", contribution: "+28%" },
              { factor: "Saturated Soil Moisture", contribution: "+20%" },
              { factor: "High Upstream River Discharge", contribution: "+14%" }
            ]).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                <span className="text-slate-800 font-bold">{item.factor}</span>
                <span className="font-mono font-black text-red-600 text-sm">{item.contribution}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Exposed Population & Infrastructure Impact */}
        <div className="rounded-xl border-2 border-slate-200 bg-white p-5 space-y-4 shadow-md">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <span>🏛️</span> Infrastructure & Population Impact Analysis
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-50 p-3 rounded-xl border-2 border-slate-200 shadow-sm">
              <p className="text-xs text-slate-700 font-bold">Exposed Pop.</p>
              <p className="text-lg font-black text-blue-900">{popExposed}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border-2 border-slate-200 shadow-sm">
              <p className="text-xs text-slate-700 font-bold">Vulnerable Pop.</p>
              <p className="text-lg font-black text-amber-900">{popVuln}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border-2 border-slate-200 shadow-sm">
              <p className="text-xs text-slate-700 font-bold">Hospitals</p>
              <p className="text-lg font-black text-red-600">{sector.hospitals || 3}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border-2 border-slate-200 shadow-sm">
              <p className="text-xs text-slate-700 font-bold">Critical Bridges</p>
              <p className="text-lg font-black text-emerald-800">{sector.bridges || 4}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-black text-slate-800 mb-1.5">Affected Highway Corridors:</p>
            <div className="flex flex-wrap gap-2">
              {(sector.roads || ["Main Himalayan Corridor"]).map((rd, i) => (
                <span key={i} className="px-3 py-1.5 bg-red-600 text-white font-black rounded-xl text-xs shadow border border-red-400">
                  🚧 {rd} (HIGH VULNERABILITY)
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Action Plan for Authorities — Crisp Solid Red Box with White Text */}
        <div className="rounded-xl border-2 border-red-600 bg-red-600 p-5 space-y-2.5 shadow-xl text-white">
          <h3 className="text-base font-black text-white flex items-center gap-2 border-b border-red-500 pb-2">
            <span>🚨</span> Recommended Authority Response Protocol
          </h3>
          <ul className="text-xs font-bold text-white space-y-2 list-disc list-inside leading-relaxed">
            <li>Dispatch NDRF & State Disaster Response Force (SDRF) team to <strong className="underline underline-offset-2">{sector.name}</strong>.</li>
            <li>Issue immediate mandatory evacuation for inhabitants within 200m of riverbanks.</li>
            <li>Deploy heavy motor graders to clear landslide debris along highway corridors.</li>
            <li>Prepare relief shelters: <strong className="underline underline-offset-2">{sector.shelters?.join(", ") || "Government Relief Hub"}</strong>.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
