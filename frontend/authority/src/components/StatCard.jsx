export default function StatCard({
  title,
  value,
  subtitle,
  icon,
}) {
  return (
    <div className="rounded-2xl border-2 border-red-100 bg-white p-3.5 sm:p-5 shadow-xl transition-all hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/10">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 leading-tight">
          {title}
        </p>

        <span className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg sm:text-xl text-blue-900 border border-blue-200/80 shadow-sm">
          {icon}
        </span>
      </div>

      <h2 className="mt-2 text-2xl sm:text-3xl font-black text-red-600 tracking-tight">
        {value}
      </h2>

      <p className="mt-1 text-[10px] sm:text-xs font-semibold text-slate-500 line-clamp-2">
        {subtitle}
      </p>
    </div>
  );
}