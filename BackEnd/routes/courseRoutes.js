import express from 'express';
import Course from '../models/Course.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const {
      category = 'development',
      page = 1,
      pageSize = 20,
      search = '',
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    // 🔍 Search regex (case-insensitive)
    const searchRegex = new RegExp(search, 'i');

    // 🎯 Dynamic filters
    // 🎯 Dynamic filters
    const filters = {
      ...(!search && category !== 'all' && { category }),
      ...(search && {
        $or: [
          { title: searchRegex },
          { 'instructors.display_name': searchRegex },
          { category: searchRegex },
        ],
      }),
    };


    // 📦 Query DB
    const courses = await Course.find(filters)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(filters);

    res.json({
      success: true,
      data: courses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (err) {
    console.error('❌ Error fetching courses:', err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
