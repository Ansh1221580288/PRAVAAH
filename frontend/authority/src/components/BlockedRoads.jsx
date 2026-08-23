export default function BlockedRoads({ roads }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">
          Blocked Roads
        </h2>

        <p className="text-xs text-slate-400">
          Routes affected by flooding
        </p>
      </div>

      {roads.length === 0 ? (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center">
          <p className="text-sm font-medium text-emerald-400">
            No blocked roads
          </p>

          <p className="mt-1 text-xs text-slate-500">
            All monitored routes are currently operational.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {roads.map((road, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-lg">
                  🚧
                </div>

                <div>
                  <p className="text-sm font-medium text-white">
                    {road.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    Road status
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  road.status === "BLOCKED"
                    ? "border-red-500/30 bg-red-500/10 text-red-400"
                    : "border-orange-500/30 bg-orange-500/10 text-orange-400"
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