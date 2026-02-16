import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { act } from 'react'
import useAuthSession from '../../hooks/useAuthSession'
import useCourseCatalog from '../../hooks/useCourseCatalog'
import useRegistration from '../../hooks/useRegistration'
import useAdminStats from '../../hooks/useAdminStats'
import api from '../../lib/api'
import storageKeys from '../../constants/storageKeys'

vi.mock('../../lib/api')

describe('Client Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  afterEach(() => {
    sessionStorage.clear()
  })

  describe('useAuthSession', () => {
    it('returns null user and token when no auth in session storage', () => {
      const { result } = renderHook(() => useAuthSession())
      
      expect(result.current.user).toBeNull()
      expect(result.current.token).toBeNull()
      expect(result.current.auth).toBeNull()
    })

    it('returns user and token from session storage', () => {
      const mockAuth = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        token: 'mock-token-123'
      }
      sessionStorage.setItem(storageKeys.auth, JSON.stringify(mockAuth))
      
      const { result } = renderHook(() => useAuthSession())
      
      expect(result.current.user).toEqual(mockAuth.user)
      expect(result.current.token).toBe(mockAuth.token)
      expect(result.current.auth).toEqual(mockAuth)
    })

    it('setAuth stores auth in session storage', () => {
      const { result } = renderHook(() => useAuthSession())
      const mockAuth = {
        user: { id: '1', name: 'Test User' },
        token: 'new-token'
      }
      
      act(() => {
        result.current.setAuth(mockAuth)
      })
      
      const stored = JSON.parse(sessionStorage.getItem(storageKeys.auth))
      expect(stored).toEqual(mockAuth)
    })

    it('setAuth with null removes auth from session storage', () => {
      sessionStorage.setItem(storageKeys.auth, JSON.stringify({ token: 'test' }))
      
      const { result } = renderHook(() => useAuthSession())
      
      act(() => {
        result.current.setAuth(null)
      })
      
      expect(sessionStorage.getItem(storageKeys.auth)).toBeNull()
    })

    it('clearAuth removes auth from session storage', () => {
      sessionStorage.setItem(storageKeys.auth, JSON.stringify({ token: 'test' }))
      
      const { result } = renderHook(() => useAuthSession())
      
      act(() => {
        result.current.clearAuth()
      })
      
      expect(sessionStorage.getItem(storageKeys.auth)).toBeNull()
    })

    it('handles malformed JSON in session storage', () => {
      sessionStorage.setItem(storageKeys.auth, 'invalid-json')
      
      expect(() => {
        renderHook(() => useAuthSession())
      }).toThrow()
    })
  })

  describe('useCourseCatalog', () => {
    it('initializes with default level', () => {
      api.get.mockResolvedValueOnce({ data: { data: [] } })
      
      const { result } = renderHook(() => useCourseCatalog())
      
      expect(result.current.selectedLevel).toBe('100')
      expect(result.current.courses).toEqual([])
      expect(result.current.loading).toBe(true)
    })

    it('initializes with custom level', () => {
      api.get.mockResolvedValueOnce({ data: { data: [] } })
      
      const { result } = renderHook(() => useCourseCatalog({ initialLevel: '200' }))
      
      expect(result.current.selectedLevel).toBe('200')
    })

    it('fetches courses on mount', async () => {
      const mockCourses = [
        { _id: '1', courseCode: 'CS101', courseName: 'Intro to CS', level: 100 },
        { _id: '2', courseCode: 'CS102', courseName: 'Data Structures', level: 100 }
      ]
      api.get.mockResolvedValueOnce({ data: { data: mockCourses } })
      
      const { result } = renderHook(() => useCourseCatalog())
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      expect(api.get).toHaveBeenCalledWith('/courses/all', {
        params: { level: '100' }
      })
      expect(result.current.courses).toEqual(mockCourses)
      expect(result.current.status).toBeNull()
    })

    it('refetches courses when level changes', async () => {
      api.get.mockResolvedValue({ data: { data: [] } })
      
      const { result } = renderHook(() => useCourseCatalog())
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      act(() => {
        result.current.setSelectedLevel('200')
      })
      
      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith('/courses/all', {
          params: { level: '200' }
        })
      })
    })

    it('handles API error', async () => {
      const errorMessage = 'Failed to fetch courses'
      api.get.mockRejectedValueOnce({
        response: { data: { message: errorMessage } }
      })
      
      const { result } = renderHook(() => useCourseCatalog())
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      expect(result.current.status).toEqual({
        type: 'error',
        message: errorMessage
      })
      expect(result.current.courses).toEqual([])
    })

    it('handles API error without message', async () => {
      api.get.mockRejectedValueOnce({
        response: { data: {} }
      })
      
      const { result } = renderHook(() => useCourseCatalog())
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      expect(result.current.status.message).toBe('Failed to fetch courses for level.')
    })

    it('sets loading state correctly', async () => {
      api.get.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({ data: { data: [] } }), 100))
      )
      
      const { result } = renderHook(() => useCourseCatalog())
      
      expect(result.current.loading).toBe(true)
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
    })
  })

  describe('useRegistration', () => {
    it('returns empty courses when no registration in storage', async () => {
      api.get.mockResolvedValueOnce({ data: { courses: [], totalCreditUnits: 0 } })
      
      const { result } = renderHook(() => useRegistration())
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      expect(result.current.courses).toEqual([])
      expect(result.current.totalUnits).toBe(0)
    })

    it('loads registration from session storage', () => {
      const mockPayload = {
        courses: [
          { _id: '1', courseCode: 'CS101', creditUnit: 3 }
        ],
        totalUnits: 3,
        registeredAt: '2024-01-01T00:00:00.000Z'
      }
      sessionStorage.setItem(storageKeys.registeredCourses, JSON.stringify(mockPayload))
      
      const { result } = renderHook(() => useRegistration())
      
      expect(result.current.courses).toEqual(mockPayload.courses)
      expect(result.current.totalUnits).toBe(3)
    })

    it('calculates total units from courses', () => {
      const mockPayload = {
        courses: [
          { _id: '1', courseCode: 'CS101', creditUnit: 3 },
          { _id: '2', courseCode: 'CS102', creditUnit: 2 }
        ]
      }
      sessionStorage.setItem(storageKeys.registeredCourses, JSON.stringify(mockPayload))
      
      const { result } = renderHook(() => useRegistration())
      
      expect(result.current.totalUnits).toBe(5)
    })

    it('setFromPayload stores registration in session storage', () => {
      const { result } = renderHook(() => useRegistration())
      const mockPayload = {
        courses: [{ _id: '1', courseCode: 'CS101', creditUnit: 3 }],
        totalUnits: 3
      }
      
      act(() => {
        result.current.setFromPayload(mockPayload)
      })
      
      const stored = JSON.parse(sessionStorage.getItem(storageKeys.registeredCourses))
      expect(stored).toEqual(mockPayload)
    })

    it('setFromPayload with null removes registration from storage', () => {
      sessionStorage.setItem(storageKeys.registeredCourses, JSON.stringify({ courses: [] }))
      
      const { result } = renderHook(() => useRegistration())
      
      act(() => {
        result.current.setFromPayload(null)
      })
      
      expect(sessionStorage.getItem(storageKeys.registeredCourses)).toBeNull()
    })

    it('refresh fetches registration from API', async () => {
      const mockAuth = { token: 'test-token' }
      sessionStorage.setItem(storageKeys.auth, JSON.stringify(mockAuth))
      
      const mockCourses = [
        { _id: '1', courseCode: 'CS101', creditUnit: 3 }
      ]
      api.get.mockResolvedValueOnce({
        data: { courses: mockCourses, totalCreditUnits: 3 }
      })
      
      const { result } = renderHook(() => useRegistration())
      
      await act(async () => {
        await result.current.refresh()
      })
      
      expect(api.get).toHaveBeenCalledWith('/courses/registered')
      expect(result.current.courses).toEqual(mockCourses)
      expect(result.current.totalUnits).toBe(3)
    })

    it('refresh clears registration when no auth', async () => {
      const { result } = renderHook(() => useRegistration())
      
      await act(async () => {
        await result.current.refresh()
      })
      
      expect(result.current.payload).toBeNull()
      expect(api.get).not.toHaveBeenCalled()
    })

    it('refresh handles API error', async () => {
      const mockAuth = { token: 'test-token' }
      sessionStorage.setItem(storageKeys.auth, JSON.stringify(mockAuth))
      
      // First call succeeds (auto-refresh on mount)
      api.get.mockResolvedValueOnce({
        data: { courses: [{ _id: '1', courseCode: 'CS101', creditUnit: 3 }], totalCreditUnits: 3 }
      })
      
      const { result } = renderHook(() => useRegistration())
      
      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      expect(result.current.courses).toHaveLength(1)
      
      // Second call fails - should clear the data
      api.get.mockRejectedValueOnce(new Error('API Error'))
      
      // Mock the subsequent auto-refresh attempt to also fail
      api.get.mockRejectedValue(new Error('API Error'))
      
      await act(async () => {
        const refreshResult = await result.current.refresh()
        expect(refreshResult).toBeNull()
      })
    })

    it('auto-refreshes when payload is null', async () => {
      const mockAuth = { token: 'test-token' }
      sessionStorage.setItem(storageKeys.auth, JSON.stringify(mockAuth))
      
      api.get.mockResolvedValueOnce({
        data: { courses: [], totalCreditUnits: 0 }
      })
      
      renderHook(() => useRegistration())
      
      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith('/courses/registered')
      })
    })
  })

  describe('useAdminStats', () => {
    it('initializes with default stats', () => {
      api.get.mockResolvedValueOnce({ data: { data: { students: 0, courses: 0 } } })
      
      const { result } = renderHook(() => useAdminStats())
      
      expect(result.current.stats).toEqual({ students: 0, courses: 0 })
      expect(result.current.loading).toBe(true)
    })

    it('fetches stats on mount', async () => {
      const mockStats = { students: 42, courses: 15 }
      api.get.mockResolvedValueOnce({ data: { data: mockStats } })
      
      const { result } = renderHook(() => useAdminStats())
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      expect(api.get).toHaveBeenCalledWith('/admin/stats')
      expect(result.current.stats).toEqual(mockStats)
      expect(result.current.status).toBeNull()
    })

    it('handles API error', async () => {
      const errorMessage = 'Failed to load stats'
      api.get.mockRejectedValueOnce({
        response: { data: { message: errorMessage } }
      })
      
      const { result } = renderHook(() => useAdminStats())
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      expect(result.current.status).toEqual({
        type: 'error',
        message: errorMessage
      })
    })

    it('handles API error without message', async () => {
      api.get.mockRejectedValueOnce({
        response: { data: {} }
      })
      
      const { result } = renderHook(() => useAdminStats())
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      expect(result.current.status.message).toBe('Failed to load admin stats.')
    })

    it('refresh refetches stats', async () => {
      api.get.mockResolvedValue({ data: { data: { students: 10, courses: 5 } } })
      
      const { result } = renderHook(() => useAdminStats())
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      const newStats = { students: 20, courses: 10 }
      api.get.mockResolvedValueOnce({ data: { data: newStats } })
      
      await act(async () => {
        await result.current.refresh()
      })
      
      expect(result.current.stats).toEqual(newStats)
      expect(api.get).toHaveBeenCalledTimes(2)
    })

    it('sets loading state correctly during fetch', async () => {
      api.get.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({ data: { data: { students: 0, courses: 0 } } }), 100))
      )
      
      const { result } = renderHook(() => useAdminStats())
      
      expect(result.current.loading).toBe(true)
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
    })
  })
})
