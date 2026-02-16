import TableShell from './TableShell.jsx'

function SemesterCourseTable({
  semester,
  courses,
  rows,
  loading,
  onAddRow,
  onRemoveRow,
  onRowChange,
}) {
  const semesterCourses = courses.filter((course) => course.semester === semester)

  return (
    <div>
      <TableShell
        title={`Semester ${semester}`}
        countLabel={`${rows.length} row${rows.length === 1 ? '' : 's'}`}
        columns={['Course', 'Details', 'Action']}
        footer={
          <div className="flex items-center justify-between">
            <button
              className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
              type="button"
              onClick={() => onAddRow(semester)}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-sm">
                +
              </span>
              Add course row
            </button>
            <span className="text-xs text-slate-400">Semester {semester}</span>
          </div>
        }
      >
        {loading ? (
          <div className="px-4 py-4 text-sm text-slate-500">
            Loading courses...
          </div>
        ) : semesterCourses.length === 0 ? (
          <div className="px-4 py-4 text-sm text-slate-500">
            No courses found.
          </div>
        ) : (
          rows.map((row) => {
            const selectedCourse = semesterCourses.find(
              (course) =>
                course.courseCode.toLowerCase() === row.value.toLowerCase()
            )

            return (
              <div
                key={row.id}
                className="grid grid-cols-[1.2fr_1fr_140px] items-center gap-4 px-4 py-4"
              >
                <div className="flex flex-col gap-2">
                  <input
                    className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:border-accent-400 focus:outline-none focus:ring-4 focus:ring-accent-100"
                    list={`course-options-${semester}`}
                    placeholder="Search by code (e.g. CSC101)"
                    value={row.value}
                    onChange={(event) =>
                      onRowChange(semester, row.id, event.target.value)
                    }
                  />
                  <span className="text-xs text-slate-400">
                    {selectedCourse
                      ? selectedCourse.courseName
                      : 'Pick a course to see details'}
                  </span>
                </div>

                <div className="text-xs text-slate-500">
                  {selectedCourse ? (
                    <div className="flex flex-col gap-1">
                      <span>Semester {selectedCourse.semester}</span>
                      <span>{selectedCourse.creditUnit} units</span>
                      <span>Level {selectedCourse.level}</span>
                      <span className="text-slate-600">
                        {selectedCourse.prerequisites && selectedCourse.prerequisites.length > 0
                          ? `Prerequisites: ${selectedCourse.prerequisites.join(', ')}`
                          : 'No prerequisites'}
                      </span>
                      <span className={selectedCourse.isFull ? 'text-red-600 font-semibold' : 'text-green-600'}>
                        {selectedCourse.availableSeats !== undefined
                          ? `${selectedCourse.availableSeats}/${selectedCourse.capacity} seats available`
                          : 'Capacity info unavailable'}
                      </span>
                      {selectedCourse.isFull && (
                        <span className="text-xs text-red-600 font-semibold">FULL</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400">No course selected</span>
                  )}
                </div>

                <div className="flex justify-end">
                  {rows.length > 1 ? (
                    <button
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
                      type="button"
                      onClick={() => onRemoveRow(semester, row.id)}
                    >
                      Remove
                    </button>
                  ) : (
                    <span className="text-xs text-slate-300">--</span>
                  )}
                </div>
              </div>
            )
          })
        )}
      </TableShell>

      <datalist id={`course-options-${semester}`}>
        {semesterCourses.map((course) => (
          <option key={course._id} value={course.courseCode}>
            {course.courseName}
          </option>
        ))}
      </datalist>
    </div>
  )
}

export default SemesterCourseTable
