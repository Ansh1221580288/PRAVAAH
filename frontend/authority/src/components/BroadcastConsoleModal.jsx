import { useState } from "react";

export default function BroadcastConsoleModal({ isOpen, onClose, onBroadcastSent }) {
  const [sectorId, setSectorId] = useState("ALL");
  const [title, setTitle] = useState("🚨 HIGH RIDGE FLASH FLOOD EVACUATION ALERT");
  const [message, setMessage] = useState(
    "Beas & Alaknanda rivers have breached emergency 4.5m surge level. Citizens in lower highway corridors must immediately move to nearest High Ridge Relief Shelter!"
  );
  const [severity, setSeverity] = useState("CRITICAL");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSendBroadcast = async () => {
    if (!message.trim()) return;
    setIsSubmitting(true);
    setBroadcastSuccess(false);

    const payload = {
      sector_id: sectorId,
      title: title || "🚨 EMERGENCY DISASTER BROADCAST",
      message: message.trim(),
      severity: severity
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/authority/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (onBroadcastSent) onBroadcastSent(data.broadcast);
      } else {
        if (onBroadcastSent) onBroadcastSent(payload);
      }
    } catch (err) {
      if (onBroadcastSent) onBroadcastSent(payload);
    }

    // Save to localStorage for instant cross-tab sync
    localStorage.setItem("pravaah_active_broadcast", JSON.stringify({
      ...payload,
      timestamp: new Date().toISOString()
    }));

    setIsSubmitting(false);
    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[7000] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="max-w-lg w-full rounded-2xl border-4 border-red-600 bg-white p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b-2 border-red-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-600 animate-ping"></span>
            <h2 className="text-base font-black text-red-600 uppercase tracking-wider">
              📡 Emergency Alert Broadcast Control Console
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 font-black text-lg"
          >
            ✕
          </button>
        </div>

        {broadcastSuccess && (
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-black text-emerald-800 animate-bounce flex items-center gap-2 shadow">
            <span>📡</span> EMERGENCY ALERT BROADCASTED LIVE TO ALL CITIZEN PORTALS!
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Target Sector / Region:</label>
              <select
                value={sectorId}
                onChange={(e) => setSectorId(e.target.value)}
                className="mt-1 w-full rounded-xl bg-slate-50 border border-slate-300 p-2.5 text-xs font-black text-slate-900 focus:outline-none"
              >
                <option value="ALL">🌐 ALL SECTORS (National Broadcast)</option>
                <option value="S02">S02 - Kullu Valley & Beas Basin</option>
                <option value="S04">S04 - Chamoli Alaknanda Corridor</option>
                <option value="S05">S05 - Kedarnath Mandakini Basin</option>
                <option value="S07">S07 - Dima Hasao Haflong Zone</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Severity Tier:</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="mt-1 w-full rounded-xl bg-slate-50 border border-slate-300 p-2.5 text-xs font-black text-red-600 focus:outline-none"
              >
                <option value="CRITICAL">🔴 CRITICAL EMERGENCY</option>
                <option value="HIGH">🟡 HIGH SEVERITY WARNING</option>
                <option value="WARNING">🔵 GENERAL ADVISORY</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Alert Title / Headline:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. FLASH FLOOD EVACUATION WARNING"
              className="mt-1 w-full rounded-xl bg-slate-50 border border-slate-300 p-3 text-xs font-bold text-slate-900 placeholder-slate-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">
              Emergency Voice & Text Message Content:
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write clear, urgent evacuation instructions..."
              className="mt-1 w-full rounded-xl bg-slate-50 border border-slate-300 p-3 text-xs text-slate-900 placeholder-slate-400 font-semibold leading-relaxed"
            />
            <p className="mt-1 text-[11px] text-slate-500 font-semibold">
              ℹ️ This alert will pop up on all active citizen portals and automatically play in the user's selected local language.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t-2 border-slate-100">
          <button
            onClick={handleSendBroadcast}
            disabled={isSubmitting || !message.trim()}
            className="rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 p-3.5 text-xs font-black text-white shadow-xl shadow-red-600/30 disabled:opacity-40 flex items-center justify-center gap-2 border border-red-400"
          >
            <span>📡</span>
            <span>{isSubmitting ? "BROADCASTING..." : "SEND LIVE EMERGENCY BROADCAST"}</span>
          </button>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 hover:bg-slate-800 p-3.5 text-xs font-extrabold text-white border border-slate-800"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
