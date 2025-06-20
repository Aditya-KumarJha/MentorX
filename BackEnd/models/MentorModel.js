import mongoose from 'mongoose';

const MentorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  profilePic: { type: String },       // Profile image
  headline: { type: String },         // Quick summary under name
  occupation: { type: String },       // "ML Engineer at Google"

  location: {
    city: String,
    state: String,
    country: String,
  },

  socialLinks: {
    linkedin: String,
    twitter: { type: String, default: null },
    facebook: { type: String, default: null },
    instagram: { type: String, default: null },
  },

  expertiseTags: [String],           // e.g. ["Machine Learning"]
  techStack: [String],               // e.g. ["python", "react", "solidity"]
  seniorityLevel: { type: String },  // e.g. "Senior", "Founder"

  summary: String, // Full bio / description

  education: [{
    school: String,
    degree: String,
    field: String,
    startYear: Number,
    endYear: Number,
  }],

  experiences: [{
    title: String,
    company: String,
    location: String,
    startYear: Number,
    endYear: Number,
  }],

  certifications: [{
    name: String,
    authority: String,
  }],

  awards: [{
    title: String,
    issuer: String,
    year: Number,
  }],

  similarPeople: [{
    name: String,
    link: String,
    summary: String,
  }],

  backgroundPic: { type: String, default: null }, // Optional

}, { timestamps: true });

export default mongoose.model('Mentor', MentorSchema);
