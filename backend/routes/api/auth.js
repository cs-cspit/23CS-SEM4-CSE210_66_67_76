const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const auth = require('../../middleware/auth');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/logout', auth, authController.logout);
router.get('/verify', auth, authController.verifyToken);

module.exports = router; 