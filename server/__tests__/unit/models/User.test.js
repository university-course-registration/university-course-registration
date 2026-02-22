const mongoose = require('mongoose');
const User = require('../../../models/User');

describe('User Model', () => {
  describe('Schema Validation', () => {
    it('should create a valid student user', async () => {
      const userData = {
        name: 'John Doe',
        regNo: 'UG15/CS/1001',
        email: 'john@test.com',
        password: 'hashedpassword123',
        level: '100',
        role: 'student'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.name).toBe(userData.name);
      expect(savedUser.regNo).toBe(userData.regNo);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.level).toBe(userData.level);
      expect(savedUser.role).toBe(userData.role);
      expect(savedUser.registeredCourses).toEqual([]);
    });

    it('should create a valid admin user', async () => {
      const adminData = {
        name: 'Admin User',
        regNo: 'ADMIN001',
        email: 'admin@test.com',
        password: 'hashedpassword123',
        level: '100',
        role: 'admin'
      };

      const admin = new User(adminData);
      const savedAdmin = await admin.save();

      expect(savedAdmin.role).toBe('admin');
    });

    it('should default role to student if not specified', async () => {
      const userData = {
        name: 'Jane Doe',
        regNo: 'UG15/CS/1002',
        email: 'jane@test.com',
        password: 'hashedpassword123',
        level: '200'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.role).toBe('student');
    });

    it('should fail validation when name is missing', async () => {
      const userData = {
        regNo: 'UG15/CS/1003',
        email: 'test@test.com',
        password: 'hashedpassword123',
        level: '100'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should fail validation when regNo is missing', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@test.com',
        password: 'hashedpassword123',
        level: '100'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should fail validation when email is missing', async () => {
      const userData = {
        name: 'Test User',
        regNo: 'UG15/CS/1004',
        password: 'hashedpassword123',
        level: '100'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should fail validation when password is missing', async () => {
      const userData = {
        name: 'Test User',
        regNo: 'UG15/CS/1005',
        email: 'test@test.com',
        level: '100'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should fail validation when level is missing', async () => {
      const userData = {
        name: 'Test User',
        regNo: 'UG15/CS/1006',
        email: 'test@test.com',
        password: 'hashedpassword123'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should fail validation with invalid level', async () => {
      const userData = {
        name: 'Test User',
        regNo: 'UG15/CS/1007',
        email: 'test@test.com',
        password: 'hashedpassword123',
        level: '600' // Invalid level
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should fail validation with invalid role', async () => {
      const userData = {
        name: 'Test User',
        regNo: 'UG15/CS/1008',
        email: 'test@test.com',
        password: 'hashedpassword123',
        level: '100',
        role: 'superadmin' // Invalid role
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should enforce unique regNo', async () => {
      const userData1 = {
        name: 'User One',
        regNo: 'UG15/CS/1009',
        email: 'user1@test.com',
        password: 'hashedpassword123',
        level: '100'
      };

      const userData2 = {
        name: 'User Two',
        regNo: 'UG15/CS/1009', // Duplicate regNo
        email: 'user2@test.com',
        password: 'hashedpassword123',
        level: '100'
      };

      await User.create(userData1);
      
      await expect(User.create(userData2)).rejects.toThrow();
    });

    it('should enforce unique email', async () => {
      const userData1 = {
        name: 'User One',
        regNo: 'UG15/CS/1010',
        email: 'duplicate@test.com',
        password: 'hashedpassword123',
        level: '100'
      };

      const userData2 = {
        name: 'User Two',
        regNo: 'UG15/CS/1011',
        email: 'duplicate@test.com', // Duplicate email
        password: 'hashedpassword123',
        level: '100'
      };

      await User.create(userData1);
      
      await expect(User.create(userData2)).rejects.toThrow();
    });

    it('should accept all valid level values', async () => {
      const levels = ['100', '200', '300', '400', '500'];
      
      for (let i = 0; i < levels.length; i++) {
        const userData = {
          name: `User ${i}`,
          regNo: `UG15/CS/10${12 + i}`,
          email: `user${i}@test.com`,
          password: 'hashedpassword123',
          level: levels[i]
        };

        const user = await User.create(userData);
        expect(user.level).toBe(levels[i]);
      }
    });

    it('should initialize registeredCourses as empty array', async () => {
      const userData = {
        name: 'Test User',
        regNo: 'UG15/CS/1017',
        email: 'test17@test.com',
        password: 'hashedpassword123',
        level: '100'
      };

      const user = await User.create(userData);
      
      expect(Array.isArray(user.registeredCourses)).toBe(true);
      expect(user.registeredCourses.length).toBe(0);
    });

    it('should allow adding course references to registeredCourses', async () => {
      const userData = {
        name: 'Test User',
        regNo: 'UG15/CS/1018',
        email: 'test18@test.com',
        password: 'hashedpassword123',
        level: '100',
        registeredCourses: [new mongoose.Types.ObjectId()]
      };

      const user = await User.create(userData);
      
      expect(user.registeredCourses.length).toBe(1);
      expect(user.registeredCourses[0]).toBeInstanceOf(mongoose.Types.ObjectId);
    });
  });
});
