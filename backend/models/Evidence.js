const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  Evidence_Type: { type: String, required: true },
  Description:   { type: String },
  Case_ID:       { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Evidence', evidenceSchema);
