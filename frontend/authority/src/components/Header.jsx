import React, { useState } from "react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-red-600 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 shadow-2xl backdrop-blur-md">
      <div className="mx-auto max-w-[1600px] px-4 py-3 sm:px-6">
        
        {/* Top Navbar Row */}
        <div className="flex items-center justify-between gap-2">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src="/pravaah_logo.png"
              alt="PRAVAAH - Navigate to Safety"
              className="h-9 w-auto sm:h-11 rounded-xl border-2 border-red-500/80 shadow-lg shadow-blue-500/30 object-contain bg-blue-950 p-1"
            />

            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-widest text-white drop-shadow-md">
                  PRAVAAH
                </h1>
                <span className="rounded-full bg-red-600 px-2 py-0.5 text-[9px] sm:text-[10px] font-black text-white border border-red-400 uppercase tracking-wider shadow">
                  SAFETY
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-blue-200 font-semibold leading-tight">
                Himalayan Multi-Hazard & Risk-Aware Evacuation Engine
              </p>
            </div>
          </div>

          {/* Desktop Navigation Items (hidden on mobile < md) */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Broadcast Alert Button (Authority View) */}
            {activeView === "authority" && (
              <button
                onClick={onOpenBroadcast}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 px-3.5 py-2 text-xs font-black text-white shadow-lg shadow-rose-600/30 border border-rose-400 animate-pulse transition-transform active:scale-95"
              >
                <span>📡</span>
                <span>BROADCAST ALERT</span>
              </button>
            )}

            {/* Portal Switcher or Confirmed Role Badge */}
            {currentUser ? (
              <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 border border-slate-800 shadow">
                {currentUser.role === "authority" ? (
                  <div className="flex items-center gap-2 text-cyan-300 font-extrabold text-xs">
                    <span>🏛️</span>
                    <span>Authority Operations Console</span>
                    <span className="rounded bg-cyan-950 px-2 py-0.5 text-[9px] text-cyan-400 border border-cyan-800">LOGGED IN</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-xs">
                    <span>📱</span>
                    <span>Citizen Emergency Portal</span>
                    <span className="rounded bg-emerald-950 px-2 py-0.5 text-[9px] text-emerald-400 border border-emerald-800">LOGGED IN</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1 rounded-xl bg-slate-900 p-1 border border-slate-800">
                <button
                  onClick={() => onOpenAuthModal("authority")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    activeView === "authority"
                      ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>🏛️</span> Authority Console
                </button>

                <button
                  onClick={() => onOpenAuthModal("citizen")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    activeView === "citizen"
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>📱</span> Citizen Portal
                </button>
              </div>
            )}

            {/* Status Indicator */}
            <div className="hidden xl:flex items-center gap-2 text-xs font-mono text-cyan-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>OPEN-METEO • GloFAS</span>
            </div>

            {/* Auth Controls */}
            {currentUser ? (
              <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 p-1.5 shadow-md">
                <div className="flex items-center gap-2 px-2">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg font-bold text-xs border ${
                    currentUser.role === "authority"
                      ? "bg-cyan-950 text-cyan-400 border-cyan-800/80"
                      : "bg-emerald-950 text-emerald-400 border-emerald-800/80"
                  }`}>
                    {currentUser.role === "authority" ? "🏛️" : "👤"}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-extrabold text-white leading-tight">
                      {currentUser.full_name}
                    </p>
                    <p className={`text-[9px] font-bold uppercase tracking-wider ${
                      currentUser.role === "authority" ? "text-cyan-400" : "text-emerald-400"
                    }`}>
                      {currentUser.role === "authority" ? "Disaster Officer" : "Citizen"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 rounded-lg bg-red-950/80 hover:bg-red-600 text-red-300 hover:text-white border border-red-800/80 px-2.5 py-1.5 text-xs font-bold transition-all shadow"
                  title="Secure Session Logout"
                >
                  <span>🚪</span> Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuthModal(null)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-3.5 py-2 text-xs font-extrabold text-white shadow-lg shadow-cyan-600/20 border border-cyan-400/40 transition-all"
              >
                <span>🛡️</span> Sign In
              </button>
            )}
          </div>

          {/* Hamburger Menu Toggle Button (Mobile < md) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-700/80 text-white shadow-lg focus:outline-none active:scale-95 transition-all"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? (
              <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-800 flex flex-col gap-3 animate-fadeIn">
            
            {/* Tagline Subtext on Mobile */}
            <p className="text-[11px] text-blue-200 font-medium bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              🏔️ Himalayan Multi-Hazard & Risk-Aware Evacuation Engine
            </p>

            {/* Broadcast Alert Button (Authority Mode) */}
            {activeView === "authority" && (
              <button
                onClick={() => {
                  onOpenBroadcast();
                  closeMobileMenu();
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-4 py-2.5 text-xs font-black text-white shadow-lg border border-rose-400 animate-pulse"
              >
                <span>📡</span>
                <span>BROADCAST EMERGENCY ALERT</span>
              </button>
            )}

            {/* Portal Switcher */}
            {currentUser ? (
              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm border ${
                    currentUser.role === "authority"
                      ? "bg-cyan-950 text-cyan-400 border-cyan-800"
                      : "bg-emerald-950 text-emerald-400 border-emerald-800"
                  }`}>
                    {currentUser.role === "authority" ? "🏛️" : "👤"}
                  </div>
                  <div>
                    <p className="text-xs font-black text-white leading-tight">
                      {currentUser.full_name}
                    </p>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${
                      currentUser.role === "authority" ? "text-cyan-400" : "text-emerald-400"
                    }`}>
                      {currentUser.role === "authority" ? "Authority Console" : "Citizen Reporter"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onLogout();
                    closeMobileMenu();
                  }}
                  className="rounded-lg bg-red-950/80 text-red-300 hover:text-white border border-red-800 px-3 py-1.5 text-xs font-bold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-950 p-1.5 border border-slate-800">
                <button
                  onClick={() => {
                    onOpenAuthModal("authority");
                    closeMobileMenu();
                  }}
                  className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
                    activeView === "authority"
                      ? "bg-cyan-500 text-slate-950 shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>🏛️</span> Authority
                </button>

                <button
                  onClick={() => {
                    onOpenAuthModal("citizen");
                    closeMobileMenu();
                  }}
                  className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
                    activeView === "citizen"
                      ? "bg-emerald-500 text-slate-950 shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>📱</span> Citizen Portal
                </button>
              </div>
            )}

            {/* Auth Sign In Button if not logged in */}
            {!currentUser && (
              <button
                onClick={() => {
                  onOpenAuthModal(null);
                  closeMobileMenu();
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg border border-cyan-400/40"
              >
                <span>🛡️</span> Sign In / Confirm Identity
              </button>
            )}

            {/* Telemetry Badge */}
            <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-cyan-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE TELEMETRY: OPEN-METEO • GloFAS</span>
            </div>

          </div>
        )}

      </div>
    </header>
  );
}