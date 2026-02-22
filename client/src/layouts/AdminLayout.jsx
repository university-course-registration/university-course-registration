import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar.jsx'
import useAuthSession from '../hooks/useAuthSession.js'

function AdminLayout() {
  const { user, clearAuth } = useAuthSession()
  const navigate = useNavigate()

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  const handleSignOut = () => {
    clearAuth()
    navigate('/')
  }

  return (
    <div className="page-bg min-h-screen w-full text-ink-900">
      <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
        <AdminSidebar user={user} onSignOut={handleSignOut} />
        <main className="px-6 py-10 md:px-12">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
