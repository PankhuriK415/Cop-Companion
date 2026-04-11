const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  Username:   { type: String, required: true, unique: true },
  Password:   { type: String, required: true },
  Role:       { type: String, enum: ['officer', 'victim', 'criminal'], required: true },
  User_ID:    { type: mongoose.Schema.Types.ObjectId, refPath: 'UserModel' },
  UserModel:  { type: String, enum: ['Officer', 'Victim', 'Criminal'] },
  Last_Login: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
