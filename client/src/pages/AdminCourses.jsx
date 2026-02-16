import { useState } from 'react'
import AddCourseForm from '../components/AddCourseForm.jsx'
import CourseCatalogControls from '../components/CourseCatalogControls.jsx'
import CoursesTable from '../components/CoursesTable.jsx'
import EditCourseModal from '../components/EditCourseModal.jsx'
import { CATALOG_LEVEL_FILTER_ALL } from '../constants/catalog.js'
import useAdminCoursesList from '../hooks/useAdminCoursesList.js'
import useCatalogFilters from '../hooks/useCatalogFilters.js'
import useCreateCourse from '../hooks/useCreateCourse.js'
import api from '../lib/api.js'

function AdminCourses() {
  const {
    courses,
    loading: listLoading,
    status: listStatus,
    setCourses,
    refresh,
  } = useAdminCoursesList()
  const { createCourse, loading: createLoading, status: createStatus } =
    useCreateCourse({
      onCreated: (course) => setCourses((prev) => [course, ...prev]),
    })
  const [query, setQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState(CATALOG_LEVEL_FILTER_ALL)
  const [page, setPage] = useState(1)
  const [editingCourse, setEditingCourse] = useState(null)
  const [viewArchived, setViewArchived] = useState(false)
  const [archivedCourses, setArchivedCourses] = useState([])
  const [archivedLoading, setArchivedLoading] = useState(false)

  const displayCourses = viewArchived ? archivedCourses : courses

  const { filteredCourses, pagedCourses, totalPages, currentPage } =
    useCatalogFilters({ courses: displayCourses, query, levelFilter, page })

  const handleQueryChange = (event) => {
    setQuery(event.target.value)
    setPage(1)
  }

  const handleFilterChange = (event) => {
    setLevelFilter(event.target.value)
    setPage(1)
  }

  const handleCreateCourse = async (payload) => {
    return createCourse(payload)
  }

  const handleUpdateCourse = async (courseId, payload) => {
    await api.put(`/admin/courses/${courseId}`, payload)
    await refresh()
  }

  const handleArchiveCourse = async (courseId) => {
    if (!confirm('Archive this course? It will be hidden from students but remain in their records.')) {
      return
    }
    try {
      await api.put(`/admin/courses/${courseId}/archive`)
      await refresh()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to archive course')
    }
  }

  const handleRestoreCourse = async (courseId) => {
    try {
      await api.put(`/admin/courses/${courseId}/restore`)
      await loadArchivedCourses()
      await refresh()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to restore course')
    }
  }

  const loadArchivedCourses = async () => {
    setArchivedLoading(true)
    try {
      const response = await api.get('/admin/courses/archived')
      setArchivedCourses(response.data.data || [])
    } catch (error) {
      console.error('Failed to load archived courses:', error)
    } finally {
      setArchivedLoading(false)
    }
  }

  const handleToggleView = async () => {
    if (!viewArchived) {
      await loadArchivedCourses()
    }
    setViewArchived(!viewArchived)
    setPage(1)
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          Courses
        </p>
        <h1 className="font-display text-3xl font-semibold text-slate-900 md:text-4xl">
          Course catalog
        </h1>
        <p className="text-sm text-slate-500">
          Manage the courses students can register for.
        </p>
      </header>

      {!viewArchived && (
        <section className="grid gap-6 rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-soft md:grid-cols-[1.2fr_1fr]">
          <AddCourseForm
            status={createStatus}
            loading={createLoading}
            onSubmit={handleCreateCourse}
          />

          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 p-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Course tips
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>Use unique course codes (e.g., CSC 201).</li>
              <li>Match the level to the student year.</li>
              <li>Credit units can be 2 or 3.</li>
            </ul>
          </div>
        </section>
      )}

      <section className="grid gap-6">
        {listStatus ? (
          <div
            className={`rounded-2xl px-4 py-3 text-xs ${
              listStatus.type === 'error'
                ? 'bg-rose-50 text-rose-700'
                : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {listStatus.message}
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <CourseCatalogControls
            query={query}
            levelFilter={levelFilter}
            onQueryChange={handleQueryChange}
            onLevelChange={handleFilterChange}
            currentCount={pagedCourses.length}
            totalCount={filteredCourses.length}
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={() =>
              setPage((prev) => Math.min(prev + 1, totalPages))
            }
          />
          <button
            className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-100"
            type="button"
            onClick={handleToggleView}
          >
            {viewArchived ? 'View Active' : 'View Archived'}
          </button>
        </div>

        {(listLoading || archivedLoading) ? (
          <div className="rounded-3xl border border-slate-200 bg-white/90 px-4 py-4 text-sm text-slate-500 shadow-soft">
            Loading courses...
          </div>
        ) : (
          <CoursesTable
            title={viewArchived ? 'Archived courses' : 'All courses'}
            courses={pagedCourses}
            onEdit={!viewArchived ? setEditingCourse : undefined}
            onArchive={!viewArchived ? handleArchiveCourse : undefined}
            onRestore={viewArchived ? handleRestoreCourse : undefined}
          />
        )}
      </section>

      {editingCourse && (
        <EditCourseModal
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
          onUpdate={handleUpdateCourse}
        />
      )}
    </div>
  )
}

export default AdminCourses
