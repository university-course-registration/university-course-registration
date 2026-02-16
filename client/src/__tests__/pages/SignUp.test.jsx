import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignUp from '../../pages/SignUp'
import { renderWithRouter, createMockUser, createMockToken } from '../testUtils'
import api from '../../lib/api'

vi.mock('../../lib/api')

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('SignUp Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  it('renders sign up form with all fields', () => {
    renderWithRouter(<SignUp />)

    expect(screen.getByPlaceholderText('Full name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Registration number')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Confirm password')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('updates form fields on user input', async () => {
    const user = userEvent.setup()
    renderWithRouter(<SignUp />)

    const nameInput = screen.getByPlaceholderText('Full name')
    const regNoInput = screen.getByPlaceholderText('Registration number')
    const emailInput = screen.getByPlaceholderText('Email address')
    const passwordInput = screen.getByPlaceholderText('Password')
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm password')

    await user.type(nameInput, 'John Doe')
    await user.type(regNoInput, 'UG15/CS/1001')
    await user.type(emailInput, 'john@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')

    expect(nameInput).toHaveValue('John Doe')
    expect(regNoInput).toHaveValue('UG15/CS/1001')
    expect(emailInput).toHaveValue('john@example.com')
    expect(passwordInput).toHaveValue('password123')
    expect(confirmPasswordInput).toHaveValue('password123')
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    renderWithRouter(<SignUp />)

    const passwordInput = screen.getByPlaceholderText('Password')
    const toggleButtons = screen.getAllByLabelText(/toggle.*password visibility/i)

    expect(passwordInput).toHaveAttribute('type', 'password')

    await user.click(toggleButtons[0])
    expect(passwordInput).toHaveAttribute('type', 'text')

    await user.click(toggleButtons[0])
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('toggles confirm password visibility', async () => {
    const user = userEvent.setup()
    renderWithRouter(<SignUp />)

    const confirmPasswordInput = screen.getByPlaceholderText('Confirm password')
    const toggleButtons = screen.getAllByLabelText(/toggle.*password visibility/i)

    expect(confirmPasswordInput).toHaveAttribute('type', 'password')

    await user.click(toggleButtons[1])
    expect(confirmPasswordInput).toHaveAttribute('type', 'text')

    await user.click(toggleButtons[1])
    expect(confirmPasswordInput).toHaveAttribute('type', 'password')
  })

  it('allows selecting different levels', async () => {
    const user = userEvent.setup()
    renderWithRouter(<SignUp />)

    const levelSelect = screen.getByRole('combobox')

    await user.selectOptions(levelSelect, '200')
    expect(levelSelect).toHaveValue('200')

    await user.selectOptions(levelSelect, '300')
    expect(levelSelect).toHaveValue('300')
  })

  it('displays error when passwords do not match', async () => {
    const user = userEvent.setup()
    renderWithRouter(<SignUp />)

    await user.type(screen.getByPlaceholderText('Full name'), 'John Doe')
    await user.type(screen.getByPlaceholderText('Registration number'), 'UG15/CS/1001')
    await user.type(screen.getByPlaceholderText('Email address'), 'john@example.com')
    await user.type(screen.getByPlaceholderText('Password'), 'password123')
    await user.type(screen.getByPlaceholderText('Confirm password'), 'password456')

    const termsCheckbox = screen.getByRole('checkbox')
    await user.click(termsCheckbox)

    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match.')).toBeInTheDocument()
    })

    expect(api.post).not.toHaveBeenCalled()
  })

  it('submits form with valid data and navigates to dashboard', async () => {
    const user = userEvent.setup()
    const mockUser = createMockUser({ name: 'John Doe', regNo: 'UG15/CS/1001' })
    const mockToken = createMockToken()

    api.post.mockResolvedValueOnce({
      data: { user: mockUser, token: mockToken },
    })

    renderWithRouter(<SignUp />)

    await user.type(screen.getByPlaceholderText('Full name'), 'John Doe')
    await user.type(screen.getByPlaceholderText('Registration number'), 'UG15/CS/1001')
    await user.type(screen.getByPlaceholderText('Email address'), 'john@example.com')
    await user.type(screen.getByPlaceholderText('Password'), 'password123')
    await user.type(screen.getByPlaceholderText('Confirm password'), 'password123')

    const termsCheckbox = screen.getByRole('checkbox')
    await user.click(termsCheckbox)

    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/signup', {
        name: 'John Doe',
        regNo: 'UG15/CS/1001',
        email: 'john@example.com',
        password: 'password123',
        level: '100',
      })
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })

    const storedAuth = JSON.parse(sessionStorage.getItem('auth'))
    expect(storedAuth.token).toBe(mockToken)
    expect(storedAuth.user).toEqual(mockUser)
  })

  it('displays error message on failed signup', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Email already exists'

    api.post.mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    })

    renderWithRouter(<SignUp />)

    await user.type(screen.getByPlaceholderText('Full name'), 'John Doe')
    await user.type(screen.getByPlaceholderText('Registration number'), 'UG15/CS/1001')
    await user.type(screen.getByPlaceholderText('Email address'), 'existing@example.com')
    await user.type(screen.getByPlaceholderText('Password'), 'password123')
    await user.type(screen.getByPlaceholderText('Confirm password'), 'password123')

    const termsCheckbox = screen.getByRole('checkbox')
    await user.click(termsCheckbox)

    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('displays generic error message when API error has no message', async () => {
    const user = userEvent.setup()

    api.post.mockRejectedValueOnce({
      response: { data: {} },
    })

    renderWithRouter(<SignUp />)

    await user.type(screen.getByPlaceholderText('Full name'), 'John Doe')
    await user.type(screen.getByPlaceholderText('Registration number'), 'UG15/CS/1001')
    await user.type(screen.getByPlaceholderText('Email address'), 'john@example.com')
    await user.type(screen.getByPlaceholderText('Password'), 'password123')
    await user.type(screen.getByPlaceholderText('Confirm password'), 'password123')

    const termsCheckbox = screen.getByRole('checkbox')
    await user.click(termsCheckbox)

    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText('Sign up failed.')).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()

    api.post.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )

    renderWithRouter(<SignUp />)

    await user.type(screen.getByPlaceholderText('Full name'), 'John Doe')
    await user.type(screen.getByPlaceholderText('Registration number'), 'UG15/CS/1001')
    await user.type(screen.getByPlaceholderText('Email address'), 'john@example.com')
    await user.type(screen.getByPlaceholderText('Password'), 'password123')
    await user.type(screen.getByPlaceholderText('Confirm password'), 'password123')

    const termsCheckbox = screen.getByRole('checkbox')
    await user.click(termsCheckbox)

    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(screen.getByText('Creating account...')).toBeInTheDocument()
  })

  it('has link to sign in page', () => {
    renderWithRouter(<SignUp />)

    const signInLink = screen.getByRole('link', { name: /sign in/i })
    expect(signInLink).toHaveAttribute('href', '/')
  })

  it('requires terms checkbox to be checked', () => {
    renderWithRouter(<SignUp />)

    const termsCheckbox = screen.getByRole('checkbox')
    expect(termsCheckbox).toBeRequired()
  })
})
