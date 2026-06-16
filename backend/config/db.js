const { Sequelize } = require("sequelize");
require("./dotenv");

const connectionUri = process.env.DATABASE_URL;

const baseOptions = {
  dialect: "mysql",
  logging: false,
};

// TiDB Cloud requires TLS
if (connectionUri?.includes("tidbcloud.com")) {
  baseOptions.dialectOptions = {
    ssl: {
      minVersion: "TLSv1.2",
      rejectUnauthorized: true,
    },
  };
}

let sequelize;
if (connectionUri) {
  sequelize = new Sequelize(connectionUri, baseOptions);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || "crime_db",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      dialect: "mysql",
      logging: false,
    },
  );
}

const isRemoteDb =
  connectionUri?.includes("tidbcloud.com") ||
  process.env.NODE_ENV === "production";

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    // TiDB rejects ALTER on UNIQUE keys; only create missing tables remotely.
    if (isRemoteDb) {
      await sequelize.sync();
    } else {
      await sequelize.sync({ alter: true });
    }
    console.log("✅ MySQL connected and models synced with Sequelize");
  } catch (err) {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
