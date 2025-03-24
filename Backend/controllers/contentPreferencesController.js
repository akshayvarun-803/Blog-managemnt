// controllers/contentPreferencesController.js

const contentPreferencesModel = require('../models/contentPreferencesModel');

const setContentPreferences = async (req, res) => {
  const { preferences } = req.body;
  const { firebase_uid } = req.user;

  try {
    const user = await userModel.findUserByFirebaseUID(firebase_uid);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedPreferences = await contentPreferencesModel.setContentPreferences(user.id, preferences);
    return res.json({ updatedPreferences });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { setContentPreferences };
