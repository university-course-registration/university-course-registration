const express = require('express');
const { getAllCourses, registerCourses, getRegisteredCourses, unregisterCourses } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const { validateCourseRegistration } = require('../middleware/validation');
const { checkRegistrationPeriod } = require('../middleware/checkRegistrationPeriod');

const router = express.Router();

// GET /all - Fetch all available courses (public)
router.get('/all', getAllCourses);

// POST /register - Register courses (protected - logged in students only)
router.post('/register', protect, checkRegistrationPeriod, validateCourseRegistration, registerCourses);

// POST /unregister - Unregister from courses (protected)
router.post('/unregister', protect, checkRegistrationPeriod, unregisterCourses);

// GET /registered - Fetch registered courses (protected)
router.get('/registered', protect, getRegisteredCourses);

module.exports = router;
