const express = require('express');
const { exportMyCourses, exportAllRegistrations } = require('../controllers/exportController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /my-courses - Export current user's courses (protected)
router.get('/my-courses', protect, exportMyCourses);

// GET /all-registrations - Export all registrations (protected - admin only)
router.get('/all-registrations', protect, isAdmin, exportAllRegistrations);

module.exports = router;
