import React, { useState } from "react";

export default function LogoutConfirmModal({ isOpen, onClose, onConfirmLogout, userName, userRole }) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsProcessing(true);
    await onConfirmLogout();
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl border border-red-800/80 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-950 px-3 py-1 text-xs font-bold text-red-400 border border-red-800">
            <span>🛡️</span> SECURITY & SESSION MANAGEMENT
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Confirm Account Logout
          </h2>
          <p className="text-xs text-slate-400">
            Are you sure you want to terminate your active PRAVAAH session?
          </p>
        </div>

        {/* Active User Info Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active User Profile</span>
            <span className="rounded-full bg-cyan-950 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-800">
              {userRole === "authority" ? "🏛️ Authority Officer" : "👤 Citizen Reporter"}
            </span>
          </div>
          <p className="text-sm font-extrabold text-white">{userName || "Authenticated User"}</p>
          <p className="text-xs text-slate-400">Your authentication token & active session state will be safely cleared.</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 py-3 text-xs font-bold text-slate-200 transition-all disabled:opacity-50"
          >
            Cancel & Stay
          </button>
          
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isProcessing}
            className="w-full rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 py-3 text-xs font-extrabold text-white shadow-lg shadow-red-600/20 transition-all disabled:opacity-50"
          >
            {isProcessing ? "Invalidating Session..." : "Yes, Safe Logout ➔"}
          </button>
        </div>

      </div>
    </div>
  );
}
