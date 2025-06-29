import express from 'express';
import {
    bookmarkChat,
    unbookmarkChat,
    getBookmarks
  } from '../controllers/chatBookmarkController.js';  

import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.post('/', protect, bookmarkChat);       
router.delete('/:id', protect, unbookmarkChat); 
router.get('/', protect, getBookmarks);        

export default router;
