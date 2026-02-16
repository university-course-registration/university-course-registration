import { useEffect, useState } from 'react'
import api from '../lib/api.js'
import levels from '../constants/levels.js'

function useCourseCatalog({ initialLevel = levels[0] } = {}) {
  const [selectedLevel, setSelectedLevel] = useState(initialLevel)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      setStatus(null)
      try {
        const response = await api.get('/courses/all', {
          params: { level: selectedLevel },
        })
        setCourses(response.data.data || [])
      } catch (error) {
        setStatus({
          type: 'error',
          message:
            error.response?.data?.message || 'Failed to fetch courses for level.',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [selectedLevel])

  return {
    selectedLevel,
    setSelectedLevel,
    courses,
    loading,
    status,
  }
}

export default useCourseCatalog
