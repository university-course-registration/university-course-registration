import { useState } from 'react'
import api from '../lib/api.js'

function useCreateCourse({ onCreated } = {}) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const createCourse = async (payload) => {
    setLoading(true)
    setStatus(null)
    try {
      const response = await api.post('/admin/courses', payload)
      const created = response.data.data
      if (onCreated) {
        onCreated(created)
      }
      setStatus({ type: 'success', message: response.data.message })
      return { ok: true, data: created }
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error.response?.data?.message || 'Failed to create course.',
      })
      return { ok: false }
    } finally {
      setLoading(false)
    }
  }

  return { createCourse, loading, status }
}

export default useCreateCourse
