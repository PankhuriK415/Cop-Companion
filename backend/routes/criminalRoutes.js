const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const { getCriminalStatus } = require('../controllers/criminalController');

/**
 * @route  GET /api/criminal/status
 * @desc   Criminal views their own case status
 * @access criminal only
 */
router.get('/status', verifyToken, authorizeRoles(['criminal']), getCriminalStatus);

module.exports = router;
