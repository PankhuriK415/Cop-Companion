/**
 * Seed script — run once to populate the MySQL database with sample data.
 * Usage: node seed.js
 */
require("dotenv").config();
const bcrypt = require("bcryptjs");

const { connectDB } = require("./config/db");
const PoliceStation = require("./models/PoliceStation");
const Officer = require("./models/Officer");
const Criminal = require("./models/Criminal");
const Victim = require("./models/Victim");
const Case = require("./models/Case");
const FIR = require("./models/FIR");
const Evidence = require("./models/Evidence");
const Arrest = require("./models/Arrest");
const User = require("./models/User");
const LoginLog = require("./models/LoginLog");

const seed = async () => {
  await connectDB();

  await Promise.all([
    PoliceStation.destroy({ where: {} }),
    Officer.destroy({ where: {} }),
    Criminal.destroy({ where: {} }),
    Victim.destroy({ where: {} }),
    Case.destroy({ where: {} }),
    FIR.destroy({ where: {} }),
    Evidence.destroy({ where: {} }),
    Arrest.destroy({ where: {} }),
    User.destroy({ where: {} }),
    LoginLog.destroy({ where: {} }),
  ]);
  console.log("🗑  Cleared all tables");

  const [ps1, ps2] = await PoliceStation.bulkCreate(
    [
      {
        Station_Name: "Central Police Station",
        Location: "12 Main Street, Metro City",
        Contact_No: "555-0101",
      },
      {
        Station_Name: "North District Station",
        Location: "45 Oak Avenue, Metro City",
        Contact_No: "555-0202",
      },
    ],
    { returning: true },
  );

  const [off1, off2] = await Officer.bulkCreate(
    [
      {
        Officer_Name: "Rajiv Kumar",
        Officer_Rank: "Inspector",
        Phone: "555-1001",
        Station_ID: ps1.Station_ID,
      },
      {
        Officer_Name: "Priya Sharma",
        Officer_Rank: "Sub-Inspector",
        Phone: "555-1002",
        Station_ID: ps2.Station_ID,
      },
    ],
    { returning: true },
  );

  const [cr1, cr2] = await Criminal.bulkCreate(
    [
      {
        Criminal_Name: "Arun Mehta",
        Gender: "Male",
        DOB: new Date("1985-06-15"),
        Address: "78 Slum Quarter, Old City",
      },
      {
        Criminal_Name: "Deepa Nair",
        Gender: "Female",
        DOB: new Date("1992-03-22"),
        Address: "23 Back Alley, East Zone",
      },
    ],
    { returning: true },
  );

  const [v1, v2] = await Victim.bulkCreate(
    [
      {
        Victim_Name: "Sunita Patel",
        Gender: "Female",
        Phone: "555-2001",
        Address: "56 Green Park, Metro City",
      },
      {
        Victim_Name: "Rohit Gupta",
        Gender: "Male",
        Phone: "555-2002",
        Address: "9 Rose Lane, Metro City",
      },
    ],
    { returning: true },
  );

  const [c1, c2, c3] = await Case.bulkCreate(
    [
      {
        Case_Date: new Date("2024-01-10"),
        Case_Status: "Open",
        Description: "Robbery at Central Market",
        Station_ID: ps1.Station_ID,
        Officer_ID: off1.Officer_ID,
      },
      {
        Case_Date: new Date("2024-02-14"),
        Case_Status: "Under Investigation",
        Description: "Vehicle theft reported near North District",
        Station_ID: ps2.Station_ID,
        Officer_ID: off2.Officer_ID,
      },
      {
        Case_Date: new Date("2024-03-05"),
        Case_Status: "Closed",
        Description: "Assault case resolved",
        Station_ID: ps1.Station_ID,
        Officer_ID: off1.Officer_ID,
      },
    ],
    { returning: true },
  );

  await FIR.bulkCreate([
    {
      FIR_Date: new Date("2024-01-10"),
      Case_ID: c1.Case_ID,
      Victim_ID: v1.Victim_ID,
    },
    {
      FIR_Date: new Date("2024-02-14"),
      Case_ID: c2.Case_ID,
      Victim_ID: v2.Victim_ID,
    },
  ]);

  await Evidence.bulkCreate([
    {
      Evidence_Type: "CCTV Footage",
      Description: "Camera footage from Central Market entrance",
      Case_ID: c1.Case_ID,
    },
    {
      Evidence_Type: "Physical - Weapon",
      Description: "Knife recovered from crime scene",
      Case_ID: c1.Case_ID,
    },
    {
      Evidence_Type: "Witness Statement",
      Description: "Statement from shopkeeper Ramesh",
      Case_ID: c2.Case_ID,
    },
  ]);

  await Arrest.bulkCreate([
    {
      Arrest_Date: new Date("2024-01-20"),
      Criminal_ID: cr1.Criminal_ID,
      Case_ID: c1.Case_ID,
      Charges: "Robbery under IPC 392",
    },
    {
      Arrest_Date: new Date("2024-03-10"),
      Criminal_ID: cr2.Criminal_ID,
      Case_ID: c3.Case_ID,
      Charges: "Assault under IPC 351",
    },
  ]);

  const hashedPassword = await bcrypt.hash("Password@123", 10);

  // Create dedicated role records for demo accounts so User.User_ID points correctly
  const demoOfficer = await Officer.create({
    Officer_Name: "officer_sharma",
    Officer_Rank: "Inspector",
    Phone: "9000000003",
    Station_ID: ps1.Station_ID,
  });

  const demoVictim = await Victim.create({
    Victim_Name: "victim_amit",
    Gender: "Male",
    Phone: "9000000004",
    Address: "Demo Address",
  });

  const demoCriminal = await Criminal.create({
    Criminal_Name: "criminal_rajan",
    Gender: "Male",
    DOB: new Date("1990-01-01"),
    Address: "Demo Address",
  });

  // Create a demo case and link it to demoVictim and demoCriminal so portals show data
  const demoCase = await Case.create({
    Case_Date: new Date(),
    Case_Status: "Open",
    Description: "Demo case linking victim_amit and criminal_rajan",
    Station_ID: ps1.Station_ID,
    Officer_ID: off1.Officer_ID,
  });

  await FIR.create({
    FIR_Date: new Date(),
    Case_ID: demoCase.Case_ID,
    Victim_ID: demoVictim.Victim_ID,
  });

  await Arrest.create({
    Arrest_Date: new Date(),
    Criminal_ID: demoCriminal.Criminal_ID,
    Case_ID: demoCase.Case_ID,
    Charges: "Demo - No formal charges",
  });

  // Insert demo login accounts linked to the created role records
  await User.bulkCreate([
    {
      Username: "officer_sharma",
      Password: hashedPassword,
      Role: "officer",
      User_ID: demoOfficer.Officer_ID,
    },
    {
      Username: "victim_amit",
      Password: hashedPassword,
      Role: "victim",
      User_ID: demoVictim.Victim_ID,
    },
    {
      Username: "criminal_rajan",
      Password: hashedPassword,
      Role: "criminal",
      User_ID: demoCriminal.Criminal_ID,
    },
  ]);

  await LoginLog.bulkCreate([
    { Username: "officer_sharma", Login_Time: new Date() },
    { Username: "victim_amit", Login_Time: new Date() },
    { Username: "criminal_rajan", Login_Time: new Date() },
  ]);

  console.log("✅ Seed data inserted successfully!");
  console.log("");
  console.log("─── Login Credentials ───────────────");
  console.log("  Officer:  officer_sharma  / Password@123");
  console.log("  Victim:   victim_amit     / Password@123");
  console.log("  Criminal: criminal_rajan  / Password@123");
  console.log("  Admin signup key: 123456");
  console.log("─────────────────────────────────────");

  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
