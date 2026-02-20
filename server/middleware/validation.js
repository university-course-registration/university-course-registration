// Validation middleware for request bodies

// Validate signup data
const validateSignup = (req, res, next) => {
  const { name, regNo, email, password, level } = req.body;
  const errors = [];

  // Check for missing or empty fields
  if (!name || (typeof name === 'string' && name.trim() === '')) {
    errors.push('Name is required');
  }
  if (!regNo || (typeof regNo === 'string' && regNo.trim() === '')) {
    errors.push('Registration number is required');
  }
  if (!email || (typeof email === 'string' && email.trim() === '')) {
    errors.push('Email is required');
  }
  if (!password || (typeof password === 'string' && password.trim() === '')) {
    errors.push('Password is required');
  }
  if (!level) {
    errors.push('Level is required');
  }

  // Validate level enum
  if (level && !['100', '200', '300', '400', '500'].includes(level)) {
    errors.push('Invalid level. Must be one of: 100, 200, 300, 400, 500');
  }

  // Validate email format
  if (email && typeof email === 'string' && email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      status: 'error',
      error: 'Validation Error',
      message: errors.join(', ')
    });
  }

  next();
};

// Validate login data
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || (typeof email === 'string' && email.trim() === '')) {
    errors.push('Email is required');
  }
  if (!password || (typeof password === 'string' && password.trim() === '')) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      status: 'error',
      error: 'Validation Error',
      message: errors.join(', ')
    });
  }

  next();
};

// Validate course creation data
const validateCourseCreation = (req, res, next) => {
  const { courseCode, courseName, semester, creditUnit, level } = req.body;
  const errors = [];

  if (!courseCode || (typeof courseCode === 'string' && courseCode.trim() === '')) {
    errors.push('Course code is required');
  }
  if (!courseName || (typeof courseName === 'string' && courseName.trim() === '')) {
    errors.push('Course name is required');
  }
  if (semester === undefined || semester === null) {
    errors.push('Semester is required');
  }
  if (creditUnit === undefined || creditUnit === null) {
    errors.push('Credit unit is required');
  }
  if (level === undefined || level === null) {
    errors.push('Level is required');
  }

  // Validate semester enum
  if (semester !== undefined && semester !== null && ![1, 2].includes(semester)) {
    errors.push('Invalid semester. Must be 1 or 2');
  }

  // Validate creditUnit enum
  if (creditUnit !== undefined && creditUnit !== null && ![2, 3].includes(creditUnit)) {
    errors.push('Invalid credit unit. Must be 2 or 3');
  }

  // Validate level enum
  if (level !== undefined && level !== null && !['100', '200', '300', '400', '500'].includes(level)) {
    errors.push('Invalid level. Must be one of: 100, 200, 300, 400, 500');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      status: 'error',
      error: 'Validation Error',
      message: errors.join(', ')
    });
  }

  next();
};

// Validate course registration data
const validateCourseRegistration = (req, res, next) => {
  const { courseIds, userId } = req.body;
  const errors = [];

  if (!courseIds) {
    errors.push('Course IDs are required');
  } else if (!Array.isArray(courseIds)) {
    errors.push('Course IDs must be an array');
  } else if (courseIds.length === 0) {
    errors.push('At least one course ID is required');
  }

  if (!userId || (typeof userId === 'string' && userId.trim() === '')) {
    errors.push('User ID is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      status: 'error',
      error: 'Validation Error',
      message: errors.join(', ')
    });
  }

  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateCourseCreation,
  validateCourseRegistration
};
