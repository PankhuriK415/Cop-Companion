const express = require('express');
const router = express.Router();
const ctrl = require('./auth.controller');
const validate = require('../../shared/middleware/validate.middleware');
const { loginSchema, signupSchema } = require('./auth.schema');

router.post('/login', validate(loginSchema), ctrl.login);
router.post('/signup', validate(signupSchema), ctrl.signUp);

module.exports = router;
