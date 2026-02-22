import { useState, useEffect } from 'react'

function EditCourseModal({ course, onClose, onUpdate }) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    semester: 1,
    creditUnit: 2,
    level: '100',
    capacity: 50,
    prerequisites: ''
  })

  useEffect(() => {
    if (course) {
      setFormData({
        courseCode: course.courseCode || '',
        courseName: course.courseName || '',
        semester: course.semester || 1,
        creditUnit: course.creditUnit || 2,
        level: course.level || '100',
        capacity: course.capacity || 50,
        prerequisites: course.prerequisites?.join(', ') || ''
      })
    }
  }, [course])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const payload = {
        ...formData,
        semester: Number(formData.semester),
        creditUnit: Number(formData.creditUnit),
        capacity: Number(formData.capacity),
        prerequisites: formData.prerequisites
          ? formData.prerequisites.split(',').map(p => p.trim()).filter(Boolean)
          : []
      }

      await onUpdate(course._id, payload)
      setStatus({ type: 'success', message: 'Course updated successfully' })
      setTimeout(() => onClose(), 1500)
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update course'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden animate-fade-in">
        <div className="bg-gradient-to-r from-accent-500 to-accent-400 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Edit Course</h2>
              <p className="mt-1 text-sm text-white/80">Update course information</p>
            </div>
            <button
              className="rounded-full p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
              type="button"
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Course Code
                </label>
                <input
                  name="courseCode"
                  type="text"
                  value={formData.courseCode}
                  onChange={handleChange}
                  placeholder="e.g. CSC101"
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-accent-400 focus:outline-none focus:ring-4 focus:ring-accent-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Course Title
                </label>
                <input
                  name="courseName"
                  type="text"
                  value={formData.courseName}
                  onChange={handleChange}
                  placeholder="e.g. Introduction to Computer Science"
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-accent-400 focus:outline-none focus:ring-4 focus:ring-accent-100"
                  required
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Semester
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-accent-400 focus:outline-none focus:ring-4 focus:ring-accent-100"
                  required
                >
                  <option value={1}>First Semester</option>
                  <option value={2}>Second Semester</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Credit Units
                </label>
                <select
                  name="creditUnit"
                  value={formData.creditUnit}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-accent-400 focus:outline-none focus:ring-4 focus:ring-accent-100"
                  required
                >
                  <option value={2}>2 Units</option>
                  <option value={3}>3 Units</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-accent-400 focus:outline-none focus:ring-4 focus:ring-accent-100"
                  required
                >
                  <option value="100">100 Level</option>
                  <option value="200">200 Level</option>
                  <option value="300">300 Level</option>
                  <option value="400">400 Level</option>
                  <option value="500">500 Level</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Capacity
              </label>
              <input
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="e.g. 50"
                min="1"
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-accent-400 focus:outline-none focus:ring-4 focus:ring-accent-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Prerequisites
                <span className="ml-2 text-xs font-normal text-slate-500">(Optional, comma-separated)</span>
              </label>
              <input
                name="prerequisites"
                type="text"
                value={formData.prerequisites}
                onChange={handleChange}
                placeholder="e.g. CSC101, CSC102"
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-accent-400 focus:outline-none focus:ring-4 focus:ring-accent-100"
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Enter course codes separated by commas
              </p>
            </div>

            {status && (
              <div
                className={`rounded-xl p-4 text-sm font-medium ${
                  status.type === 'error'
                    ? 'bg-red-50 text-red-700 border-2 border-red-200'
                    : 'bg-green-50 text-green-700 border-2 border-green-200'
                }`}
              >
                {status.message}
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-gradient-to-r from-accent-500 to-accent-400 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Updating...' : 'Update Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditCourseModal
