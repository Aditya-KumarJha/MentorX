import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import TestModel from './models/TestModel.js'; 

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

// App setup
const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send('MentorX Backend is running ✅');
});

app.get('/test-mongo', async (req, res) => {
    try {
      const doc = new TestModel({ name: 'Aditya Test' });
      await doc.save();
      res.send('✅ MongoDB insert successful!');
    } catch (err) {
      console.error(err);
      res.status(500).send('❌ MongoDB insert failed.');
    }
});

// Start Server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
