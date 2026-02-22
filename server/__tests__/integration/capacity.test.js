const request = require('supertest');
const createTestApp = require('../testApp');
const User = require('../../models/User');
const Course = require('../../models/Course');
const jwt = require('jsonwebtoken');

const app = createTestApp();

describe('Course Capacity Integration Tests', () => {
  let token;
  let userId;
  let course;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test_jwt_secret';

    // Create test user
    const user = await User.create({
      name: 'Test Student',
      regNo: 'UG15/CS/2001',
      email: 'capacity@test.com',
      password: 'password123',
      level: '200',
      role: 'student',
      registeredCourses: []
    });
    userId = user._id;

    token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Create test course with limited capacity
    course = await Course.create({
      courseCode: 'CSC201',
      courseName: 'Data Structures',
      semester: 1,
      creditUnit: 3,
      level: '200',
      prerequisites: [],
      capacity: 2,
      enrolledCount: 0
    });
  });

  it('should allow registration when course has available capacity', async () => {
    const response = await request(app)
      .post('/api/courses/register')
      .set('Authorization', `Bearer ${token}`)
      .send({
        courseIds: [course._id],
        userId: userId.toString()
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');

    // Verify enrolledCount was incremented
    const updatedCourse = await Course.findById(course._id);
    expect(updatedCourse.enrolledCount).toBe(1);
  });

  it('should reject registration when course is full', async () => {
    // Fill the course to capacity
    await Course.findByIdAndUpdate(course._id, { enrolledCount: 2 });

    const response = await request(app)
      .post('/api/courses/register')
      .set('Authorization', `Bearer ${token}`)
      .send({
        courseIds: [course._id],
        userId: userId.toString()
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Validation Error');
    expect(response.body.message).toContain('full');
    expect(response.body.capacityErrors).toHaveLength(1);
    expect(response.body.capacityErrors[0].courseCode).toBe('CSC201');
  });

  it('should increment enrolledCount on successful registration', async () => {
    const initialCount = course.enrolledCount;

    await request(app)
      .post('/api/courses/register')
      .set('Authorization', `Bearer ${token}`)
      .send({
        courseIds: [course._id],
        userId: userId.toString()
      });

    const updatedCourse = await Course.findById(course._id);
    expect(updatedCourse.enrolledCount).toBe(initialCount + 1);
  });

  it('should decrement enrolledCount on unregister', async () => {
    // First register
    await User.findByIdAndUpdate(userId, {
      registeredCourses: [course._id]
    });
    await Course.findByIdAndUpdate(course._id, { enrolledCount: 1 });

    // Then unregister
    const response = await request(app)
      .post('/api/courses/unregister')
      .set('Authorization', `Bearer ${token}`)
      .send({
        courseIds: [course._id.toString()],
        userId: userId.toString()
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');

    // Verify enrolledCount was decremented
    const updatedCourse = await Course.findById(course._id);
    expect(updatedCourse.enrolledCount).toBe(0);
  });

  it('should handle multiple students registering for same course', async () => {
    // Create second student
    const user2 = await User.create({
      name: 'Test Student 2',
      regNo: 'UG15/CS/2002',
      email: 'capacity2@test.com',
      password: 'password123',
      level: '200',
      role: 'student',
      registeredCourses: []
    });

    const token2 = jwt.sign(
      { id: user2._id, role: user2.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // First student registers
    await request(app)
      .post('/api/courses/register')
      .set('Authorization', `Bearer ${token}`)
      .send({
        courseIds: [course._id],
        userId: userId.toString()
      });

    // Second student registers
    await request(app)
      .post('/api/courses/register')
      .set('Authorization', `Bearer ${token2}`)
      .send({
        courseIds: [course._id],
        userId: user2._id.toString()
      });

    // Verify enrolledCount is 2
    const updatedCourse = await Course.findById(course._id);
    expect(updatedCourse.enrolledCount).toBe(2);

    // Third student should be rejected (course is full)
    const user3 = await User.create({
      name: 'Test Student 3',
      regNo: 'UG15/CS/2003',
      email: 'capacity3@test.com',
      password: 'password123',
      level: '200',
      role: 'student',
      registeredCourses: []
    });

    const token3 = jwt.sign(
      { id: user3._id, role: user3.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const response = await request(app)
      .post('/api/courses/register')
      .set('Authorization', `Bearer ${token3}`)
      .send({
        courseIds: [course._id],
        userId: user3._id.toString()
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('full');
  });

  it('should not increment enrolledCount if registration fails', async () => {
    // Create a course that will cause credit limit error
    await Course.create({
      courseCode: 'CSC202',
      courseName: 'Heavy Course',
      semester: 1,
      creditUnit: 3,
      level: '200',
      prerequisites: [],
      capacity: 50,
      enrolledCount: 0
    });

    // Try to register for courses that exceed credit limit
    const heavyCourses = [];
    for (let i = 0; i < 13; i++) {
      const c = await Course.create({
        courseCode: `CSC20${i + 10}`,
        courseName: `Course ${i}`,
        semester: 1,
        creditUnit: 3,
        level: '200',
        prerequisites: [],
        capacity: 50,
        enrolledCount: 0
      });
      heavyCourses.push(c._id);
    }

    const response = await request(app)
      .post('/api/courses/register')
      .set('Authorization', `Bearer ${token}`)
      .send({
        courseIds: heavyCourses,
        userId: userId.toString()
      });

    expect(response.status).toBe(400);

    // Verify enrolledCount was not incremented for any course
    for (const courseId of heavyCourses) {
      const c = await Course.findById(courseId);
      expect(c.enrolledCount).toBe(0);
    }
  });
});
