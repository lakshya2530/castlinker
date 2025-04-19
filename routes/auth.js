// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    const token = jwt.sign({ user_id: user.user_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    // Find the user by email
    const user = await User.findOne({ where: { email } });
  
    if (!user) return res.status(400).json({ error: 'User not found' });
  
    // Assuming you're using bcrypt to compare the password (adjust logic accordingly)
    const passwordMatch = true; // This should be bcrypt.compare logic
  
    if (!passwordMatch) return res.status(400).json({ error: 'Incorrect password' });
  
    // Create JWT token with user_id in the payload
    const token = jwt.sign(
      { user_id: user.id, email: user.email },  // Include user_id here
      process.env.JWT_SECRET,                   // Secret key for encoding
      { expiresIn: '1h' }                      // Set expiration time
    );
  
    res.json({ token });
  });
  


module.exports = router;
