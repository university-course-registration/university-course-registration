import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter, createMockCourse, createMockUser } from '../testUtils'
import StatCard from '../../components/StatCard'
import AddCourseForm from '../../components/AddCourseForm'
import AdminDashboard from '../../pages/AdminDashboard'
import AdminCourses from '../../pages/AdminCourses'
import AdminUsers from '../../pages/AdminUsers'
import api from '../../lib/api'
import useAdminStats from '../../hooks/useAdminStats'
import useAdminStudents from '../../hooks/useAdminStudents'
import useAdminCoursesList from '../../hooks/useAdminCoursesList'
import useCatalogFilters from '../../hooks/useCatalogFilters'
import useCreateCourse from '../../hooks/useCreateCourse'

vi.mock('../../lib/api')

// Mock the icons
vi.mock('../../constants/icons.jsx', () => ({
  BookIcon: ({ className }) => <div className={className} data-testid="book-icon" />,
  ChartIcon: ({ className }) => <div className={className} data-testid="chart-icon" />,
  UsersIcon: ({ className }) => <div className={className} data-testid="users-icon" />,
  PlusIcon: ({ className }) => <div className={className} data-testid="plus-icon" />,
  ArrowRightIcon: ({ className }) => <div className={className} data-testid="arrow-right-icon" />,
}))

// Mock the hooks
vi.mock('../../hooks/useAdminStats.js', () => ({
  default: vi.fn(),
}))

vi.mock('../../hooks/useAdminStudents.js', () => ({
  default: vi.fn(),
}))

vi.mock('../../hooks/useAdminCoursesList.js', () => ({
  default: vi.fn(),
}))

vi.mock('../../hooks/useCatalogFilters.js', () => ({
  default: vi.fn(),
}))

vi.mock('../../hooks/useCreateCourse.js', () => ({
  default: vi.fn(),
}))

