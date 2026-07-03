const User = require('./user.model');
const LoginLog = require('./loginLog.model');
const { hashPassword, comparePassword } = require('../../shared/utils/hashPassword');
const generateToken = require('../../shared/utils/generateToken');
const Officer = require('../officer/officer.model');
const Victim = require('../victim/victim.model');
const Criminal = require('../criminal/criminal.model');

class AuthService {
  async authenticate(username, password) {
    const user = await User.findOne({ where: { Username: username } });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await comparePassword(password, user.Password);
    if (!isMatch) throw new Error("Invalid credentials");

    await user.update({ Last_Login: new Date() });
    await LoginLog.create({ Username: user.Username, Login_Time: new Date() });

    const role = typeof user.Role === "string" ? user.Role.toLowerCase() : user.Role;
    const token = generateToken({ login_id: user.Login_ID, role, user_id: user.User_ID });

    return { token, user: { login_id: user.Login_ID, username: user.Username, role: user.Role, user_id: user.User_ID } };
  }

  async register({ username, password, role }) {
    const existingUser = await User.findOne({ where: { Username: username } });
    if (existingUser) throw new Error("Username is already taken");

    let userId;
    if (role === 'officer' || role === 'chief') {
      const rec = await Officer.create({ Officer_Name: username });
      userId = rec.Officer_ID;
    } else if (role === 'victim') {
      const rec = await Victim.create({ Victim_Name: username });
      userId = rec.Victim_ID;
    } else {
      const rec = await Criminal.create({ Criminal_Name: username });
      userId = rec.Criminal_ID;
    }

    const hashed = await hashPassword(password);
    const newUser = await User.create({
      Username: username,
      Password: hashed,
      Role: role,
      User_ID: userId,
    });

    return { login_id: newUser.Login_ID, username: newUser.Username, role: newUser.Role, user_id: newUser.User_ID };
  }
}

module.exports = new AuthService();
