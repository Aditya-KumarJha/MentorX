// controllers/bookmarkController.js

import User from '../models/UserModel.js';

// Save a new conversation bookmark
export const bookmarkChat = async (req, res) => {
  const userId = req.user.id; // ✅ comes from auth middleware
  const { heading, messages } = req.body;

  if (!heading || !messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Heading and messages are required.' });
  }

  try {
    const user = await User.findById(userId);
    user.bookmarks.push({ heading, messages });

    // ✅ Save and grab the last pushed bookmark
    const savedUser = await user.save();
    const newBookmark = savedUser.bookmarks[savedUser.bookmarks.length - 1];

    // ✅ Return the _id
    res.status(200).json({
      message: 'Conversation bookmarked successfully.',
      bookmarkId: newBookmark._id,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to bookmark conversation.' });
  }
};

// Delete a bookmark by ID
export const unbookmarkChat = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params; // bookmark _id

  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { bookmarks: { _id: id } }
    });

    res.status(200).json({ message: 'Bookmark removed successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove bookmark.' });
  }
};

// Fetch all bookmarks for logged-in user
export const getBookmarks = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select('bookmarks');
    res.status(200).json({ bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookmarks.' });
  }
};
