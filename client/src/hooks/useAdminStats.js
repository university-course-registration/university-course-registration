import { useCallback, useEffect, useState } from 'react'
import api from '../lib/api.js'

function useAdminStats() {
  const [stats, setStats] = useState({ students: 0, courses: 0 })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setStatus(null)
    try {
      const response = await api.get('/admin/stats')
      setStats(response.data.data || { students: 0, courses: 0 })
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error.response?.data?.message || 'Failed to load admin stats.',
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return { stats, loading, status, refresh: fetchStats }
}

export default useAdminStats
