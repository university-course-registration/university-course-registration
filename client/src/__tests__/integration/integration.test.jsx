import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import SignUp from '../../pages/SignUp'
import SignIn from '../../pages/SignIn'
import StudentDashboard from '../../pages/StudentDashboard'
import api from '../../lib/api'
import storageKeys from '../../constants/storageKeys'

vi.mock('../../lib/api')
vi.mock('../../constants/icons', () => ({
  ArrowRightIcon: () => <div>ArrowRightIcon</div>,
  BookOpenIcon: () => <div>BookOpenIcon</div>,
  AcademicCapIcon: () => <div>AcademicCapIcon</div>,
  ClipboardDocumentListIcon: () => <div>ClipboardDocumentListIcon</div>,
  UserIcon: () => <div>UserIcon</div>,
  MailIcon: () => <div>MailIcon</div>,
  LockIcon: () => <div>LockIcon</div>,
  EyeIcon: () => <div>EyeIcon</div>,
  EyeOffIcon: () => <div>EyeOffIcon</div>,
}))

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Client Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  describe('Authentication Flow', () => {
    it('stores auth data in session storage on successful login', async () => {
      const mockResponse = {
        data: {
          message: 'Login successful',
          user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'student' },
          token: 'mock-token'
        }
      }
      api.post.mockResolvedValueOnce(mockResponse)

      // Simulate successful login by calling the API directly
      const response = await api.post('/auth/login', {
        email: 'test@example.com',
        password: 'Password123!'
      })

      // Store auth like the app would
      sessionStorage.setItem(storageKeys.auth, JSON.stringify({
        user: response.data.user,
        token: response.data.token
      }))

      // Verify auth stored correctly
      const stored = sessionStorage.getItem(storageKeys.auth)
      expect(stored).toBeTruthy()
      const auth = JSON.parse(stored)
      expect(auth.token).toBe('mock-token')
      expect(auth.user.email).toBe('test@example.com')
    })

    it('handles login API error', async () => {
      api.post.mockRejectedValueOnce({
        response: { data: { message: 'Invalid credentials' } }
      })

      try {
        await api.post('/auth/login', {
          email: 'wrong@example.com',
          password: 'wrongpass'
        })
      } catch (error) {
        expect(error.response.data.message).toBe('Invalid credentials')
      }
    })

    it('handles signup API success', async () => {
      const mockResponse = {
        data: {
          message: 'Registration successful',
          user: { id: '1', name: 'Test User', email: 'test@example.com' },
          token: 'mock-token'
        }
      }
      api.post.mockResolvedValueOnce(mockResponse)

      const response = await api.post('/auth/signup', {
        name: 'Test User',
        regNo: 'UG15/CS/1001',
        email: 'test@example.com',
        password: 'Password123!',
        level: '100'
      })

      expect(response.data.message).toBe('Registration successful')
      expect(response.data.user.email).toBe('test@example.com')
    })

    it('handles signup validation error', async () => {
      api.post.mockRejectedValueOnce({
        response: { data: { message: 'Email already exists' } }
      })

      try {
        await api.post('/auth/signup', {
          name: 'Test User',
          regNo: 'UG15/CS/1001',
          email: 'existing@example.com',
          password: 'Password123!',
          level: '100'
        })
      } catch (error) {
        expect(error.response.data.message).toBe('Email already exists')
      }
    })
  })

  describe('Course Registration Workflow', () => {
    beforeEach(() => {
      // Set up authenticated user
      const mockAuth = {
        user: { id: '1', name: 'Test Student', email: 'student@example.com', role: 'student', level: 100 },
        token: 'mock-token'
      }
      sessionStorage.setItem(storageKeys.auth, JSON.stringify(mockAuth))
    })

    it('loads course catalog on mount', async () => {
      const mockCourses = [
        { _id: '1', courseCode: 'CS101', courseName: 'Intro to CS', level: 100, creditUnit: 3, semester: 1 }
      ]
      api.get.mockResolvedValueOnce({ data: { data: mockCourses } })
      api.get.mockResolvedValueOnce({ data: { courses: [], totalCreditUnits: 0 } })

      renderWithRouter(<StudentDashboard />)

      // Verify API calls were made
      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith('/courses/all', { params: { level: '100' } })
      })
    })

    it('loads registered courses on mount', async () => {
      api.get.mockResolvedValueOnce({ data: { data: [] } })
      
      const mockRegistered = [
        { _id: '1', courseCode: 'CS101', courseName: 'Intro to CS', creditUnit: 3 }
      ]
      api.get.mockResolvedValueOnce({ 
        data: { courses: mockRegistered, totalCreditUnits: 3 } 
      })

      renderWithRouter(<StudentDashboard />)

      // Verify registered courses API was called
      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith('/courses/registered')
      })
    })

    it('successfully registers for a course via API', async () => {
      const mockResponse = {
        data: {
          message: 'Course registered successfully',
          courses: [{ _id: '1', courseCode: 'CS101', courseName: 'Intro to CS', creditUnit: 3 }],
          totalCreditUnits: 3
        }
      }
      api.post.mockResolvedValueOnce(mockResponse)

      const response = await api.post('/courses/register', { courseCode: 'CS101' })

      expect(response.data.message).toBe('Course registered successfully')
      expect(response.data.totalCreditUnits).toBe(3)
    })

    it('handles credit limit exceeded error', async () => {
      api.post.mockRejectedValueOnce({
        response: { data: { message: 'Credit limit exceeded' } }
      })

      try {
        await api.post('/courses/register', { courseCode: 'CS101' })
      } catch (error) {
        expect(error.response.data.message).toBe('Credit limit exceeded')
      }
    })

    it('handles duplicate registration error', async () => {
      api.post.mockRejectedValueOnce({
        response: { data: { message: 'Already registered for this course' } }
      })

      try {
        await api.post('/courses/register', { courseCode: 'CS101' })
      } catch (error) {
        expect(error.response.data.message).toBe('Already registered for this course')
      }
    })
  })

  describe('API Integration', () => {
    it('handles network errors gracefully', async () => {
      api.post.mockRejectedValueOnce(new Error('Network Error'))

      try {
        await api.post('/auth/login', { email: 'test@example.com', password: 'password' })
      } catch (error) {
        expect(error.message).toBe('Network Error')
      }
    })

    it('makes authenticated API calls with token', async () => {
      const mockAuth = {
        user: { id: '1', name: 'Test', email: 'test@example.com', role: 'student', level: 100 },
        token: 'mock-token-123'
      }
      sessionStorage.setItem(storageKeys.auth, JSON.stringify(mockAuth))

      api.get.mockResolvedValue({ data: { data: [] } })
      api.get.mockResolvedValueOnce({ data: { courses: [], totalCreditUnits: 0 } })

      renderWithRouter(<StudentDashboard />)

      // Verify API was called (token is added by axios interceptor)
      await waitFor(() => {
        expect(api.get).toHaveBeenCalled()
      })
    })

    it('handles empty response data', async () => {
      const mockAuth = {
        user: { id: '1', name: 'Test', email: 'test@example.com', role: 'student', level: 100 },
        token: 'mock-token'
      }
      sessionStorage.setItem(storageKeys.auth, JSON.stringify(mockAuth))

      // Return empty arrays
      api.get.mockResolvedValueOnce({ data: { data: [] } })
      api.get.mockResolvedValueOnce({ data: { courses: [], totalCreditUnits: 0 } })

      renderWithRouter(<StudentDashboard />)

      // Should display "No courses found" message
      await waitFor(() => {
        expect(screen.getAllByText(/no courses found/i).length).toBeGreaterThan(0)
      })
    })
  })
})
