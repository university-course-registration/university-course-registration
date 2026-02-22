const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Sign up a new user
const signUp = async (req, res, next) => {
  try {
    const { name, regNo, email, password, level } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { regNo }] });
    if (existingUser) {
      return res.status(400).json({
        error: 'Validation Error',
        message: existingUser.email === email
          ? 'Email already registered'
          : 'Registration number already exists'
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      name,
      regNo,
      email,
      password: hashedPassword,
      level
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success response (exclude password)
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        regNo: newUser.regNo,
        email: newUser.email,
        level: newUser.level,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Sign up error:', error);
    next(error); // Forward to error handler
  }
}

// Sign in an existing user
const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token with user ID and role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success response
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        regNo: user.regNo,
        email: user.email,
        level: user.level,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Sign in error:', error);
    next(error); // Forward to error handler
  }
};

module.exports = {
  signUp,
  signIn
};
