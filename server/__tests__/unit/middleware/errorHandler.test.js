const errorHandler = require('../../../middleware/errorHandler');

// Mock response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock next function
const mockNext = jest.fn();

describe('Error Handler Middleware', () => {
  let originalEnv;

  beforeEach(() => {
    jest.clearAllMocks();
    originalEnv = process.env.NODE_ENV;
    // Suppress console.error during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    console.error.mockRestore();
  });

  it('should handle generic errors with 500 status code', () => {
    const error = new Error('Something went wrong');
    const req = {};
    const res = mockResponse();

    errorHandler(error, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status: 'error',
      error: 'Internal Server Error',
      message: 'Something went wrong'
    });
  });

  it('should use custom status code if provided', () => {
    const error = new Error('Bad request');
    error.statusCode = 400;
    const req = {};
    const res = mockResponse();

    errorHandler(error, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status: 'error',
      error: 'Validation Error',
      message: 'Bad request'
    });
  });

  it('should handle ValidationError with 400 status', () => {
    const error = {
      name: 'ValidationError',
      errors: {
        email: { message: 'Email is required' },
        password: { message: 'Password is required' }
      }
    };
    const req = {};
    const res = mockResponse();

    errorHandler(error, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        status: 'error',
        message: expect.stringContaining('Email is required')
      })
    );
  });

  it('should handle CastError with 400 status', () => {
    const error = {
      name: 'CastError',
      message: 'Cast to ObjectId failed'
    };
    const req = {};
    const res = mockResponse();

    errorHandler(error, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status: 'error',
      error: 'Validation Error',
      message: 'Invalid ID format'
    });
  });

  it('should handle duplicate key error (code 11000)', () => {
    const error = {
      code: 11000,
      keyValue: { email: 'duplicate@test.com' }
    };
    const req = {};
    const res = mockResponse();

    errorHandler(error, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status: 'error',
      error: 'Validation Error',
      message: 'email already exists'
    });
  });

  it('should handle JsonWebTokenError with 401 status', () => {
    const error = {
      name: 'JsonWebTokenError',
      message: 'jwt malformed'
    };
    const req = {};
    const res = mockResponse();

    errorHandler(error, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status: 'error',
      error: 'Unauthorized',
      message: 'Invalid token'
    });
  });

  it('should handle TokenExpiredError with 401 status', () => {
    const error = {
      name: 'TokenExpiredError',
      message: 'jwt expired'
    };
    const req = {};
    const res = mockResponse();

    errorHandler(error, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status: 'error',
      error: 'Unauthorized',
      message: 'Token expired'
    });
  });

  it('should include stack trace in development mode', () => {
    process.env.NODE_ENV = 'development';
    const error = new Error('Development error');
    error.stack = 'Error stack trace';
    const req = {};
    const res = mockResponse();

    errorHandler(error, req, res, mockNext);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        stack: 'Error stack trace'
      })
    );
  });

  it('should not include stack trace in production mode', () => {
    process.env.NODE_ENV = 'production';
    const error = new Error('Production error');
    error.stack = 'Error stack trace';
    const req = {};
    const res = mockResponse();

    errorHandler(error, req, res, mockNext);

    expect(res.json).toHaveBeenCalledWith(
      expect.not.objectContaining({
        stack: expect.anything()
      })
    );
  });

  it('should log error details to console', () => {
    const error = new Error('Test error');
    error.stack = 'Test stack';
    const req = {};
    const res = mockResponse();

    errorHandler(error, req, res, mockNext);

    expect(console.error).toHaveBeenCalledWith(
      'Error:',
      expect.objectContaining({
        status: 500,
        message: 'Test error',
        stack: 'Test stack'
      })
    );
  });

  it('should use default message for errors without message', () => {
    const error = {};
    const req = {};
    const res = mockResponse();

    errorHandler(error, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status: 'error',
      error: 'Internal Server Error',
      message: 'Internal Server Error'
    });
  });
});
