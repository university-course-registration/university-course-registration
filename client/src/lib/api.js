import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token
api.interceptors.request.use((config) => {
  const auth = sessionStorage.getItem('auth')
  if (auth) {
    const { token } = JSON.parse(auth)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Response interceptor - Global error handling
api.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response

      // Handle 401 Unauthorized - redirect to login
      if (status === 401) {
        // Clear auth data
        sessionStorage.removeItem('auth')
        
        // Only redirect if not already on login page
        if (window.location.pathname !== '/' && window.location.pathname !== '/signup') {
          window.location.href = '/'
        }
      }

      // Map API errors to user-friendly messages
      const errorMessage = data?.message || getDefaultErrorMessage(status)
      
      // Enhance error object with user-friendly message
      error.userMessage = errorMessage
      error.errorType = data?.error || 'Error'
    } else if (error.request) {
      // Request was made but no response received
      error.userMessage = 'Unable to connect to server. Please check your internet connection.'
      error.errorType = 'Network Error'
    } else {
      // Something else happened
      error.userMessage = 'An unexpected error occurred. Please try again.'
      error.errorType = 'Error'
    }

    return Promise.reject(error)
  }
)

// Helper function to get default error messages based on status code
function getDefaultErrorMessage(status) {
  const messages = {
    400: 'Invalid request. Please check your input.',
    401: 'Authentication required. Please log in.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    500: 'Server error. Please try again later.',
    502: 'Bad gateway. Please try again later.',
    503: 'Service unavailable. Please try again later.',
  }
  
  return messages[status] || 'An error occurred. Please try again.'
}

export default api
