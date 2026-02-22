// Feature: assignment-compliance-improvements, Property 1: Invalid Input Error Responses
const fc = require('fast-check');
const request = require('supertest');
const createTestApp = require('../testApp');
const { createTestAdmin } = require('../testUtils');

const app = createTestApp();

describe('Property 1: Invalid Input Error Responses', () => {
  let adminToken;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test_jwt_secret';
    const { token } = await createTestAdmin();
    adminToken = token;
  });

  describe('POST /api/auth/signup - Invalid inputs should return 400-level errors', () => {
    it('should return 400 for missing required fields', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.option(fc.string(), { nil: undefined }),
            regNo: fc.option(fc.string(), { nil: undefined }),
            email: fc.option(fc.emailAddress(), { nil: undefined }),
            password: fc.option(fc.string(), { nil: undefined }),
            level: fc.option(fc.constantFrom('100', '200', '300', '400', '500'), { nil: undefined })
          }),
          async (userData) => {
            // Only test if at least one required field is missing
            const hasAllFields = userData.name && userData.regNo && userData.email && 
                                userData.password && userData.level;
            
            if (hasAllFields) {return true;}

            const response = await request(app)
              .post('/api/auth/signup')
              .send(userData);

            // Should return 400-level error
            expect(response.status).toBeGreaterThanOrEqual(400);
            expect(response.status).toBeLessThan(500);
            expect(response.body).toHaveProperty('error');
            return true;
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should return 400 for invalid level values', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string().filter(s => !['100', '200', '300', '400', '500'].includes(s)),
          async (invalidLevel) => {
            const userData = {
              name: 'Test User',
              regNo: `UG15/CS/${Math.floor(Math.random() * 10000)}`,
              email: `test${Math.random()}@test.com`,
              password: 'password123',
              level: invalidLevel
            };

            const response = await request(app)
              .post('/api/auth/signup')
              .send(userData);

            // Should return 400-level error
            expect(response.status).toBeGreaterThanOrEqual(400);
            expect(response.status).toBeLessThan(500);
            return true;
          }
        ),
        { numRuns: 5 }
      );
    });
  });

  describe('POST /api/auth/login - Invalid inputs should return 400-level errors', () => {
    it('should return 400 or 401 for missing credentials', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            email: fc.option(fc.emailAddress(), { nil: undefined }),
            password: fc.option(fc.string(), { nil: undefined })
          }),
          async (credentials) => {
            // Only test if at least one field is missing
            if (credentials.email && credentials.password) {return true;}

            const response = await request(app)
              .post('/api/auth/login')
              .send(credentials);

            // Should return 400-level error
            expect(response.status).toBeGreaterThanOrEqual(400);
            expect(response.status).toBeLessThan(500);
            expect(response.body).toHaveProperty('error');
            return true;
          }
        ),
        { numRuns: 5 }
      );
    });
  });

  describe('POST /api/courses/register - Invalid inputs should return 400-level errors', () => {
    it('should return 400 for invalid courseIds format', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.oneof(
            fc.constant(null),
            fc.constant(undefined),
            fc.string(),
            fc.integer(),
            fc.constant([])
          ),
          async (invalidCourseIds) => {
            const response = await request(app)
              .post('/api/courses/register')
              .set('Authorization', `Bearer ${adminToken}`)
              .send({ 
                courseIds: invalidCourseIds,
                userId: '507f1f77bcf86cd799439011'
              });

            // Should return 400-level error
            expect(response.status).toBeGreaterThanOrEqual(400);
            expect(response.status).toBeLessThan(500);
            return true;
          }
        ),
        { numRuns: 5 }
      );
    });
  });

  describe('POST /api/admin/courses - Invalid inputs should return 400-level errors', () => {
    it('should return 400 for missing required fields', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            courseCode: fc.option(fc.string(), { nil: undefined }),
            courseName: fc.option(fc.string(), { nil: undefined }),
            semester: fc.option(fc.constantFrom(1, 2), { nil: undefined }),
            creditUnit: fc.option(fc.constantFrom(2, 3), { nil: undefined }),
            level: fc.option(fc.constantFrom('100', '200', '300', '400', '500'), { nil: undefined })
          }),
          async (courseData) => {
            // Only test if at least one required field is missing
            const hasAllFields = courseData.courseCode && courseData.courseName && 
                                courseData.semester !== undefined && 
                                courseData.creditUnit !== undefined && 
                                courseData.level;
            
            if (hasAllFields) {return true;}

            const response = await request(app)
              .post('/api/admin/courses')
              .set('Authorization', `Bearer ${adminToken}`)
              .send(courseData);

            // Should return 400-level error
            expect(response.status).toBeGreaterThanOrEqual(400);
            expect(response.status).toBeLessThan(500);
            return true;
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should return 400 for invalid semester values', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer().filter(n => n !== 1 && n !== 2),
          async (invalidSemester) => {
            const courseData = {
              courseCode: `CS${Math.floor(Math.random() * 1000)}`,
              courseName: 'Test Course',
              semester: invalidSemester,
              creditUnit: 3,
              level: '100'
            };

            const response = await request(app)
              .post('/api/admin/courses')
              .set('Authorization', `Bearer ${adminToken}`)
              .send(courseData);

            // Should return 400-level error (validation error)
            expect(response.status).toBeGreaterThanOrEqual(400);
            expect(response.status).toBeLessThan(500);
            return true;
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should return 400 for invalid creditUnit values', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer().filter(n => n !== 2 && n !== 3),
          async (invalidCreditUnit) => {
            const courseData = {
              courseCode: `CS${Math.floor(Math.random() * 1000)}`,
              courseName: 'Test Course',
              semester: 1,
              creditUnit: invalidCreditUnit,
              level: '100'
            };

            const response = await request(app)
              .post('/api/admin/courses')
              .set('Authorization', `Bearer ${adminToken}`)
              .send(courseData);

            // Should return 400-level error (validation error)
            expect(response.status).toBeGreaterThanOrEqual(400);
            expect(response.status).toBeLessThan(500);
            return true;
          }
        ),
        { numRuns: 5 }
      );
    });
  });
});
