export default function ResourceAllocation({ resources }) {
  const items = [
    {
      label: "Rescue Teams",
      value: resources.rescueTeams,
      icon: "👷",
    },
    {
      label: "Rescue Boats",
      value: resources.boats,
      icon: "🚤",
    },
    {
      label: "Ambulances",
      value: resources.ambulances,
      icon: "🚑",
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">
          Resource Allocation
        </h2>

        <p className="text-xs text-slate-400">
          Currently deployed emergency resources
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-800 bg-slate-950 p-4"
          >
            <div className="text-2xl">{item.icon}</div>

            <p className="mt-3 text-2xl font-bold text-white">
              {item.value}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {item.label}
            </p>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-3/4 rounded-full bg-cyan-400" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}