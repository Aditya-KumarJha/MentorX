// /routes/proxycurl.js
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import Mentor from '../models/MentorModel.js'; // Mongoose model

dotenv.config();
const router = express.Router();


// ===============================
// 🔎 CLASSIFIER FUNCTION
// ===============================
function classifyMentor(mentor) {
  const combinedText = `
    ${mentor.headline || ''}
    ${mentor.summary || ''}
    ${mentor.occupation || ''}
    ${(mentor.experiences || []).map(e => `${e.title} ${e.description || ''}`).join(' ')}
    ${(mentor.certifications || []).map(c => c.name).join(' ')}
  `.toLowerCase();

  const tags = [];
  const stack = []; 

  const keywordMap = {
    'Machine Learning': [
      'machine learning', 'ml engineer', 'ml scientist', 'deep learning',
      'artificial intelligence', 'ai engineer', 'neural network', 'computer vision'
    ],
    'Data Science': [
      'data science', 'data scientist', 'data analyst', 'data engineer',
      'statistical modeling', 'regression', 'pandas', 'numpy'
    ],
    'Full Stack': [
      'full stack', 'mern', 'react', 'node.js', 'frontend', 'backend',
      'javascript developer', 'web developer', 'express.js', 'typescript'
    ],
    'Blockchain': [
      'blockchain', 'web3', 'solidity', 'ethereum', 'smart contract', 'crypto', 'nft', 'defi'
    ],
    'App Development': [
      'android developer', 'ios developer', 'flutter', 'kotlin', 'swift',
      'mobile app developer', 'react native', 'play store', 'app store'
    ],
    'Cybersecurity': [
      'cybersecurity', 'ethical hacker', 'penetration tester', 'infosec',
      'security analyst', 'security engineer', 'ctf', 'vulnerability'
    ],
    'DevOps': [
      'devops', 'docker', 'kubernetes', 'ci/cd', 'terraform', 'ansible',
      'jenkins', 'infrastructure', 'sre', 'reliability engineer'
    ],
    'Cloud': [
      'aws', 'azure', 'gcp', 'cloud engineer', 'cloud computing', 'cloud architect'
    ],
    'Leadership': [
      'founder', 'co-founder', 'ceo', 'cto', 'director', 'vp', 'executive', 'entrepreneur'
    ],
    'UI/UX': [
      'ui designer', 'ux designer', 'product designer', 'figma', 'user interface',
      'user experience', 'design system'
    ],
    'AI Research': [
      'nlp', 'language model', 'llm', 'chatbot', 'research scientist',
      'transformer', 'bert', 'gpt', 'prompt engineer'
    ]
  };

  const techStackKeywords = [
    'react', 'next.js', 'node.js', 'express', 'python', 'tensorflow', 'pytorch',
    'solidity', 'web3', 'kotlin', 'flutter', 'swift', 'firebase',
    'docker', 'kubernetes', 'sql', 'mongodb', 'mysql', 'postgresql',
    'aws', 'azure', 'gcp', 'typescript', 'figma', 'html', 'css',
    'java', 'c++', 'c#', 'bash', 'linux', 'redis', 'graphql'
  ];


  for (const [tag, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(keyword => combinedText.includes(keyword))) {
      tags.push(tag);
    }
  }

  for (const keyword of techStackKeywords) {
    if (combinedText.includes(keyword)) {
      stack.push(keyword);
    }
  }

  // Seniority
  let seniority = null;
  if (combinedText.includes('intern')) seniority = 'Intern';
  else if (combinedText.includes('junior')) seniority = 'Junior';
  else if (combinedText.includes('senior')) seniority = 'Senior';
  else if (combinedText.includes('lead')) seniority = 'Lead';
  else if (combinedText.includes('manager')) seniority = 'Manager';
  else if (combinedText.includes('director')) seniority = 'Director';
  else if (combinedText.includes('founder') || combinedText.includes('ceo') || combinedText.includes('cto')) seniority = 'Founder/Executive';

  return {
    expertiseTags: [...new Set(tags)],
    seniorityLevel: seniority,
    techStack: [...new Set(stack)],
  };
}


// ===============================
// 📥 FETCH + SAVE MENTOR
// ===============================
router.get('/fetch-mentor', async (req, res) => {
  const linkedInUrl = req.query.url;

  if (!linkedInUrl) {
    return res.status(400).json({ message: 'Missing LinkedIn URL in ?url=' });
  }

  try {
    const response = await axios.get('https://nubela.co/proxycurl/api/v2/linkedin', {
      params: { url: linkedInUrl, use_cache: 'if-present' },
      headers: { Authorization: `Bearer ${process.env.PROXYCURL_API_KEY}` },
    });

    const mentor = response.data;
    const { expertiseTags, seniorityLevel, techStack } = classifyMentor(mentor);

    const mentorObj = {
      fullName: mentor.full_name,
      profilePic: mentor.profile_pic_url,
      headline: mentor.headline,
      occupation: mentor.occupation,
      location: {
        city: mentor.city,
        state: mentor.state,
        country: mentor.country_full_name,
      },
      summary: mentor.summary,

      socialLinks: {
        linkedin: `https://www.linkedin.com/in/${mentor.public_identifier}`,
        twitter: null,
        facebook: null,
        instagram: null,
      },

      education: mentor.education?.map(e => ({
        school: e.school,
        degree: e.degree_name,
        field: e.field_of_study,
        startYear: e.starts_at?.year,
        endYear: e.ends_at?.year,
      })) || [],

      experiences: mentor.experiences?.map(e => ({
        title: e.title,
        company: e.company,
        location: e.location,
        startYear: e.starts_at?.year,
        endYear: e.ends_at?.year,
      })) || [],

      certifications: mentor.certifications?.map(c => ({
        name: c.name,
        authority: c.authority,
      })) || [],

      awards: mentor.accomplishment_honors_awards?.map(a => ({
        title: a.title,
        issuer: a.issuer,
        year: a.issued_on?.year,
      })) || [],

      similarPeople: mentor.people_also_viewed?.map(p => ({
        name: p.name,
        link: p.link,
        summary: p.summary || null,
      })) || [],

      expertiseTags,
      seniorityLevel,
      techStack,
    };

    // Store in MongoDB
    const exists = await Mentor.findOne({
      fullName: mentorObj.fullName,
      'socialLinks.linkedin': mentorObj.socialLinks.linkedin,
    });

    let saved;
    if (exists) {
      saved = await Mentor.findByIdAndUpdate(exists._id, mentorObj, { new: true });
    } else {
      saved = await Mentor.create(mentorObj);
    }

    res.status(200).json(saved);

  } catch (error) {
    console.error('❌ Proxycurl error:', error.message);
    res.status(500).json({
      message: 'Failed to fetch mentor',
      error: error.response?.data || error.message
    });
  }
});

export default router;
