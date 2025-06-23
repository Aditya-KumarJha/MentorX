import User from '../models/UserModel.js';
import Mentor from '../models/MentorModel.js';
import Post from '../models/Post.js';
import mongoose from 'mongoose';

// ✅ Toggle favorite mentor
export const toggleFavoriteMentor = async (req, res) => {
  try {
    const userId = req.user._id;
    const { mentorId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return res.status(400).json({ message: 'Invalid mentor ID' });
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' });

    const user = await User.findById(userId);
    const alreadyFavorite = user.favorites.includes(mentorId);

    if (alreadyFavorite) {
      user.favorites = user.favorites.filter(id => id.toString() !== mentorId);
    } else {
      user.favorites.push(mentorId);
    }

    await user.save();
    res.status(200).json({
      message: alreadyFavorite ? 'Removed from favorites' : 'Added to favorites',
      mentor: alreadyFavorite ? null : mentor,
    });
  } catch (err) {
    console.error('❌ Favorite error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get favorite mentors
export const getFavoriteMentors = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      favoriteMentors: user.favorites,
      favoriteIds: user.favorites.map(m => m._id.toString()),
    });
  } catch (error) {
    console.error('❌ Error fetching favorite mentors:', error);
    res.status(500).json({ message: 'Failed to fetch favorites' });
  }
};

// ✅ Get bookmarked courses
export const getBookmarkedCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('bookmarkedCourses');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ bookmarkedCourses: user.bookmarkedCourses });
  } catch (err) {
    console.error('❌ Error fetching bookmarked courses:', err);
    res.status(500).json({ message: 'Failed to fetch bookmarked courses' });
  }
};

// ✅ Toggle liked post (add/remove)
export const toggleLikedPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const user = await User.findById(userId);
    const alreadyLiked = user.likedPosts.includes(postId);

    if (alreadyLiked) {
      user.likedPosts = user.likedPosts.filter(id => id.toString() !== postId);
    } else {
      user.likedPosts.push(postId);
    }

    await user.save();
    res.status(200).json({
      message: alreadyLiked ? 'Post unliked' : 'Post liked',
      likedPosts: user.likedPosts,
    });
  } catch (err) {
    console.error('❌ Error toggling liked post:', err);
    res.status(500).json({ message: 'Failed to toggle liked post' });
  }
};

// ✅ Get all liked posts for user
export const getLikedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'likedPosts',
      populate: {
        path: 'author',
        select: 'name profilePic',
      },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      likedPosts: user.likedPosts,
      likedPostIds: user.likedPosts.map(p => p._id.toString()),
    });
  } catch (err) {
    console.error('❌ Error fetching liked posts:', err);
    res.status(500).json({ message: 'Failed to fetch liked posts' });
  }
};