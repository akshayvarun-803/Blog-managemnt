const { pool } = require('../db');

// Like an article
const likeArticle = async (userId, articleId) => {
  const result = await pool.query(
    'INSERT INTO likes (user_id, article_id) VALUES ($1, $2) RETURNING *',
    [userId, articleId]
  );
  return result.rows[0];
};

// Remove a like from an article
const unlikeArticle = async (userId, articleId) => {
  await pool.query(
    'DELETE FROM likes WHERE user_id = $1 AND article_id = $2',
    [userId, articleId]
  );
};

// Check if user has already liked the article
const checkIfLiked = async (userId, articleId) => {
  const result = await pool.query(
    'SELECT * FROM likes WHERE user_id = $1 AND article_id = $2',
    [userId, articleId]
  );
  return result.rows.length > 0;
};

// Get like count for an article
const getLikeCount = async (articleId) => {
  const result = await pool.query(
    'SELECT COUNT(*) FROM likes WHERE article_id = $1',
    [articleId]
  );
  return parseInt(result.rows[0].count || 0);
};

module.exports = { likeArticle, unlikeArticle, checkIfLiked, getLikeCount };
