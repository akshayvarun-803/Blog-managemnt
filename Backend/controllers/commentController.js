// controllers/commentController.js

const commentModel = require('../models/commentModel');

const addComment = async (req, res) => {
  const { articleId, content } = req.body;
  const { firebase_uid } = req.user;

  try {
    const user = await userModel.findUserByFirebaseUID(firebase_uid);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const comment = await commentModel.addComment(user.id, articleId, content);
    return res.json({ comment });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addComment };
