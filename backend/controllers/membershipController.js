const User = require('../models/User');
const Membership = require('../models/Membership');

exports.purchaseMembership = async (req, res) => {
    try {
        const { membershipTier, price } = req.body;
        const userId = req.user.id;

        // Create new membership
        const membership = new Membership({
            user: userId,
            tier: membershipTier,
            price: price,
            startDate: new Date(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
        });

        await membership.save();

        // Update user's membership status
        await User.findByIdAndUpdate(userId, {
            membership: membership._id
        });

        res.json({ 
            success: true, 
            message: 'Membership purchased successfully',
            membership 
        });
    } catch (error) {
        console.error('Error purchasing membership:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error processing membership purchase' 
        });
    }
}; 