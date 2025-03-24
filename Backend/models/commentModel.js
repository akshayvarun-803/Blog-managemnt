// models/commentModel.js

const { pool } = require('../db');

// Add a comment to an article
const addComment = async (userId, articleId, content) => {
  const result = await pool.query(
    'INSERT INTO comments (user_id, article_id, content) VALUES ($1, $2, $3) RETURNING *',
    [userId, articleId, content]
  );
  return result.rows[0];
};

// Get all comments for an article
const getCommentsByArticleId = async (articleId) => {
  const result = await pool.query('SELECT * FROM comments WHERE article_id = $1', [articleId]);
  return result.rows;
};

module.exports = { addComment, getCommentsByArticleId };
