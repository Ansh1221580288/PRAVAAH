export default function BlockedRoads({ roads }) {
  return (
    <section className="rounded-2xl border-2 border-red-200 bg-white p-5 shadow-xl">
      <div className="mb-4 border-b-2 border-red-100 pb-3">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <span>🚧</span> Blocked Highway Roads & Breaches
        </h2>

        <p className="text-xs font-semibold text-slate-500">
          Himalayan mountain routes affected by landslides and flash flood submergence
        </p>
      </div>

      {roads.length === 0 ? (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-5 text-center">
          <p className="text-sm font-bold text-emerald-700">
            No blocked roads
          </p>

          <p className="mt-1 text-xs text-slate-600 font-semibold">
            All monitored routes are currently operational.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {roads.map((road, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl border border-red-200 bg-slate-50 p-3 hover:border-red-400 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-xl border border-red-200">
                  🚧
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {road.name}
                  </p>

                  <p className="text-xs font-medium text-slate-500">
                    Critical Infrastructure Breach
                  </p>
                </div>
              </div>

              <span
                className={`rounded-xl border px-3 py-1 text-xs font-black ${
                  road.status === "BLOCKED"
                    ? "border-red-400 bg-red-600 text-white shadow"
                    : "border-amber-400 bg-amber-500 text-slate-950 font-bold"
                }`}
              >
                {road.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}