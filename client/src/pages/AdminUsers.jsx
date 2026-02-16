import TableShell from '../components/TableShell.jsx'
import useAdminStudents from '../hooks/useAdminStudents.js'

function AdminUsers() {
  const { students, loading, status } = useAdminStudents()

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          User management
        </p>
        <h1 className="font-display text-3xl font-semibold text-slate-900 md:text-4xl">
          Student list
        </h1>
        <p className="text-sm text-slate-500">
          Review registered students and their registration status.
        </p>
      </header>

      {status ? (
        <div
          className={`rounded-2xl px-4 py-3 text-xs ${
            status.type === 'error'
              ? 'bg-rose-50 text-rose-700'
              : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          {status.message}
        </div>
      ) : null}

      <TableShell
        title="Students"
        countLabel={`${students.length} student${students.length === 1 ? '' : 's'}`}
        columns={['Student', 'Reg no', 'Level', 'Courses']}
        columnsClassName="grid grid-cols-[1.2fr_1fr_120px_120px] gap-4 border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
      >
        {loading ? (
          <div className="px-4 py-4 text-sm text-slate-500">
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div className="px-4 py-4 text-sm text-slate-500">
            No students found.
          </div>
        ) : (
          students.map((student) => (
            <div
              key={student._id}
              className="grid grid-cols-[1.2fr_1fr_120px_120px] items-center gap-4 px-4 py-4"
            >
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {student.name}
                </p>
                <p className="text-xs text-slate-500">{student.email}</p>
              </div>
              <div className="text-xs text-slate-500">{student.regNo}</div>
              <div className="text-xs font-semibold text-slate-500">
                {student.level}
              </div>
              <div className="text-xs font-semibold text-slate-700">
                {student.registeredCourses?.length || 0}
              </div>
            </div>
          ))
        )}
      </TableShell>
    </div>
  )
}

export default AdminUsers
