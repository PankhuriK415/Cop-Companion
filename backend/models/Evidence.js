const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Evidence = sequelize.define('Evidence', {
  Evidence_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Evidence_Type: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Description: {
    type: DataTypes.TEXT,
  },
  Case_ID: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'evidence',
  timestamps: false,
});

module.exports = Evidence;
