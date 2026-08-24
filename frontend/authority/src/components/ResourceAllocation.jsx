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
    <section className="rounded-2xl border-2 border-red-200 bg-white p-5 shadow-xl">
      <div className="mb-4 border-b-2 border-red-100 pb-3">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <span>🛠️</span> NDRF Emergency Resource Allocation
        </h2>

        <p className="text-xs font-semibold text-slate-500">
          Currently deployed emergency tactical assets across active sector sectors
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border-2 border-blue-100 bg-gradient-to-b from-blue-50/50 to-white p-4 shadow hover:border-blue-400 transition-all"
          >
            <div className="text-2xl">{item.icon}</div>

            <p className="mt-2 text-2xl font-black text-blue-900">
              {item.value}
            </p>

            <p className="mt-0.5 text-xs font-bold text-slate-600">
              {item.label}
            </p>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100">
              <div className="h-full w-3/4 rounded-full bg-red-600 shadow" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}