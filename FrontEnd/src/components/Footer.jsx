import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import 'remixicon/fonts/remixicon.css';

const Footer = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const bgColor = darkMode ? 'bg-zinc-900 text-white' : 'bg-gray-50 text-gray-900';
  const headingColor = darkMode ? 'text-cyan-400' : 'text-cyan-600';
  const textColor = darkMode ? 'text-gray-400' : 'text-gray-700';

  return (
    <footer className={`py-6 px-6 sm:px-10 md:px-20 ${bgColor}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <i className="ri-graduation-cap-line text-4xl text-cyan-500" />
          <h3 className={`text-3xl font-bold ${headingColor}`}>Still here? Let us guide your journey!</h3>
        </div>

        <p className={`mb-10 max-w-2xl mx-auto text-lg ${textColor}`}>
          Join MentorX and unlock personalized career growth powered by AI and expert mentorship.
        </p>

        <div className="flex justify-center gap-4 mb-10 flex-wrap">
          <button
            onClick={() => navigate("/login")}
            className="text-center px-6 py-3 text-base font-semibold border-2 border-cyan-400 text-cyan-400 rounded-full relative overflow-hidden group"
          >
            <span className="relative z-20 group-hover:text-black transition-all duration-300">Login</span>
            <span className="absolute inset-0 flex justify-center items-center z-0">
              <span className="h-12 w-12 bg-cyan-400 rounded-full scale-0 group-hover:scale-[2.5] transition-transform duration-500 ease-out"></span>
            </span>
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="text-center px-6 py-3 text-base font-semibold border-2 border-rose-400 text-rose-400 rounded-full relative overflow-hidden group"
          >
            <span className="relative z-20 group-hover:text-black transition-all duration-300">Signup</span>
            <span className="absolute inset-0 flex justify-center items-center z-0">
              <span className="h-12 w-12 bg-rose-400 rounded-full scale-0 group-hover:scale-[2.5] transition-transform duration-500 ease-out"></span>
            </span>
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-600">
          &copy; {new Date().getFullYear()} MentorX. All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
};

export default Footer;
