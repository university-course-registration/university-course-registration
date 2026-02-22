import { NavLink } from 'react-router-dom'
import adminNavItems from '../constants/adminNavItems.js'
import { LogoutIcon } from '../constants/icons.jsx'

function AdminSidebar({ user, onSignOut }) {
  return (
    <aside className="flex h-full flex-col gap-8 border-r border-slate-200 bg-white/90 px-6 py-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          CourseReg
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900">
          Admin Console
        </h2>
      </div>

      <nav className="flex flex-col gap-2">
        {adminNavItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-auto grid gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-4">
        <div>
          <p className="text-xs text-slate-400">Signed in as</p>
          <p className="text-sm font-semibold text-slate-800">
            {user?.name || 'Admin'}
          </p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
        <div className="flex gap-2">
          <NavLink
            to="/profile"
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Profile
          </NavLink>
          <button
            className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
            type="button"
            onClick={onSignOut}
          >
            <LogoutIcon className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  )
}

export default AdminSidebar
