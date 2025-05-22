// scripts/check-db.js
// Checks number of users in the database and logs the count.

require('dotenv').config();
const sequelize = require('../config/db');
const User = require('../models/User');

(async () => {
  try {
    await sequelize.authenticate();
    const count = await User.count();
    console.log(`Users count: ${count}`);
    process.exit(0);
  } catch (error) {
    console.error('Error checking database:', error);
    process.exit(1);
  }
})();