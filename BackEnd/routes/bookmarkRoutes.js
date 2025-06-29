import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Course from '../models/Course.js';
import User from '../models/UserModel.js';

const router = express.Router();

router.post('/:courseId', protect, async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const alreadyBookmarked = user.bookmarkedCourses.some(
      (id) => id.toString() === courseId
    );

    if (alreadyBookmarked) {
      user.bookmarkedCourses = user.bookmarkedCourses.filter(
        (id) => id.toString() !== courseId
      );
    } else {
      user.bookmarkedCourses.push(courseId);
    }

    await user.save();

    res.json({
      success: true,
      bookmarked: !alreadyBookmarked,
      message: alreadyBookmarked
        ? '❌ Removed from bookmarks'
        : '✅ Bookmarked successfully',
      updatedBookmarkedCourses: user.bookmarkedCourses, 
    });
  } catch (err) {
    console.error('Bookmark error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
