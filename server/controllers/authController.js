const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op, where, fn, col } = require('sequelize');
const crypto = require('crypto');
const User = require('../models/User');
const sendMail = require('../utils/mail');
const generateToken = require('../utils/generateToken');

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({
      where: {
        [Op.or]: [
          where(fn('lower', col('email')), email.toLowerCase()),
          where(fn('lower', col('username')), username.toLowerCase())
        ]
      }
    });
    if (existing) {
      return res.status(400).json({ message: 'Email or username already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const ownerCount = await User.count({ where: { role: 'owner' } });

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: ownerCount === 0 ? 'owner' : 'user'
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });

    res.status(201).json({ message: 'Registered successfully', user: { id: user.id, role: user.role } });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      where: {
        [Op.or]: [
          where(fn('lower', col('email')), identifier.toLowerCase()),
          where(fn('lower', col('username')), identifier.toLowerCase())
        ]
      }
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true });

    res.status(200).json({ message: 'Logged in successfully', token, role: user.role });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: where(fn('lower', col('email')), email.toLowerCase()) });
    if (!user) {
      return res.json({ message: 'If the email exists, reset instructions sent.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();

    const resetUrl = `http://localhost:5000/reset.html?token=${token}`;
    await sendMail({ to: user.email, subject: 'Password Reset', text: resetUrl });

    res.json({ message: 'If the email exists, reset instructions sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      where: { resetToken: token, resetTokenExpiry: { [Op.gt]: Date.now() } }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token invalid or expired.' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: 'Password reset successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};