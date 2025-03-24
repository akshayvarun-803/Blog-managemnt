const express = require('express');
const router = express.Router();
const { savePost, unsavePost } = require('../models/savedPostModel');

// Save or unsave an article
router.post('/:username/saved-posts', async (req, res) => {
  const { articleId } = req.body;
  const username = req.params.username;

  try {
    // Assume you have a function to get user ID by username
    const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    const userId = userResult.rows[0].id;

    // Check if the post is already saved by this user
    const savedPostsResult = await pool.query(
      'SELECT * FROM saved_posts WHERE user_id = $1 AND article_id = $2',
      [userId, articleId]
    );

    if (savedPostsResult.rows.length > 0) {
      // If already saved, unsave it
      await unsavePost(userId, articleId);
      return res.json({ message: 'Post unsaved' });
    } else {
      // Otherwise, save the post
      const savedPostData = await savePost(userId, articleId);
      return res.json(savedPostData);
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
