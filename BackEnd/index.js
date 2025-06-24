import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
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

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/proxycurl', proxycurlRouter);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes); 
app.use('/api/bookmarks', bookmarkRoutes);
app.use("/api/ai", aiRoutes);
app.use('/api/chat-bookmarks', chatBookmarkRoutes);

// ✅ Mount communityRoutes directly under /api so routes like /api/posts work
app.use('/api', communityRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('✅ MentorX Backend is running');
});

// Start Server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
