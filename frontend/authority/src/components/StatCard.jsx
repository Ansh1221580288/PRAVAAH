export default function StatCard({
  title,
  value,
  subtitle,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-400">
          {title}
        </p>

        <span className="text-xl">
          {icon}
        </span>
      </div>

      <h2 className="mt-3 text-3xl font-bold text-white">
        {value}
      </h2>

      <p className="mt-1 text-xs text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}