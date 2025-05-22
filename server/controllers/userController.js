const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'role']
    });
    res.render('profile', { user });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};