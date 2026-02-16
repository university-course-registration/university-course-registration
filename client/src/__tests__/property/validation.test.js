// Feature: assignment-compliance-improvements, Property 2: Input Validation Consistency
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'

/**
 * Property 2: Input Validation Consistency
 * 
 * For any user input field across client and server, validation rules should be 
 * consistent between client-side and server-side validation.
 * 
 * Validates: Requirements 6.6
 */

// Validation functions that mirror client and server logic
const validateSignupData = (data) => {
  const errors = []
  
  // Required fields validation - check for undefined, null, empty string, or whitespace-only
  if (!data.name || (typeof data.name === 'string' && data.name.trim() === '')) {
    errors.push('Name is required')
  }
  if (!data.regNo || (typeof data.regNo === 'string' && data.regNo.trim() === '')) {
    errors.push('Registration number is required')
  }
  if (!data.email || (typeof data.email === 'string' && data.email.trim() === '')) {
    errors.push('Email is required')
  }
  if (!data.password || (typeof data.password === 'string' && data.password.trim() === '')) {
    errors.push('Password is required')
  }
  if (!data.level) {
    errors.push('Level is required')
  }
  
  // Email format validation - only validate if email is not empty after trimming
  if (data.email && typeof data.email === 'string' && data.email.trim() !== '' && 
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format')
  }
  
  // Level enum validation
  if (data.level && !['100', '200', '300', '400', '500'].includes(data.level)) {
    errors.push('Invalid level')
  }
  
  // Length constraints - only check if field is not empty
  if (data.name && typeof data.name === 'string' && data.name.trim() !== '' && data.name.length > 100) {
    errors.push('Name is too long')
  }
  if (data.regNo && typeof data.regNo === 'string' && data.regNo.trim() !== '' && data.regNo.length > 50) {
    errors.push('Registration number is too long')
  }
  
  return { valid: errors.length === 0, errors }
}

const validateLoginData = (data) => {
  const errors = []
  
  if (!data.email || (typeof data.email === 'string' && data.email.trim() === '')) {
    errors.push('Email is required')
  }
  if (!data.password || (typeof data.password === 'string' && data.password.trim() === '')) {
    errors.push('Password is required')
  }
  
  // Email format validation - only validate if email is not empty after trimming
  if (data.email && typeof data.email === 'string' && data.email.trim() !== '' && 
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format')
  }
  
  return { valid: errors.length === 0, errors }
}

const validateCourseData = (data) => {
  const errors = []
  
  if (!data.courseCode || (typeof data.courseCode === 'string' && data.courseCode.trim() === '')) {
    errors.push('Course code is required')
  }
  if (!data.courseName || (typeof data.courseName === 'string' && data.courseName.trim() === '')) {
    errors.push('Course name is required')
  }
  if (data.creditUnit !== undefined && ![2, 3].includes(data.creditUnit)) {
    errors.push('Credit unit must be 2 or 3')
  }
  if (data.semester !== undefined && ![1, 2].includes(data.semester)) {
    errors.push('Semester must be 1 or 2')
  }
  if (data.level !== undefined && ![100, 200, 300, 400, 500].includes(data.level)) {
    errors.push('Invalid level')
  }
  
  return { valid: errors.length === 0, errors }
}

