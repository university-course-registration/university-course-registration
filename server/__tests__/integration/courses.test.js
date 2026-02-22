const request = require('supertest');
const createTestApp = require('../testApp');
const { createTestStudent, createTestCourse, createTestCourses } = require('../testUtils');
const Course = require('../../models/Course');
const User = require('../../models/User');

const app = createTestApp();

describe('Course Endpoints', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test_jwt_secret';
  });

  describe('GET /api/courses/all', () => {
    beforeEach(async () => {
      // Create test courses at different levels
      await Course.create([
        { courseCode: 'CS101', courseName: 'Intro to CS', semester: 1, creditUnit: 3, level: '100' },
        { courseCode: 'CS102', courseName: 'Programming I', semester: 2, creditUnit: 3, level: '100' },
        { courseCode: 'CS201', courseName: 'Data Structures', semester: 1, creditUnit: 3, level: '200' },
        { courseCode: 'CS202', courseName: 'Algorithms', semester: 2, creditUnit: 3, level: '200' },
        { courseCode: 'CS301', courseName: 'Database Systems', semester: 1, creditUnit: 3, level: '300' }
      ]);
    });

    it('should return courses for specified level', async () => {
      const response = await request(app)
        .get('/api/courses/all?level=100');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.count).toBe(2);
      expect(response.body.currentLevel).toBe('100');
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every(c => c.level === '100')).toBe(true);
    });

    it('should return all courses when level is not provided', async () => {
      const response = await request(app)
        .get('/api/courses/all');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeDefined();
    });

    it('should include carry-over levels when includeLevels is provided', async () => {
      const response = await request(app)
        .get('/api/courses/all?level=200&includeLevels=100');

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(4); // 2 from 100 + 2 from 200
      expect(response.body.levelsIncluded).toContain('100');
      expect(response.body.levelsIncluded).toContain('200');
      expect(response.body.message).toContain('Courses retrieved successfully');
    });

    it('should handle multiple carry-over levels', async () => {
      const response = await request(app)
        .get('/api/courses/all?level=300&includeLevels=100,200');

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(5); // All courses
      expect(response.body.levelsIncluded).toContain('100');
      expect(response.body.levelsIncluded).toContain('200');
      expect(response.body.levelsIncluded).toContain('300');
    });

    it('should return empty array when no courses match level', async () => {
      const response = await request(app)
        .get('/api/courses/all?level=500');

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toHaveLength(0);
    });

    it('should sort courses by level and courseCode', async () => {
      const response = await request(app)
        .get('/api/courses/all?level=100&includeLevels=200');

      expect(response.status).toBe(200);
      const courses = response.body.data;
      
      // Check that courses are sorted
      for (let i = 1; i < courses.length; i++) {
        const prevLevel = parseInt(courses[i - 1].level);
        const currLevel = parseInt(courses[i].level);
        expect(currLevel).toBeGreaterThanOrEqual(prevLevel);
      }
    });
  });

  describe('POST /api/courses/register', () => {
    let student, token, courses;

    beforeEach(async () => {
      const result = await createTestStudent();
      student = result.student;
      token = result.token;

      courses = await Promise.all([
        createTestCourse({ courseCode: 'CS101', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS102', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS103', creditUnit: 2 })
      ]);
    });

    it('should register courses successfully', async () => {
      const courseIds = courses.map(c => c._id);

      const response = await request(app)
        .post('/api/courses/register')
        .set('Authorization', `Bearer ${token}`)
        .send({ courseIds, userId: student._id });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Courses registered successfully');
      expect(response.body.totalCreditUnits).toBe(8); // 3 + 3 + 2
    });

    it('should return 401 without authentication token', async () => {
      const courseIds = courses.map(c => c._id);

      const response = await request(app)
        .post('/api/courses/register')
        .send({ courseIds, userId: student._id });

      expect(response.status).toBe(401);
    });

    it('should return 400 when courseIds is missing', async () => {
      const response = await request(app)
        .post('/api/courses/register')
        .set('Authorization', `Bearer ${token}`)
        .send({ userId: student._id });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Course IDs are required');
    });

    it('should return 400 when courseIds is not an array', async () => {
      const response = await request(app)
        .post('/api/courses/register')
        .set('Authorization', `Bearer ${token}`)
        .send({ courseIds: 'not-an-array', userId: student._id });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Course IDs must be an array');
    });

    it('should return 400 when courseIds is empty array', async () => {
      const response = await request(app)
        .post('/api/courses/register')
        .set('Authorization', `Bearer ${token}`)
        .send({ courseIds: [], userId: student._id });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('At least one course ID is required');
    });

    it('should return 400 when userId is missing', async () => {
      const courseIds = courses.map(c => c._id);

      const response = await request(app)
        .post('/api/courses/register')
        .set('Authorization', `Bearer ${token}`)
        .send({ courseIds });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('User ID is required');
    });

    it('should return 404 when course not found', async () => {
      const invalidCourseId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .post('/api/courses/register')
        .set('Authorization', `Bearer ${token}`)
        .send({ courseIds: [invalidCourseId], userId: student._id });

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('courses not found');
    });

    it('should return 404 when user not found', async () => {
      const courseIds = courses.map(c => c._id);
      const invalidUserId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .post('/api/courses/register')
        .set('Authorization', `Bearer ${token}`)
        .send({ courseIds, userId: invalidUserId });

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('User not found');
    });

    it('should enforce 36 credit unit limit', async () => {
      // Create courses that exceed 36 units
      const manyCourses = await Promise.all([
        createTestCourse({ courseCode: 'CS201', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS202', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS203', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS204', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS205', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS206', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS207', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS208', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS209', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS210', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS211', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS212', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS213', creditUnit: 3 }) // Total: 39 units
      ]);

      const courseIds = manyCourses.map(c => c._id);

      const response = await request(app)
        .post('/api/courses/register')
        .set('Authorization', `Bearer ${token}`)
        .send({ courseIds, userId: student._id });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Credit unit limit exceeded');
      expect(response.body.totalCreditUnits).toBe(39);
    });

    it('should allow exactly 36 credit units', async () => {
      // Create courses totaling exactly 36 units
      const exactCourses = await Promise.all([
        createTestCourse({ courseCode: 'CS301', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS302', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS303', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS304', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS305', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS306', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS307', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS308', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS309', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS310', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS311', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS312', creditUnit: 3 }) // Total: 36 units
      ]);

      const courseIds = exactCourses.map(c => c._id);

      const response = await request(app)
        .post('/api/courses/register')
        .set('Authorization', `Bearer ${token}`)
        .send({ courseIds, userId: student._id });

      expect(response.status).toBe(200);
      expect(response.body.totalCreditUnits).toBe(36);
    });

    it('should update user registeredCourses field', async () => {
      const courseIds = courses.map(c => c._id);

      await request(app)
        .post('/api/courses/register')
        .set('Authorization', `Bearer ${token}`)
        .send({ courseIds, userId: student._id });

      const updatedUser = await User.findById(student._id);
      expect(updatedUser.registeredCourses).toHaveLength(3);
    });

    it('should replace previous registrations', async () => {
      const firstCourseIds = [courses[0]._id];
      const secondCourseIds = [courses[1]._id, courses[2]._id];

      // First registration
      await request(app)
        .post('/api/courses/register')
        .set('Authorization', `Bearer ${token}`)
        .send({ courseIds: firstCourseIds, userId: student._id });

      // Second registration should replace first
      const response = await request(app)
        .post('/api/courses/register')
        .set('Authorization', `Bearer ${token}`)
        .send({ courseIds: secondCourseIds, userId: student._id });

      expect(response.status).toBe(200);
      expect(response.body.user.registeredCourses).toHaveLength(2);
    });
  });

  describe('GET /api/courses/registered', () => {
    let student, token, courses;

    beforeEach(async () => {
      const result = await createTestStudent();
      student = result.student;
      token = result.token;

      courses = await createTestCourses(3);
    });

    it('should return registered courses for authenticated user', async () => {
      // Register courses first
      await User.findByIdAndUpdate(student._id, {
        registeredCourses: courses.map(c => c._id)
      });

      const response = await request(app)
        .get('/api/courses/registered')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.courses).toHaveLength(3);
      expect(response.body.totalCreditUnits).toBeGreaterThan(0);
    });

    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .get('/api/courses/registered');

      expect(response.status).toBe(401);
    });

    it('should return empty array when no courses registered', async () => {
      const response = await request(app)
        .get('/api/courses/registered')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.courses).toHaveLength(0);
      expect(response.body.totalCreditUnits).toBe(0);
      expect(response.body.message).toContain('No registered courses');
    });

    it('should calculate total credit units correctly', async () => {
      const testCourses = await Promise.all([
        createTestCourse({ courseCode: 'CS401', creditUnit: 3 }),
        createTestCourse({ courseCode: 'CS402', creditUnit: 2 }),
        createTestCourse({ courseCode: 'CS403', creditUnit: 3 })
      ]);

      await User.findByIdAndUpdate(student._id, {
        registeredCourses: testCourses.map(c => c._id)
      });

      const response = await request(app)
        .get('/api/courses/registered')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.totalCreditUnits).toBe(8); // 3 + 2 + 3
    });

    it('should populate course details', async () => {
      await User.findByIdAndUpdate(student._id, {
        registeredCourses: [courses[0]._id]
      });

      const response = await request(app)
        .get('/api/courses/registered')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.courses[0]).toHaveProperty('courseCode');
      expect(response.body.courses[0]).toHaveProperty('courseName');
      expect(response.body.courses[0]).toHaveProperty('creditUnit');
    });
  });
});
