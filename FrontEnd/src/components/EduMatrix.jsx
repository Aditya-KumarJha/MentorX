import React, { useEffect, useState, useMemo } from 'react';
import { fetchUdemyCoursesByCategory } from '../utils/udemyAPI';
import { useTheme } from '../context/ThemeContext';
import { FaSearch, FaGraduationCap } from 'react-icons/fa';
import { RiCloseLine, RiArrowLeftLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import CourseCard from './partials/CourseCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';
import { useAuth } from '../context/AuthContext';

const EduMatrix = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [courseIds, setCourseIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('development');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const categories = [
    { label: 'All Courses', value: 'all' },
    { label: 'Web Development', value: 'web_development' },
    { label: 'Data Science', value: 'data_science' },
    { label: 'Mobile Apps', value: 'mobile_apps' },
    { label: 'Databases', value: 'databases' },
    { label: 'Business', value: 'business' },
    { label: 'Entrepreneurship', value: 'entrepreneurship' },
    { label: 'Software Engineering', value: 'software_engineering' },
  ];

  useEffect(() => {
    loadCourses(page);
  }, [refreshTrigger, page]);

  const loadCourses = async (currentPage = 1) => {
    setLoading(true);
    const categoryToUse = selectedCategory === 'all' ? 'development' : selectedCategory;

    try {
      const res = await fetchUdemyCoursesByCategory(categoryToUse, currentPage, 12, searchQuery);
      const newCourses = res?.data || [];

      const uniqueNewCourses = newCourses.filter(
        (course) => course?.course_id && !courseIds.has(course.course_id)
      );

      const shuffledBatch = [...uniqueNewCourses];
      for (let i = shuffledBatch.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledBatch[i], shuffledBatch[j]] = [shuffledBatch[j], shuffledBatch[i]];
      }

      const updatedIds = new Set(courseIds);
      uniqueNewCourses.forEach((c) => updatedIds.add(c.course_id));

      setCourses((prev) => [...prev, ...shuffledBatch]);
      setCourseIds(updatedIds);

      const totalPages = res?.pagination?.totalPages || 1;
      if (currentPage >= totalPages || uniqueNewCourses.length === 0) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreCourses = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setCourses([]);
    setCourseIds(new Set());
    setPage(1);
    setHasMore(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCourses([]);
    setCourseIds(new Set());
    setPage(1);
    setHasMore(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  const debouncedSearch = useMemo(() => debounce((value) => {
    setCourses([]);
    setCourseIds(new Set());
    setPage(1);
    setHasMore(true);
    setRefreshTrigger((prev) => prev + 1);
  }, 1000), []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  if (loading && page === 1) return <Loader />;

  return (
    <div className={`min-h-screen px-6 py-6 ${darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10">
        <div className="flex items-start gap-2">
          <button
            onClick={() => navigate('/')}
            className="text-2xl mt-1 hover:text-blue-500 hover:scale-110 transition-all duration-200"
            aria-label="Go back"
          >
            <RiArrowLeftLine />
          </button>
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl font-extrabold flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent"
            >
              <FaGraduationCap className="text-blue-500 animate-pulse" />
              EDU MATRIX
            </motion.h1>
            <p className="text-sm text-gray-400 ml-1">Find Your Next Course</p>
          </div>
        </div>

        {/* Search & Category */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto mt-2 sm:mt-0">
          <div className="relative w-full sm:w-[360px]">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search courses..."
              className={`w-full pl-10 pr-10 px-3 py-2 rounded-md border outline-none focus:ring-2 hover:ring-2 transition text-sm ${
                darkMode ? 'bg-zinc-800 border-zinc-600 text-white focus:ring-blue-400' : 'bg-white border-zinc-300 text-zinc-900 focus:ring-blue-500'
              }`}
            />
            {searchQuery && (
              <button
                onClick={handleClear}
                className="absolute top-[0.6rem] right-2 text-xl text-gray-400 hover:text-red-400"
                aria-label="Clear search"
              >
                <RiCloseLine />
              </button>
            )}
          </div>

          <div className="relative w-full sm:w-[180px]">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={`w-full px-3 py-2 rounded-md border outline-none appearance-none focus:ring-2 hover:ring-2 transition text-sm ${
                darkMode ? 'bg-zinc-800 border-zinc-600 text-white focus:ring-blue-400' : 'bg-white border-zinc-300 text-zinc-900 focus:ring-blue-500'
              }`}
            >
              {categories.map((cat, i) => (
                <option key={i} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <FaGraduationCap className="absolute top-3 right-3 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="text-2xl hover:scale-110 transition-transform sm:ml-4"
        >
          <i className={`ri-${darkMode ? 'sun' : 'moon'}-line`} />
        </button>
      </div>

      {/* Course Results */}
      {courses.length === 0 && !loading ? (
        <p className="text-center text-gray-400 mt-10">No courses found.</p>
      ) : (
        <InfiniteScroll
          dataLength={courses.length}
          next={fetchMoreCourses}
          hasMore={hasMore}
          loader={<p className="text-center mt-4">Loading more courses...</p>}
          endMessage={<p className="text-center mt-4 text-gray-400">No more courses available.</p>}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {courses.map((course, index) => (
              <CourseCard
                key={index}
                course={course}
                index={index}
                darkMode={darkMode}
                user={user}
              />
            ))}
          </motion.div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default EduMatrix;
