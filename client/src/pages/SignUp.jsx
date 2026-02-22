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
  UserIcon,
} from '../constants/icons.jsx'
import levels from '../constants/levels.js'
import api from '../lib/api.js'

function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [form, setForm] = useState({
    name: '',
    regNo: '',
    email: '',
    level: levels[0],
    password: '',
    confirmPassword: '',
  })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus(null)

    if (form.password !== form.confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' })
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/auth/signup', {
        name: form.name,
        regNo: form.regNo,
        email: form.email,
        password: form.password,
        level: form.level,
      })
      sessionStorage.setItem(
        'auth',
        JSON.stringify({ token: response.data.token, user: response.data.user })
      )
      navigate('/dashboard')
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Sign up failed.',
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
            Create your account
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Track courses, build schedules, and stay ahead of deadlines.
          </p>
        </div>

        <form
          className="fade-up delay-3 flex flex-col items-center space-y-4"
          onSubmit={handleSubmit}
        >
          <FieldInput
            icon={<UserIcon />}
            placeholder="Full name"
            type="text"
            inputProps={{
              name: 'name',
              value: form.name,
              onChange: handleChange,
              autoComplete: 'name',
            }}
          />

          <FieldInput
            icon={<span className="text-xs font-semibold text-slate-400">#</span>}
            placeholder="Registration number"
            type="text"
            inputProps={{
              name: 'regNo',
              value: form.regNo,
              onChange: handleChange,
            }}
          />

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

          <div className="relative mx-auto w-2/3">
            <select
              className="w-full rounded-full border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-700 shadow-sm focus:border-accent-400 focus:outline-none focus:ring-4 focus:ring-accent-100"
              name="level"
              value={form.level}
              onChange={handleChange}
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level} Level
                </option>
              ))}
            </select>
          </div>

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
              autoComplete: 'new-password',
            }}
          />

          <FieldInput
            icon={<LockIcon />}
            placeholder="Confirm password"
            type={showConfirmPassword ? 'text' : 'password'}
            onToggle={() => setShowConfirmPassword((value) => !value)}
            toggleLabel="Toggle confirm password visibility"
            value={showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
            inputProps={{
              name: 'confirmPassword',
              value: form.confirmPassword,
              onChange: handleChange,
              autoComplete: 'new-password',
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
                required
              />
              I agree to the Terms and Privacy Policy
            </label>
            <Link className="font-medium text-slate-700 hover:text-accent-500" to="/">
              Need help?
            </Link>
          </div>

          <PrimaryButton>{loading ? 'Creating account...' : 'Create account'}</PrimaryButton>

          <p className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link className="font-semibold text-slate-800 hover:text-accent-500" to="/">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp
