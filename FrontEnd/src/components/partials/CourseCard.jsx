import React from 'react';
import { motion } from 'framer-motion';
import { FaChalkboardTeacher } from 'react-icons/fa';

const CourseCard = ({ course, index, darkMode }) => {
  if (!course || !course.title) return null;

  const getBestImage = (images = []) => {
    for (let i = 0; i < 7; i++) {
      if (images[6]) return images[6];
    }
    return 'https://via.placeholder.com/750x422?text=No+Image';
  };

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
      className={`rounded-2xl border transition-all duration-300 will-change-transform ${
        darkMode
          ? 'bg-zinc-800 text-white border-zinc-700 shadow-[0_8px_20px_rgba(255,255,255,0.1)]'
          : 'bg-white text-black border-zinc-200 shadow-[0_8px_20px_rgba(0,0,0,0.1)]'
      } m-2 ${index < 4 ? 'mt-6' : ''}`}
      style={{ transformOrigin: 'center', overflow: 'visible' }}
    >
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