describe('Admin Dashboard Components', () => {
  describe('StatCard', () => {
    it('renders stat card with label and value', () => {
      renderWithRouter(
        <StatCard 
          icon={<div data-testid="test-icon" />}
          label="Students"
          value="42"
          helper="Active student profiles"
        />
      )
      
      expect(screen.getByText('Students', { exact: false })).toBeInTheDocument()
      expect(screen.getByText('42')).toBeInTheDocument()
      expect(screen.getByText('Active student profiles')).toBeInTheDocument()
    })

    it('renders icon in the card', () => {
      renderWithRouter(
        <StatCard 
          icon={<div data-testid="test-icon" />}
          label="Courses"
          value="15"
        />
      )
      
      expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    })

    it('renders without helper text', () => {
      renderWithRouter(
        <StatCard 
          icon={<div data-testid="test-icon" />}
          label="Status"
          value="Live"
        />
      )
      
      expect(screen.getByText('Status', { exact: false })).toBeInTheDocument()
      expect(screen.getByText('Live')).toBeInTheDocument()
    })

    it('displays loading state', () => {
      renderWithRouter(
        <StatCard 
          icon={<div data-testid="test-icon" />}
          label="Students"
          value="..."
          helper="Loading data"
        />
      )
      
      expect(screen.getByText('...')).toBeInTheDocument()
    })
  })

  describe('AddCourseForm', () => {
    const defaultProps = {
      status: null,
      loading: false,
      onSubmit: vi.fn(),
    }

    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('renders form with all fields', () => {
      renderWithRouter(<AddCourseForm {...defaultProps} />)
      
      expect(screen.getByRole('heading', { name: /add course/i })).toBeInTheDocument()
      expect(screen.getByPlaceholderText('CSC 101')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Introduction to Computer Science')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /add course/i })).toBeInTheDocument()
    })

    it('updates form fields on user input', async () => {
      const user = userEvent.setup()
      renderWithRouter(<AddCourseForm {...defaultProps} />)
      
      const codeInput = screen.getByPlaceholderText('CSC 101')
      const nameInput = screen.getByPlaceholderText('Introduction to Computer Science')
      
      await user.type(codeInput, 'CS101')
      await user.type(nameInput, 'Intro to CS')
      
      expect(codeInput).toHaveValue('CS101')
      expect(nameInput).toHaveValue('Intro to CS')
    })

    it('renders semester dropdown with options', () => {
      renderWithRouter(<AddCourseForm {...defaultProps} />)
      
      const semesterSelect = screen.getAllByRole('combobox')[0]
      const options = within(semesterSelect).getAllByRole('option')
      
      expect(options).toHaveLength(2)
      expect(options[0]).toHaveValue('1')
      expect(options[1]).toHaveValue('2')
    })

    it('renders credit unit dropdown with options', () => {
      renderWithRouter(<AddCourseForm {...defaultProps} />)
      
      const creditSelect = screen.getAllByRole('combobox')[1]
      const options = within(creditSelect).getAllByRole('option')
      
      expect(options).toHaveLength(2)
      expect(options[0]).toHaveValue('2')
      expect(options[1]).toHaveValue('3')
    })

    it('renders level dropdown with all levels', () => {
      renderWithRouter(<AddCourseForm {...defaultProps} />)
      
      const levelSelect = screen.getAllByRole('combobox')[2]
      const options = within(levelSelect).getAllByRole('option')
      
      expect(options).toHaveLength(5)
      expect(options[0]).toHaveValue('100')
      expect(options[4]).toHaveValue('500')
    })

    it('calls onSubmit with correct payload when form is submitted', async () => {
      const user = userEvent.setup()
      const mockOnSubmit = vi.fn().mockResolvedValue({ ok: true })
      
      renderWithRouter(<AddCourseForm {...defaultProps} onSubmit={mockOnSubmit} />)
      
      await user.type(screen.getByPlaceholderText('CSC 101'), 'CS101')
      await user.type(screen.getByPlaceholderText('Introduction to Computer Science'), 'Intro to CS')
      
      const submitButton = screen.getByRole('button', { name: /add course/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          courseCode: 'CS101',
          courseName: 'Intro to CS',
          semester: 1,
          creditUnit: 2,
          level: '100',
          capacity: 50,
        })
      })
    })

    it('resets form after successful submission', async () => {
      const user = userEvent.setup()
      const mockOnSubmit = vi.fn().mockResolvedValue({ ok: true })
      
      renderWithRouter(<AddCourseForm {...defaultProps} onSubmit={mockOnSubmit} />)
      
      const codeInput = screen.getByPlaceholderText('CSC 101')
      const nameInput = screen.getByPlaceholderText('Introduction to Computer Science')
      
      await user.type(codeInput, 'CS101')
      await user.type(nameInput, 'Intro to CS')
      await user.click(screen.getByRole('button', { name: /add course/i }))
      
      await waitFor(() => {
        expect(codeInput).toHaveValue('')
        expect(nameInput).toHaveValue('')
      })
    })

    it('does not reset form after failed submission', async () => {
      const user = userEvent.setup()
      const mockOnSubmit = vi.fn().mockResolvedValue({ ok: false })
      
      renderWithRouter(<AddCourseForm {...defaultProps} onSubmit={mockOnSubmit} />)
      
      const codeInput = screen.getByPlaceholderText('CSC 101')
      const nameInput = screen.getByPlaceholderText('Introduction to Computer Science')
      
      await user.type(codeInput, 'CS101')
      await user.type(nameInput, 'Intro to CS')
      await user.click(screen.getByRole('button', { name: /add course/i }))
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled()
      })
      
      expect(codeInput).toHaveValue('CS101')
      expect(nameInput).toHaveValue('Intro to CS')
    })

    it('displays loading state during submission', () => {
      renderWithRouter(<AddCourseForm {...defaultProps} loading={true} />)
      
      expect(screen.getByText('Adding course...')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /adding course/i })).toBeDisabled()
    })

    it('displays success status message', () => {
      const status = { type: 'success', message: 'Course added successfully' }
      renderWithRouter(<AddCourseForm {...defaultProps} status={status} />)
      
      const statusElement = screen.getByText('Course added successfully')
      expect(statusElement).toBeInTheDocument()
      expect(statusElement.className).toContain('emerald')
    })

    it('displays error status message', () => {
      const status = { type: 'error', message: 'Failed to add course' }
      renderWithRouter(<AddCourseForm {...defaultProps} status={status} />)
      
      const statusElement = screen.getByText('Failed to add course')
      expect(statusElement).toBeInTheDocument()
      expect(statusElement.className).toContain('rose')
    })

    it('trims whitespace from inputs before submission', async () => {
      const user = userEvent.setup()
      const mockOnSubmit = vi.fn().mockResolvedValue({ ok: true })
      
      renderWithRouter(<AddCourseForm {...defaultProps} onSubmit={mockOnSubmit} />)
      
      await user.type(screen.getByPlaceholderText('CSC 101'), '  CS101  ')
      await user.type(screen.getByPlaceholderText('Introduction to Computer Science'), '  Intro to CS  ')
      await user.click(screen.getByRole('button', { name: /add course/i }))
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            courseCode: 'CS101',
            courseName: 'Intro to CS',
          })
        )
      })
    })
  })

  describe('AdminDashboard Page', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('renders dashboard header', () => {
      useAdminStats.mockReturnValue({
        stats: { students: 0, courses: 0 },
        loading: false,
        status: null,
      })
      
      renderWithRouter(<AdminDashboard />)
      
      expect(screen.getByText('Admin Overview')).toBeInTheDocument()
      expect(screen.getByText('Dashboard snapshot')).toBeInTheDocument()
      expect(screen.getByText('Track student activity and course catalog at a glance.')).toBeInTheDocument()
    })

    it('displays loading state for stats', () => {
      useAdminStats.mockReturnValue({
        stats: { students: 0, courses: 0 },
        loading: true,
        status: null,
      })
      
      renderWithRouter(<AdminDashboard />)
      
      expect(screen.getByText('Loading')).toBeInTheDocument()
      expect(screen.getAllByText('...')).toHaveLength(2)
    })

    it('displays stats after loading', () => {
      useAdminStats.mockReturnValue({
        stats: { students: 42, courses: 15 },
        loading: false,
        status: null,
      })
      
      renderWithRouter(<AdminDashboard />)
      
      expect(screen.getByText('42')).toBeInTheDocument()
      expect(screen.getByText('15')).toBeInTheDocument()
      expect(screen.getByText('Live')).toBeInTheDocument()
    })

    it('displays error status when API fails', () => {
      useAdminStats.mockReturnValue({
        stats: { students: 0, courses: 0 },
        loading: false,
        status: { type: 'error', message: 'Failed to load stats' },
      })
      
      renderWithRouter(<AdminDashboard />)
      
      expect(screen.getByText('Failed to load stats')).toBeInTheDocument()
    })

    it('renders all stat cards', () => {
      useAdminStats.mockReturnValue({
        stats: { students: 10, courses: 20 },
        loading: false,
        status: null,
      })
      
      renderWithRouter(<AdminDashboard />)
      
      expect(screen.getByText('Status', { exact: false })).toBeInTheDocument()
      expect(screen.getByText('Students', { exact: false })).toBeInTheDocument()
      expect(screen.getByText('Courses', { exact: false })).toBeInTheDocument()
    })
  })

  describe('AdminUsers Page', () => {
    const mockStudents = [
      createMockUser({ 
        _id: '1', 
        name: 'John Doe', 
        email: 'john@example.com', 
        regNo: 'UG15/CS/1001', 
        level: 100,
        registeredCourses: [{ _id: '1' }, { _id: '2' }]
      }),
      createMockUser({ 
        _id: '2', 
        name: 'Jane Smith', 
        email: 'jane@example.com', 
        regNo: 'UG15/CS/1002', 
        level: 200,
        registeredCourses: [{ _id: '1' }]
      }),
    ]

    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('renders page header', () => {
      useAdminStudents.mockReturnValue({
        students: [],
        loading: false,
        status: null,
      })
      
      renderWithRouter(<AdminUsers />)
      
      expect(screen.getByText('User management')).toBeInTheDocument()
      expect(screen.getByText('Student list')).toBeInTheDocument()
      expect(screen.getByText('Review registered students and their registration status.')).toBeInTheDocument()
    })

    it('displays loading state', () => {
      useAdminStudents.mockReturnValue({
        students: [],
        loading: true,
        status: null,
      })
      
      renderWithRouter(<AdminUsers />)
      
      expect(screen.getByText('Loading students...')).toBeInTheDocument()
    })

    it('displays student list after loading', () => {
      useAdminStudents.mockReturnValue({
        students: mockStudents,
        loading: false,
        status: null,
      })
      
      renderWithRouter(<AdminUsers />)
      
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
      expect(screen.getByText('UG15/CS/1001')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
      expect(screen.getByText('UG15/CS/1002')).toBeInTheDocument()
    })

    it('displays student count', () => {
      useAdminStudents.mockReturnValue({
        students: mockStudents,
        loading: false,
        status: null,
      })
      
      renderWithRouter(<AdminUsers />)
      
      expect(screen.getByText('2 students')).toBeInTheDocument()
    })

    it('displays singular student count', () => {
      useAdminStudents.mockReturnValue({
        students: [mockStudents[0]],
        loading: false,
        status: null,
      })
      
      renderWithRouter(<AdminUsers />)
      
      expect(screen.getByText('1 student')).toBeInTheDocument()
    })

    it('displays registered courses count for each student', () => {
      useAdminStudents.mockReturnValue({
        students: mockStudents,
        loading: false,
        status: null,
      })
      
      renderWithRouter(<AdminUsers />)
      
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('displays no students message when list is empty', () => {
      useAdminStudents.mockReturnValue({
        students: [],
        loading: false,
        status: null,
      })
      
      renderWithRouter(<AdminUsers />)
      
      expect(screen.getByText('No students found.')).toBeInTheDocument()
    })

    it('displays error status when API fails', () => {
      useAdminStudents.mockReturnValue({
        students: [],
        loading: false,
        status: { type: 'error', message: 'Failed to load students' },
      })
      
      renderWithRouter(<AdminUsers />)
      
      expect(screen.getByText('Failed to load students')).toBeInTheDocument()
    })
  })

  describe('AdminCourses Page', () => {
    const mockCourses = [
      createMockCourse({ _id: '1', courseCode: 'CS101', courseName: 'Intro to CS', level: 100 }),
      createMockCourse({ _id: '2', courseCode: 'CS102', courseName: 'Data Structures', level: 100 }),
      createMockCourse({ _id: '3', courseCode: 'CS201', courseName: 'Algorithms', level: 200 }),
    ]

    beforeEach(() => {
      vi.clearAllMocks()
      useAdminCoursesList.mockReturnValue({
        courses: [],
        loading: false,
        status: null,
        setCourses: vi.fn(),
      })
      useCreateCourse.mockReturnValue({
        createCourse: vi.fn(),
        loading: false,
        status: null,
      })
      useCatalogFilters.mockReturnValue({
        filteredCourses: [],
        pagedCourses: [],
        totalPages: 1,
        currentPage: 1,
      })
    })

    it('renders page header', () => {
      renderWithRouter(<AdminCourses />)
      
      expect(screen.getByText('Courses')).toBeInTheDocument()
      expect(screen.getByText('Course catalog')).toBeInTheDocument()
      expect(screen.getByText('Manage the courses students can register for.')).toBeInTheDocument()
    })

    it('renders add course form', () => {
      renderWithRouter(<AdminCourses />)
      
      expect(screen.getByRole('heading', { name: /add course/i })).toBeInTheDocument()
      expect(screen.getByPlaceholderText('CSC 101')).toBeInTheDocument()
    })

    it('renders course tips section', () => {
      renderWithRouter(<AdminCourses />)
      
      expect(screen.getByText('Course tips')).toBeInTheDocument()
      expect(screen.getByText('Use unique course codes (e.g., CSC 201).')).toBeInTheDocument()
      expect(screen.getByText('Match the level to the student year.')).toBeInTheDocument()
      expect(screen.getByText('Credit units can be 2 or 3.')).toBeInTheDocument()
    })

    it('displays loading state for courses', () => {
      useAdminCoursesList.mockReturnValue({
        courses: [],
        loading: true,
        status: null,
        setCourses: vi.fn(),
      })
      
      renderWithRouter(<AdminCourses />)
      
      expect(screen.getByText('Loading courses...')).toBeInTheDocument()
    })

    it('displays course list after loading', () => {
      useAdminCoursesList.mockReturnValue({
        courses: mockCourses,
        loading: false,
        status: null,
        setCourses: vi.fn(),
      })
      useCatalogFilters.mockReturnValue({
        filteredCourses: mockCourses,
        pagedCourses: mockCourses,
        totalPages: 1,
        currentPage: 1,
      })
      
      renderWithRouter(<AdminCourses />)
      
      expect(screen.getByText(/CS101 - Intro to CS/)).toBeInTheDocument()
      expect(screen.getByText(/CS102 - Data Structures/)).toBeInTheDocument()
      expect(screen.getByText(/CS201 - Algorithms/)).toBeInTheDocument()
    })

    it('displays error status when course list fails to load', () => {
      useAdminCoursesList.mockReturnValue({
        courses: [],
        loading: false,
        status: { type: 'error', message: 'Failed to load courses' },
        setCourses: vi.fn(),
      })
      
      renderWithRouter(<AdminCourses />)
      
      expect(screen.getByText('Failed to load courses')).toBeInTheDocument()
    })
  })
})
