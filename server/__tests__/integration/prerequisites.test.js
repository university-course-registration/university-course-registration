const request = require('supertest');
const createTestApp = require('../testApp');
const User = require('../../models/User');
const Course = require('../../models/Course');
const jwt = require('jsonwebtoken');

const app = createTestApp();

describe('Course Prerequisites Integration Tests', () => {
  let token;
  let userId;
  let course101;
  let course201;
  let course301;

  beforeEach(async () => {
    // Set JWT secret for tests
    process.env.JWT_SECRET = 'test_jwt_secret';

    // Create test user
    const user = await User.create({
      name: 'Test Student',
      regNo: 'UG15/CS/1001',
      email: 'student@test.com',
      password: 'password123',
      level: '200',
      role: 'student',
      registeredCourses: []
    });
    userId = user._id;

    // Generate token
    token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Create test courses with prerequisites
    course101 = await Course.create({
      courseCode: 'CSC101',
      courseName: 'Introduction to Programming',
      semester: 1,
      creditUnit: 3,
      level: '100',
      prerequisites: []
    });

    course201 = await Course.create({
      courseCode: 'CSC201',
      courseName: 'Data Structures',
      semester: 1,
      creditUnit: 3,
      level: '200',
      prerequisites: ['CSC101']
    });

    course301 = await Course.create({
      courseCode: 'CSC301',
      courseName: 'Algorithms',
      semester: 1,
      creditUnit: 3,
      level: '300',
      prerequisites: ['CSC101', 'CSC201']
    });
  });

  it('should allow registration when prerequisites are met', async () => {
    // First register CSC101
    await User.findByIdAndUpdate(userId, {
      registeredCourses: [course101._id]
    });

    // Then try to register CSC201 (requires CSC101)
    const response = await request(app)
      .post('/api/courses/register')
      .set('Authorization', `Bearer ${token}`)
      .send({
        courseIds: [course201._id],
        userId: userId.toString()
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Courses registered successfully');
  });

  it('should reject registration when prerequisites are not met', async () => {
    // Try to register CSC201 without having CSC101
    const response = await request(app)
      .post('/api/courses/register')
      .set('Authorization', `Bearer ${token}`)
      .send({
        courseIds: [course201._id],
        userId: userId.toString()
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Validation Error');
    expect(response.body.message).toContain('Prerequisites not met');
    expect(response.body.prerequisiteErrors).toHaveLength(1);
    expect(response.body.prerequisiteErrors[0].courseCode).toBe('CSC201');
    expect(response.body.prerequisiteErrors[0].missingPrerequisites).toContain('CSC101');
  });

  it('should reject registration when multiple prerequisites are missing', async () => {
    // Try to register CSC301 without having CSC101 and CSC201
    const response = await request(app)
      .post('/api/courses/register')
      .set('Authorization', `Bearer ${token}`)
      .send({
        courseIds: [course301._id],
        userId: userId.toString()
      });

    expect(response.status).toBe(400);
    expect(response.body.prerequisiteErrors[0].missingPrerequisites).toEqual(
      expect.arrayContaining(['CSC101', 'CSC201'])
    );
  });

  it('should allow registration of course with no prerequisites', async () => {
    const response = await request(app)
      .post('/api/courses/register')
      .set('Authorization', `Bearer ${token}`)
      .send({
        courseIds: [course101._id],
        userId: userId.toString()
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
  });

  it('should validate prerequisites for multiple courses in single request', async () => {
    // Register CSC101 first
    await User.findByIdAndUpdate(userId, {
      registeredCourses: [course101._id]
    });

    // Try to register both CSC201 (valid) and CSC301 (invalid - missing CSC201)
    const response = await request(app)
      .post('/api/courses/register')
      .set('Authorization', `Bearer ${token}`)
      .send({
        courseIds: [course201._id, course301._id],
        userId: userId.toString()
      });

    expect(response.status).toBe(400);
    expect(response.body.prerequisiteErrors).toHaveLength(1);
    expect(response.body.prerequisiteErrors[0].courseCode).toBe('CSC301');
  });
});
