const express = require('express');
const {
	getAllStudentSlips,
	getAdminStats,
	getAllCoursesAdmin,
	createCourse,
	updateCourse,
	archiveCourse,
	restoreCourse,
	getArchivedCourses,
	getRegistrationPeriod,
	updateRegistrationPeriod,
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { validateCourseCreation } = require('../middleware/validation');

const router = express.Router();

// GET /students - Get all student slips with registered courses (protected - admin only)
router.get('/students', protect, isAdmin, getAllStudentSlips);

// GET /stats - Admin dashboard stats (protected - admin only)
router.get('/stats', protect, isAdmin, getAdminStats);

// GET /courses/archived - Get archived courses (protected - admin only) - MUST come before /:id routes
router.get('/courses/archived', protect, isAdmin, getArchivedCourses);

// GET /courses - Get all courses (protected - admin only)
router.get('/courses', protect, isAdmin, getAllCoursesAdmin);

// POST /courses - Create a course (protected - admin only)
router.post('/courses', protect, isAdmin, validateCourseCreation, createCourse);

// PUT /courses/:id - Update a course (protected - admin only)
router.put('/courses/:id', protect, isAdmin, validateCourseCreation, updateCourse);

// PUT /courses/:id/archive - Archive a course (protected - admin only)
router.put('/courses/:id/archive', protect, isAdmin, archiveCourse);

// PUT /courses/:id/restore - Restore an archived course (protected - admin only)
router.put('/courses/:id/restore', protect, isAdmin, restoreCourse);

// GET /registration-period - Get registration period (protected - admin only)
router.get('/registration-period', protect, isAdmin, getRegistrationPeriod);

// PUT /registration-period - Update registration period (protected - admin only)
router.put('/registration-period', protect, isAdmin, updateRegistrationPeriod);

module.exports = router;
