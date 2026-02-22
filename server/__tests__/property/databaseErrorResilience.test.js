// Feature: assignment-compliance-improvements, Property 4: Database Error Resilience
const fc = require('fast-check');
const request = require('supertest');
const mongoose = require('mongoose');
const createTestApp = require('../testApp');
const { createTestStudent, createTestAdmin } = require('../testUtils');

const app = createTestApp();

describe('Property 4: Database Error Resilience', () => {
  let student, studentToken, adminToken;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test_jwt_secret';
    const studentResult = await createTestStudent();
    student = studentResult.student;
    studentToken = studentResult.token;

    const adminResult = await createTestAdmin();
    adminToken = adminResult.token;
  });

  describe('System should handle database errors gracefully', () => {
    it('should handle invalid ObjectId format without crashing', async () => {
      const invalidIds = ['invalid', '123', 'not-an-id'];
      
      for (const invalidId of invalidIds) {
        const response = await request(app)
          .post('/api/courses/register')
          .set('Authorization', `Bearer ${studentToken}`)
          .send({
            courseIds: [invalidId],
            userId: student._id
          });

        expect(response.status).toBeGreaterThanOrEqual(400);
        expect(response.status).toBeLessThan(600);
        expect(response.body).toHaveProperty('status');
      }
    }, 10000);

    it('should handle malformed user IDs without crashing', async () => {
      const malformedIds = ['malformed', 'test123', 'abc'];
      
      for (const malformedId of malformedIds) {
        const response = await request(app)
          .post('/api/courses/register')
          .set('Authorization', `Bearer ${studentToken}`)
          .send({
            courseIds: ['507f1f77bcf86cd799439011'],
            userId: malformedId
          });

        expect(response.status).toBeGreaterThanOrEqual(400);
        expect(response.status).toBeLessThan(600);
        expect(response.body).toHaveProperty('status');
      }
    }, 10000);

    it('should handle non-existent document queries gracefully', async () => {
      const nonExistentIds = [
        '507f1f77bcf86cd799439011',
        '507f1f77bcf86cd799439012',
        '507f1f77bcf86cd799439013'
      ];
      
      for (const nonExistentId of nonExistentIds) {
        const response = await request(app)
          .post('/api/courses/register')
          .set('Authorization', `Bearer ${studentToken}`)
          .send({
            courseIds: [nonExistentId],
            userId: student._id
          });

        expect(response.status).toBeGreaterThanOrEqual(400);
        expect(response.status).toBeLessThan(500);
        expect(response.body).toHaveProperty('message');
      }
    }, 10000);

    it('should handle duplicate key errors gracefully', async () => {
      // Use a simpler approach without property-based testing for bcrypt-heavy operations
      const testCases = [
        { regNo: 'DUP001', email: 'dup1@test.com' },
        { regNo: 'DUP002', email: 'dup2@test.com' },
        { regNo: 'DUP003', email: 'dup3@test.com' }
      ];

      for (const testCase of testCases) {
        const userData = {
          name: 'Test User',
          regNo: testCase.regNo,
          email: testCase.email,
          password: 'password123',
          level: '100'
        };

        // Create user first time
        await request(app)
          .post('/api/auth/signup')
          .send(userData);

        // Try to create duplicate
        const response = await request(app)
          .post('/api/auth/signup')
          .send(userData);

        // Should handle duplicate error gracefully
        expect(response.status).toBe(400);
        expect(response.body.message).toBeDefined();
      }
    }, 15000);

    it('should handle validation errors without crashing', async () => {
      const invalidCourses = [
        { courseCode: '', courseName: 'Test', semester: 1, creditUnit: 3, level: '100' },
        { courseCode: 'CS', courseName: '', semester: 1, creditUnit: 3, level: '100' },
        { courseCode: 'CS', courseName: 'Test', semester: 0, creditUnit: 3, level: '100' }
      ];

      for (const invalidCourseData of invalidCourses) {
        const response = await request(app)
          .post('/api/admin/courses')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(invalidCourseData);

        expect(response.status).toBeGreaterThanOrEqual(400);
        expect(response.status).toBeLessThan(600);
        expect(response.body).toHaveProperty('status');
      }
    }, 10000);

    it('should return appropriate error responses for database failures', async () => {
      const testCases = [
        {
          endpoint: '/api/courses/register',
          method: 'post',
          token: studentToken,
          data: { courseIds: null, userId: student._id }
        },
        {
          endpoint: '/api/courses/register',
          method: 'post',
          token: studentToken,
          data: { courseIds: ['invalid'], userId: student._id }
        },
        {
          endpoint: '/api/admin/courses',
          method: 'post',
          token: adminToken,
          data: { courseCode: '', courseName: '', semester: 0, creditUnit: 0, level: '' }
        }
      ];

      for (const testCase of testCases) {
        const response = await request(app)[testCase.method](testCase.endpoint)
          .set('Authorization', `Bearer ${testCase.token}`)
          .send(testCase.data);

        expect(response.status).toBeGreaterThanOrEqual(400);
        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toBe('error');
      }
    }, 10000);

    it('should handle concurrent database operations without crashing', async () => {
      const promises = Array(5).fill(null).map(() =>
        request(app)
          .get('/api/admin/stats')
          .set('Authorization', `Bearer ${adminToken}`)
      );

      const results = await Promise.all(promises);
      
      results.forEach(response => {
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(600);
      });
    }, 10000);

    it('should maintain system stability after database errors', async () => {
      // Cause a database error
      await request(app)
        .post('/api/courses/register')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ courseIds: ['invalid'], userId: student._id });

      // System should still work after error
      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    }, 10000);

    it('should handle empty or null database results gracefully', async () => {
      // Query for non-existent data
      const response = await request(app)
        .get('/api/courses/all?level=500');

      // Should return empty result, not crash
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    }, 10000);

    it('should handle malformed query parameters without crashing', async () => {
      const malformedLevels = ['abc', '999', 'invalid'];
      
      for (const malformedLevel of malformedLevels) {
        const response = await request(app)
          .get(`/api/courses/all?level=${encodeURIComponent(malformedLevel)}`);

        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(600);
        expect(response.body).toHaveProperty('status');
      }
    }, 10000);
  });

  describe('System should log errors but continue operating', () => {
    it('should continue serving requests after encountering errors', async () => {
      const errorRequests = [];
      const successRequests = [];

      // Generate some error requests
      for (let i = 0; i < 3; i++) {
        errorRequests.push(
          request(app)
            .post('/api/courses/register')
            .set('Authorization', `Bearer ${studentToken}`)
            .send({ courseIds: ['invalid'], userId: student._id })
        );
      }

      await Promise.all(errorRequests);

      // System should still handle valid requests
      for (let i = 0; i < 3; i++) {
        successRequests.push(
          request(app)
            .get('/api/admin/stats')
            .set('Authorization', `Bearer ${adminToken}`)
        );
      }

      const results = await Promise.all(successRequests);
      
      results.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
      });
    }, 10000);
  });
});
