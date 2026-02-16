function StatCard({ icon, label, value, helper }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            {label}
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
          {helper ? (
            <p className="mt-2 text-xs text-slate-500">{helper}</p>
          ) : null}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
          {icon}
        </div>
      </div>
    </div>
  )
}

export default StatCard
