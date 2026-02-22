function TableShell({
  title,
  countLabel,
  columns,
  children,
  footer,
  columnsClassName =
    'grid grid-cols-[1.2fr_1fr_140px] gap-4 border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400',
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {title}
        </span>
        <span className="text-xs text-slate-400">{countLabel}</span>
      </div>

      <div className={columnsClassName}>
        {columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>

      <div className="divide-y divide-slate-200">{children}</div>

      {footer ? (
        <div className="border-t border-slate-200 px-4 py-3">{footer}</div>
      ) : null}
    </div>
  )
}

export default TableShell
