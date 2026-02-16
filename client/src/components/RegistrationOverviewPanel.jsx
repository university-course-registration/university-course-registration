function RegistrationOverviewPanel({
  firstSemesterCount,
  secondSemesterCount,
  registeredUnits,
  onViewRegistration,
}) {
  return (
    <section className="grid gap-4 rounded-[32px] bg-white/90 p-6 shadow-soft ring-1 ring-slate-200 md:grid-cols-[1fr_auto] md:items-center md:p-8">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            First semester
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {firstSemesterCount}
          </p>
          <p className="text-xs text-slate-500">Registered courses</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Second semester
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {secondSemesterCount}
          </p>
          <p className="text-xs text-slate-500">Registered courses</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Total units
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {registeredUnits}
          </p>
          <p className="text-xs text-slate-500">Credit units</p>
        </div>
      </div>
      <button
        className="h-full w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 md:w-auto"
        type="button"
        onClick={onViewRegistration}
      >
        View your registration
      </button>
    </section>
  )
}

export default RegistrationOverviewPanel
