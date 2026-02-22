import TableShell from './TableShell.jsx'

function CoursesTable({ title, courses, onEdit, onArchive, onRestore }) {
  const hasActions = onEdit || onArchive || onRestore

  return (
    <TableShell
      title={title}
      countLabel={`${courses.length} course${courses.length === 1 ? '' : 's'}`}
      columns={hasActions ? ['Course', 'Details', 'Enrollment', 'Level', 'Actions'] : ['Course', 'Details', 'Enrollment', 'Level']}
    >
      {courses.length === 0 ? (
        <div className="px-4 py-4 text-sm text-slate-500">No courses found.</div>
      ) : (
        courses.map((course) => (
          <div
            key={course._id}
            className={`grid ${hasActions ? 'grid-cols-[1.2fr_1fr_120px_100px_180px]' : 'grid-cols-[1.2fr_1fr_120px_100px]'} items-center gap-4 px-4 py-4`}
          >
            <div className="text-sm font-semibold text-slate-800">
              {course.courseCode} - {course.courseName}
              {course.isArchived && (
                <span className="ml-2 text-xs font-normal text-amber-600">(Archived)</span>
              )}
            </div>
            <div className="text-xs text-slate-500">
              Semester {course.semester} • {course.creditUnit} units
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="mt-1 text-xs text-slate-400">
                  Prereq: {course.prerequisites.join(', ')}
                </div>
              )}
            </div>
            <div className="text-xs text-slate-600">
              {course.enrolledCount !== undefined && course.capacity !== undefined
                ? `${course.enrolledCount}/${course.capacity} enrolled`
                : 'N/A'}
            </div>
            <div className="text-right text-xs font-semibold text-slate-500">
              {course.level}
            </div>
            {hasActions && (
              <div className="flex justify-end gap-2">
                {onEdit && (
                  <button
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
                    type="button"
                    onClick={() => onEdit(course)}
                  >
                    Edit
                  </button>
                )}
                {onArchive && (
                  <button
                    className="rounded-full border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-600 transition hover:border-amber-300 hover:text-amber-700"
                    type="button"
                    onClick={() => onArchive(course._id)}
                  >
                    Archive
                  </button>
                )}
                {onRestore && (
                  <button
                    className="rounded-full border border-green-200 px-3 py-1.5 text-xs font-semibold text-green-600 transition hover:border-green-300 hover:text-green-700"
                    type="button"
                    onClick={() => onRestore(course._id)}
                  >
                    Restore
                  </button>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </TableShell>
  )
}

export default CoursesTable
