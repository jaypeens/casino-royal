
const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  const users = await User.findAll({ attributes: ['id', 'email', 'username', 'role'] });
  res.render('ownerPanel', { users });
};

exports.promoteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    user.role = 'admin';
    await user.save();
    res.redirect('/owner');
  } else {
    res.status(404).send('User not found.');
  }
};

exports.demoteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user && user.role !== 'owner') {
    user.role = 'user';
    await user.save();
    res.redirect('/owner');
  } else {
    res.status(403).send('Cannot demote this user.');
  }
};
