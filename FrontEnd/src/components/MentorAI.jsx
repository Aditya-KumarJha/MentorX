import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { FaSearch, FaUserGraduate } from 'react-icons/fa';
import { useSearchParams, Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import Loader from '../components/Loader';
import MentorCard from './partials/MentorCard';
import 'remixicon/fonts/remixicon.css';

const careerOptions = ['All', 'Machine Learning', 'Data Science', 'Blockchain', 'Full Stack', 'Cybersecurity', 'App Development'];

const MentorAI = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [careerFilter, setCareerFilter] = useState(searchParams.get('career') || 'All');
  const [itemsToShow, setItemsToShow] = useState(12);
  const [mentors, setMentors] = useState([]);
  const [displayedMentors, setDisplayedMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const shuffleArray = (arr) => [...arr].sort(() => 0.5 - Math.random());

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await axios.get('http://localhost:5050/api/mentors');
        const fetched = Array.isArray(res.data) ? res.data : res.data.mentors || [];
        setMentors(shuffleArray(fetched));
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  useEffect(() => {
    setSearchParams({
      search: search || '',
      career: careerFilter !== 'All' ? careerFilter : ''
    });
  }, [search, careerFilter]);

  const filteredMentors = useMemo(() => {
    const normalizedCareer = careerFilter.toLowerCase();
    return mentors.filter((mentor) => {
      const matchesCareer =
        normalizedCareer === 'all' ||
        (mentor.expertiseTags &&
          mentor.expertiseTags.some((tag) => tag.toLowerCase() === normalizedCareer));
      const matchesSearch = mentor.fullName?.toLowerCase().includes(search.toLowerCase());
      return matchesCareer && matchesSearch;
    });
  }, [mentors, careerFilter, search]);

  useEffect(() => {
    setDisplayedMentors(filteredMentors.slice(0, itemsToShow));
  }, [filteredMentors, itemsToShow]);

  const fetchMoreMentors = () => {
    setTimeout(() => setItemsToShow((prev) => prev + 9), 500);
  };

  if (loading) return <Loader />;

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 p-6 h-[45vh] md:h-screen overflow-hidden border-b md:border-b-0 md:border-r"
        style={{ borderColor: darkMode ? '#3f3f46' : '#e5e7eb' }}
      >
        <div className="flex justify-start items-center mb-4 gap-4">
          {/* Back Arrow → Link to Homepage */}
          <Link
            to="/"
            className="text-3xl hover:scale-110 transition-transform"
            aria-label="Go back"
            style={{ color: darkMode ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.7)' }}
          >
            <i className="ri-arrow-left-line" />
          </Link>

          {/* Heading and icon shifted left */}
          <h2 className="text-3xl font-bold flex items-center gap-2 select-none">
            <i className="ri-robot-2-line text-3xl animate-bounce" />
            <span className="bg-gradient-to-r from-cyan-400 to-rose-500 bg-clip-text text-transparent">
              MentorAI
            </span>
          </h2>

          {/* Theme toggle button */}
          <button onClick={toggleDarkMode} className="ml-auto text-2xl hover:scale-110 transition-transform">
            <i className={`ri-${darkMode ? 'sun' : 'moon'}-line`} />
          </button>
        </div>
        <div
          className={`h-[80%] md:h-[85vh] rounded-xl p-4 flex justify-center items-center text-sm transition-all duration-300 ${
            darkMode
              ? 'bg-zinc-800 border border-zinc-700 text-gray-400'
              : 'bg-gray-100 border border-gray-300 text-gray-500'
          }`}
        >
          (AI chat feature coming soon)
        </div>
      </motion.div>

      <div id="mentor-scrollable-div" className="w-full lg:w-1/2 h-[55vh] md:h-screen overflow-y-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        >
          <div className="relative w-full sm:w-[45%] text-sm">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setItemsToShow(12);
              }}
              placeholder="Search mentors..."
              className={`w-full pl-10 px-3 py-2 rounded-md border outline-none focus:ring-2 focus:ring-purple-500 transition text-sm ${
                darkMode
                  ? 'bg-zinc-800 border-zinc-600 text-white'
                  : 'bg-white border-zinc-300 text-zinc-900'
              }`}
            />
          </div>
          <div className="relative w-full sm:w-[45%] text-sm">
            <select
              value={careerFilter}
              onChange={(e) => {
                setCareerFilter(e.target.value);
                setItemsToShow(12);
              }}
              className={`w-full px-3 py-2 rounded-md border outline-none appearance-none focus:ring-2 focus:ring-purple-500 transition text-sm ${
                darkMode
                  ? 'bg-zinc-800 border-zinc-600 text-white'
                  : 'bg-white border-zinc-300 text-zinc-900'
              }`}
            >
              {careerOptions.map((option, i) => (
                <option key={i} value={option}>
                  {option === 'All' ? 'All Careers' : option}
                </option>
              ))}
            </select>
            <FaUserGraduate className="absolute top-3 right-3 text-gray-400 pointer-events-none" />
          </div>
        </motion.div>

        <InfiniteScroll
          dataLength={displayedMentors.length}
          next={fetchMoreMentors}
          hasMore={displayedMentors.length < filteredMentors.length}
          loader={<p className="text-center text-gray-400 mt-4">Loading more mentors...</p>}
          scrollableTarget="mentor-scrollable-div"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-6 gap-y-8">
            {displayedMentors.length === 0 ? (
              <p className="text-center text-gray-400 w-full">No mentors found.</p>
            ) : (
              displayedMentors.map((mentor, i) => (
                <MentorCard key={mentor._id || i} mentor={mentor} index={i} />
              ))
            )}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default MentorAI;
