import { useCallback, useEffect, useState } from 'react'
import api from '../lib/api.js'

function useAdminCoursesList() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    setStatus(null)
    try {
      const response = await api.get('/admin/courses')
      setCourses(response.data.data || [])
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error.response?.data?.message || 'Failed to load courses list.',
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  return { courses, loading, status, refresh: fetchCourses, setCourses }
}

export default useAdminCoursesList
