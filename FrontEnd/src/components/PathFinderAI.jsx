import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FaExchangeAlt, FaArrowLeft, FaCompass } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PathFinderAI = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [mode, setMode] = useState('career');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleToggle = () => {
    setMode(prev => (prev === 'career' ? 'strength' : 'career'));
    setInput('');
    setResults(null);
    setError('');
  };

  const formatList = (text) => {
    return text
      .replace(/(\d+\.)/g, '\n$1')
      .split(/\n/)
      .map(line => line.trim())
      .filter(line => line && !/^[-•]/.test(line));
  };

  const cleanJobsText = (rawText) => {
    return rawText.split(/(?:How to Start|Next Steps|Conclusion)/i)[0].trim();
  };

  const parseMultipleCareers = (text) => {
    const blocks = text.split(/\n(?=\d+\.)/);
    const parsed = [];

    blocks.forEach((block) => {
      const roadmapMatch = block.match(/Roadmap:\s*([\s\S]*?)(?=\n\S|$)/i);
      const skillsMatch = block.match(/Skills to Learn:\s*([\s\S]*?)(?=\n\S|$)/i);
      const timelineMatch = block.match(/Estimated Timeline:\s*([\s\S]*?)(?=\n\S|$)/i);
      const jobsMatchRaw = block.match(/Target Job Titles:\s*([\s\S]*?)(?=\n\S|$)/i);

      let jobs = [];
      if (jobsMatchRaw?.[1]) {
        const cleaned = cleanJobsText(jobsMatchRaw[1]);
        jobs = formatList(cleaned);
      }

      parsed.push({
        roadmap: roadmapMatch?.[1]?.trim() || '',
        skills: skillsMatch ? formatList(skillsMatch[1]) : [],
        timeline: timelineMatch?.[1]?.trim() || '',
        jobs,
      });
    });

    return parsed;
  };

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResults(null);
    setError('');

    try {
      const prompt =
        mode === 'career'
          ? `For the career goal: ${input}, generate a detailed response with exactly these four sections:\n1. Roadmap\n2. Skills to Learn\n3. Estimated Timeline\n4. Target Job Titles.`
          : `Given these strengths: ${input}, suggest 2-3 suitable careers and for each, provide:\n1. Roadmap\n2. Skills to Learn\n3. Estimated Timeline\n4. Target Job Titles.`;

      const res = await axios.post('http://localhost:5050/api/pathfinder/generate', {
        input: prompt,
        mode,
      });

      const text = res.data.result;

      if (mode === 'strength') {
        const parsedCareers = parseMultipleCareers(text);
        setResults({ multiple: true, careers: parsedCareers });
      } else {
        const roadmapMatch = text.match(/Roadmap:\s*([\s\S]*?)\n(?:Skills|Estimated Timeline|Target|$)/i);
        const skillsMatch = text.match(/Skills to Learn:\s*([\s\S]*?)\n(?:Roadmap|Estimated Timeline|Target|$)/i);
        const timelineMatch = text.match(/Estimated Timeline:\s*([\s\S]*?)\n(?:Roadmap|Skills|Target|$)/i);
        const jobsMatchRaw = text.match(/Target Job Titles:\s*([\s\S]*)/i);

        let jobs = [];
        if (jobsMatchRaw?.[1]) {
          const cleaned = cleanJobsText(jobsMatchRaw[1]);
          jobs = formatList(cleaned);
        }

        setResults({
          multiple: false,
          roadmap: roadmapMatch?.[1]?.trim() || '',
          skills: skillsMatch ? formatList(skillsMatch[1]) : [],
          timeline: timelineMatch?.[1]?.trim() || '',
          jobs,
        });
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong while generating the roadmap.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen pt-4 py-12 ${darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-800'}`}>
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all hover:scale-110 ${
            darkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-300 hover:bg-zinc-100'
          }`}
        >
          <FaArrowLeft size={18} />
        </button>
        <button
          onClick={toggleDarkMode}
          className="text-2xl hover:scale-110 transition-transform"
        >
          <i className={`ri-${darkMode ? 'sun' : 'moon'}-line`} />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h1 className="text-4xl font-bold mb-4 flex justify-center items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
        <FaCompass
          className={`text-blue-500 dark:text-purple-400 hover:scale-125 transition-transform duration-300`}
          size={30}
        />
          PathFinder AI
        </h1>
        <h3 className="text-lg mb-6">Discover your ideal career path with AI-powered guidance.</h3>

        <div className="flex justify-center items-center gap-3 mb-6">
          <button
            onClick={handleToggle}
            className={`flex items-center gap-2 border px-3 py-2 rounded-full text-sm font-medium transition ${
              darkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'hover:bg-zinc-100'
            }`}
          >
            <FaExchangeAlt /> Switch to {mode === 'career' ? 'Strengths' : 'Career Goal'}
          </button>
        </div>

        <div className="px-10 flex items-center gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'career' ? 'e.g. Frontend Developer' : 'e.g. Problem Solving, Creativity'}
            className={`w-full max-w-xl px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
              darkMode
                ? 'bg-zinc-800 border-zinc-700 focus:ring-purple-500 text-white placeholder-zinc-400'
                : 'bg-white border-zinc-300 focus:ring-blue-500 text-zinc-800 placeholder-zinc-500'
            }`}
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition"
          >
            {loading ? 'Generating...' : 'Generate My Roadmap'}
          </button>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </motion.div>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto mt-12 grid gap-6"
        >
          {results.multiple ? (
            results.careers.slice(1).map((career, idx) => (
              <div key={idx} className="border p-4 rounded-xl dark:border-zinc-700 shadow space-y-4">
                <h2 className="text-xl font-bold text-blue-500">Career Path #{idx + 1}</h2>

                <div>
                  <h3 className="text-lg font-semibold mb-1">Career Roadmap</h3>
                  <p>{career.roadmap}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-1">Skills to Learn</h3>
                  {career.skills.map((skill, i) => (
                    <p key={i}>{skill}</p>
                  ))}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-1">Estimated Timeline</h3>
                  <p>{career.timeline}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-1">Target Job Titles</h3>
                  {career.jobs.map((job, i) => (
                    <p key={i}>{job}</p>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="p-4 rounded-xl border dark:border-zinc-700 shadow">
                <h2 className="text-xl font-semibold mb-2">Career Roadmap</h2>
                <p>{results.roadmap}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border dark:border-zinc-700 shadow">
                  <h2 className="text-lg font-semibold mb-2">Skills to Learn</h2>
                  {results.skills.map((s, idx) => (
                    <p key={idx}>{s}</p>
                  ))}
                </div>
                <div className="p-4 rounded-xl border dark:border-zinc-700 shadow">
                  <h2 className="text-lg font-semibold mb-2">Estimated Timeline</h2>
                  <p>{results.timeline}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border dark:border-zinc-700 shadow">
                <h2 className="text-lg font-semibold mb-2">Target Job Titles</h2>
                {results.jobs.map((j, idx) => (
                  <p key={idx}>{j}</p>
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default PathFinderAI;
