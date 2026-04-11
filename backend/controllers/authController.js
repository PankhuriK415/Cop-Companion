const bcrypt = require('bcryptjs');
const db = require('../config/db');
const generateToken = require('../utils/generateToken');

const login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM login WHERE Username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.Password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Update Last_Login
    await db.query(
      'UPDATE login SET Last_Login = NOW() WHERE Login_ID = ?',
      [user.Login_ID]
    );

    // Insert into login_log
    await db.query(
      'INSERT INTO login_log (Username, Login_Time) VALUES (?, NOW())',
      [user.Username]
    );

    const token = generateToken({
      login_id: user.Login_ID,
      role: user.Role,
      user_id: user.User_ID,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        login_id: user.Login_ID,
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
