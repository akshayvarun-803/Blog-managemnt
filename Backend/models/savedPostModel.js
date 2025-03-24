const { pool } = require('../db');

// Save an article for later
const savePost = async (userId, articleId) => {
  const result = await pool.query(
    'INSERT INTO saved_posts (user_id, article_id) VALUES ($1, $2) RETURNING *',
    [userId, articleId]
  );
  return result.rows[0];
};

// Remove a saved post
const unsavePost = async (userId, articleId) => {
  await pool.query(
    'DELETE FROM saved_posts WHERE user_id = $1 AND article_id = $2',
    [userId, articleId]
  );
};

// Get saved posts for a user
const getSavedPostsByUser = async (userId) => {
  const result = await pool.query('SELECT * FROM saved_posts WHERE user_id = $1', [userId]);
  return result.rows;
};

module.exports = { savePost, unsavePost, getSavedPostsByUser };
