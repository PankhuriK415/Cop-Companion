const mongoose = require('mongoose');

const arrestSchema = new mongoose.Schema({
  Arrest_Date:  { type: Date, required: true },
  Criminal_ID:  { type: mongoose.Schema.Types.ObjectId, ref: 'Criminal', required: true },
  Case_ID:      { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  Charges:      { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Arrest', arrestSchema);
