// routes/bookmarkRoutes.js

import express from 'express';
import {
    bookmarkChat,
    unbookmarkChat,
    getBookmarks
  } from '../controllers/chatBookmarkController.js';  

import { protect } from '../middleware/authMiddleware.js'; // 🔐 Auth check

const router = express.Router();

router.post('/', protect, bookmarkChat);       // ✅ Save bookmark
router.delete('/:id', protect, unbookmarkChat); // ✅ Delete by bookmark ID
router.get('/', protect, getBookmarks);         // ✅ Fetch all bookmarks

export default router;
