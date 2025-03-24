// routes/contentPreferencesRoutes.js

const express = require('express');
const router = express.Router();
const contentPreferencesController = require('../controllers/contentPreferencesController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to set content preferences
router.post('/set', authMiddleware.verifyToken, contentPreferencesController.setContentPreferences);

module.exports = router;
