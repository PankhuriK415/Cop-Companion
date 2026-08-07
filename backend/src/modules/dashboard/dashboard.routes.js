const express = require('express');
const router = express.Router();
const ctrl = require('./dashboard.controller');
const { authorizeRoles } = require('../../shared/middleware/auth.middleware');

// Note: Ensure this route is protected in the main app if necessary.
router.get('/', authorizeRoles(['officer']), ctrl.getAllData);

module.exports = router;
