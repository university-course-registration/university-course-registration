import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter, createMockCourse } from '../testUtils'
import SemesterCourseTable from '../../components/SemesterCourseTable'
import RegistrationTotalsFooter from '../../components/RegistrationTotalsFooter'
import LevelSelectorPanel from '../../components/LevelSelectorPanel'
import RegistrationSummaryFooter from '../../components/RegistrationSummaryFooter'

describe('Course Registration Components', () => {
  describe('SemesterCourseTable', () => {
    const mockCourses = [
      createMockCourse({ courseCode: 'CS101', courseName: 'Intro to CS', semester: 1, creditUnit: 3 }),
      createMockCourse({ _id: '2', courseCode: 'CS102', courseName: 'Data Structures', semester: 1, creditUnit: 3 }),
      createMockCourse({ _id: '3', courseCode: 'CS201', courseName: 'Algorithms', semester: 2, creditUnit: 3 }),
    ]

    const mockRows = [
      { id: 1, value: '' },
    ]

    const defaultProps = {
      semester: 1,
      courses: mockCourses,
      rows: mockRows,
      loading: false,
      onAddRow: vi.fn(),
      onRemoveRow: vi.fn(),
      onRowChange: vi.fn(),
    }

    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('renders semester table with correct title', () => {
      renderWithRouter(<SemesterCourseTable {...defaultProps} />)
      expect(screen.getAllByText(/Semester 1/i)[0]).toBeInTheDocument()
    })

    it('displays correct row count', () => {
      renderWithRouter(<SemesterCourseTable {...defaultProps} />)
      expect(screen.getByText('1 row')).toBeInTheDocument()
    })

    it('displays multiple rows count correctly', () => {
      const multipleRows = [
        { id: 1, value: '' },
        { id: 2, value: '' },
      ]
      renderWithRouter(<SemesterCourseTable {...defaultProps} rows={multipleRows} />)
      expect(screen.getByText('2 rows')).toBeInTheDocument()
    })

    it('filters courses by semester', () => {
      renderWithRouter(<SemesterCourseTable {...defaultProps} />)
      
      // Should show semester 1 courses in datalist
      const datalist = document.querySelector('#course-options-1')
      const options = datalist.querySelectorAll('option')
      
      expect(options).toHaveLength(2) // Only CS101 and CS102
      expect(options[0].value).toBe('CS101')
      expect(options[1].value).toBe('CS102')
    })

    it('displays loading state', () => {
      renderWithRouter(<SemesterCourseTable {...defaultProps} loading={true} />)
      expect(screen.getByText('Loading courses...')).toBeInTheDocument()
    })

    it('displays no courses message when no courses available', () => {
      renderWithRouter(<SemesterCourseTable {...defaultProps} courses={[]} />)
      expect(screen.getByText('No courses found.')).toBeInTheDocument()
    })

    it('renders course input field with placeholder', () => {
      renderWithRouter(<SemesterCourseTable {...defaultProps} />)
      expect(screen.getByPlaceholderText('Search by code (e.g. CSC101)')).toBeInTheDocument()
    })

    it('calls onRowChange when input value changes', async () => {
      const user = userEvent.setup()
      renderWithRouter(<SemesterCourseTable {...defaultProps} />)
      
      const input = screen.getByPlaceholderText('Search by code (e.g. CSC101)')
      await user.type(input, 'CS101')
      
      expect(defaultProps.onRowChange).toHaveBeenCalled()
    })

    it('displays course details when course is selected', () => {
      const rowsWithValue = [{ id: 1, value: 'CS101' }]
      renderWithRouter(<SemesterCourseTable {...defaultProps} rows={rowsWithValue} />)
      
      expect(screen.getAllByText('Intro to CS')[0]).toBeInTheDocument()
      expect(screen.getByText('3 units')).toBeInTheDocument()
      expect(screen.getByText('Level 100')).toBeInTheDocument()
    })

    it('displays placeholder text when no course selected', () => {
      renderWithRouter(<SemesterCourseTable {...defaultProps} />)
      expect(screen.getByText('Pick a course to see details')).toBeInTheDocument()
      expect(screen.getByText('No course selected')).toBeInTheDocument()
    })

    it('calls onAddRow when add button is clicked', async () => {
      const user = userEvent.setup()
      renderWithRouter(<SemesterCourseTable {...defaultProps} />)
      
      const addButton = screen.getByRole('button', { name: /add course row/i })
      await user.click(addButton)
      
      expect(defaultProps.onAddRow).toHaveBeenCalledWith(1)
    })

    it('calls onRemoveRow when remove button is clicked', async () => {
      const user = userEvent.setup()
      const multipleRows = [
        { id: 1, value: 'CS101' },
        { id: 2, value: '' },
      ]
      renderWithRouter(<SemesterCourseTable {...defaultProps} rows={multipleRows} />)
      
      const removeButtons = screen.getAllByRole('button', { name: /remove/i })
      await user.click(removeButtons[0])
      
      expect(defaultProps.onRemoveRow).toHaveBeenCalledWith(1, 1)
    })

    it('hides remove button when only one row exists', () => {
      renderWithRouter(<SemesterCourseTable {...defaultProps} />)
      expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument()
      expect(screen.getByText('--')).toBeInTheDocument()
    })

    it('renders multiple rows correctly', () => {
      const multipleRows = [
        { id: 1, value: 'CS101' },
        { id: 2, value: 'CS102' },
      ]
      renderWithRouter(<SemesterCourseTable {...defaultProps} rows={multipleRows} />)
      
      const inputs = screen.getAllByPlaceholderText('Search by code (e.g. CSC101)')
      expect(inputs).toHaveLength(2)
    })
  })

  describe('RegistrationTotalsFooter', () => {
    const defaultProps = {
      totalUnits: 12,
      loading: false,
      hasRegistration: false,
      isUpdateMode: false,
      onRegister: vi.fn(),
    }

    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('renders total units display', () => {
      renderWithRouter(<RegistrationTotalsFooter {...defaultProps} />)
      expect(screen.getByText('Total credit units')).toBeInTheDocument()
      expect(screen.getByText('Maximum allowed: 36')).toBeInTheDocument()
      expect(screen.getByText('12 units')).toBeInTheDocument()
    })

    it('displays register button with correct text', () => {
      renderWithRouter(<RegistrationTotalsFooter {...defaultProps} />)
      expect(screen.getByRole('button', { name: /register courses/i })).toBeInTheDocument()
    })

    it('displays update button text in update mode', () => {
      renderWithRouter(<RegistrationTotalsFooter {...defaultProps} isUpdateMode={true} />)
      expect(screen.getByRole('button', { name: /update registration/i })).toBeInTheDocument()
    })

    it('calls onRegister when button is clicked', async () => {
      const user = userEvent.setup()
      renderWithRouter(<RegistrationTotalsFooter {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: /register courses/i })
      await user.click(button)
      
      expect(defaultProps.onRegister).toHaveBeenCalled()
    })

    it('disables button when loading', () => {
      renderWithRouter(<RegistrationTotalsFooter {...defaultProps} loading={true} />)
      const button = screen.getByRole('button', { name: /register courses/i })
      expect(button).toBeDisabled()
    })

    it('disables button when user has registration and not in update mode', () => {
      renderWithRouter(<RegistrationTotalsFooter {...defaultProps} hasRegistration={true} />)
      const button = screen.getByRole('button', { name: /register courses/i })
      expect(button).toBeDisabled()
    })

    it('enables button in update mode even with existing registration', () => {
      renderWithRouter(
        <RegistrationTotalsFooter 
          {...defaultProps} 
          hasRegistration={true} 
          isUpdateMode={true} 
        />
      )
      const button = screen.getByRole('button', { name: /update registration/i })
      expect(button).not.toBeDisabled()
    })

    it('displays correct total units value', () => {
      renderWithRouter(<RegistrationTotalsFooter {...defaultProps} totalUnits={24} />)
      expect(screen.getByText('24 units')).toBeInTheDocument()
    })
  })

  describe('LevelSelectorPanel', () => {
    const defaultProps = {
      selectedLevel: '100',
      onLevelChange: vi.fn(),
      status: null,
    }

    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('renders level selector with label', () => {
      renderWithRouter(<LevelSelectorPanel {...defaultProps} />)
      expect(screen.getByText('Level')).toBeInTheDocument()
      expect(screen.getByText('Courses update automatically when you change level.')).toBeInTheDocument()
    })

    it('displays select dropdown with current level', () => {
      renderWithRouter(<LevelSelectorPanel {...defaultProps} />)
      const select = screen.getByRole('combobox')
      expect(select).toHaveValue('100')
    })

    it('renders all level options', () => {
      renderWithRouter(<LevelSelectorPanel {...defaultProps} />)
      const select = screen.getByRole('combobox')
      const options = within(select).getAllByRole('option')
      
      expect(options).toHaveLength(5) // 100, 200, 300, 400, 500
      expect(options[0]).toHaveTextContent('100 Level')
      expect(options[4]).toHaveTextContent('500 Level')
    })

    it('calls onLevelChange when level is changed', async () => {
      const user = userEvent.setup()
      renderWithRouter(<LevelSelectorPanel {...defaultProps} />)
      
      const select = screen.getByRole('combobox')
      await user.selectOptions(select, '200')
      
      expect(defaultProps.onLevelChange).toHaveBeenCalled()
    })

    it('does not display status when status is null', () => {
      renderWithRouter(<LevelSelectorPanel {...defaultProps} />)
      expect(screen.queryByText(/success|error/i)).not.toBeInTheDocument()
    })

    it('displays success status message', () => {
      const status = { type: 'success', message: 'Courses loaded successfully' }
      renderWithRouter(<LevelSelectorPanel {...defaultProps} status={status} />)
      
      const statusElement = screen.getByText('Courses loaded successfully')
      expect(statusElement).toBeInTheDocument()
      expect(statusElement.className).toContain('emerald')
    })

    it('displays error status message', () => {
      const status = { type: 'error', message: 'Failed to load courses' }
      renderWithRouter(<LevelSelectorPanel {...defaultProps} status={status} />)
      
      const statusElement = screen.getByText('Failed to load courses')
      expect(statusElement).toBeInTheDocument()
      expect(statusElement.className).toContain('rose')
    })
  })

  describe('RegistrationSummaryFooter', () => {
    const defaultProps = {
      totalUnits: 18,
      onUpdate: vi.fn(),
    }

    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('renders total credit units label', () => {
      renderWithRouter(<RegistrationSummaryFooter {...defaultProps} />)
      expect(screen.getByText('Total credit units')).toBeInTheDocument()
      expect(screen.getByText('Maximum allowed: 36')).toBeInTheDocument()
    })

    it('displays correct total units', () => {
      renderWithRouter(<RegistrationSummaryFooter {...defaultProps} />)
      expect(screen.getByText('18 units')).toBeInTheDocument()
    })

    it('renders update registration button', () => {
      renderWithRouter(<RegistrationSummaryFooter {...defaultProps} />)
      expect(screen.getByRole('button', { name: /update registration/i })).toBeInTheDocument()
    })

    it('calls onUpdate when button is clicked', async () => {
      const user = userEvent.setup()
      renderWithRouter(<RegistrationSummaryFooter {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: /update registration/i })
      await user.click(button)
      
      expect(defaultProps.onUpdate).toHaveBeenCalled()
    })

    it('displays different total units values correctly', () => {
      renderWithRouter(<RegistrationSummaryFooter {...defaultProps} totalUnits={30} />)
      expect(screen.getByText('30 units')).toBeInTheDocument()
    })
  })

  describe('Credit Limit Validation Display', () => {
    it('shows maximum credit limit in RegistrationTotalsFooter', () => {
      renderWithRouter(
        <RegistrationTotalsFooter 
          totalUnits={36}
          loading={false}
          hasRegistration={false}
          isUpdateMode={false}
          onRegister={vi.fn()}
        />
      )
      expect(screen.getByText('Maximum allowed: 36')).toBeInTheDocument()
      expect(screen.getByText('36 units')).toBeInTheDocument()
    })

    it('shows maximum credit limit in RegistrationSummaryFooter', () => {
      renderWithRouter(
        <RegistrationSummaryFooter 
          totalUnits={36}
          onUpdate={vi.fn()}
        />
      )
      expect(screen.getByText('Maximum allowed: 36')).toBeInTheDocument()
      expect(screen.getByText('36 units')).toBeInTheDocument()
    })
  })

  describe('Error State Display', () => {
    it('displays error status in LevelSelectorPanel', () => {
      const errorStatus = { 
        type: 'error', 
        message: 'You already registered. Open the summary to update.' 
      }
      renderWithRouter(
        <LevelSelectorPanel 
          selectedLevel="100"
          onLevelChange={vi.fn()}
          status={errorStatus}
        />
      )
      
      const errorElement = screen.getByText('You already registered. Open the summary to update.')
      expect(errorElement).toBeInTheDocument()
      expect(errorElement.className).toContain('rose')
    })

    it('displays validation error in LevelSelectorPanel', () => {
      const errorStatus = { 
        type: 'error', 
        message: 'Select at least one course.' 
      }
      renderWithRouter(
        <LevelSelectorPanel 
          selectedLevel="100"
          onLevelChange={vi.fn()}
          status={errorStatus}
        />
      )
      
      expect(screen.getByText('Select at least one course.')).toBeInTheDocument()
    })

    it('displays API error in LevelSelectorPanel', () => {
      const errorStatus = { 
        type: 'error', 
        message: 'Course registration failed.' 
      }
      renderWithRouter(
        <LevelSelectorPanel 
          selectedLevel="100"
          onLevelChange={vi.fn()}
          status={errorStatus}
        />
      )
      
      expect(screen.getByText('Course registration failed.')).toBeInTheDocument()
    })
  })
})
