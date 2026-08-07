const { Sequelize } = require("sequelize");
require("../../../config/dotenv");

const connectionUri = process.env.DATABASE_URL;
const isTiDB =
  (connectionUri && connectionUri.includes("tidbcloud.com")) ||
  (process.env.DB_HOST && process.env.DB_HOST.includes("tidbcloud.com"));

// Use DATABASE_URL when set, regardless of NODE_ENV
const shouldUseDatabaseUrl = Boolean(connectionUri);

const tlsOptions = {
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  },
};

let sequelize;
if (shouldUseDatabaseUrl) {
  // TiDB Cloud always requires TLS
  const urlOptions = {
    dialect: "mysql",
    logging: false,
    ...(isTiDB && { dialectOptions: tlsOptions }),
  };
  sequelize = new Sequelize(connectionUri, urlOptions);
} else {
  // Individual connection params — still apply TLS if pointing at TiDB
  sequelize = new Sequelize(
    process.env.DB_NAME || "crime_db",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      dialect: "mysql",
      logging: false,
      ...(isTiDB && { dialectOptions: tlsOptions }),
    },
  );
}

const isRemoteDb =
  isTiDB || process.env.NODE_ENV === "production";

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
