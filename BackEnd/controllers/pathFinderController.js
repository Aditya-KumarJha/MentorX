import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1', 
  defaultHeaders: {
    'HTTP-Referer': 'https://mentorx.ai', 
    'X-Title': 'MentorX PathFinder AI'
  }
});

export const generatePathFinderData = async (req, res) => {
  const { input, mode } = req.body;

  if (!input || !mode) {
    return res.status(400).json({ error: 'Input and mode are required' });
  }

  const prompt = mode === 'career'
    ? `Generate a detailed learning roadmap to become a successful ${input}. Include key skills, estimated timeline, job titles, and how to start.`
    : `Given the strengths: ${input}, suggest 2-3 suitable careers, a roadmap to pursue them, skills to build, estimated learning time, and job roles.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gryphe/mythomax-l2-13b',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    const answer = response.choices[0]?.message?.content;

    res.status(200).json({ result: answer });
  } catch (err) {
    console.error('OpenRouter error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate content' });
  }
};
