const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FIR = sequelize.define('FIR', {
  FIR_No: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  FIR_Date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Case_ID: {
    type: DataTypes.INTEGER,
  },
  Victim_ID: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'fir',
  timestamps: false,
});

module.exports = FIR;
