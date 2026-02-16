function FieldInput({
  icon,
  type,
  placeholder,
  inputProps = {},
  value,
  onToggle,
  toggleLabel,
}) {
  return (
    <div className="relative mx-auto w-2/3">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </span>
      <input
        className="w-full rounded-full border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-700 shadow-sm focus:border-accent-400 focus:outline-none focus:ring-4 focus:ring-accent-100"
        placeholder={placeholder}
        type={type}
        required
        {...inputProps}
      />
      {onToggle ? (
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 transition hover:text-slate-600"
          type="button"
          aria-label={toggleLabel}
          onClick={onToggle}
        >
          {value}
        </button>
      ) : null}
    </div>
  )
}

export default FieldInput
