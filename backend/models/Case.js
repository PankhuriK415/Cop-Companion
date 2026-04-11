const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  Case_Date:   { type: Date, required: true },
  Case_Status: {
    type: String,
    required: true,
    enum: ['Open', 'Closed', 'Pending Review', 'Under Investigation', 'Dismissed'],
    default: 'Open',
  },
  Description: { type: String },
  Station_ID:  { type: mongoose.Schema.Types.ObjectId, ref: 'PoliceStation', required: true },
  Officer_ID:  { type: mongoose.Schema.Types.ObjectId, ref: 'Officer', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Case', caseSchema);
