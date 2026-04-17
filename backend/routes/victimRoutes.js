const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const { getVictimData } = require('../controllers/victimController');

/**
 * @route  GET /api/victim/data
 * @desc   Victim views their own FIR, case, and evidence data
 * @access victim only
 */
router.get('/data', verifyToken, authorizeRoles(['victim']), getVictimData);

module.exports = router;
