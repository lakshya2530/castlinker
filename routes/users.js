const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');        // ✅ Import db
const User = db.User;                   // ✅ Access User from db

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });  // ✅ This line works now

    if (existingUser) return res.status(409).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashed });

    const token = jwt.sign({ id: newUser.id }, 'your_secret_key', { expiresIn: '7d' });

    res.status(201).json({ user: { id: newUser.id, email: newUser.email }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
