export default function SituationMonitoring({ data }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">
          Situation Monitoring
        </h2>

        <p className="text-xs text-slate-400">
          Current environmental and operational conditions
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            Rainfall
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {data.rainfall}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Current intensity
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            Water Level
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {data.waterLevel}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Current level
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            Flood Extent
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {data.floodExtent}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Estimated affected area
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Situation Updates
        </p>

        <div className="space-y-2">
          {data.situation.map((update, index) => (
            <div
              key={index}
              className="flex items-center gap-3 text-sm text-slate-300"
            >
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              {update}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}