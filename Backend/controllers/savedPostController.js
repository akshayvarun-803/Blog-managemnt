// controllers/savedPostController.js

const savedPostModel = require('../models/savedPostModel');

const savePost = async (req, res) => {
  const { articleId } = req.body;
  const { firebase_uid } = req.user;

  try {
    const user = await userModel.findUserByFirebaseUID(firebase_uid);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const savedPost = await savedPostModel.savePost(user.id, articleId);
    return res.json({ savedPost });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { savePost };
