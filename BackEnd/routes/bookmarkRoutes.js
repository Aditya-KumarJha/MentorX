import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Course from '../models/Course.js';
import User from '../models/UserModel.js';

const router = express.Router();

router.post('/:courseId', protect, async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // ✅ Get full user object from DB
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // ✅ Validate course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // ✅ Check if already bookmarked
    const alreadyBookmarked = user.bookmarkedCourses.some(
      (id) => id.toString() === courseId
    );

    if (alreadyBookmarked) {
      // Remove bookmark
      user.bookmarkedCourses = user.bookmarkedCourses.filter(
        (id) => id.toString() !== courseId
      );
    } else {
      // Add bookmark
      user.bookmarkedCourses.push(courseId);
    }

    await user.save();

    res.json({
      success: true,
      bookmarked: !alreadyBookmarked,
      message: alreadyBookmarked
        ? '❌ Removed from bookmarks'
        : '✅ Bookmarked successfully',
      updatedBookmarkedCourses: user.bookmarkedCourses, // ✅ ADDED THIS LINE
    });
  } catch (err) {
    console.error('Bookmark error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
