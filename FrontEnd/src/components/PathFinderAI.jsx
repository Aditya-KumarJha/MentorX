import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FaExchangeAlt, FaArrowLeft, FaCompass, FaFilePdf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import jsPDF from 'jspdf';

const PathFinderAI = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [mode, setMode] = useState('career');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const resultRef = useRef();

  const handleToggle = () => {
    setMode(prev => (prev === 'career' ? 'strength' : 'career'));
    setInput('');
    setResults(null);
    setError('');
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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

      const roadmap = roadmapMatch?.[1]?.trim() || '';
      const skills = skillsMatch ? formatList(skillsMatch[1]) : [];
      const timeline = timelineMatch?.[1]?.trim() || '';
      const jobs = jobsMatchRaw?.[1] ? formatList(cleanJobsText(jobsMatchRaw[1])) : [];

      if (roadmap || skills.length || timeline || jobs.length) {
        parsed.push({ roadmap, skills, timeline, jobs });
      }
    });

    return parsed.length > 0 ? parsed : [{
      roadmap: 'No valid roadmap found.',
      skills: [],
      timeline: '',
      jobs: [],
    }];
  };

  const handleGenerate = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    setLoading(true);
    setResults(null);
    setError('');

    try {
      let prompt = '';

      if (mode === 'career') {
        prompt = `You are a career guidance expert AI. For the career goal "${trimmedInput}", provide a structured response with exactly these four sections:\n\n1. Roadmap\n2. Skills to Learn\n3. Estimated Timeline\n4. Target Job Titles.`;
      } else {
        const formattedStrengths = trimmedInput
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
          .join(', ');
        prompt = `Based on the following strengths: ${formattedStrengths}, suggest 2-3 most suitable career paths. For each career, provide a clear structured response with:\n\n1. Roadmap\n2. Skills to Learn\n3. Estimated Timeline\n4. Target Job Titles.`;
      }

      const res = await axios.post('/api/pathfinder/generate', {
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

        const roadmap = roadmapMatch?.[1]?.trim() || '';
        const skills = skillsMatch ? formatList(skillsMatch[1]) : [];
        const timeline = timelineMatch?.[1]?.trim() || '';
        const jobs = jobsMatchRaw?.[1] ? formatList(cleanJobsText(jobsMatchRaw[1])) : [];

        if (!roadmap && skills.length === 0 && !timeline && jobs.length === 0) {
          throw new Error('Empty result');
        }

        setResults({
          multiple: false,
          roadmap,
          skills,
          timeline,
          jobs,
        });
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong while generating the roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const lineHeight = 7;
    const maxLineWidth = pageWidth - margin * 2;
    let y = 20;

    const checkPageSpace = () => {
      if (y + lineHeight > 280) {
        doc.addPage();
        y = 20;
      }
    };

    const addWrappedText = (label, textArray) => {
      if (!textArray || textArray.length === 0) return;
      checkPageSpace();
      doc.setFont(undefined, 'bold');
      doc.text(label, margin, y);
      y += lineHeight;

      doc.setFont(undefined, 'normal');
      textArray.forEach(line => {
        const wrapped = doc.splitTextToSize(line, maxLineWidth - 5);
        wrapped.forEach(wline => {
          checkPageSpace();
          doc.text(wline, margin + 5, y);
          y += lineHeight;
        });
      });

      y += 4;
    };

    const addParagraph = (label, paragraph) => {
      if (!paragraph) return;
      const lines = doc.splitTextToSize(paragraph, maxLineWidth);
      addWrappedText(label, lines);
    };

    doc.setFontSize(14);
    doc.text('PathFinder AI - Career Guidance', margin, y);
    y += 10;

    if (results.multiple) {
      results.careers.forEach((career, idx) => {
        addWrappedText(`Career Path #${idx + 1}`, []);
        addParagraph('Roadmap:', career.roadmap);
        addWrappedText('Skills to Learn:', career.skills.map(skill => `• ${skill}`));
        addParagraph('Estimated Timeline:', career.timeline);
        addWrappedText('Target Job Titles:', career.jobs.map(job => `• ${job}`));
      });
    } else {
      addParagraph('Roadmap:', results.roadmap);
      addWrappedText('Skills to Learn:', results.skills.map(skill => `• ${skill}`));
      addParagraph('Estimated Timeline:', results.timeline);
      addWrappedText('Target Job Titles:', results.jobs.map(job => `• ${job}`));
    }

    doc.save('PathFinderAI_Career_Guide.pdf');
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
          <FaCompass className="text-blue-500 dark:text-purple-400 hover:scale-125 transition-transform duration-300" size={30} />
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
            placeholder={mode === 'career' ? 'e.g. Frontend Developer' : 'e.g. Flutter, Python, Teamwork'}
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
        <>
          <div className="flex justify-end max-w-5xl mx-auto mt-8">
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
            >
              <FaFilePdf /> Export to PDF
            </button>
          </div>

          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-5xl mx-auto mt-6 grid gap-6"
          >
            {results.multiple ? (
              results.careers.map((career, idx) => (
                <div key={idx} className="border p-4 rounded-xl dark:border-zinc-700 shadow space-y-4">
                  <h2 className="text-xl font-bold text-blue-500">Career Path #{idx + 1}</h2>

                  {career.roadmap && (
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Career Roadmap</h3>
                      <p>{career.roadmap}</p>
                    </div>
                  )}

                  {career.skills.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Skills to Learn</h3>
                      {career.skills.map((skill, i) => (
                        <p key={i}>{skill}</p>
                      ))}
                    </div>
                  )}

                  {career.timeline && (
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Estimated Timeline</h3>
                      <p>{career.timeline}</p>
                    </div>
                  )}

                  {career.jobs.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Target Job Titles</h3>
                      {career.jobs.map((job, i) => (
                        <p key={i}>{job}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <>
                {results.roadmap && (
                  <div className="p-4 rounded-xl border dark:border-zinc-700 shadow">
                    <h2 className="text-xl font-semibold mb-2">Career Roadmap</h2>
                    <p>{results.roadmap}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.skills.length > 0 && (
                    <div className="p-4 rounded-xl border dark:border-zinc-700 shadow">
                      <h2 className="text-lg font-semibold mb-2">Skills to Learn</h2>
                      {results.skills.map((s, idx) => (
                        <p key={idx}>{s}</p>
                      ))}
                    </div>
                  )}
                  {results.timeline && (
                    <div className="p-4 rounded-xl border dark:border-zinc-700 shadow">
                      <h2 className="text-lg font-semibold mb-2">Estimated Timeline</h2>
                      <p>{results.timeline}</p>
                    </div>
                  )}
                </div>

                {results.jobs.length > 0 && (
                  <div className="p-4 rounded-xl border dark:border-zinc-700 shadow">
                    <h2 className="text-lg font-semibold mb-2">Target Job Titles</h2>
                    {results.jobs.map((j, idx) => (
                      <p key={idx}>{j}</p>
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default PathFinderAI;
