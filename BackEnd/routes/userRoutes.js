import express from 'express';
import {
  toggleFavoriteMentor,
  getFavoriteMentors,
  getBookmarkedCourses, // ✅ Import this new controller
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 💖 Favorite Mentors
router.post('/favorites', protect, toggleFavoriteMentor);
router.get('/favorites', protect, getFavoriteMentors);

// 🔖 Bookmarked Courses - ✅ NEW ROUTE
router.get('/bookmarks', protect, getBookmarkedCourses);

export default router;
