// routes/mentorRoutes.js
import express from 'express';
import Mentor from '../models/MentorModel.js';

const router = express.Router();

// Fetch all mentors or a specific mentor by name
router.get('/', async (req, res) => {
  try {
    const { category, name } = req.query;

    if (name) {
      const mentor = await Mentor.findOne({ fullName: decodeURIComponent(name) });
      if (!mentor) return res.status(404).json({ message: 'Mentor not found' });
      return res.json(mentor);
    }

    const filter = category ? { category } : {};
    const mentors = await Mentor.find(filter).sort({ createdAt: -1 });
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get similar mentors by matching expertiseTags
router.get('/similar', async (req, res) => {
  try {
    const tags = req.query.tag;

    if (!tags || tags.length === 0) {
      return res.status(400).json({ message: 'Missing tag query params' });
    }

    const tagArray = Array.isArray(tags) ? tags : [tags];

    const mentors = await Mentor.find({
      expertiseTags: { $in: tagArray }
    }).sort({ createdAt: -1 });

    res.json(mentors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
