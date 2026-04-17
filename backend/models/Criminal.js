const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Criminal = sequelize.define('Criminal', {
  Criminal_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Criminal_Name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
  },
  DOB: {
    type: DataTypes.DATE,
  },
  Address: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'criminal',
  timestamps: false,
});

module.exports = Criminal;
