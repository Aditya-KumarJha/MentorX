import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  course_id: { type: Number, unique: true }, 
  title: String,
  url: String,
  images: [String],
  cloudinaryImage: String,
  instructors: [
    {
      display_name: String,
      job_title: String,
      image_100x100: String,
    }
  ],
  purchase: {
    price: {
      amount: Number,
      price_string: String
    }
  },
  visible_instructors: Array,
  category: String, 
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
export default Course;
