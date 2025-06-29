import User from '../models/UserModel.js';

export const bookmarkChat = async (req, res) => {
  const userId = req.user.id; 
  const { heading, messages } = req.body;

  if (!heading || !messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Heading and messages are required.' });
  }

  try {
    const user = await User.findById(userId);
    user.bookmarks.push({ heading, messages });

    const savedUser = await user.save();
    const newBookmark = savedUser.bookmarks[savedUser.bookmarks.length - 1];

    res.status(200).json({
      message: 'Conversation bookmarked successfully.',
      bookmarkId: newBookmark._id,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to bookmark conversation.' });
  }
};

export const unbookmarkChat = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params; 

  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { bookmarks: { _id: id } }
    });

    res.status(200).json({ message: 'Bookmark removed successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove bookmark.' });
  }
};

export const getBookmarks = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select('bookmarks');
    res.status(200).json({ bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookmarks.' });
  }
};
