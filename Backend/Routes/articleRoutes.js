const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const articleModel = require('../models/articleModel');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { pool } = require('../db');

const {getLikeCount} = require('../models/likeModel');

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Route to create a new article with images
router.post('/create', verifyToken, upload.array('images', 10), async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  const files = req.files;

  try {
    const newArticle = await articleModel.createArticle(userId, title, content);

    if (files && files.length > 0) {
      const imageUrls = files.map(file => `/uploads/${file.filename}`);
      await articleModel.addImagesToArticle(newArticle.id, imageUrls);
    }

    res.status(201).json({ message: 'Article created successfully', article: newArticle });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Route to get articles by username
router.get('/:username/articles', async (req, res) => {
  const { username } = req.params;
  console.log(username + '  testing ');

  try {
    const articles = await articleModel.getArticlesByUsername(username);
    res.json({ articles });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/feed', async (req, res) => {
  try {
    const articles = await articleModel.getAllArticles();

    const articlesWithLikesPromises = articles.map(async (article) => {
      const likesCount = await getLikeCount(article.id); 
      return { ...article, likes: likesCount };
    });

    const articlesWithLikes = await Promise.all(articlesWithLikesPromises);
    
    res.json({ articles: articlesWithLikes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Route to get a specific article by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log("This is the requested from home page ; " + id);

  try {
    const article = await articleModel.getArticleById(id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json({ article });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;