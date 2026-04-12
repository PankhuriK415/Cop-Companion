const bcrypt = require("bcryptjs");
const User = require("../models/User");
const LoginLog = require("../models/LoginLog");
const Officer = require("../models/Officer");
const Victim = require("../models/Victim");
const Criminal = require("../models/Criminal");
const generateToken = require("../utils/generateToken");

const roleModelMap = {
  officer: Officer,
  victim: Victim,
  criminal: Criminal,
};

const roleIdKeyMap = {
  officer: "Officer_ID",
  victim: "Victim_ID",
  criminal: "Criminal_ID",
};

const createRoleRecord = async (role, username) => {
  if (role === "officer") {
    return Officer.create({ Officer_Name: username });
  }

  if (role === "victim") {
    return Victim.create({ Victim_Name: username });
  }

  return Criminal.create({ Criminal_Name: username });
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Username and password are required." });
  }

  try {
    const user = await User.findOne({ where: { Username: username } });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    const storedPassword = user.Password;
    const isBcryptHash =
      typeof storedPassword === "string" && /^\$2[aby]\$/.test(storedPassword);
    let isMatch = false;

    if (isBcryptHash) {
      isMatch = await bcrypt.compare(password, storedPassword);
    } else {
      isMatch = password === storedPassword;
      if (isMatch) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await user.update({ Password: hashedPassword, Last_Login: new Date() });
      }
    }

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    await user.update({ Last_Login: new Date() });
    await LoginLog.create({ Username: user.Username, Login_Time: new Date() });

    const role =
      typeof user.Role === "string" ? user.Role.toLowerCase() : user.Role;
    const token = generateToken({
      login_id: user.Login_ID,
      role,
      user_id: user.User_ID,
    });

    res.status(200).json({
      success: true,
      message: "Login successful.",
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

const signUp = async (req, res, next) => {
  const { username, password, role, admin_key } = req.body;
  const requiredAdminKey = process.env.ADMIN_SIGNUP_KEY;

  if (!username || !password || !role || !admin_key) {
    return res.status(400).json({
      success: false,
      message: "Username, password, role, and admin_key are required.",
    });
  }

  if (!requiredAdminKey || admin_key !== requiredAdminKey) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid admin key." });
  }

  const normalizedRole = String(role).toLowerCase();
  const validRoles = ["officer", "victim", "criminal"];

  if (!validRoles.includes(normalizedRole)) {
    return res.status(400).json({
      success: false,
      message: "Role must be one of officer, victim, or criminal.",
    });
  }

  try {
    const existingUser = await User.findOne({ where: { Username: username } });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Username is already taken." });
    }

    const relatedModel = roleModelMap[normalizedRole];
    if (!relatedModel) {
      return res.status(400).json({ success: false, message: "Invalid role." });
    }

    const roleRecord = await createRoleRecord(normalizedRole, username);
    const roleIdKey = roleIdKeyMap[normalizedRole];
    const userId = roleRecord[roleIdKey];

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      Username: username,
      Password: hashedPassword,
      Role: normalizedRole,
      User_ID: userId,
    });

    res.status(201).json({
      success: true,
      message: "Sign up successful.",
      user: {
        login_id: newUser.Login_ID,
        username: newUser.Username,
        role: newUser.Role,
        user_id: newUser.User_ID,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, signUp };
