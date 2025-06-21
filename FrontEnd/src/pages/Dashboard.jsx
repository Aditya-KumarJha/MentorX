import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { FaUserGraduate, FaBrain, FaUsers, FaCompass, FaBars } from 'react-icons/fa';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const { logout, isAuthenticated, userName, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ✅ Wait for userName to be non-empty string too
  const showLoader = loading || (isAuthenticated && (!userName || userName.trim() === ''));

  useEffect(() => {
    console.log('[Dashboard useEffect]', { loading, isAuthenticated, userName });
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { label: 'Mentor AI', href: '/mentor-ai', icon: <FaBrain className="inline-block mr-2" /> },
    { label: 'PathFinder AI', href: '/pathfinder-ai', icon: <FaCompass className="inline-block mr-2" /> },
    { label: 'EduMatrix', href: '/edumatrix', icon: <FaUserGraduate className="inline-block mr-2" /> },
    { label: 'Community', href: '/community', icon: <FaUsers className="inline-block mr-2" /> },
  ];

  if (showLoader) {
    return <Loader />;
  }

  if (!isAuthenticated) return null;

  return (
    <div className={`${darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'} min-h-screen transition`}>
      {/* Header */}
      <header className={`w-full px-4 sm:px-6 py-4 shadow ${darkMode ? 'bg-zinc-800' : 'bg-white'}`}>
        {/* Top Row for Mobile and Tablet */}
        <div className="flex justify-between items-center md:hidden">
          <h1 className="text-lg sm:text-xl font-bold tracking-wide">
            Welcome, {userName}
          </h1>
          <div className="flex items-center gap-3">
            <button onClick={toggleDarkMode}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 text-sm font-medium rounded-full border border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white transition"
            >
              Logout
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-xl">
              <FaBars />
            </button>
          </div>
        </div>

        {/* Desktop Header Layout */}
        <div className="hidden md:flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wide">Welcome, {userName}</h1>
          <nav className="flex flex-wrap justify-center gap-8 text-sm sm:text-base font-semibold">
            {menuItems.map(({ label, href, icon }, i) => (
              <div
                key={i}
                className={`group relative px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-110 ${
                  darkMode
                    ? 'hover:bg-zinc-800 hover:border hover:border-blue-400'
                    : 'hover:bg-blue-100 hover:border hover:border-blue-400'
                }`}
              >
                <a
                  href={href}
                  className={`transition-all duration-300 flex items-center ${
                    darkMode ? 'group-hover:text-blue-400' : 'group-hover:text-blue-600'
                  }`}
                >
                  {icon}
                  {label}
                </a>
              </div>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={toggleDarkMode}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 font-semibold rounded-full border border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <nav className="flex flex-col mt-4 md:hidden gap-3 text-sm font-semibold">
            {menuItems.map(({ label, href, icon }, i) => (
              <a
                key={i}
                href={href}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  darkMode
                    ? 'hover:bg-zinc-700 hover:text-blue-400'
                    : 'hover:bg-blue-100 hover:text-blue-600'
                }`}
              >
                {icon}
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="p-6 sm:p-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-extrabold mb-4"
        >
          MentorX Dashboard
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-base sm:text-lg opacity-80 max-w-xl mx-auto"
        >
          Your personalized control panel for mentorship, AI tools, and growth insights.
        </motion.p>
      </main>
    </div>
  );
};

export default Dashboard;
