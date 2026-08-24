export default function SOSReports({ reports }) {
  const getPriorityStyle = (priority) => {
    if (priority === "CRITICAL") {
      return "bg-red-600 text-white border-red-400 font-black shadow";
    }

    if (priority === "HIGH") {
      return "bg-orange-600 text-white border-orange-400 font-bold";
    }

    return "bg-amber-500 text-slate-950 border-amber-400 font-bold";
  };

  return (
    <section className="rounded-2xl border-2 border-red-200 bg-white p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between border-b-2 border-red-100 pb-3">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span>🚨</span> Citizen Emergency SOS Reports
          </h2>

          <p className="text-xs font-semibold text-slate-500">
            Live two-way citizen dispatches sent directly to disaster control HQ
          </p>
        </div>

        <span className="rounded-full bg-red-600 px-3.5 py-1 text-xs font-black text-white shadow border border-red-400">
          {reports.length} Active Dispatches
        </span>
      </div>

      <div className="space-y-3">
        {reports.map((report, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-xl border border-red-200 bg-slate-50 p-3 hover:border-red-400 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-xl border border-red-200">
                🚨
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Sector {report.location}
                </p>

                <p className="text-xs font-medium text-slate-500">
                  Reported {report.time}
                </p>
              </div>
            </div>

            <span
              className={`rounded-xl border px-3 py-1 text-xs uppercase ${getPriorityStyle(
                report.priority
              )}`}
            >
              {report.priority}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}