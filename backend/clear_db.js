require("./config/dotenv");

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

const clearDb = async () => {
  console.log("Starting database cleanup...");
  try {
    await connectDB();
    
    // Delete in reverse dependency order to avoid foreign key constraint errors
    await LoginLog.destroy({ where: {} });
    await User.destroy({ where: {} });
    
    await Evidence.destroy({ where: {} });
    await Arrest.destroy({ where: {} });
    await FIR.destroy({ where: {} });
    
    await Case.destroy({ where: {} });
    
    await Officer.destroy({ where: {} });
    await Victim.destroy({ where: {} });
    await Criminal.destroy({ where: {} });
    await PoliceStation.destroy({ where: {} });

    console.log("✅ Successfully removed all data from the database.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to clear data:", err.message);
    process.exit(1);
  }
};

clearDb();
