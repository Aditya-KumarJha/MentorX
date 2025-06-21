import User from '../models/UserModel.js';
import Mentor from '../models/MentorModel.js';
import mongoose from 'mongoose';

// ✅ Toggle favorite mentor (add/remove)
export const toggleFavoriteMentor = async (req, res) => {
  try {
    const userId = req.user._id;
    const { mentorId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return res.status(400).json({ message: 'Invalid mentor ID' });
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const user = await User.findById(userId);
    let updatedMentor = null;

    const alreadyFavorite = user.favorites.includes(mentorId);

    if (alreadyFavorite) {
      user.favorites = user.favorites.filter(id => id.toString() !== mentorId);
    } else {
      user.favorites.push(mentorId);
      updatedMentor = mentor;
    }

    await user.save();

    res.status(200).json({
      message: alreadyFavorite ? 'Removed from favorites' : 'Added to favorites',
      mentor: updatedMentor, // will be null if removed
    });
  } catch (err) {
    console.error('❌ Favorite error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get favorite mentors (both IDs and full data)
export const getFavoriteMentors = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const favoriteMentors = user.favorites;
    const favoriteIds = favoriteMentors.map((mentor) => mentor._id.toString());

    res.status(200).json({
      favoriteMentors,
      favoriteIds,
    });
  } catch (error) {
    console.error('❌ Error fetching favorite mentors:', error);
    res.status(500).json({ message: 'Failed to fetch favorites' });
  }
};
