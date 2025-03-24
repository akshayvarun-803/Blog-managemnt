// models/userModel.js

const { pool } = require('../db');

// Find user by email
const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

// Find user by ID
const findUserById = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

// Find user by username
const findUserByUsername = async (username) => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
};

// Create a new user
const createUser = async (email, password, username) => {
  const result = await pool.query(
    'INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING *',
    [email, password, username]
  );
  return result.rows[0];
};

module.exports = { findUserByEmail, findUserById, findUserByUsername, createUser };
