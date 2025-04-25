const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');
const auth = require('../middleware/auth');

router.post('/purchase', auth, membershipController.purchaseMembership);

module.exports = router; 