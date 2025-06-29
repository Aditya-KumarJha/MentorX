import mongoose from 'mongoose';

const MentorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  profilePic: { type: String },       
  headline: { type: String },         
  occupation: { type: String },       

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

  expertiseTags: [String],           
  techStack: [String],              
  seniorityLevel: { type: String },  

  summary: String, 

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

  backgroundPic: { type: String, default: null }, 

}, { timestamps: true });

export default mongoose.model('Mentor', MentorSchema);
