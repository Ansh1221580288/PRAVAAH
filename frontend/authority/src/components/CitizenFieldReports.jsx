import { useState, useEffect } from "react";

export default function CitizenFieldReports({ sectorIdFilter = null }) {
  const [reports, setReports] = useState([
    {
      id: "REP-201",
      sector_id: "S02",
      reporter_name: "Ramesh Thakur",
      hazard_type: "Landslide Road Blockage",
      location: "NH-21 Kullu-Manali Road near Aut",
      water_level_m: 4.8,
      description: "Boulders sliding from upper mountain slope onto highway lane.",
      verified: true,
      status: "VERIFIED & DISPATCHED",
      official_notes: "NDRF Team #4 dispatched to clear highway boulder breach.",
      timestamp: "10 mins ago"
    },
    {
      id: "REP-202",
      sector_id: "S06",
      reporter_name: "Bipul Sharma",
      hazard_type: "Urban Water Inundation",
      location: "Guwahati Khanapara Hill Creek",
      water_level_m: 1.9,
      description: "Flash rain overflowed drainage canal into low-lying housing colony.",
      verified: false,
      status: "UNVERIFIED",
      official_notes: "Awaiting municipal field verification.",
      timestamp: "18 mins ago"
    },
    {
      id: "REP-203",
      sector_id: "S04",
      reporter_name: "Devendra Negi",
      hazard_type: "Washed Away Bridge Pier",
      location: "Alaknanda Tributary Wooden Footbridge",
      water_level_m: 3.5,
      description: "River surge damaged central concrete pillar. Unsafe for foot crossing.",
      verified: false,
      status: "UNVERIFIED",
      official_notes: "Pending inspection team dispatch.",
      timestamp: "25 mins ago"
    }
  ]);

  const [selectedSector, setSelectedSector] = useState(sectorIdFilter || "ALL");
  const [selectedHazard, setSelectedHazard] = useState("ALL");
  const [actionModalReport, setActionModalReport] = useState(null);
  const [officialNoteInput, setOfficialNoteInput] = useState("");
  const [actionStatusInput, setActionStatusInput] = useState("VERIFIED & DISPATCHED");

  // Fetch reports from backend
  const fetchReports = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/citizen/reports");
      if (res.ok) {
        const data = await res.json();
        if (data.reports && data.reports.length > 0) {
          setReports(data.reports);
        }
      }
    } catch (err) {
      console.log("Using local offline field reports state.", err);
    }
  };

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveAction = async () => {
    if (!actionModalReport) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/citizen/reports/${actionModalReport.id}/action`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: actionStatusInput,
          official_notes: officialNoteInput || "Actioned by Authority Operations Console."
        })
      });
      if (res.ok) {
        const data = await res.json();
        setReports((prev) =>
          prev.map((r) => (r.id === actionModalReport.id ? data.report : r))
        );
      }
    } catch (err) {
      // Local state fallback update
      setReports((prev) =>
        prev.map((r) =>
          r.id === actionModalReport.id
            ? {
                ...r,
                verified: true,
                status: actionStatusInput,
                official_notes: officialNoteInput || "Actioned by Authority Operations Console."
              }
            : r
        )
      );
    }
    setActionModalReport(null);
    setOfficialNoteInput("");
  };

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const matchSector = selectedSector === "ALL" || r.sector_id === selectedSector;
    const matchHazard = selectedHazard === "ALL" || r.hazard_type === selectedHazard;
    return matchSector && matchHazard;
  });

  return (
    <div className="rounded-2xl border-2 border-red-200 bg-white p-6 space-y-4 shadow-xl">
      {/* Component Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-red-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-900 px-3 py-0.5 text-[11px] font-black text-white border border-blue-700 shadow">
              TWO-WAY FEEDBACK LOOP
            </span>
            <span className="rounded-full bg-red-600 px-3 py-0.5 text-[11px] font-black text-white border border-red-400 shadow">
              {filteredReports.length} Citizen Reports Active
            </span>
          </div>
          <h2 className="mt-1.5 text-lg font-black text-slate-900 flex items-center gap-2">
            <span>📝</span> Citizen Field Incident Reports Console
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Real-time crowdsourced disaster incident observations submitted directly by citizens in affected sectors.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="rounded-xl bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs font-bold text-white focus:outline-none"
          >
            <option value="ALL">All Sectors</option>
            <option value="S02">S02 - Kullu Valley</option>
            <option value="S04">S04 - Chamoli</option>
            <option value="S05">S05 - Kedarnath</option>
            <option value="S06">S06 - Guwahati</option>
            <option value="S07">S07 - Dima Hasao</option>
          </select>

          <select
            value={selectedHazard}
            onChange={(e) => setSelectedHazard(e.target.value)}
            className="rounded-xl bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs font-bold text-white focus:outline-none"
          >
            <option value="ALL">All Hazard Types</option>
            <option value="Landslide Road Blockage">Landslide Blockage</option>
            <option value="Urban Water Inundation">Water Inundation</option>
            <option value="Washed Away Bridge Pier">Bridge Damage</option>
          </select>
        </div>
      </div>

      {/* Reports Feed Table / Grid */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="rounded-xl border border-red-200 bg-slate-50 p-6 text-center text-xs text-slate-500 font-semibold">
            No citizen field reports match the selected filters.
          </div>
        ) : (
          filteredReports.map((r) => (
            <div
              key={r.id}
              className={`rounded-xl border p-4 transition-all space-y-2.5 ${
                r.verified
                  ? "border-emerald-900/80 bg-slate-950/90 shadow-md"
                  : "border-amber-900/80 bg-slate-950 shadow-md"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-black text-cyan-400 border border-slate-700">
                    {r.sector_id}
                  </span>
                  <span className="text-xs font-black text-white">{r.hazard_type}</span>
                  {r.water_level_m > 0 && (
                    <span className="rounded bg-rose-950 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-800">
                      🌊 Water: {r.water_level_m}m
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded px-2.5 py-0.5 text-[10px] font-black uppercase border ${
                      r.status === "VERIFIED & DISPATCHED"
                        ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                        : r.status === "INSPECTION ASSIGNED"
                        ? "bg-amber-950 text-amber-400 border-amber-800"
                        : "bg-rose-950 text-rose-400 border-rose-800 animate-pulse"
                    }`}
                  >
                    {r.status || "UNVERIFIED"}
                  </span>
                  <button
                    onClick={() => {
                      setActionModalReport(r);
                      setOfficialNoteInput(r.official_notes || "");
                      setActionStatusInput(r.status || "VERIFIED & DISPATCHED");
                    }}
                    className="rounded-lg bg-cyan-600 hover:bg-cyan-500 px-3 py-1 text-[11px] font-bold text-white shadow"
                  >
                    Action / Verify 🛠️
                  </button>
                </div>
              </div>

              {/* Observation Detail */}
              <div className="rounded-lg bg-slate-900/90 p-3 border border-slate-800/80 space-y-1">
                <p className="text-xs text-slate-200 font-semibold leading-relaxed">
                  "{r.description}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>
                    Reported by: <strong className="text-white">{r.reporter_name}</strong> • Location: <strong className="text-cyan-300">{r.location}</strong>
                  </span>
                  <span className="text-slate-500">{r.timestamp || "Recent"}</span>
                </div>
              </div>

              {/* Official Action Notes */}
              {r.official_notes && (
                <div className="text-[11px] text-emerald-300 font-bold bg-emerald-950/40 p-2 rounded border border-emerald-900/60 flex items-center gap-2">
                  <span>🛡️ OFFICIAL ACTION NOTE:</span>
                  <span>{r.official_notes}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Action Verification Modal */}
      {actionModalReport && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="max-w-md w-full rounded-2xl border-2 border-cyan-500 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-cyan-400 uppercase tracking-wider">
                🛠️ Action Citizen Report ({actionModalReport.id})
              </h3>
              <button
                onClick={() => setActionModalReport(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <p>Reporter: <strong className="text-white">{actionModalReport.reporter_name}</strong></p>
              <p>Location: <strong className="text-cyan-300">{actionModalReport.location}</strong></p>
              <p>Description: <span className="italic text-slate-200">"{actionModalReport.description}"</span></p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-300">Set Verification Status:</label>
                <select
                  value={actionStatusInput}
                  onChange={(e) => setActionStatusInput(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-xs font-bold text-white"
                >
                  <option value="VERIFIED & DISPATCHED">🟢 VERIFIED & DISPATCHED</option>
                  <option value="INSPECTION ASSIGNED">🟡 INSPECTION ASSIGNED</option>
                  <option value="RESOLVED">✅ RESOLVED</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Official Command Note:</label>
                <textarea
                  rows={3}
                  value={officialNoteInput}
                  onChange={(e) => setOfficialNoteInput(e.target.value)}
                  placeholder="e.g. NDRF Rescue Unit #3 dispatched to inspect landslide site."
                  className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-xs text-white placeholder-slate-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleSaveAction}
                className="rounded-xl bg-cyan-600 hover:bg-cyan-500 p-3 text-xs font-black text-white shadow-lg shadow-cyan-600/30"
              >
                SAVE ACTION & UPDATE
              </button>
              <button
                onClick={() => setActionModalReport(null)}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 p-3 text-xs font-bold text-slate-300 border border-slate-700"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
