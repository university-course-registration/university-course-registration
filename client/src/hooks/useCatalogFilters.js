import { useMemo } from 'react'
import {
  CATALOG_LEVEL_FILTER_ALL,
  CATALOG_PAGE_SIZE,
} from '../constants/catalog.js'

function useCatalogFilters({
  courses,
  query,
  levelFilter,
  page,
  pageSize = CATALOG_PAGE_SIZE,
}) {
  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return courses
      .filter((course) => {
        if (
          levelFilter !== CATALOG_LEVEL_FILTER_ALL &&
          course.level !== levelFilter
        ) {
          return false
        }

        if (!normalizedQuery) {
          return true
        }

        const code = course.courseCode?.toLowerCase() || ''
        const name = course.courseName?.toLowerCase() || ''
        return code.includes(normalizedQuery) || name.includes(normalizedQuery)
      })
      .sort((a, b) =>
        (a.courseCode || '').localeCompare(b.courseCode || '')
      )
  }, [courses, levelFilter, query])

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pagedCourses = filteredCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return {
    filteredCourses,
    pagedCourses,
    totalPages,
    currentPage,
  }
}

export default useCatalogFilters
