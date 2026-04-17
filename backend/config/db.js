const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "your_database_name",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false, // Set to console.log to see SQL queries
  },
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    // Ensure models/tables exist in development by syncing.
    // Uses `alter: true` to avoid destructive drops while keeping schema in sync.
    await sequelize.sync({ alter: true });
    console.log("✅ MySQL connected and models synced with Sequelize");
  } catch (err) {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
