import mongoose from 'mongoose';
import axios from 'axios';
import Course from '../models/Course.js';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Hardcoded API Key
const API_KEY = 'd4d9a0287dmshd4329daf3a9b74dp1f1e27jsn16c266e718ba';
const API_HOST = 'udemy-api2.p.rapidapi.com';

console.log('🔑 Using API Key:', API_KEY);

const uploadImageToCloudinary = async (url) => {
  try {
    const res = await cloudinary.uploader.upload(url, { folder: 'udemy-courses' });
    return res.secure_url;
  } catch (err) {
    console.warn('⚠️ Cloudinary upload failed, using original image:', err.message);
    return url;
  }
};

const fetchAndStoreCourses = async (category = 'data_science') => {
  const totalPages = 4;
  const pageSize = 10;

  for (let page = 1; page <= totalPages; page++) {
    console.log(`📦 Fetching page ${page}/${totalPages}`);

    const body = {
      page,
      page_size: pageSize,
      ratings: '',
      instructional_level: [],
      lang: [],
      price: [],
      duration: [],
      subtitles_lang: [],
      sort: 'popularity',
      features: [],
      locale: 'en_US',
      extract_pricing: true,
    };

    try {
      const res = await axios.post(
        `https://${API_HOST}/v1/udemy/category/${category}`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Host': API_HOST,
            'X-RapidAPI-Key': API_KEY,
          },
        }
      );

      const courses = res.data?.data?.courses || [];

      for (const course of courses) {
        const images = course.images || [];
        const uploadedImages = await Promise.all(
          images.map(img => uploadImageToCloudinary(img))
        );

        const newCourse = {
          ...course,
          images: uploadedImages,
          category,
        };

        await Course.updateOne(
          { course_id: course.course_id },
          { $set: newCourse },
          { upsert: true }
        );
      }

    } catch (err) {
      console.error(`❌ Failed to fetch page ${page}:`, err.response?.data || err.message);
      break; // stop if there's a fatal error
    }

    await new Promise(res => setTimeout(res, 500)); // delay between pages
  }

  console.log('✅ Done fetching and storing courses.');
  process.exit();
};

// 🟩 Start
fetchAndStoreCourses('data_science'); // change category to fetch different one
