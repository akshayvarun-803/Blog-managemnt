const { pool } = require('../db');

// Follow a user
const followUser = async (followerId, followingId) => {
  const result = await pool.query(
    'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) RETURNING *',
    [followerId, followingId]
  );
  return result.rows[0];
};

// Unfollow a user
const unfollowUser = async (followerId, followingId) => {
  const result = await pool.query(
    'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2 RETURNING *',
    [followerId, followingId]
  );
  return result.rows[0];
};

// Check if a user is following another user
const isFollowing = async (followerId, followingId) => {
  const result = await pool.query(
    'SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2',
    [followerId, followingId]
  );
  return result.rows.length > 0;
};

module.exports = { followUser, unfollowUser, isFollowing };