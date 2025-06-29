import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavouritesContext';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { FaUserGraduate, FaBrain, FaUsers, FaCompass, FaBars, FaArrowLeft } from 'react-icons/fa';
import Loader from '../components/Loader';
import MentorCard from '../components/partials/MentorCard';
import CourseCard from '../components/partials/CourseCard';
import PostCard from '../components/PostCard';
import { BookmarkIcon } from '@radix-ui/react-icons';
import { toast } from 'react-toastify';
import axios from '../utils/axios';

const Dashboard = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const { logout, isAuthenticated, userName, user, loading } = useAuth();
  const { favoriteMentors = [], fetchFavorites } = useFavorites();
  const [bookmarkedCourses, setBookmarkedCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [likedPosts, setLikedPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [bookmarkedChats, setBookmarkedChats] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const showLoader = loading || (isAuthenticated && (!userName || userName.trim() === ''));

  const handlePostDelete = (deletedPostId) => {
    setLikedPosts(prev => prev.filter(post => post._id !== deletedPostId));
  };

  const handlePostUnlike = (deletedPostId) => {
    setLikedPosts(prev => prev.filter(post => post._id !== deletedPostId));
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate('/login');
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchBookmarkedCourses = async () => {
      if (!user?.token) return;
      try {
        const { data } = await axios.get('/api/users/bookmarks', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBookmarkedCourses(data.bookmarkedCourses || []);
      } catch (err) {
        console.error('Failed to fetch bookmarked courses:', err);
      } finally {
        setLoadingCourses(false);
      }
    };

    if (isAuthenticated) fetchBookmarkedCourses();
  }, [user?.token, isAuthenticated]);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      if (!user?.token) return;
      try {
        const { data } = await axios.get('/api/users/likes', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setLikedPosts(data.likedPosts || []);
      } catch (err) {
        console.error('Failed to fetch liked posts:', err);
      } finally {
        setLoadingPosts(false);
      }
    };

    if (isAuthenticated && user?.token) {
      fetchFavorites();
      fetchLikedPosts();
    }
  }, [isAuthenticated, user?.token, fetchFavorites]);

  useEffect(() => {
    const fetchChatBookmarks = async () => {
      if (!user?.token) return;
      try {
        const { data } = await axios.get('/api/chat-bookmarks', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBookmarkedChats(data.bookmarks || []);
      } catch (err) {
        console.error('Failed to fetch chat bookmarks:', err);
      }
    };

    if (isAuthenticated && user?.token) {
      fetchChatBookmarks();
    }
  }, [isAuthenticated, user?.token]);

  const handleRemoveChatBookmark = async (chatId) => {
    try {
      await axios.delete(`/api/chat-bookmarks/${chatId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBookmarkedChats(prev => prev.filter(c => c._id !== chatId));
      toast.warn('❌ Conversation removed from bookmarks');
    } catch (err) {
      toast.error('Failed to remove bookmark');
    }
  };

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

  if (showLoader) return <Loader />;
  if (!isAuthenticated) return null;

  const loopStyle = {
    display: 'flex',
    gap: '24px',
    width: 'max-content',
  };

  const cardWrapperStyle = {
    width: '350px',
    minHeight: '340px',
    flexShrink: 0,
  };

  const headerTextStyle = `font-bold tracking-wide ${
    darkMode ? 'text-blue-300' : 'text-indigo-600'
  }`;

  const sectionTitleStyle = `text-2xl font-bold mb-4 ${
    darkMode ? 'text-pink-400' : 'text-rose-600'
  }`;

  return (
    <div className={`${darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'} min-h-screen transition`}>
      <header className={`w-full px-4 sm:px-6 py-4 shadow ${darkMode ? 'bg-zinc-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center md:hidden">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-xl hover:scale-110 transition">
              <FaArrowLeft />
            </button>
            <h1 className={`text-lg sm:text-xl ${headerTextStyle}`}>Welcome, {userName}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleDarkMode}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
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

        <div className="hidden md:flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-xl hover:scale-110 transition">
              <FaArrowLeft />
            </button>
            <h1 className={`text-2xl ${headerTextStyle}`}>Welcome, {userName}</h1>
          </div>
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
            <button onClick={toggleDarkMode}>{darkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 font-semibold rounded-full border border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </div>

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
          className={`text-3xl sm:text-4xl font-extrabold mb-4 ${
            darkMode ? 'text-cyan-400' : 'text-indigo-700'
          }`}
        >
          MentorX Dashboard
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-base sm:text-lg opacity-80 max-w-xl mx-auto mb-10"
        >
          Your personalized control panel for mentorship, AI tools, and growth insights.
        </motion.p>

        {/* Favorite Mentors */}
        <section className="mb-12 text-left">
          <h3 className={sectionTitleStyle}>❤️ Your Favorite Mentors</h3>
          {favoriteMentors.length > 0 ? (
            <div className="scroll-container overflow-hidden whitespace-nowrap">
              <div className="loop-scroll" style={loopStyle}>
                {Array.from({ length: 2 }).flatMap((_, i) =>
                  favoriteMentors.map((mentor, index) => (
                    <div key={`${i}-${mentor._id}`} style={cardWrapperStyle}>
                      <MentorCard mentor={mentor} index={index} />
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <p className="opacity-60 italic">You haven't added any favorite mentors yet.</p>
          )}
        </section>

        {/* Bookmarked Courses */}
        <section className="mb-12 text-left">
          <h3 className={sectionTitleStyle}>🔖 Your Bookmarked Courses</h3>
          {!loadingCourses && bookmarkedCourses.length > 0 ? (
            <div className="scroll-container overflow-hidden whitespace-nowrap">
              <div className="loop-scroll" style={loopStyle}>
                {Array.from({ length: 2 }).flatMap((_, i) =>
                  bookmarkedCourses.map((course, index) => (
                    <div key={`${i}-${course._id}`} style={cardWrapperStyle}>
                      <CourseCard
                        course={course}
                        index={index}
                        darkMode={darkMode}
                        setBookmarkedCourses={setBookmarkedCourses}
                        isDashboard={true}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : !loadingCourses ? (
            <p className="opacity-60 italic">No courses bookmarked yet.</p>
          ) : null}
        </section>

        {/* Liked Posts */}
        <section className="mb-12 text-left">
          <h3 className={sectionTitleStyle}>✍️ Posts You've Liked</h3>
          {!loadingPosts && likedPosts.length > 0 ? (
            <div className="mt-2 pt-6 scroll-container overflow-hidden whitespace-nowrap" >
              <div className="loop-scroll" style={loopStyle}>
                {Array.from({ length: 2 }).flatMap((_, i) =>
                  likedPosts.map((post, index) => (
                    <div key={`${i}-${post._id}`} style={cardWrapperStyle}>
                      <PostCard
                        key={post._id}
                        post={post}
                        darkMode={darkMode}
                        fetchPosts={() => {}}
                        index={index}
                        onUnlike={handlePostUnlike}
                        onDelete={handlePostDelete}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
            ) : !loadingPosts ? (
          <p className="opacity-60 italic">You haven't liked any posts yet.</p>
          ) : null}
        </section>

      {/* Saved Conversations */}
      <section className="mb-12 text-left">
        <h3 className={sectionTitleStyle}>📌 Saved Conversations</h3>
        {bookmarkedChats.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedChats.map((chat, index) => (
              <div
              key={chat._id || index}
              onClick={() => navigate('/mentor-ai', { state: { chat } })}
              className={`p-5 rounded-xl transition-all duration-300 cursor-pointer transform ${
                darkMode
                  ? 'bg-zinc-800 border border-zinc-700 shadow-[0_4px_16px_rgba(200,200,200,0.08)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.12)]'
                  : 'bg-white border border-gray-200 shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)]'
              } hover:scale-[1.03]`}
            >            
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg truncate">
                    {chat.heading}
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveChatBookmark(chat._id);
                    }}
                    className="p-1 rounded-full bg-indigo-100 hover:bg-indigo-200"
                  >
                    <BookmarkIcon className="w-5 h-5 text-indigo-600" />
                  </button>
                </div>
                <p className="text-sm opacity-70 line-clamp-3">
                  {chat.messages?.[1]?.content || 'AI conversation preview...'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="opacity-60 italic">No conversations bookmarked yet.</p>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-gray-400 dark:text-gray-500 py-6">
          <hr className="mb-4 border-gray-700" />
          <p>© {new Date().getFullYear()} MentorX. Made with 💙 by the community.</p>
      </footer>
    </main>
      <style>
        {`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .scroll-container:hover .loop-scroll {
            animation-play-state: paused;
          }
          .loop-scroll {
            animation: scroll-left 40s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
