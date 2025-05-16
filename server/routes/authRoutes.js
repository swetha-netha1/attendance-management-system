const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const bcrypt = require('bcryptjs');

// POST /signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStaff = new Staff({ email, password: hashedPassword });
    await newStaff.save();

    res.status(201).json({ message: 'Signup successful', email });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const staff = await Staff.findOne({ email });
    if (!staff) {
      return res.status(400).json({ error: 'Account not found' });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    res.status(200).json({ message: 'Login successful', email });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
