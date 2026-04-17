const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  Login_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  Password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Role: {
    type: DataTypes.ENUM('officer', 'victim', 'criminal'),
    allowNull: false,
  },
  User_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Last_Login: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'login',
  timestamps: false,
});

module.exports = User;
