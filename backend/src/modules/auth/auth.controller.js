const authService = require('./auth.service');

const login = async (req, res, next) => {
  try {
    const result = await authService.authenticate(req.body.username, req.body.password);
    res.status(200).json({ success: true, message: 'Login successful.', ...result });
  } catch (err) {
    if (err.message === "Invalid credentials") {
      return res.status(401).json({ success: false, message: err.message });
    }
    next(err);
  }
};

const signUp = async (req, res, next) => {
  try {
    const { admin_key, role } = req.body;
    const requiredAdminKey = process.env.ADMIN_SIGNUP_KEY;
    if (!requiredAdminKey || admin_key !== requiredAdminKey) {
      return res.status(403).json({ success: false, message: "Invalid admin key." });
    }

    const user = await authService.register({ ...req.body, role: String(role).toLowerCase() });
    res.status(201).json({ success: true, message: 'Sign up successful.', user });
  } catch (err) {
    if (err.message === "Username is already taken") {
      return res.status(409).json({ success: false, message: err.message });
    }
    next(err);
  }
};

module.exports = { login, signUp };
