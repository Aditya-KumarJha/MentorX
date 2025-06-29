import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import proxycurlRouter from './routes/proxycurl.js';
import mentorRoutes from './routes/mentorRoutes.js';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js'; 
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import communityRoutes from './routes/communityRoutes.js'; 
import aiRoutes from "./routes/aiRoutes.js";
import chatBookmarkRoutes from './routes/chatBookmarkRoutes.js';
import pathFinderRoutes from './routes/pathFinderRoutes.js'; 

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://mentorx-2koy.onrender.com"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/proxycurl', proxycurlRouter);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes); 
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/chat-bookmarks', chatBookmarkRoutes);
app.use('/api/pathfinder', pathFinderRoutes); 
app.use('/api', communityRoutes);

app.get('/', (req, res) => {
  res.send('✅ MentorX Backend is running');
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
