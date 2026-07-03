const express = require('express');
const router = express.Router();
const { login, signUp } = require('../controllers/authController');
const rateLimit = require('express-rate-limit');
const validate = require('../middleware/validate');
const { loginSchema, signupSchema } = require('../utils/schemas');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
});

/**
 * @route  POST /api/auth/login
 * @desc   Authenticate user and return JWT
 * @access Public
 */
router.post('/login', authLimiter, validate(loginSchema), login);

/**
 * @route  POST /api/auth/signup
 * @desc   Create a new user account with admin key authorization
 * @access Public
 */
router.post('/signup', authLimiter, validate(signupSchema), signUp);

module.exports = router;
