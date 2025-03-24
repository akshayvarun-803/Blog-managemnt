const jwt = require('jsonwebtoken');
const { pool } = require('../db');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Check if the token is invalidated
    const result = await pool.query('SELECT * FROM invalidated_tokens WHERE token = $1', [token]);
    if (result.rows.length > 0) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};

module.exports = { verifyToken };