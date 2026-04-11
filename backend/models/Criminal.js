const mongoose = require('mongoose');

const criminalSchema = new mongoose.Schema({
  Criminal_Name: { type: String, required: true },
  Gender:        { type: String, enum: ['Male', 'Female', 'Other'] },
  DOB:           { type: Date },
  Address:       { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Criminal', criminalSchema);
