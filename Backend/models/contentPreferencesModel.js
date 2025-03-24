// models/contentPreferencesModel.js

const { pool } = require('../db');

// Set content preferences for a user
const setContentPreferences = async (userId, preferences) => {
  const result = await pool.query(
    'INSERT INTO content_preferences (user_id, preferences) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET preferences = $2 RETURNING *',
    [userId, JSON.stringify(preferences)]
  );
  return result.rows[0];
};

// Get content preferences for a user
const getContentPreferences = async (userId) => {
  const result = await pool.query('SELECT * FROM content_preferences WHERE user_id = $1', [userId]);
  return result.rows[0];
};

module.exports = { setContentPreferences, getContentPreferences };
