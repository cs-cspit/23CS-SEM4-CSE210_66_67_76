const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
    try {
        const { destination, bookingDetails } = req.body;
        const userId = req.user.id;

        const booking = new Booking({
            user: userId,
            destination,
            bookingDetails
        });

        await booking.save();
        res.status(201).json({ success: true, booking });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ success: false, message: 'Error creating booking' });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .sort({ createdAt: -1 }); // Most recent first
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
}; 