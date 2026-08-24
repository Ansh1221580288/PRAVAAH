export default function StatCard({
  title,
  value,
  subtitle,
  icon,
}) {
  return (
    <div className="rounded-2xl border-2 border-red-100 bg-white p-5 shadow-xl transition-all hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/10">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
          {title}
        </p>

        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-900 border border-blue-200/80 shadow-sm">
          {icon}
        </span>
      </div>

      <h2 className="mt-2 text-3xl font-black text-red-600 tracking-tight">
        {value}
      </h2>

      <p className="mt-1 text-xs font-semibold text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}