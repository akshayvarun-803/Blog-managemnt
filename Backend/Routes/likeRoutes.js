const express = require('express');
const router = express.Router();
const { likeArticle, unlikeArticle, checkIfLiked, getLikeCount } = require('../models/likeModel');
const { pool } = require('../db'); // Ensure you import the pool for querying

// Like or unlike an article and return the updated like count
router.post('/:username', async (req, res) => {
  const { articleId } = req.body;
  const username = req.params.username;
  console.log(`articleId: ${articleId}, username: ${username}`);

  try {
    // Get user ID by username
    const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userResult.rows[0].id;

    // Check if the article is already liked
    if (await checkIfLiked(userId, articleId)) {
      // If already liked, unlike it
      await unlikeArticle(userId, articleId);
      const count = await getLikeCount(articleId); // Get updated like count
      console.log(`--- count: ${count}`);
      return res.json({ message: 'Like removed', count });
    } else {
      // Otherwise, like the article
      const likedArticle = await likeArticle(userId, articleId);
      const count = await getLikeCount(articleId); // Get updated like count
      console.log(`--- likedArticle: ${likedArticle}, count: ${count}`);
      return res.json({ message: 'Article liked', likedArticle, count });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
