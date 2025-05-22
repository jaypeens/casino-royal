
const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const { verifyToken, verifyRole } = require('../middleware/auth');

router.use(verifyToken, verifyRole(['owner']));

router.get('/', ownerController.getAllUsers);
router.post('/promote/:id', ownerController.promoteUser);
router.post('/demote/:id', ownerController.demoteUser);

module.exports = router;