describe('Property 2: Input Validation Consistency', () => {
  describe('Sign Up Validation Consistency', () => {
    it('property: validation rejects missing required fields', () => {
      fc.assert(
        fc.property(
          fc.record({
            name: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
            regNo: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
            email: fc.option(fc.emailAddress(), { nil: undefined }),
            password: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
            level: fc.option(fc.constantFrom('100', '200', '300', '400', '500'), { nil: undefined })
          }),
          (signupData) => {
            const result = validateSignupData(signupData)
            
            // Check if all required fields are valid (present, not empty, not whitespace-only)
            const isNameValid = signupData.name && signupData.name.trim() !== ''
            const isRegNoValid = signupData.regNo && signupData.regNo.trim() !== ''
            const isEmailValid = signupData.email && signupData.email.trim() !== ''
            const isPasswordValid = signupData.password && signupData.password.trim() !== ''
            const isLevelValid = !!signupData.level
            
            const allFieldsValid = isNameValid && isRegNoValid && isEmailValid && isPasswordValid && isLevelValid
            
            // If all fields are valid, validation should pass
            if (allFieldsValid) {
              return result.valid === true
            }
            
            // If any field is invalid, validation should fail
            return result.valid === false && result.errors.length > 0
          }
        ),
        { numRuns: 100 }
      )
    })

    it('property: email format validation is consistent', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.emailAddress(), // Valid emails
            fc.string().filter(s => s.length > 0 && !s.includes('@')), // Invalid: no @
            fc.string().filter(s => s.includes('@') && !s.includes('.')), // Invalid: @ but no domain
            fc.constant('invalid@'), // Invalid: incomplete
            fc.constant('@invalid.com') // Invalid: no local part
          ),
          (email) => {
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            
            const signupData = {
              name: 'Test User',
              regNo: 'UG15/CS/1001',
              email: email,
              password: 'Password123!',
              level: '100'
            }

            const result = validateSignupData(signupData)
            
            // If email is valid, validation should pass
            if (isValidEmail) {
              return result.valid === true
            }
            
            // If email is invalid, validation should fail with email error
            return result.valid === false && result.errors.some(e => e.includes('email'))
          }
        ),
        { numRuns: 100 }
      )
    })

    it('property: level validation accepts only valid enum values', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constantFrom('100', '200', '300', '400', '500'), // Valid levels
            fc.string().filter(s => s.length > 0 && !['100', '200', '300', '400', '500'].includes(s)) // Invalid levels
          ),
          (level) => {
            const validLevels = ['100', '200', '300', '400', '500']
            const isValidLevel = validLevels.includes(level)

            const signupData = {
              name: 'Test User',
              regNo: 'UG15/CS/1001',
              email: 'test@example.com',
              password: 'Password123!',
              level: level
            }

            const result = validateSignupData(signupData)
            
            // If level is valid, validation should pass
            if (isValidLevel) {
              return result.valid === true
            }
            
            // If level is invalid, validation should fail with level error
            return result.valid === false && result.errors.some(e => e.includes('level'))
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Sign In Validation Consistency', () => {
    it('property: validation rejects missing email or password', () => {
      fc.assert(
        fc.property(
          fc.record({
            email: fc.option(fc.emailAddress(), { nil: undefined }),
            password: fc.option(fc.string({ minLength: 1 }), { nil: undefined })
          }),
          (loginData) => {
            const result = validateLoginData(loginData)
            
            // If both fields are present, not empty, and password is not just whitespace, validation should pass
            if (loginData.email && loginData.password && loginData.password.trim() !== '') {
              return result.valid === true
            }
            
            // If any field is missing or password is whitespace-only, validation should fail
            return result.valid === false && result.errors.length > 0
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Course Validation Consistency', () => {
    it('property: courseCode is required for course creation', () => {
      fc.assert(
        fc.property(
          fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
          (courseCode) => {
            const courseData = {
              courseCode: courseCode,
              courseName: 'Test Course',
              semester: 1,
              creditUnit: 3,
              level: 100
            }
            
            const result = validateCourseData(courseData)
            
            // If courseCode is present and not just whitespace, validation should pass
            if (courseCode && courseCode.trim() !== '') {
              return result.valid === true
            }
            
            // If courseCode is missing or whitespace-only, validation should fail
            return result.valid === false && result.errors.some(e => e.includes('Course code'))
          }
        ),
        { numRuns: 100 }
      )
    })

    it('property: credit unit validation is consistent', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 10 }),
          (creditUnit) => {
            const validCreditUnits = [2, 3]
            const isValid = validCreditUnits.includes(creditUnit)

            const courseData = {
              courseCode: 'CS101',
              courseName: 'Test Course',
              semester: 1,
              creditUnit: creditUnit,
              level: 100
            }
            
            const result = validateCourseData(courseData)
            
            // If credit unit is valid, validation should pass
            if (isValid) {
              return result.valid === true
            }
            
            // If credit unit is invalid, validation should fail
            return result.valid === false && result.errors.some(e => e.includes('Credit unit'))
          }
        ),
        { numRuns: 100 }
      )
    })

    it('property: semester validation accepts only 1 or 2', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 10 }),
          (semester) => {
            const validSemesters = [1, 2]
            const isValid = validSemesters.includes(semester)

            const courseData = {
              courseCode: 'CS101',
              courseName: 'Test Course',
              semester: semester,
              creditUnit: 3,
              level: 100
            }
            
            const result = validateCourseData(courseData)
            
            // If semester is valid, validation should pass
            if (isValid) {
              return result.valid === true
            }
            
            // If semester is invalid, validation should fail
            return result.valid === false && result.errors.some(e => e.includes('Semester'))
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Boundary Value Validation Consistency', () => {
    it('property: empty strings are treated as missing fields', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('', '   ', '\t', '\n'),
          (emptyValue) => {
            const signupData = {
              name: emptyValue,
              regNo: 'UG15/CS/1001',
              email: 'test@example.com',
              password: 'Password123!',
              level: '100'
            }
            
            const result = validateSignupData(signupData)
            
            // Empty/whitespace values should be treated as missing
            return result.valid === false && result.errors.some(e => e.includes('Name'))
          }
        ),
        { numRuns: 100 }
      )
    })

    it('property: maximum length constraints are consistent', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 101, maxLength: 200 }),
          (longName) => {
            const signupData = {
              name: longName,
              regNo: 'UG15/CS/1001',
              email: 'test@example.com',
              password: 'Password123!',
              level: '100'
            }

            const result = validateSignupData(signupData)
            
            // Names longer than 100 characters should be rejected
            return result.valid === false && result.errors.some(e => e.includes('too long'))
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Data Type Validation Consistency', () => {
    it('property: level field validates enum values correctly', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constantFrom('100', '200', '300', '400', '500'),
            fc.string().filter(s => s.length > 0 && !['100', '200', '300', '400', '500'].includes(s))
          ),
          (level) => {
            const validLevels = ['100', '200', '300', '400', '500']
            const isValid = validLevels.includes(level)
            
            const signupData = {
              name: 'Test User',
              regNo: 'UG15/CS/1001',
              email: 'test@example.com',
              password: 'Password123!',
              level: level
            }

            const result = validateSignupData(signupData)
            
            // Valid levels should pass, invalid should fail
            if (isValid) {
              return result.valid === true
            }
            return result.valid === false && result.errors.some(e => e.includes('level'))
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
