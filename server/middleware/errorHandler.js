// Custom error handling middleware
const errorHandler = (err, req, res, next) => {
  // Set default status code and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Log the error for debugging
  console.error('Error:', {
    status: statusCode,
    message: message,
    stack: err.stack
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Send error response with consistent format
  res.status(statusCode).json({
    success: false,
    status: 'error',
    error: getErrorType(statusCode),
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Helper function to map status codes to error types
function getErrorType(statusCode) {
  if (statusCode >= 400 && statusCode < 500) {
    if (statusCode === 400) {
      return 'Validation Error';
    }
    if (statusCode === 401) {
      return 'Unauthorized';
    }
    if (statusCode === 403) {
      return 'Forbidden';
    }
    if (statusCode === 404) {
      return 'Not Found';
    }
    return 'Client Error';
  }
  return 'Internal Server Error';
}

module.exports = errorHandler;
