import { v2 as cloudinary } from 'cloudinary';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageFromUrl = async (imageUrl, publicId = null) => {
  try {
    const filename = `mentor-${Date.now()}.jpg`;
    const tempDir = os.tmpdir(); // cross-platform tmp folder
    const filePath = path.join(tempDir, filename);

    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(filePath, response.data);

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'mentors',
      public_id: publicId || undefined,
      overwrite: true,
    });

    await unlinkAsync(filePath);
    return result.secure_url;
  } catch (err) {
    console.error('Cloudinary upload failed:', err.message);
    return imageUrl;
  }
};
