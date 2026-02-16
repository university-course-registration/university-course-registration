function RegistrationTotalsFooter({
  totalUnits,
  loading,
  hasRegistration,
  isUpdateMode,
  onRegister,
}) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-4 md:flex-row md:items-center">
      <div>
        <p className="text-sm font-medium text-slate-700">Total credit units</p>
        <p className="text-xs text-slate-500">Maximum allowed: 36</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800">
          {totalUnits} units
        </span>
        <button
          className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          onClick={onRegister}
          disabled={loading || (!isUpdateMode && hasRegistration)}
        >
          {isUpdateMode ? 'Update registration' : 'Register courses'}
        </button>
      </div>
    </div>
  )
}

export default RegistrationTotalsFooter
