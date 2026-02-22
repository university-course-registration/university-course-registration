import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout.jsx'
import AdminCourses from './pages/AdminCourses.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminUsers from './pages/AdminUsers.jsx'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import RegisteredCourses from './pages/RegisteredCourses.jsx'
import Profile from './pages/Profile.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/registered" element={<RegisteredCourses />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="courses" element={<AdminCourses />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  )
}

export default App
