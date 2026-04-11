const bcrypt = require('bcryptjs');
const User = require('../models/User');
const LoginLog = require('../models/LoginLog');
const generateToken = require('../utils/generateToken');

const login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  try {
    const user = await User.findOne({ Username: username });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    user.Last_Login = new Date();
    await user.save();

    await LoginLog.create({ Username: user.Username, Login_Time: new Date() });

    const token = generateToken({
      login_id: user._id,
      role: user.Role,
      user_id: user.User_ID,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        login_id: user._id,
        username: user.Username,
        role: user.Role,
        user_id: user.User_ID,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { login };
