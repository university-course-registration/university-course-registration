import CoursesTable from './CoursesTable.jsx'

function RegisteredCoursesTables({ courses }) {
  return (
    <div className="grid gap-6">
      <CoursesTable
        title="First semester"
        courses={courses.filter((course) => course.semester === 1)}
      />
      <CoursesTable
        title="Second semester"
        courses={courses.filter((course) => course.semester === 2)}
      />
    </div>
  )
}

export default RegisteredCoursesTables
