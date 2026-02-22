const jwt = require('jsonwebtoken');
const { protect, isAdmin } = require('../../../middleware/authMiddleware');
const User = require('../../../models/User');

// Mock response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock next function
const mockNext = jest.fn();

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_jwt_secret';
  });

  describe('protect middleware', () => {
    it('should call next() with valid token', () => {
      const token = jwt.sign({ id: 'user123', role: 'student' }, process.env.JWT_SECRET);
      const req = {
        headers: {
          authorization: `Bearer ${token}`
        }
      };
      const res = mockResponse();

      protect(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user.id).toBe('user123');
      expect(req.user.role).toBe('student');
    });

    it('should return 401 when no token is provided', () => {
      const req = {
        headers: {}
      };
      const res = mockResponse();

      protect(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'No token provided. Please log in.'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header is missing Bearer', () => {
      const req = {
        headers: {
          authorization: 'InvalidFormat'
        }
      };
      const res = mockResponse();

      protect(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 with invalid token', () => {
      const req = {
        headers: {
          authorization: 'Bearer invalid_token'
        }
      };
      const res = mockResponse();

      protect(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Invalid or expired token'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 with expired token', () => {
      const token = jwt.sign(
        { id: 'user123', role: 'student' },
        process.env.JWT_SECRET,
        { expiresIn: '-1s' } // Already expired
      );
      const req = {
        headers: {
          authorization: `Bearer ${token}`
        }
      };
      const res = mockResponse();

      protect(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Invalid or expired token'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should decode token and attach user to request', () => {
      const userId = 'user456';
      const userRole = 'admin';
      const token = jwt.sign({ id: userId, role: userRole }, process.env.JWT_SECRET);
      const req = {
        headers: {
          authorization: `Bearer ${token}`
        }
      };
      const res = mockResponse();

      protect(req, res, mockNext);

      expect(req.user).toEqual({ id: userId, role: userRole });
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('isAdmin middleware', () => {
    it('should call next() when user has admin role in req.user', async () => {
      const req = {
        user: { id: 'admin123', role: 'admin' }
      };
      const res = mockResponse();

      await isAdmin(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 403 when user role is not admin', async () => {
      const req = {
        user: { id: 'user123', role: 'student' }
      };
      const res = mockResponse();

      await isAdmin(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Access denied. Admin privileges required.'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when no user ID is provided', async () => {
      const req = {
        body: {}
      };
      const res = mockResponse();

      await isAdmin(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Authentication required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 400 with invalid user ID format', async () => {
      const req = {
        user: { id: 'invalid_id' }
      };
      const res = mockResponse();

      await isAdmin(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Invalid user ID'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 404 when user is not found in database', async () => {
      const validObjectId = '507f1f77bcf86cd799439011';
      const req = {
        user: { id: validObjectId }
      };
      const res = mockResponse();

      await isAdmin(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'User not found'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when user exists but is not admin', async () => {
      const student = await User.create({
        name: 'Test Student',
        regNo: 'UG15/CS/2001',
        email: 'student@middleware.test',
        password: 'hashedpassword',
        level: '100',
        role: 'student'
      });

      const req = {
        user: { id: student._id.toString() }
      };
      const res = mockResponse();

      await isAdmin(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Access denied. Admin privileges required.'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next() when user exists and is admin', async () => {
      const admin = await User.create({
        name: 'Test Admin',
        regNo: 'ADMIN002',
        email: 'admin@middleware.test',
        password: 'hashedpassword',
        level: '100',
        role: 'admin'
      });

      const req = {
        user: { id: admin._id.toString() }
      };
      const res = mockResponse();

      await isAdmin(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user.role).toBe('admin');
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      // Mock User.findById to throw an error
      jest.spyOn(User, 'findById').mockRejectedValueOnce(new Error('Database error'));

      const validObjectId = '507f1f77bcf86cd799439011';
      const req = {
        user: { id: validObjectId }
      };
      const res = mockResponse();

      await isAdmin(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Authentication error',
        error: 'Database error'
      });
      expect(mockNext).not.toHaveBeenCalled();

      // Restore the original implementation
      User.findById.mockRestore();
    });
  });
});
