const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route   POST api/membership/purchase
// @desc    Purchase a membership
// @access  Private
router.post('/purchase', auth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    
    if (!['basic', 'premium', 'platinum'].includes(membershipType)) {
      return res.status(400).json({ msg: 'Invalid membership type' });
    }
    
    // Get membership duration in months
    let durationMonths = 1;
    if (membershipType === 'premium') durationMonths = 6;
    if (membershipType === 'platinum') durationMonths = 12;
    
    const purchaseDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + durationMonths);
    
    // Update user's membership
    const user = await User.findById(req.user.id);
    user.membership = membershipType;
    user.membershipPurchaseDate = purchaseDate;
    user.membershipExpiryDate = expiryDate;
    
    await user.save();
    
    res.json({
      membership: user.membership,
      purchaseDate: user.membershipPurchaseDate,
      expiryDate: user.membershipExpiryDate
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/membership
// @desc    Get current user's membership
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.json({
      membership: user.membership,
      purchaseDate: user.membershipPurchaseDate,
      expiryDate: user.membershipExpiryDate
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 