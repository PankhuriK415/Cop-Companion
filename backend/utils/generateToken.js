const jwt = require('jsonwebtoken');
require('../config/dotenv');


const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
};

module.exports = generateToken;
