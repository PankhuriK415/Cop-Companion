const mongoose = require('mongoose');

const officerSchema = new mongoose.Schema({
  Officer_Name:  { type: String, required: true },
  Officer_Rank:  { type: String },
  Phone:         { type: String },
  Station_ID:    { type: mongoose.Schema.Types.ObjectId, ref: 'PoliceStation' },
}, { timestamps: true });

module.exports = mongoose.model('Officer', officerSchema);
