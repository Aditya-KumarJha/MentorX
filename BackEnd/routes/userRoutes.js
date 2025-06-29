import express from 'express';
import {
  toggleFavoriteMentor,
  getFavoriteMentors,
  getBookmarkedCourses,
  toggleLikedPost,        
  getLikedPosts,          
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/favorites', protect, toggleFavoriteMentor);
router.get('/favorites', protect, getFavoriteMentors);

router.get('/bookmarks', protect, getBookmarkedCourses);

router.post('/likes', protect, toggleLikedPost);     
router.get('/likes', protect, getLikedPosts);       

export default router;
