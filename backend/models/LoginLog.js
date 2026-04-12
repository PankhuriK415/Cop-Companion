const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const LoginLog = sequelize.define('LoginLog', {
  Log_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Username: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Login_Time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'login_log',
  timestamps: false,
});

module.exports = LoginLog;
