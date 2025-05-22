
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, verifyRole } = require('../middleware/auth');

router.use(verifyToken, verifyRole(['admin', 'owner']));

router.get('/', adminController.getAllUsers);

module.exports = router;
