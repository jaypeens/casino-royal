// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true },
  email:    { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  role:     DataTypes.STRING,

  // FORGOT PASSWORD FIELDS
  resetToken:       { type: DataTypes.STRING, allowNull: true },
  resetTokenExpiry: { type: DataTypes.DATE,   allowNull: true }
});

module.exports = User;
