const express = require('express');
const router = express.Router();
const { login, signUp } = require('../controllers/authController');

/**
 * @route  POST /api/auth/login
 * @desc   Authenticate user and return JWT
 * @access Public
 */
router.post('/login', login);

/**
 * @route  POST /api/auth/signup
 * @desc   Create a new user account with admin key authorization
 * @access Public
 */
router.post('/signup', signUp);

module.exports = router;
