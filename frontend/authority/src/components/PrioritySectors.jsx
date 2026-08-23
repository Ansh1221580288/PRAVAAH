export default function PrioritySectors({ sectors }) {
  const getLevelStyle = (level) => {
    if (level === "CRITICAL") {
      return "border-red-500/30 bg-red-500/10 text-red-400";
    }

    if (level === "HIGH") {
      return "border-orange-500/30 bg-orange-500/10 text-orange-400";
    }

    if (level === "MEDIUM") {
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";
    }

    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">
          Priority Sectors
        </h2>

        <p className="text-xs text-slate-400">
          Sectors requiring immediate monitoring
        </p>
      </div>

      <div className="space-y-3">
        {sectors.map((sector) => (
          <div
            key={sector.name}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-slate-300">
                {sector.name}
              </div>

              <div>
                <p className="text-sm font-medium text-white">
                  Sector {sector.name}
                </p>

                <p className="text-xs text-slate-500">
                  Flood risk zone
                </p>
              </div>
            </div>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getLevelStyle(
                sector.level
              )}`}
            >
              {sector.level}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}