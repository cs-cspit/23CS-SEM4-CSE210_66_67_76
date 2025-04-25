const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');

const app = express();

// Updated CORS configuration
app.use(cors({
    origin: config.CLIENT_URL,
    credentials: true
}));

app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/bookings', require('./routes/api/bookings'));
app.use('/api/membership', require('./routes/api/membership'));
app.use('/api/users', require('./routes/api/users'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
});