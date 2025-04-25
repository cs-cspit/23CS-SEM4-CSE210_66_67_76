const config = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/travelvista',
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5000'
};

module.exports = config; 