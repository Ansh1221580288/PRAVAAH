export default function Header({ mode, setMode }) {
  return (
    <header className="border-b border-slate-800 bg-slate-950 px-6 py-5">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-2xl">
            🌊
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">
              PRAVAAH
            </h1>

            <p className="text-xs text-slate-400">
              Authority Command Console
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">

          <span className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            LIVE
          </span>

          <select
            value={mode}
            onChange={(event) => setMode(event.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white outline-none"
          >
            <option value="normal">
              SIMULATE DISASTER — Normal
            </option>

            <option value="heavy">
              SIMULATE DISASTER — Heavy Rainfall
            </option>

            <option value="critical">
              SIMULATE DISASTER — Critical Flood
            </option>
          </select>

        </div>
      </div>
    </header>
  );
}