import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignIn from '../../pages/SignIn'
import { renderWithRouter, createMockUser, createMockToken } from '../testUtils'
import api from '../../lib/api'

vi.mock('../../lib/api')
vi.mock('../../hooks/useRegistration', () => ({
  default: () => ({ refresh: vi.fn() }),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('SignIn Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  it('renders sign in form with all fields', () => {
    renderWithRouter(<SignIn />)

    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument()
  })

  it('updates form fields on user input', async () => {
    const user = userEvent.setup()
    renderWithRouter(<SignIn />)

    const emailInput = screen.getByPlaceholderText('Email address')
    const passwordInput = screen.getByPlaceholderText('Password')

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    renderWithRouter(<SignIn />)

    const passwordInput = screen.getByPlaceholderText('Password')
    const toggleButton = screen.getByLabelText('Toggle password visibility')

    expect(passwordInput).toHaveAttribute('type', 'password')

    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')

    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('submits form with valid credentials and navigates to dashboard', async () => {
    const user = userEvent.setup()
    const mockUser = createMockUser()
    const mockToken = createMockToken()

    api.post.mockResolvedValueOnce({
      data: { user: mockUser, token: mockToken },
    })

    renderWithRouter(<SignIn />)

    await user.type(screen.getByPlaceholderText('Email address'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      })
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })

    const storedAuth = JSON.parse(sessionStorage.getItem('auth'))
    expect(storedAuth.token).toBe(mockToken)
    expect(storedAuth.user).toEqual(mockUser)
  })

  it('navigates to admin dashboard for admin users', async () => {
    const user = userEvent.setup()
    const mockAdmin = createMockUser({ role: 'admin' })
    const mockToken = createMockToken()

    api.post.mockResolvedValueOnce({
      data: { user: mockAdmin, token: mockToken },
    })

    renderWithRouter(<SignIn />)

    await user.type(screen.getByPlaceholderText('Email address'), 'admin@example.com')
    await user.type(screen.getByPlaceholderText('Password'), 'admin123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin')
    })
  })

  it('displays error message on failed login', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Invalid credentials'

    api.post.mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    })

    renderWithRouter(<SignIn />)

    await user.type(screen.getByPlaceholderText('Email address'), 'wrong@example.com')
    await user.type(screen.getByPlaceholderText('Password'), 'wrongpass')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('displays generic error message when API error has no message', async () => {
    const user = userEvent.setup()

    api.post.mockRejectedValueOnce({
      response: { data: {} },
    })

    renderWithRouter(<SignIn />)

    await user.type(screen.getByPlaceholderText('Email address'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText('Sign in failed.')).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()

    api.post.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )

    renderWithRouter(<SignIn />)

    await user.type(screen.getByPlaceholderText('Email address'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(screen.getByText('Signing in...')).toBeInTheDocument()
  })

  it('has link to sign up page', () => {
    renderWithRouter(<SignIn />)

    const signUpLink = screen.getByRole('link', { name: /sign up/i })
    expect(signUpLink).toHaveAttribute('href', '/signup')
  })
})
