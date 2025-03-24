// controllers/likeController.js

const likeModel = require('../models/likeModel');

const likeArticle = async (req, res) => {
  const { articleId } = req.body;
  const { firebase_uid } = req.user;

  try {
    const user = await userModel.findUserByFirebaseUID(firebase_uid);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const alreadyLiked = await likeModel.checkIfLiked(user.id, articleId);
    if (alreadyLiked) {
      return res.status(400).json({ message: 'You already liked this article' });
    }

    const like = await likeModel.likeArticle(user.id, articleId);
    return res.json({ like });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { likeArticle };
