const express = require('express');
const { signUp, signIn } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middleware/validation');

const router = express.Router();

// POST /signup - Register a new user
router.post('/signup', validateSignup, signUp);

// POST /login - Authenticate user and get token
router.post('/login', validateLogin, signIn);

module.exports = router;
