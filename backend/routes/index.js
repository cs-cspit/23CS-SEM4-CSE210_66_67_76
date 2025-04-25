const express = require('express');
const router = express.Router();
const path = require('path');

// Serve HTML pages
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/homepage.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/login.html'));
});

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/signup.html'));
});

router.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/my-profile.html'));
});

router.get('/destination_page', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/destination_page.html'));
});

router.get('/tours_page', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/tours_page.html'));
});

router.get('/about_page', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/about_page.html'));
});

router.get('/contact_page', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/contact_page.html'));
});

router.get('/feedback', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/feedback.html'));
});

// Add a catch-all route for other pages
router.get('*', (req, res) => {
    res.redirect('/');
});

// Export router
module.exports = router; 