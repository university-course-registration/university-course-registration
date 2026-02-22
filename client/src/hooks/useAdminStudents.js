import { useCallback, useEffect, useState } from 'react'
import api from '../lib/api.js'

function useAdminStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    setStatus(null)
    try {
      const response = await api.get('/admin/students')
      setStudents(response.data.data || [])
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error.response?.data?.message || 'Failed to load students list.',
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  return { students, loading, status, refresh: fetchStudents }
}

export default useAdminStudents
