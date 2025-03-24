const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const followModel = require('../models/followModel');
const { pool } = require('../db');

// Route to toggle follow/unfollow a user
router.post('/:username', verifyToken, async (req, res) => {
  const { username } = req.params;
  const followerId = req.user.id;

  try {
    const followingUser = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (followingUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const followingId = followingUser.rows[0].id;
    const isAlreadyFollowing = await followModel.isFollowing(followerId, followingId);

    let result;
    if (isAlreadyFollowing) {
      result = await followModel.unfollowUser(followerId, followingId);
      res.status(200).json({ message: 'User unfollowed successfully', isFollowing: false });
    } else {
      result = await followModel.followUser(followerId, followingId);
      res.status(201).json({ message: 'User followed successfully', isFollowing: true });
      console.log("succesfully follwed")
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Route to check if the current user is following another user
router.get('/:username/is-following', verifyToken, async (req, res) => {
  const { username } = req.params;
  const followerId = req.user.id;

  try {
    const followingUser = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (followingUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const followingId = followingUser.rows[0].id;
    const isFollowing = await followModel.isFollowing(followerId, followingId);

    res.status(200).json({ isFollowing });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

