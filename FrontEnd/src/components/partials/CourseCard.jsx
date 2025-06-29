import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaChalkboardTeacher, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const CourseCard = ({ course, index, darkMode, setBookmarkedCourses, isDashboard = false }) => {
  const { user, setUser } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (!user) return setBookmarked(false);
    const bookmarkedList = user?.bookmarkedCourses || [];
    setBookmarked(bookmarkedList.includes(course._id));
  }, [user, course._id]);

  const handleBookmarkToggle = async () => {
    if (!user?.token) {
      toast.info('🔐 Login to bookmark this course', { position: 'top-right' });
      return;
    }

    try {
      const res = await axios.post(
        `/api/bookmarks/${course._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (res.data.success) {
        setBookmarked(res.data.bookmarked);

        const updatedUser = {
          ...user,
          bookmarkedCourses: res.data.updatedBookmarkedCourses || [],
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);

        if (setBookmarkedCourses) {
          if (!res.data.bookmarked) {
            setBookmarkedCourses((prev) =>
              prev.filter((c) => c._id !== course._id)
            );
          } else if (res.data.bookmarkedCourse) {
            setBookmarkedCourses((prev) => [...prev, res.data.bookmarkedCourse]);
          }
        }

        toast[res.data.bookmarked ? 'success' : 'error'](
          res.data.bookmarked ? '✅ Bookmarked successfully' : '❌ Removed from bookmarks',
          { position: 'top-right' }
        );
      }
    } catch (err) {
      console.error('Bookmark error:', err);
      toast.error('Failed to update bookmark', { position: 'top-right' });
    }
  };

  const getBestImage = (images = []) =>
    images?.[6] || 'https://via.placeholder.com/750x422?text=No+Image';

  if (!course || !course.title) return null;

  const courseImage = getBestImage(course.images);
  const instructor = course.instructors?.[0]?.display_name || 'Unknown Instructor';
  const price = course.purchase?.price?.price_string || 'Free';
  const courseUrl = course.url?.startsWith('/course')
    ? `https://www.udemy.com${course.url}`
    : course.url || '#';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        boxShadow: darkMode
          ? '0 12px 25px rgba(255,255,255,0.15)'
          : '0 12px 25px rgba(0,0,0,0.25)',
      }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`relative rounded-2xl border transition-all duration-300 ${
        darkMode
          ? 'bg-zinc-800 text-white border-zinc-700'
          : 'bg-white text-black border-zinc-200'
      } m-2 ${!isDashboard && index < 4 ? 'mt-6' : ''}`}
    >
      {/* Bookmark Icon */}
      <button
        onClick={handleBookmarkToggle}
        className="absolute top-3 right-3 text-xl text-yellow-400 hover:scale-110 transition"
        title={bookmarked ? 'Remove Bookmark' : 'Add to Bookmarks'}
      >
        {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
      </button>

      <img
        src={courseImage}
        alt={course.title}
        loading="lazy"
        className="rounded-md h-40 w-full object-cover object-center mb-3"
      />

      <div className="px-4 pb-4">
        <h2 className="text-lg font-bold mb-1 line-clamp-2">{course.title}</h2>

        <div
          className={`flex items-center gap-2 text-sm mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          <FaChalkboardTeacher className="text-blue-500" />
          <span>{instructor}</span>
        </div>

        <p className="text-yellow-600 font-semibold">{price}</p>

        <a
          href={courseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-500 underline text-sm mt-2 inline-block"
        >
          View Course →
        </a>
      </div>
    </motion.div>
  );
};

export default CourseCard;
