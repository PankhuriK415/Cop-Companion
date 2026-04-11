const mongoose = require('mongoose');

const policeStationSchema = new mongoose.Schema({
  Station_Name: { type: String, required: true },
  Location:     { type: String },
  Contact_No:   { type: String },
}, { timestamps: true });

module.exports = mongoose.model('PoliceStation', policeStationSchema);
