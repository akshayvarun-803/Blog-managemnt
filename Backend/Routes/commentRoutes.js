// routes/commentRoutes.js
const authMiddleware = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Get comments for a specific article
router.get('/articles/:articleId', async (req, res) => {
  try {
    const { articleId } = req.params;
    
    const commentsResult = await pool.query(
      `SELECT 
        c.id,
        c.content,
        c.created_at,
        u.username,
        u.id as user_id
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.article_id = $1
       ORDER BY c.created_at DESC`,
      [articleId]
    );

    // Format the comments with proper timestamp
    const formattedComments = commentsResult.rows.map(comment => ({
      id: comment.id,
      content: comment.content,
      username: comment.username,
      userId: comment.user_id,
      timestamp: comment.created_at,
      formattedTime: new Date(comment.created_at).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));

    res.json({
      comments: formattedComments,
      totalComments: formattedComments.length
    });

    console.log(`Comments for article ${articleId}😎:`, formattedComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

// Add a new comment
router.post('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { articleId, content } = req.body;

    // 1) Get user ID
    const userResult = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = userResult.rows[0].id;

    // 2) Insert the comment
    const insertResult = await pool.query(
      `INSERT INTO comments (article_id, user_id, content) 
       VALUES ($1, $2, $3) 
       RETURNING id, content, created_at`,
      [articleId, userId, content]
    );

    // 3) Get the complete comment data with username
    const newCommentResult = await pool.query(
      `SELECT 
        c.id,
        c.content,
        c.created_at,
        u.username
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [insertResult.rows[0].id]
    );

    const newComment = {
      ...newCommentResult.rows[0],
      formattedTime: new Date(newCommentResult.rows[0].created_at).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment' });
  }
});

// Optional: Delete comment endpoint
// router.delete('/:commentId', authMiddleware, async (req, res) => {
//   try {
//     const { commentId } = req.params;
//     const { userId } = req; // From authMiddleware

//     // Check if user owns the comment
//     const commentResult = await pool.query(
//       'SELECT user_id FROM comments WHERE id = $1',
//       [commentId]
//     );

//     if (commentResult.rows.length === 0) {
//       return res.status(404).json({ message: 'Comment not found' });
//     }

//     if (commentResult.rows[0].user_id !== userId) {
//       return res.status(403).json({ message: 'Unauthorized to delete this comment' });
//     }

//     await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
//     res.status(204).send();
//   } catch (error) {
//     console.error('Error deleting comment:', error);
//     res.status(500).json({ message: 'Error deleting comment' });
//   }
// });

module.exports = router;

