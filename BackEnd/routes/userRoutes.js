import express from 'express';
import {
  toggleFavoriteMentor,
  getFavoriteMentors
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/favorites', protect, toggleFavoriteMentor);

router.get('/favorites', protect, getFavoriteMentors);

export default router;
