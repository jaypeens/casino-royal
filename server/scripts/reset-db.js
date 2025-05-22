// scripts/reset-db.js
// Resets the database by dropping and recreating all tables and verifies Users count is zero.

require('dotenv').config();
const sequelize = require('../config/db');
const User = require('../models/User');

(async () => {
  try {
    console.log('Authenticating with database...');
    await sequelize.authenticate();
    console.log('Dropping all tables...');
    await sequelize.getQueryInterface().dropAllTables();
    console.log('Re-syncing database...');
    await sequelize.sync();
    console.log('Counting users...');
    const count = await User.count();
    console.log(`Users count after reset: ${count}`);
    if (count === 0) {
      console.log('✅ Database reset successful.');
      process.exit(0);
    } else {
      console.error('❌ Database reset failed, users still exist.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error during reset:', error);
    process.exit(1);
  }
})();