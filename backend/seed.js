/**
 * Seed script — run once to populate MongoDB Atlas with sample data.
 * Usage: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB   = require('./config/db');
const PoliceStation = require('./models/PoliceStation');
const Officer     = require('./models/Officer');
const Criminal    = require('./models/Criminal');
const Victim      = require('./models/Victim');
const Case        = require('./models/Case');
const FIR         = require('./models/FIR');
const Evidence    = require('./models/Evidence');
const Arrest      = require('./models/Arrest');
const User        = require('./models/User');
const LoginLog    = require('./models/LoginLog');

const seed = async () => {
  await connectDB();

  // Clear all collections
  await Promise.all([
    PoliceStation.deleteMany(), Officer.deleteMany(), Criminal.deleteMany(),
    Victim.deleteMany(), Case.deleteMany(), FIR.deleteMany(),
    Evidence.deleteMany(), Arrest.deleteMany(), User.deleteMany(), LoginLog.deleteMany(),
  ]);
  console.log('🗑  Cleared all collections');

  // Police Stations
  const [ps1, ps2] = await PoliceStation.insertMany([
    { Station_Name: 'Central Police Station', Location: '12 Main Street, Metro City', Contact_No: '555-0101' },
    { Station_Name: 'North District Station', Location: '45 Oak Avenue, Metro City', Contact_No: '555-0202' },
  ]);

  // Officers
  const [off1, off2] = await Officer.insertMany([
    { Officer_Name: 'Rajiv Kumar', Officer_Rank: 'Inspector', Phone: '555-1001', Station_ID: ps1._id },
    { Officer_Name: 'Priya Sharma', Officer_Rank: 'Sub-Inspector', Phone: '555-1002', Station_ID: ps2._id },
  ]);

  // Criminals
  const [cr1, cr2] = await Criminal.insertMany([
    { Criminal_Name: 'Arun Mehta', Gender: 'Male', DOB: new Date('1985-06-15'), Address: '78 Slum Quarter, Old City' },
    { Criminal_Name: 'Deepa Nair', Gender: 'Female', DOB: new Date('1992-03-22'), Address: '23 Back Alley, East Zone' },
  ]);

  // Victims
  const [v1, v2] = await Victim.insertMany([
    { Victim_Name: 'Sunita Patel', Gender: 'Female', Phone: '555-2001', Address: '56 Green Park, Metro City' },
    { Victim_Name: 'Rohit Gupta', Gender: 'Male', Phone: '555-2002', Address: '9 Rose Lane, Metro City' },
  ]);

  // Cases
  const [c1, c2, c3] = await Case.insertMany([
    { Case_Date: new Date('2024-01-10'), Case_Status: 'Open', Description: 'Robbery at Central Market', Station_ID: ps1._id, Officer_ID: off1._id },
    { Case_Date: new Date('2024-02-14'), Case_Status: 'Under Investigation', Description: 'Vehicle theft reported near North District', Station_ID: ps2._id, Officer_ID: off2._id },
    { Case_Date: new Date('2024-03-05'), Case_Status: 'Closed', Description: 'Assault case resolved', Station_ID: ps1._id, Officer_ID: off1._id },
  ]);

  // FIRs
  const [f1, f2] = await FIR.insertMany([
    { FIR_Date: new Date('2024-01-10'), Case_ID: c1._id, Victim_ID: v1._id },
    { FIR_Date: new Date('2024-02-14'), Case_ID: c2._id, Victim_ID: v2._id },
  ]);

  // Evidence
  await Evidence.insertMany([
    { Evidence_Type: 'CCTV Footage', Description: 'Camera footage from Central Market entrance', Case_ID: c1._id },
    { Evidence_Type: 'Physical - Weapon', Description: 'Knife recovered from crime scene', Case_ID: c1._id },
    { Evidence_Type: 'Witness Statement', Description: 'Statement from shopkeeper Ramesh', Case_ID: c2._id },
  ]);

  // Arrests
  await Arrest.insertMany([
    { Arrest_Date: new Date('2024-01-20'), Criminal_ID: cr1._id, Case_ID: c1._id, Charges: 'Robbery under IPC 392' },
    { Arrest_Date: new Date('2024-03-10'), Criminal_ID: cr2._id, Case_ID: c3._id, Charges: 'Assault under IPC 351' },
  ]);

  // Users (hashed password: Password@123)
  const hashedPassword = await bcrypt.hash('Password@123', 10);
  await User.insertMany([
    {
      Username: 'officer1',
      Password: hashedPassword,
      Role: 'officer',
      User_ID: off1._id,
      UserModel: 'Officer',
    },
    {
      Username: 'victim1',
      Password: hashedPassword,
      Role: 'victim',
      User_ID: v1._id,
      UserModel: 'Victim',
    },
    {
      Username: 'criminal1',
      Password: hashedPassword,
      Role: 'criminal',
      User_ID: cr1._id,
      UserModel: 'Criminal',
    },
  ]);

  console.log('✅ Seed data inserted successfully!');
  console.log('');
  console.log('─── Login Credentials ───────────────');
  console.log('  Officer:  officer1  / Password@123');
  console.log('  Victim:   victim1   / Password@123');
  console.log('  Criminal: criminal1 / Password@123');
  console.log('─────────────────────────────────────');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
