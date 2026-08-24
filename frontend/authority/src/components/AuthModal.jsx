import { useState, useEffect } from "react";

export default function AuthModal({ isOpen, onClose, onAuthSuccess, defaultRole }) {
  const [confirmedRole, setConfirmedRole] = useState(defaultRole || null); // null | 'authority' | 'citizen'
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Sync role when modal opens with a default role
  useEffect(() => {
    if (isOpen) {
      if (defaultRole) {
        setConfirmedRole(defaultRole);
        if (defaultRole === "authority") {
          setEmail("officer@pravaah.gov.in");
          setPassword("officer123");
        } else {
          setEmail("citizen@pravaah.in");
          setPassword("citizen123");
        }
      } else {
        setConfirmedRole(null);
        setEmail("");
        setPassword("");
      }
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [isOpen, defaultRole]);

  if (!isOpen) return null;

  const handleConfirmRole = (roleChoice) => {
    setConfirmedRole(roleChoice);
    setErrorMsg("");
    setSuccessMsg("");

    if (roleChoice === "authority") {
      setEmail("officer@pravaah.gov.in");
      setPassword("officer123");
    } else {
      setEmail("citizen@pravaah.in");
      setPassword("citizen123");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const payload = mode === "login"
      ? { email, password }
      : { full_name: fullName, email, password, role: confirmedRole, organization };

    try {
      const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setSuccessMsg(data.message || "Authentication successful!");
        setTimeout(() => {
          onAuthSuccess(data.user, data.token);
          onClose();
        }, 1000);
      } else {
        setErrorMsg(data.detail || "Authentication failed. Please check your credentials.");
      }
    } catch (err) {
      console.log("Authentication server connection error.", err);
      setErrorMsg("Unable to connect to Authentication server. Please verify backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-fadeIn">
      <div className={`relative w-full max-w-md rounded-3xl border ${
        confirmedRole === "citizen" ? "border-emerald-800/80 bg-slate-900" : "border-cyan-800/80 bg-slate-900"
      } p-6 sm:p-8 shadow-2xl space-y-6 transition-all`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors text-lg"
        >
          ✕
        </button>

        {/* STEP 1: IDENTITY CONFIRMATION GATE (Shown when role is not confirmed yet) */}
        {!confirmedRole ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-950 px-3.5 py-1 text-xs font-black text-cyan-400 border border-cyan-800">
                <span>🛡️</span> PRAVAAH ACCESS GATEWAY
              </div>
              <h2 className="text-2xl font-black text-white">
                Confirm Your Identity
              </h2>
              <p className="text-xs text-slate-300">
                To access your dedicated portal, please select and confirm who you are:
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* Option A: Government Official */}
              <button
                type="button"
                onClick={() => handleConfirmRole("authority")}
                className="w-full flex items-start gap-4 rounded-2xl border border-cyan-700/80 bg-slate-950 p-4 hover:bg-cyan-950/60 hover:border-cyan-400 transition-all text-left group shadow-lg"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-950 text-2xl border border-cyan-700 text-cyan-400">
                  🏛️
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-white group-hover:text-cyan-300">
                      Government Official / Authority
                    </h3>
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">OFFICER</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Multi-Hazard Operations Console, Hydrological Gauges & Emergency Dispatches.
                  </p>
                </div>
              </button>

              {/* Option B: Public Citizen */}
              <button
                type="button"
                onClick={() => handleConfirmRole("citizen")}
                className="w-full flex items-start gap-4 rounded-2xl border border-emerald-700/80 bg-slate-950 p-4 hover:bg-emerald-950/60 hover:border-emerald-400 transition-all text-left group shadow-lg"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-950 text-2xl border border-emerald-700 text-emerald-400">
                  👤
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-white group-hover:text-emerald-300">
                      Public Citizen / Resident
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">CITIZEN</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Multilingual Audio Warnings, Emergency SOS, Incident Form & Safe Shelters.
                  </p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: DEDICATED CONFIRMED ROLE LOGIN / SIGNUP SCREEN (No mixed options shown!) */
          <div className="space-y-5">
            
            {/* Header & Change Role Button */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setConfirmedRole(null)}
                  className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  ← Change Identity
                </button>

                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  confirmedRole === "authority"
                    ? "bg-cyan-950 text-cyan-300 border-cyan-800"
                    : "bg-emerald-950 text-emerald-300 border-emerald-800"
                }`}>
                  {confirmedRole === "authority" ? "🏛️ AUTHORITY ACCESS" : "👤 CITIZEN ACCESS"}
                </span>
              </div>

              <div className="text-center space-y-1">
                <h2 className="text-2xl font-black text-white">
                  {confirmedRole === "authority"
                    ? (mode === "login" ? "Authority Operations Sign In" : "Register Officer Account")
                    : (mode === "login" ? "Public Citizen Sign In" : "Register Citizen Account")}
                </h2>
                <p className="text-xs text-slate-400">
                  {confirmedRole === "authority"
                    ? "Access Command Console, live hydro-gauges & emergency dispatches"
                    : "Access Early Warnings, Emergency SOS & safe relief shelters"}
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => { setMode("login"); setErrorMsg(""); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === "login"
                    ? confirmedRole === "authority" ? "bg-cyan-600 text-white shadow" : "bg-emerald-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode("signup"); setErrorMsg(""); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === "signup"
                    ? confirmedRole === "authority" ? "bg-cyan-600 text-white shadow" : "bg-emerald-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Register Account
              </button>
            </div>

            {/* Autofill Demo Credentials (ONLY for the confirmed role) */}
            {mode === "login" && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-400">⚡ Demo Account:</span>
                <button
                  type="button"
                  onClick={() => handleConfirmRole(confirmedRole)}
                  className={`rounded-lg px-3 py-1 text-[10px] font-bold border transition-colors ${
                    confirmedRole === "authority"
                      ? "bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border-cyan-800"
                      : "bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border-emerald-800"
                  }`}
                >
                  {confirmedRole === "authority" ? "🏛️ Auto-fill Demo Officer Credentials" : "👤 Auto-fill Demo Citizen Credentials"}
                </button>
              </div>
            )}

            {/* Form Inputs */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {mode === "signup" && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={confirmedRole === "authority" ? "Commander R. Sharma" : "Anshul Kumar"}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={confirmedRole === "authority" ? "officer@pravaah.gov.in" : "citizen@pravaah.in"}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {mode === "signup" && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Organization / Department</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder={confirmedRole === "authority" ? "NDRF Command HQ" : "Citizen Safety Reporter"}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              )}

              {errorMsg && (
                <div className="rounded-xl border border-red-800/80 bg-red-950/60 p-3 text-xs text-red-300">
                  ⚠️ {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="rounded-xl border border-emerald-800/80 bg-emerald-950/60 p-3 text-xs text-emerald-300">
                  ✅ {successMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl py-3 text-xs font-black text-white shadow-lg transition-all disabled:opacity-50 ${
                  confirmedRole === "authority"
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-600/20"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/20"
                }`}
              >
                {loading
                  ? "Authenticating Credentials..."
                  : mode === "login"
                  ? `SIGN IN TO ${confirmedRole === "authority" ? "AUTHORITY CONSOLE" : "CITIZEN PORTAL"} ➔`
                  : `REGISTER AS ${confirmedRole === "authority" ? "AUTHORITY OFFICER" : "PUBLIC CITIZEN"} ➔`}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
