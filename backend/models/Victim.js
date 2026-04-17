const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Victim = sequelize.define('Victim', {
  Victim_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Victim_Name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
  },
  Phone: {
    type: DataTypes.STRING(20),
  },
  Address: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'victim',
  timestamps: false,
});

module.exports = Victim;
