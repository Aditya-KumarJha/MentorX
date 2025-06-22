import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload function
export const uploadToCloudinary = async (imageUrl, publicId) => {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      public_id: publicId,
      folder: 'udemy-courses',
      overwrite: true,
    });
    return result.secure_url;
  } catch (err) {
    console.error('❌ Cloudinary Upload Error:', err.message);
    return imageUrl; // fallback to original
  }
};

export default cloudinary;
