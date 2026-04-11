const mongoose = require('mongoose');

const firSchema = new mongoose.Schema({
  FIR_Date:  { type: Date, required: true },
  Case_ID:   { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  Victim_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Victim', required: true },
}, { timestamps: true });

module.exports = mongoose.model('FIR', firSchema);
