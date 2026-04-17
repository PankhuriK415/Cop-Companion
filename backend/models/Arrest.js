const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Arrest = sequelize.define('Arrest', {
  Arrest_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Arrest_Date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Criminal_ID: {
    type: DataTypes.INTEGER,
  },
  Case_ID: {
    type: DataTypes.INTEGER,
  },
  Charges: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'arrest',
  timestamps: false,
});

module.exports = Arrest;
