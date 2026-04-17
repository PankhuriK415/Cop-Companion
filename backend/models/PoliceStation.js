const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PoliceStation = sequelize.define('PoliceStation', {
  Station_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Station_Name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Location: {
    type: DataTypes.STRING(200),
  },
  Contact_No: {
    type: DataTypes.STRING(20),
  },
}, {
  tableName: 'police_station',
  timestamps: false,
});

module.exports = PoliceStation;
