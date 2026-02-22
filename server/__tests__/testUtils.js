const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Course');

/**
 * Generate JWT token for testing
 */
function generateToken(userId, role = 'student') {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'test_jwt_secret',
    { expiresIn: '1h' }
  );
}

/**
 * Create a test student user
 */
async function createTestStudent(overrides = {}) {
  // Use bcrypt rounds of 1 for tests (much faster than default 10)
  const hashedPassword = await bcrypt.hash('password123', 1);
  
  const studentData = {
    name: 'Test Student',
    regNo: 'UG15/CS/1001',
    email: 'student@test.com',
    password: hashedPassword,
    level: '100', // Changed from 100 to '100' to match User model
    role: 'student',
    registeredCourses: [],
    ...overrides
  };

  const student = await User.create(studentData);
  const token = generateToken(student._id, student.role);
  
  return { student, token };
}

/**
 * Create a test admin user
 */
async function createTestAdmin(overrides = {}) {
  // Use bcrypt rounds of 1 for tests (much faster than default 10)
  const hashedPassword = await bcrypt.hash('admin123', 1);
  
  const adminData = {
    name: 'Test Admin',
    regNo: 'ADMIN001',
    email: 'admin@test.com',
    password: hashedPassword,
    level: '100', // Changed from 100 to '100' to match User model
    role: 'admin',
    registeredCourses: [],
    ...overrides
  };

  const admin = await User.create(adminData);
  const token = generateToken(admin._id, admin.role);
  
  return { admin, token };
}

/**
 * Create a test course
 */
async function createTestCourse(overrides = {}) {
  const courseData = {
    courseCode: 'CS101',
    courseName: 'Introduction to Computer Science',
    semester: 1,
    creditUnit: 3,
    level: '100', // Changed from 100 to '100' to match Course model
    isActive: true,
    isArchived: false,
    ...overrides
  };

  return await Course.create(courseData);
}

/**
 * Create multiple test courses
 */
async function createTestCourses(count = 3) {
  const courses = [];
  for (let i = 0; i < count; i++) {
    const course = await createTestCourse({
      courseCode: `CS${101 + i}`,
      courseName: `Test Course ${i + 1}`,
      semester: (i % 2) + 1,
      creditUnit: (i % 2) + 2,
      level: 100 + (Math.floor(i / 2) * 100)
    });
    courses.push(course);
  }
  return courses;
}

/**
 * Helper to make authenticated requests
 */
function authenticatedRequest(request, token) {
  return request.set('Authorization', `Bearer ${token}`);
}

/**
 * Assert response has error structure
 */
function assertErrorResponse(response, statusCode, errorMessage = null) {
  expect(response.status).toBe(statusCode);
  expect(response.body).toHaveProperty('error');
  if (errorMessage) {
    expect(response.body.error).toContain(errorMessage);
  }
}

/**
 * Assert response is successful
 */
function assertSuccessResponse(response, statusCode = 200) {
  expect(response.status).toBe(statusCode);
  expect(response.body).not.toHaveProperty('error');
}

module.exports = {
  generateToken,
  createTestStudent,
  createTestAdmin,
  createTestCourse,
  createTestCourses,
  authenticatedRequest,
  assertErrorResponse,
  assertSuccessResponse
};
