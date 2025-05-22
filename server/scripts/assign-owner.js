// scripts/assign-owner.js
// Assign OWNER role to a specified username or email (case-insensitive).

require('dotenv').config();
const sequelize = require('../config/db');
const { Sequelize, Op } = require('sequelize');
const User = require('../models/User');

(async () => {
  try {
    await sequelize.authenticate();
    const identifier = process.argv[2];
    if (!identifier) {
      console.error('Usage: npm run assign-owner <username_or_email>');
      process.exit(1);
    }

    // Determine whether identifier is email or username
    let whereClause;
    if (identifier.includes('@')) {
      whereClause = { email: identifier.toLowerCase() };
    } else {
      whereClause = sequelize.where(
        sequelize.fn('lower', sequelize.col('username')),
        identifier.toLowerCase()
      );
    }

    // Find user
    const user = await User.findOne({ where: whereClause });
    if (!user) {
      console.error(`⛔ No user found matching "${identifier}"`);
      process.exit(1);
    }

    // Promote to owner
    user.role = 'owner';
    await user.save();
    console.log(`✅ User "${user.username}" has been promoted to OWNER.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
})();