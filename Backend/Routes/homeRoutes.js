const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');

// Route to get user profile by username
router.get('/user/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await userModel.findUserByUsername(username);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;