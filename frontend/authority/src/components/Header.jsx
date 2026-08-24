import React from "react";

export default function Header({
  activeView,
  setActiveView,
  isLiveApi,
  apiStatus,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onOpenBroadcast
}) {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-red-600 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 shadow-2xl backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-6 py-3">

        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <img
            src="/pravaah_logo.png"
            alt="PRAVAAH - Navigate to Safety"
            className="h-12 w-auto rounded-xl border-2 border-red-500/80 shadow-lg shadow-blue-500/30 object-contain bg-blue-950 p-1"
          />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-widest text-white drop-shadow-md">
                PRAVAAH
              </h1>
              <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-black text-white border border-red-400 uppercase tracking-wider shadow">
                NAVIGATE TO SAFETY
              </span>
            </div>
            <p className="text-xs text-blue-200 font-semibold">
              Himalayan Multi-Hazard & Risk-Aware Evacuation Engine
            </p>
          </div>
        </div>

        {/* Broadcast Alert Quick Access Button (Authority View) */}
        {activeView === "authority" && (
          <button
            onClick={onOpenBroadcast}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 px-4 py-2 text-xs font-black text-white shadow-lg shadow-rose-600/30 border border-rose-400 animate-pulse"
          >
            <span>📡</span>
            <span>BROADCAST EMERGENCY ALERT</span>
          </button>
        )}

        {/* Center View Header - DEDICATED PER CONFIRMED USER ROLE (No mixing!) */}
        {currentUser ? (
          /* When Logged In: Display ONLY their confirmed single dedicated portal badge */
          <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 border border-slate-800 shadow">
            {currentUser.role === "authority" ? (
              <div className="flex items-center gap-2 text-cyan-300 font-extrabold text-xs">
                <span>🏛️</span>
                <span>DEDICATED PORTAL: Authority Operations Console</span>
                <span className="rounded bg-cyan-950 px-2 py-0.5 text-[9px] text-cyan-400 border border-cyan-800">OFFICER LOGGED IN</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-xs">
                <span>📱</span>
                <span>DEDICATED PORTAL: Public Citizen Emergency Portal</span>
                <span className="rounded bg-emerald-950 px-2 py-0.5 text-[9px] text-emerald-400 border border-emerald-800">CITIZEN LOGGED IN</span>
              </div>
            )}
          </div>
        ) : (
          /* When NOT Logged In: Preview Portal Switcher */
          <div className="flex items-center gap-1 rounded-xl bg-slate-900 p-1 border border-slate-800">
            <button
              onClick={() => onOpenAuthModal("authority")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                activeView === "authority"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>🏛️</span> Authority Console
            </button>

            <button
              onClick={() => onOpenAuthModal("citizen")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                activeView === "citizen"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>📱</span> Citizen Portal
            </button>
          </div>
        )}

        {/* Right Authentication Badge & System Status */}
        <div className="flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-2 text-xs font-mono text-cyan-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>OPEN-METEO • GloFAS</span>
          </div>

          {currentUser ? (
            <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 p-1.5 shadow-md">
              <div className="flex items-center gap-2.5 px-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm border ${
                  currentUser.role === "authority"
                    ? "bg-cyan-950 text-cyan-400 border-cyan-800/80"
                    : "bg-emerald-950 text-emerald-400 border-emerald-800/80"
                }`}>
                  {currentUser.role === "authority" ? "🏛️" : "👤"}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-extrabold text-white leading-tight">
                    {currentUser.full_name}
                  </p>
                  <p className={`text-[9px] font-bold uppercase tracking-wider ${
                    currentUser.role === "authority" ? "text-cyan-400" : "text-emerald-400"
                  }`}>
                    {currentUser.role === "authority" ? "Disaster Officer" : "Citizen Reporter"}
                  </p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 rounded-lg bg-red-950/80 hover:bg-red-600 text-red-300 hover:text-white border border-red-800/80 px-3 py-1.5 text-xs font-bold transition-all shadow"
                title="Secure Session Logout"
              >
                <span>🚪</span> Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuthModal(null)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-4 py-2 text-xs font-extrabold text-white shadow-lg shadow-cyan-600/20 border border-cyan-400/40 transition-all"
            >
              <span>🛡️</span> Sign In / Confirm Identity
            </button>
          )}
        </div>

      </div>
    </header>
  );
}