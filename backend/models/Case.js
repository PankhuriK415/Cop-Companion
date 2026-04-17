const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Case = sequelize.define('Case', {
  Case_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Case_Date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Case_Status: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  Description: {
    type: DataTypes.TEXT,
  },
  Station_ID: {
    type: DataTypes.INTEGER,
  },
  Officer_ID: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'cases',
  timestamps: false,
});

module.exports = Case;
