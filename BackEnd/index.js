// index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import proxycurlRouter from './routes/proxycurl.js';
import mentorRoutes from './routes/mentorRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api/mentors', mentorRoutes);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/proxycurl', proxycurlRouter);

// Health Check Route
app.get('/', (req, res) => {
  res.send('MentorX Backend is running ✅');
});

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
