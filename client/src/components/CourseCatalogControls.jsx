import { ArrowRightIcon } from '../constants/icons.jsx'
import levels from '../constants/levels.js'
import {
  CATALOG_LEVEL_FILTER_ALL,
  CATALOG_SEARCH_PLACEHOLDER,
} from '../constants/catalog.js'

function CourseCatalogControls({
  query,
  levelFilter,
  onQueryChange,
  onLevelChange,
  currentCount,
  totalCount,
  currentPage,
  totalPages,
  onNextPage,
}) {
  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row">
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-accent-400 focus:outline-none focus:ring-4 focus:ring-accent-100"
            placeholder={CATALOG_SEARCH_PLACEHOLDER}
            value={query}
            onChange={onQueryChange}
          />
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-accent-400 focus:outline-none focus:ring-4 focus:ring-accent-100 md:w-40"
            value={levelFilter}
            onChange={onLevelChange}
          >
            <option value={CATALOG_LEVEL_FILTER_ALL}>All levels</option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level} level
              </option>
            ))}
          </select>
        </div>
        <div className="text-xs text-slate-500">
          Showing {currentCount} of {totalCount}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Page {currentPage} of {totalPages}
        </p>
        <button
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-100"
          type="button"
          onClick={onNextPage}
          disabled={currentPage >= totalPages}
        >
          Next
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default CourseCatalogControls
