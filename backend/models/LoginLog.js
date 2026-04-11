const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
  Username:   { type: String, required: true },
  Login_Time: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LoginLog', loginLogSchema);
