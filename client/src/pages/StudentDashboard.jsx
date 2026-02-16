import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LevelSelectorPanel from '../components/LevelSelectorPanel.jsx'
import RegistrationOverviewPanel from '../components/RegistrationOverviewPanel.jsx'
import RegistrationTotalsFooter from '../components/RegistrationTotalsFooter.jsx'
import SemesterCourseTable from '../components/SemesterCourseTable.jsx'
import api from '../lib/api.js'
import useCourseCatalog from '../hooks/useCourseCatalog.js'
import useRegistration from '../hooks/useRegistration.js'
import useAuthSession from '../hooks/useAuthSession.js'
import useRegistrationMode from '../hooks/useRegistrationMode.js'
import useRegistrationRows from '../hooks/useRegistrationRows.js'

function StudentDashboard() {
  const [registerStatus, setRegisterStatus] = useState(null)
  const [registerLoading, setRegisterLoading] = useState(false)
  const navigate = useNavigate()
  const {
    payload: registrationSummary,
    courses: registeredCourses,
    totalUnits: registeredUnits,
    refresh: refreshRegistration,
    setFromPayload,
  } = useRegistration()
  const { user, clearAuth } = useAuthSession()
  const { isUpdateMode, clearMode } = useRegistrationMode()

  const {
    selectedLevel,
    setSelectedLevel,
    courses,
    loading: coursesLoading,
    status: coursesStatus,
  } = useCourseCatalog()

  // Filter out already registered courses from available courses
  const availableCourses = useMemo(() => {
    if (isUpdateMode) {
      // In update mode, show all courses including registered ones
      return courses
    }
    // Filter out courses that are already registered
    const registeredCourseIds = new Set(registeredCourses.map((c) => c._id))
    return courses.filter((course) => !registeredCourseIds.has(course._id))
  }, [courses, registeredCourses, isUpdateMode])

  const {
    rowsBySemester,
    totalUnits,
    selectedCourseIds,
    resetRows,
    handleRowChange,
    handleAddRow,
    handleRemoveRow,
  } = useRegistrationRows({
    courses: availableCourses,
    isUpdateMode,
    registrationSummary,
    registeredCourses,
    refreshRegistration,
    onInferLevel: setSelectedLevel,
  })

  const hasRegistration = registeredCourses.length > 0

  const firstSemesterCount = useMemo(
    () => registeredCourses.filter((course) => course.semester === 1).length,
    [registeredCourses]
  )

  const secondSemesterCount = useMemo(
    () => registeredCourses.filter((course) => course.semester === 2).length,
    [registeredCourses]
  )

  const combinedStatus = registerStatus || coursesStatus

  const handleSignOut = () => {
    clearAuth()
    navigate('/')
  }

  const handleRegister = async () => {
    if (hasRegistration && !isUpdateMode) {
      setRegisterStatus({
        type: 'error',
        message: 'You already registered. Open the summary to update.',
      })
      return
    }
    if (!user) {
      setRegisterStatus({
        type: 'error',
        message: 'Please sign in first so we can register your courses.',
      })
      return
    }
    if (!user?.id) {
      setRegisterStatus({
        type: 'error',
        message: 'Missing user info. Please sign in again.',
      })
      return
    }

    if (selectedCourseIds.length === 0) {
      setRegisterStatus({
        type: 'error',
        message: 'Select at least one course.',
      })
      return
    }

    // Get selected courses
    const selectedCourses = availableCourses.filter((course) =>
      selectedCourseIds.includes(course._id)
    )

    // Check if any courses are full
    const fullCourses = selectedCourses.filter((course) => course.isFull)
    if (fullCourses.length > 0) {
      const fullCourseNames = fullCourses
        .map((c) => c.courseCode)
        .join(', ')
      setRegisterStatus({
        type: 'error',
        message: `Cannot register: ${fullCourseNames} ${fullCourses.length === 1 ? 'is' : 'are'} full`,
      })
      return
    }

    // Validate prerequisites
    const registeredCourseCodes = registeredCourses.map((c) => c.courseCode)
    const prerequisiteErrors = []

    for (const course of selectedCourses) {
      if (course.prerequisites && course.prerequisites.length > 0) {
        const missingPrereqs = course.prerequisites.filter(
          (prereq) => !registeredCourseCodes.includes(prereq)
        )
        if (missingPrereqs.length > 0) {
          prerequisiteErrors.push({
            courseCode: course.courseCode,
            courseName: course.courseName,
            missing: missingPrereqs,
          })
        }
      }
    }

    if (prerequisiteErrors.length > 0) {
      const errorMessage = prerequisiteErrors
        .map(
          (err) =>
            `${err.courseCode}: Missing ${err.missing.join(', ')}`
        )
        .join('; ')
      setRegisterStatus({
        type: 'error',
        message: `Prerequisites not met: ${errorMessage}`,
      })
      return
    }

    setRegisterLoading(true)
    setRegisterStatus(null)
    try {
      const response = await api.post('/courses/register', {
        courseIds: selectedCourseIds,
        userId: user.id,
      })
      setFromPayload({
        courses: response.data.user?.registeredCourses || [],
        totalUnits: response.data.totalCreditUnits,
        registeredAt: new Date().toISOString(),
      })
      clearMode()
      navigate('/registered')
    } catch (error) {
      setRegisterStatus({
        type: 'error',
        message:
          error.response?.data?.message || 'Course registration failed.',
      })
    } finally {
      setRegisterLoading(false)
    }
  }

  const handleLevelChange = (event) => {
    const nextLevel = event.target.value
    setSelectedLevel(nextLevel)
    if (!isUpdateMode) {
      resetRows()
    }
  }

  return (
    <div className="page-bg min-h-screen w-full px-6 py-10 text-ink-900 md:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Student Dashboard
            </p>
            <h1 className="font-display text-3xl font-semibold text-slate-900 md:text-4xl">
              Course Registration
            </h1>
            <p className="text-sm text-slate-500">
              Select your level, review courses, and submit your registration.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-100"
              type="button"
              onClick={() => navigate('/profile')}
            >
              Profile
            </button>
            <button
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-100"
              type="button"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </header>

        {!isUpdateMode && hasRegistration ? (
          <RegistrationOverviewPanel
            firstSemesterCount={firstSemesterCount}
            secondSemesterCount={secondSemesterCount}
            registeredUnits={registeredUnits}
            onViewRegistration={() => navigate('/registered')}
          />
        ) : null}

        {!hasRegistration || isUpdateMode ? (
          <section className="grid gap-6 rounded-[32px] bg-white/90 p-6 shadow-soft ring-1 ring-slate-200 md:p-8">
            <LevelSelectorPanel
              selectedLevel={selectedLevel}
              onLevelChange={handleLevelChange}
              status={combinedStatus}
            />

            <div className="grid gap-6 lg:grid-cols-2">
              {[1, 2].map((semester) => (
                <SemesterCourseTable
                  key={semester}
                  semester={semester}
                  courses={availableCourses}
                  rows={rowsBySemester[semester]}
                  loading={coursesLoading}
                  onAddRow={handleAddRow}
                  onRemoveRow={handleRemoveRow}
                  onRowChange={handleRowChange}
                />
              ))}
            </div>
            <RegistrationTotalsFooter
              totalUnits={totalUnits}
              loading={registerLoading}
              hasRegistration={hasRegistration}
              isUpdateMode={isUpdateMode}
              onRegister={handleRegister}
            />
          </section>
        ) : null}
      </div>
    </div>
  )
}

export default StudentDashboard
