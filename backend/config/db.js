const { Sequelize } = require("sequelize");
require("dotenv").config();

// Support a full connection URI (Railway provides MYSQL_URL / MYSQL_PUBLIC_URL)
const connectionUri =
  process.env.DATABASE_URL ||
  process.env.MYSQL_URL ||
  process.env.MYSQL_PUBLIC_URL;

let sequelize;
if (connectionUri) {
  sequelize = new Sequelize(connectionUri, {
    dialect: "mysql",
    logging: false,
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || process.env.MYSQLDATABASE || "your_database_name",
    process.env.DB_USER || process.env.MYSQLUSER || "root",
    process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || "",
    {
      host: process.env.DB_HOST || process.env.MYSQLHOST || "localhost",
      port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
      dialect: "mysql",
      logging: false, // Set to console.log to see SQL queries
    },
  );
}

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
