const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

router.get('/', getProfile);
router.put('/', updateProfile);
router.put('/password', changePassword);

module.exports = router;
