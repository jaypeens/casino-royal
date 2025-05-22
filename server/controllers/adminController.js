
const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  const users = await User.findAll({ attributes: ['id', 'email', 'username', 'role'] });
  res.render('adminDashboard', { users });
};
