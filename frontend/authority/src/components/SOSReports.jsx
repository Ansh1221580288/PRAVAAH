export default function SOSReports({ reports }) {
  const getPriorityStyle = (priority) => {
    if (priority === "CRITICAL") {
      return "bg-red-500/10 text-red-400 border-red-500/30";
    }

    if (priority === "HIGH") {
      return "bg-orange-500/10 text-orange-400 border-orange-500/30";
    }

    return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            SOS Reports
          </h2>

          <p className="text-xs text-slate-400">
            Active emergency reports
          </p>
        </div>

        <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
          {reports.length} Active
        </span>
      </div>

      <div className="space-y-3">
        {reports.map((report, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-lg">
                🚨
              </div>

              <div>
                <p className="text-sm font-medium text-white">
                  Sector {report.location}
                </p>

                <p className="text-xs text-slate-500">
                  Reported {report.time}
                </p>
              </div>
            </div>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityStyle(
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