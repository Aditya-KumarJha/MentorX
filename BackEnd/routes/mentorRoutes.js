// routes/mentorRoutes.js
import express from 'express';
import Mentor from '../models/MentorModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const mentors = await Mentor.find(filter).sort({ createdAt: -1 });
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
