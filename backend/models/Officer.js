const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Officer = sequelize.define('Officer', {
  Officer_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Officer_Name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Officer_Rank: {
    type: DataTypes.STRING(50),
  },
  Phone: {
    type: DataTypes.STRING(20),
  },
  Station_ID: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'officer',
  timestamps: false,
});

module.exports = Officer;
