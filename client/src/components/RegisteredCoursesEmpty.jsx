function RegisteredCoursesEmpty({ onGoDashboard }) {
  return (
    <div className="flex flex-col items-start gap-3 text-sm text-slate-500">
      <p>No registered courses found yet.</p>
      <button
        className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
        type="button"
        onClick={onGoDashboard}
      >
        Go to dashboard
      </button>
    </div>
  )
}

export default RegisteredCoursesEmpty
