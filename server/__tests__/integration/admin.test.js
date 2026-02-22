const request = require('supertest');
const createTestApp = require('../testApp');
const { createTestStudent, createTestAdmin, createTestCourses } = require('../testUtils');
const Course = require('../../models/Course');
const User = require('../../models/User');

const app = createTestApp();

describe('Admin Endpoints', () => {
  let adminToken, student, studentToken;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test_jwt_secret';
    
    const adminResult = await createTestAdmin();
    adminToken = adminResult.token;

    const studentResult = await createTestStudent();
    student = studentResult.student;
    studentToken = studentResult.token;
  });

  describe('GET /api/admin/stats', () => {
    beforeEach(async () => {
      await createTestCourses(5);
      await createTestStudent({ email: 'student2@test.com', regNo: 'UG15/CS/5002' });
    });

    it('should return admin stats for authenticated admin', async () => {
      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('students');
      expect(response.body.data).toHaveProperty('courses');
      expect(response.body.data.students).toBeGreaterThanOrEqual(2);
      expect(response.body.data.courses).toBe(5);
    });

    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .get('/api/admin/stats');

      expect(response.status).toBe(401);
    });

    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Admin privileges required');
    });

    it('should count only students, not admins', async () => {
      await createTestAdmin({ email: 'admin2@test.com', regNo: 'ADMIN002' });

      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      // Should still be 2 students (not counting the new admin)
      expect(response.body.data.students).toBe(2);
    });
  });

  describe('GET /api/admin/students', () => {
    beforeEach(async () => {
      const courses = await createTestCourses(3);
      await User.findByIdAndUpdate(student._id, {
        registeredCourses: courses.map(c => c._id)
      });
    });

    it('should return all students with registered courses', async () => {
      const response = await request(app)
        .get('/api/admin/students')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.count).toBeGreaterThanOrEqual(1);
      expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should populate registered courses', async () => {
      const response = await request(app)
        .get('/api/admin/students')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      const studentWithCourses = response.body.data.find(s => s._id === student._id.toString());
      expect(studentWithCourses.registeredCourses).toHaveLength(3);
      expect(studentWithCourses.registeredCourses[0]).toHaveProperty('courseCode');
    });

    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .get('/api/admin/students');

      expect(response.status).toBe(401);
    });

    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .get('/api/admin/students')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(403);
    });

    it('should sort students by name', async () => {
      await createTestStudent({ 
        name: 'Alice Student', 
        email: 'alice@test.com', 
        regNo: 'UG15/CS/5003' 
      });
      await createTestStudent({ 
        name: 'Zoe Student', 
        email: 'zoe@test.com', 
        regNo: 'UG15/CS/5004' 
      });

      const response = await request(app)
        .get('/api/admin/students')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      const names = response.body.data.map(s => s.name);
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);
    });

    it('should not include admin users in student list', async () => {
      const response = await request(app)
        .get('/api/admin/students')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      const hasAdmin = response.body.data.some(user => user.role === 'admin');
      expect(hasAdmin).toBe(false);
    });
  });

  describe('GET /api/admin/courses', () => {
    beforeEach(async () => {
      await Course.create([
        { courseCode: 'CS101', courseName: 'Intro to CS', semester: 1, creditUnit: 3, level: '100' },
        { courseCode: 'CS201', courseName: 'Data Structures', semester: 1, creditUnit: 3, level: '200' },
        { courseCode: 'CS301', courseName: 'Algorithms', semester: 1, creditUnit: 3, level: '300' }
      ]);
    });

    it('should return all courses for admin', async () => {
      const response = await request(app)
        .get('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.count).toBe(3);
      expect(response.body.data).toHaveLength(3);
    });

    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .get('/api/admin/courses');

      expect(response.status).toBe(401);
    });

    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .get('/api/admin/courses')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(403);
    });

    it('should sort courses by level and courseCode', async () => {
      const response = await request(app)
        .get('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      const courses = response.body.data;
      
      for (let i = 1; i < courses.length; i++) {
        const prevLevel = parseInt(courses[i - 1].level);
        const currLevel = parseInt(courses[i].level);
        expect(currLevel).toBeGreaterThanOrEqual(prevLevel);
      }
    });

    it('should return empty array when no courses exist', async () => {
      await Course.deleteMany({});

      const response = await request(app)
        .get('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('POST /api/admin/courses', () => {
    it('should create a new course successfully', async () => {
      const courseData = {
        courseCode: 'CS401',
        courseName: 'Software Engineering',
        semester: 1,
        creditUnit: 3,
        level: '400'
      };

      const response = await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(courseData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Course created successfully');
      expect(response.body.data.courseCode).toBe('CS401');
      expect(response.body.data.courseName).toBe(courseData.courseName);
    });

    it('should convert courseCode to uppercase', async () => {
      const courseData = {
        courseCode: 'cs402',
        courseName: 'Database Systems',
        semester: 1,
        creditUnit: 3,
        level: '400'
      };

      const response = await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(courseData);

      expect(response.status).toBe(201);
      expect(response.body.data.courseCode).toBe('CS402');
    });

    it('should return 401 without authentication token', async () => {
      const courseData = {
        courseCode: 'CS403',
        courseName: 'Test Course',
        semester: 1,
        creditUnit: 3,
        level: '400'
      };

      const response = await request(app)
        .post('/api/admin/courses')
        .send(courseData);

      expect(response.status).toBe(401);
    });

    it('should return 403 for non-admin users', async () => {
      const courseData = {
        courseCode: 'CS404',
        courseName: 'Test Course',
        semester: 1,
        creditUnit: 3,
        level: '400'
      };

      const response = await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(courseData);

      expect(response.status).toBe(403);
    });

    it('should return 400 when courseCode is missing', async () => {
      const courseData = {
        courseName: 'Test Course',
        semester: 1,
        creditUnit: 3,
        level: '400'
      };

      const response = await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(courseData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Course code is required');
    });

    it('should return 400 when courseName is missing', async () => {
      const courseData = {
        courseCode: 'CS405',
        semester: 1,
        creditUnit: 3,
        level: '400'
      };

      const response = await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(courseData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Course name is required');
    });

    it('should return 400 when semester is missing', async () => {
      const courseData = {
        courseCode: 'CS406',
        courseName: 'Test Course',
        creditUnit: 3,
        level: '400'
      };

      const response = await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(courseData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Semester is required');
    });

    it('should return 400 when creditUnit is missing', async () => {
      const courseData = {
        courseCode: 'CS407',
        courseName: 'Test Course',
        semester: 1,
        level: '400'
      };

      const response = await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(courseData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Credit unit is required');
    });

    it('should return 400 when level is missing', async () => {
      const courseData = {
        courseCode: 'CS408',
        courseName: 'Test Course',
        semester: 1,
        creditUnit: 3
      };

      const response = await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(courseData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Level is required');
    });

    it('should return 400 when courseCode already exists', async () => {
      const courseData = {
        courseCode: 'CS409',
        courseName: 'First Course',
        semester: 1,
        creditUnit: 3,
        level: '400'
      };

      await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(courseData);

      const duplicateData = {
        ...courseData,
        courseName: 'Duplicate Course'
      };

      const response = await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(duplicateData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already exists');
    });

    it('should handle case-insensitive duplicate courseCode', async () => {
      await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          courseCode: 'CS410',
          courseName: 'First Course',
          semester: 1,
          creditUnit: 3,
          level: '400'
        });

      const response = await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          courseCode: 'cs410', // lowercase
          courseName: 'Duplicate Course',
          semester: 1,
          creditUnit: 3,
          level: '400'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already exists');
    });
  });
});
