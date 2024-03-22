const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('database.js'); // Assuming you have a User model defined
const { verifyToken } = require('./middlewares'); // Import the verifyToken middleware

// API endpoint to fetch account data
router.get('/', verifyToken, async (req, res) => {
  try {
    // Fetch account data from MongoDB using user ID
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Send the user account data as JSON response
    res.json(user);
  } catch (error) {
    console.error('Error fetching account data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
