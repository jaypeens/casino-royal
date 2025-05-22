const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyToken = async (req, res, next) => {
  const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).send('Access Denied');

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Fetch fresh user from DB to get updated role
    const user = await User.findByPk(payload.id);
    if (!user) return res.status(401).send('User not found');

    // Attach minimal user info
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

exports.verifyRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send('Access denied');
    }
    next();
  };
};