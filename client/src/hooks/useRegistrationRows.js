import { useEffect, useMemo, useState } from 'react'

const createEmptyRows = () => ({
  1: [{ id: crypto.randomUUID(), value: '' }],
  2: [{ id: crypto.randomUUID(), value: '' }],
})

function useRegistrationRows({
  courses,
  isUpdateMode,
  registrationSummary,
  registeredCourses,
  refreshRegistration,
  onInferLevel,
}) {
  const [rowsBySemester, setRowsBySemester] = useState(createEmptyRows)

  const resetRows = () => {
    setRowsBySemester(createEmptyRows())
  }

  useEffect(() => {
    const hydrateUpdateRows = async () => {
      if (!isUpdateMode) {
        return
      }

      if (!registrationSummary) {
        const nextPayload = await refreshRegistration()
        if (!nextPayload) {
          return
        }
      }

      if (!registeredCourses.length) {
        return
      }

      const grouped = registeredCourses.reduce(
        (acc, course) => {
          const semester = course.semester
          acc[semester] = acc[semester] || []
          acc[semester].push({
            id: crypto.randomUUID(),
            value: course.courseCode,
          })
          return acc
        },
        { 1: [], 2: [] }
      )

      setRowsBySemester({
        1: grouped[1].length ? grouped[1] : [{ id: crypto.randomUUID(), value: '' }],
        2: grouped[2].length ? grouped[2] : [{ id: crypto.randomUUID(), value: '' }],
      })

      const inferredLevel = registeredCourses[0]?.level
      if (inferredLevel && onInferLevel) {
        onInferLevel(inferredLevel)
      }
    }

    hydrateUpdateRows()
  }, [
    isUpdateMode,
    registrationSummary,
    registeredCourses,
    refreshRegistration,
    onInferLevel,
  ])

  const handleRowChange = (semester, rowId, value) => {
    setRowsBySemester((prev) => ({
      ...prev,
      [semester]: prev[semester].map((row) =>
        row.id === rowId ? { ...row, value } : row
      ),
    }))
  }

  const handleAddRow = (semester) => {
    setRowsBySemester((prev) => ({
      ...prev,
      [semester]: [...prev[semester], { id: crypto.randomUUID(), value: '' }],
    }))
  }

  const handleRemoveRow = (semester, rowId) => {
    setRowsBySemester((prev) => ({
      ...prev,
      [semester]: prev[semester].filter((row) => row.id !== rowId),
    }))
  }

  const totalUnits = useMemo(() => {
    const selected = Object.values(rowsBySemester)
      .flat()
      .map((row) =>
        courses.find(
          (course) => course.courseCode.toLowerCase() === row.value.toLowerCase()
        )
      )
      .filter(Boolean)

    return selected.reduce((sum, course) => sum + course.creditUnit, 0)
  }, [courses, rowsBySemester])

  const selectedCourseIds = useMemo(() => {
    return Object.values(rowsBySemester)
      .flat()
      .map((row) =>
        courses.find(
          (course) => course.courseCode.toLowerCase() === row.value.toLowerCase()
        )
      )
      .filter(Boolean)
      .map((course) => course._id)
  }, [courses, rowsBySemester])

  return {
    rowsBySemester,
    totalUnits,
    selectedCourseIds,
    resetRows,
    handleRowChange,
    handleAddRow,
    handleRemoveRow,
  }
}

export default useRegistrationRows
