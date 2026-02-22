const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createTestApp = require('../testApp');
const User = require('../../models/User');

const app = createTestApp();

describe('Authentication Endpoints', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test_jwt_secret';
  });

  describe('POST /api/auth/signup', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        regNo: 'UG15/CS/3001',
        email: 'john@test.com',
        password: 'password123',
        level: '100'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.regNo).toBe(userData.regNo);
      expect(response.body.user.level).toBe(userData.level);
      expect(response.body.user.role).toBe('student');
      expect(response.body.user.password).toBeUndefined();
    });

    it('should hash the password before saving', async () => {
      const userData = {
        name: 'Jane Doe',
        regNo: 'UG15/CS/3002',
        email: 'jane@test.com',
        password: 'password123',
        level: '200'
      };

      await request(app)
        .post('/api/auth/signup')
        .send(userData);

      const user = await User.findOne({ email: userData.email });
      expect(user.password).not.toBe(userData.password);
      
      // Password should be hashed (bcrypt uses rounds=1 in tests for speed)
      const isPasswordValid = await bcrypt.compare(userData.password, user.password);
      expect(isPasswordValid).toBe(true);
    });

    it('should generate a valid JWT token', async () => {
      const userData = {
        name: 'Test User',
        regNo: 'UG15/CS/3003',
        email: 'testuser@test.com',
        password: 'password123',
        level: '300'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
      expect(decoded.id).toBeDefined();
      expect(decoded.role).toBe('student');
    });

    it('should return 400 when name is missing', async () => {
      const userData = {
        regNo: 'UG15/CS/3004',
        email: 'test@test.com',
        password: 'password123',
        level: '100'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Name is required');
    });

    it('should return 400 when regNo is missing', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123',
        level: '100'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should return 400 when email is missing', async () => {
      const userData = {
        name: 'Test User',
        regNo: 'UG15/CS/3005',
        password: 'password123',
        level: '100'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should return 400 when password is missing', async () => {
      const userData = {
        name: 'Test User',
        regNo: 'UG15/CS/3006',
        email: 'test@test.com',
        level: '100'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should return 400 when level is missing', async () => {
      const userData = {
        name: 'Test User',
        regNo: 'UG15/CS/3007',
        email: 'test@test.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should return 400 when email already exists', async () => {
      const userData = {
        name: 'User One',
        regNo: 'UG15/CS/3008',
        email: 'duplicate@test.com',
        password: 'password123',
        level: '100'
      };

      await request(app)
        .post('/api/auth/signup')
        .send(userData);

      const duplicateUser = {
        name: 'User Two',
        regNo: 'UG15/CS/3009',
        email: 'duplicate@test.com',
        password: 'password123',
        level: '100'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(duplicateUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation Error');
      expect(response.body.message).toContain('Email already registered');
    });

    it('should return 400 when regNo already exists', async () => {
      const userData = {
        name: 'User One',
        regNo: 'UG15/CS/3010',
        email: 'user1@test.com',
        password: 'password123',
        level: '100'
      };

      await request(app)
        .post('/api/auth/signup')
        .send(userData);

      const duplicateUser = {
        name: 'User Two',
        regNo: 'UG15/CS/3010',
        email: 'user2@test.com',
        password: 'password123',
        level: '100'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(duplicateUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation Error');
      expect(response.body.message).toContain('Registration number already exists');
    });

    it('should accept all valid level values', async () => {
      const levels = ['100', '200', '300', '400', '500'];

      for (let i = 0; i < levels.length; i++) {
        const userData = {
          name: `User ${i}`,
          regNo: `UG15/CS/30${11 + i}`,
          email: `user${i}@test.com`,
          password: 'password123',
          level: levels[i]
        };

        const response = await request(app)
          .post('/api/auth/signup')
          .send(userData);

        expect(response.status).toBe(201);
        expect(response.body.user.level).toBe(levels[i]);
      }
    });
  });

  describe('POST /api/auth/login', () => {
    // Recreate test user before each login test since afterEach clears the database
    beforeEach(async () => {
      // Use bcrypt rounds of 1 for tests (much faster)
      const hashedPassword = await bcrypt.hash('password123', 1);
      await User.create({
        name: 'Login Test User',
        regNo: 'UG15/CS/4001',
        email: 'logintest@test.com',
        password: hashedPassword,
        level: '100',
        role: 'student'
      });
    });

    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'logintest@test.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(loginData.email);
      expect(response.body.user.password).toBeUndefined();
    });

    it('should generate a valid JWT token on login', async () => {
      const loginData = {
        email: 'logintest@test.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
      expect(decoded.id).toBeDefined();
      expect(decoded.role).toBe('student');
    });

    it('should return 400 when email is missing', async () => {
      const loginData = {
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Email is required');
    });

    it('should return 400 when password is missing', async () => {
      const loginData = {
        email: 'logintest@test.com'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Password is required');
    });

    it('should return 401 with invalid email', async () => {
      const loginData = {
        email: 'nonexistent@test.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
      expect(response.body.message).toContain('Invalid email or password');
    });

    it('should return 401 with invalid password', async () => {
      const loginData = {
        email: 'logintest@test.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
      expect(response.body.message).toContain('Invalid email or password');
    });

    it('should verify password correctly', async () => {
      const correctLogin = {
        email: 'logintest@test.com',
        password: 'password123'
      };

      const correctResponse = await request(app)
        .post('/api/auth/login')
        .send(correctLogin);

      expect(correctResponse.status).toBe(200);

      const incorrectLogin = {
        email: 'logintest@test.com',
        password: 'wrongpassword'
      };

      const incorrectResponse = await request(app)
        .post('/api/auth/login')
        .send(incorrectLogin);

      expect(incorrectResponse.status).toBe(401);
    });

    it('should login admin user successfully', async () => {
      // Use bcrypt rounds of 1 for tests (much faster)
      const hashedPassword = await bcrypt.hash('adminpass', 1);
      await User.create({
        name: 'Admin User',
        regNo: 'ADMIN001',
        email: 'admin@test.com',
        password: hashedPassword,
        level: '100',
        role: 'admin'
      });

      const loginData = {
        email: 'admin@test.com',
        password: 'adminpass'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.user.role).toBe('admin');

      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
      expect(decoded.role).toBe('admin');
    });

    it('should return user information without password', async () => {
      const loginData = {
        email: 'logintest@test.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('name');
      expect(response.body.user).toHaveProperty('regNo');
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user).toHaveProperty('level');
      expect(response.body.user).toHaveProperty('role');
      expect(response.body.user).not.toHaveProperty('password');
    });
  });
});
