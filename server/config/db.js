// config/db.js

require('dotenv').config();

// Pull these from your .env
const {
  DB_NAME,
  DB_USER,
  DB_PASS,
  DB_HOST,
  DB_PORT
} = process.env;

const Sequelize = require('sequelize');

// Initialize Sequelize with individual DB credentials
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  dialectOptions: { ssl: false }
});

module.exports = sequelize;
