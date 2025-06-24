import mongoose from 'mongoose';

// Define the schema for an AI conversation bookmark
const bookmarkSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true
    },
    messages: [
      {
        role: { type: String, required: true },
        content: { type: String, required: true }
      }
    ],
    savedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentor'
      }
    ],
    bookmarkedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      }
    ],
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
      }
    ],
    bookmarks: [bookmarkSchema] // ✅ NEW: Bookmarked AI conversations
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
