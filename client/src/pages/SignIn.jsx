import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FieldInput from '../components/FieldInput.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import AuthLayout from '../layouts/AuthLayout.jsx'
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
} from '../constants/icons.jsx'
import api from '../lib/api.js'
import useRegistration from '../hooks/useRegistration.js'
import useAuthSession from '../hooks/useAuthSession.js'

function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { refresh } = useRegistration()
  const { setAuth } = useAuthSession()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus(null)
    setLoading(true)

    try {
      const response = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      })
      const nextUser = response.data.user
      setAuth({ token: response.data.token, user: nextUser })

      if (nextUser?.role === 'admin') {
        navigate('/admin')
        return
      }

      await refresh()
      navigate('/dashboard')
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Sign in failed.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout badgeText="Bayero University Kano" badgePill="Group ??">
      <div className="space-y-7">
        <div className="fade-up text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            CourseReg
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-slate-900 md:text-4xl">
            Welcome back
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Sign in to manage your courses, schedules, and updates.
          </p>
        </div>

        <form
          className="fade-up delay-3 flex flex-col items-center space-y-4"
          onSubmit={handleSubmit}
        >
          <FieldInput
            icon={<MailIcon />}
            placeholder="Email address"
            type="email"
            inputProps={{
              name: 'email',
              value: form.email,
              onChange: handleChange,
              autoComplete: 'email',
            }}
          />

          <FieldInput
            icon={<LockIcon />}
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            onToggle={() => setShowPassword((value) => !value)}
            toggleLabel="Toggle password visibility"
            value={showPassword ? <EyeOffIcon /> : <EyeIcon />}
            inputProps={{
              name: 'password',
              value: form.password,
              onChange: handleChange,
              autoComplete: 'current-password',
            }}
          />

          {status ? (
            <div
              className={`w-2/3 rounded-2xl px-4 py-3 text-center text-xs ${
                status.type === 'error'
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {status.message}
            </div>
          ) : null}

          <div className="flex w-2/3 flex-col items-center gap-3 text-center text-xs text-slate-500 sm:flex-row sm:justify-between">
            <label className="flex items-center gap-2">
              <input
                className="h-4 w-4 rounded border-slate-300 text-accent-500 focus:ring-accent-200"
                type="checkbox"
              />
              Remember me
            </label>
            {/* <a className="font-medium text-slate-700 hover:text-accent-500" href="#">
              Forgot password?
            </a> */}
          </div>

          <PrimaryButton>{loading ? 'Signing in...' : 'Sign in'}</PrimaryButton>

          <p className="text-center text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <Link className="font-semibold text-slate-800 hover:text-accent-500" to="/signup">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignIn
