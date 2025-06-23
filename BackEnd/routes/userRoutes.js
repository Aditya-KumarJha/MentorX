import express from 'express';
import {
  toggleFavoriteMentor,
  getFavoriteMentors,
  getBookmarkedCourses,
  toggleLikedPost,        // ✅ NEW: Toggle liked post
  getLikedPosts,          // ✅ NEW: Get liked posts
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 💖 Favorite Mentors
router.post('/favorites', protect, toggleFavoriteMentor);
router.get('/favorites', protect, getFavoriteMentors);

// 🔖 Bookmarked Courses
router.get('/bookmarks', protect, getBookmarkedCourses);

// ❤️ Liked Posts
router.post('/likes', protect, toggleLikedPost);     // ✅ toggle like/unlike a post
router.get('/likes', protect, getLikedPosts);        // ✅ get all liked posts for user

export default router;
