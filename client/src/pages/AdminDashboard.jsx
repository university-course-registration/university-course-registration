import StatCard from '../components/StatCard.jsx'
import { BookIcon, ChartIcon, UsersIcon } from '../constants/icons.jsx'
import useAdminStats from '../hooks/useAdminStats.js'

function AdminDashboard() {
  const { stats, loading, status } = useAdminStats()

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          Admin Overview
        </p>
        <h1 className="font-display text-3xl font-semibold text-slate-900 md:text-4xl">
          Dashboard snapshot
        </h1>
        <p className="text-sm text-slate-500">
          Track student activity and course catalog at a glance.
        </p>
      </header>

      {status ? (
        <div
          className={`rounded-2xl px-4 py-3 text-xs ${
            status.type === 'error'
              ? 'bg-rose-50 text-rose-700'
              : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          {status.message}
        </div>
      ) : null}

      <section className="grid gap-6 md:grid-cols-3">
        <StatCard
          icon={<ChartIcon className="h-5 w-5" />}
          label="Status"
          value={loading ? 'Loading' : 'Live'}
          helper="Powered by admin insights"
        />
        <StatCard
          icon={<UsersIcon className="h-5 w-5" />}
          label="Students"
          value={loading ? '...' : stats.students}
          helper="Active student profiles"
        />
        <StatCard
          icon={<BookIcon className="h-5 w-5" />}
          label="Courses"
          value={loading ? '...' : stats.courses}
          helper="Catalog entries"
        />
      </section>
    </div>
  )
}

export default AdminDashboard
