import levels from '../constants/levels.js'

function LevelSelectorPanel({ selectedLevel, onLevelChange, status }) {
  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-700">Level</p>
          <p className="text-xs text-slate-500">
            Courses update automatically when you change level.
          </p>
        </div>
        <select
          className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-accent-400 focus:outline-none focus:ring-4 focus:ring-accent-100 md:w-56"
          value={selectedLevel}
          onChange={onLevelChange}
        >
          {levels.map((level) => (
            <option key={level} value={level}>
              {level} Level
            </option>
          ))}
        </select>
      </div>

      {status ? (
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            status.type === 'success'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-rose-50 text-rose-700'
          }`}
        >
          {status.message}
        </div>
      ) : null}
    </div>
  )
}

export default LevelSelectorPanel
