const mongoose = require('mongoose');

const victimSchema = new mongoose.Schema({
  Victim_Name: { type: String, required: true },
  Gender:      { type: String, enum: ['Male', 'Female', 'Other'] },
  Phone:       { type: String },
  Address:     { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Victim', victimSchema);
