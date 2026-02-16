import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthSession from '../hooks/useAuthSession.js'
import PrimaryButton from '../components/PrimaryButton.jsx'
import api from '../lib/api.js'

function Profile() {
  const { user, clearAuth, updateUser } = useAuthSession()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [passwordStatus, setPasswordStatus] = useState(null)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const response = await api.put('/profile', formData)
      updateUser(response.data.data)
      setStatus({ type: 'success', message: 'Profile updated successfully' })
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update profile'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordStatus(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match' })
      setPasswordLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordStatus({ type: 'error', message: 'Password must be at least 6 characters' })
      setPasswordLoading(false)
      return
    }

    try {
      await api.put('/profile/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      setPasswordStatus({ type: 'success', message: 'Password changed successfully' })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setPasswordStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to change password'
      })
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleSignOut = () => {
    clearAuth()
    navigate('/')
  }

  const handleBack = () => {
    if (user?.role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="page-bg min-h-screen w-full px-6 py-10 text-ink-900 md:px-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Account Settings
            </p>
            <h1 className="font-display text-3xl font-semibold text-slate-900 md:text-4xl">
              Profile
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-100"
              type="button"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-100"
              type="button"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </header>

        <div className="grid gap-6">
          <section className="rounded-[32px] bg-white/90 p-6 shadow-soft ring-1 ring-slate-200 md:p-8">
            <h2 className="mb-6 text-xl font-semibold text-slate-900">Profile Information</h2>
            
            <div className="mb-6 grid gap-4 rounded-2xl bg-slate-50 p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Registration Number</p>
                <p className="text-sm text-slate-900">{user?.regNo}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Level</p>
                <p className="text-sm text-slate-900">{user?.level}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Role</p>
                <p className="text-sm capitalize text-slate-900">{user?.role}</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:border-accent-400 focus:outline-none focus:ring-4 focus:ring-accent-100"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:border-accent-400 focus:outline-none focus:ring-4 focus:ring-accent-100"
                />
              </div>

              {status && (
                <div
                  className={`rounded-2xl p-4 text-sm ${
                    status.type === 'error'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-green-50 text-green-700'
                  }`}
                >
                  {status.message}
                </div>
              )}

              <PrimaryButton type="submit" loading={loading}>
                Update Profile
              </PrimaryButton>
            </form>
          </section>

          <section className="rounded-[32px] bg-white/90 p-6 shadow-soft ring-1 ring-slate-200 md:p-8">
            <h2 className="mb-6 text-xl font-semibold text-slate-900">Change Password</h2>
            
            <form onSubmit={handleChangePassword} className="grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Current Password
                </label>
                <input
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:border-accent-400 focus:outline-none focus:ring-4 focus:ring-accent-100"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  New Password
                </label>
                <input
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:border-accent-400 focus:outline-none focus:ring-4 focus:ring-accent-100"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirm New Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:border-accent-400 focus:outline-none focus:ring-4 focus:ring-accent-100"
                />
              </div>

              {passwordStatus && (
                <div
                  className={`rounded-2xl p-4 text-sm ${
                    passwordStatus.type === 'error'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-green-50 text-green-700'
                  }`}
                >
                  {passwordStatus.message}
                </div>
              )}

              <PrimaryButton type="submit" loading={passwordLoading}>
                Change Password
              </PrimaryButton>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Profile
