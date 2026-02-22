import { useCallback, useEffect, useMemo, useState } from 'react'
import api from '../lib/api.js'
import storageKeys from '../constants/storageKeys.js'

function getStoredRegistration() {
  const stored = sessionStorage.getItem(storageKeys.registeredCourses)
  return stored ? JSON.parse(stored) : null
}

function useRegistration() {
  const [payload, setPayload] = useState(getStoredRegistration)
  const [loading, setLoading] = useState(false)

  const courses = useMemo(() => payload?.courses || [], [payload])

  const totalUnits = useMemo(() => {
    if (payload?.totalUnits) {
      return payload.totalUnits
    }
    return courses.reduce((sum, course) => sum + course.creditUnit, 0)
  }, [courses, payload])

  const setFromPayload = (nextPayload) => {
    if (!nextPayload) {
      sessionStorage.removeItem(storageKeys.registeredCourses)
      setPayload(null)
      return null
    }

    sessionStorage.setItem(
      storageKeys.registeredCourses,
      JSON.stringify(nextPayload)
    )
    setPayload(nextPayload)
    return nextPayload
  }

  const refresh = useCallback(async () => {
    const auth = sessionStorage.getItem(storageKeys.auth)
    if (!auth) {
      setFromPayload(null)
      return null
    }

    setLoading(true)
    try {
      const response = await api.get('/courses/registered')
      const nextPayload = {
        courses: response.data.courses || [],
        totalUnits: response.data.totalCreditUnits || 0,
        registeredAt: new Date().toISOString(),
      }
      return setFromPayload(nextPayload)
    } catch {
      return setFromPayload(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!payload) {
      refresh()
    }
  }, [payload, refresh])

  return {
    payload,
    courses,
    totalUnits,
    loading,
    refresh,
    setFromPayload,
  }
}

export default useRegistration
