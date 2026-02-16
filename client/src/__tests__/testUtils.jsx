import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'

/**
 * Custom render function that wraps components with necessary providers
 * @param {React.ReactElement} ui - Component to render
 * @param {Object} options - Additional render options
 * @returns {Object} - Render result with utilities
 */
export function renderWithRouter(ui, options = {}) {
  return render(ui, {
    wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>,
    ...options,
  })
}

/**
 * Mock axios module for testing
 * @returns {Object} - Mocked axios instance
 */
export function createMockAxios() {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    interceptors: {
      request: {
        use: vi.fn(),
        eject: vi.fn(),
      },
      response: {
        use: vi.fn(),
        eject: vi.fn(),
      },
    },
  }
}

/**
 * Create mock user data for testing
 * @param {Object} overrides - Properties to override
 * @returns {Object} - Mock user object
 */
export function createMockUser(overrides = {}) {
  return {
    _id: '507f1f77bcf86cd799439011',
    name: 'Test User',
    regNo: 'UG15/CS/1001',
    email: 'test@example.com',
    level: 100,
    role: 'student',
    registeredCourses: [],
    ...overrides,
  }
}

/**
 * Create mock course data for testing
 * @param {Object} overrides - Properties to override
 * @returns {Object} - Mock course object
 */
export function createMockCourse(overrides = {}) {
  return {
    _id: '507f1f77bcf86cd799439012',
    courseCode: 'CS101',
    courseName: 'Introduction to Computer Science',
    semester: 1,
    creditUnit: 3,
    level: 100,
    ...overrides,
  }
}

/**
 * Create mock authentication token
 * @returns {string} - Mock JWT token
 */
export function createMockToken() {
  return 'mock-jwt-token-12345'
}

/**
 * Setup session storage with mock user and token
 * @param {Object} user - User object to store
 * @param {string} token - Token to store
 */
export function setupMockSession(user = null, token = null) {
  if (user) {
    window.sessionStorage.setItem('user', JSON.stringify(user))
  }
  if (token) {
    window.sessionStorage.setItem('token', token)
  }
}

/**
 * Clear session storage
 */
export function clearMockSession() {
  window.sessionStorage.clear()
}
