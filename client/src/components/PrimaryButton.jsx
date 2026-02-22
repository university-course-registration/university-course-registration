function PrimaryButton({ children }) {
  return (
    <button
      className="mx-auto w-2/3 rounded-full bg-slate-900 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
      type="submit"
    >
      {children}
    </button>
  )
}

export default PrimaryButton
