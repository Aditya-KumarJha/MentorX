import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext'; 
import 'remixicon/fonts/remixicon.css';

const MentorCard = ({ mentor, index, isFavorite, onToggleFavorite, handleImageError }) => {
  const { darkMode } = useTheme(); 

  return (
    <motion.div
      key={mentor._id || index}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.05,
        boxShadow: darkMode
          ? '0 4px 30px rgba(255,255,255,0.05)'
          : '0 4px 30px rgba(0,0,0,0.08)',
      }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      className={`relative rounded-xl overflow-hidden border shadow-lg ${
        darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'
      } transition-all duration-300`}
    >
      <button
        onClick={() => onToggleFavorite(mentor._id || index)}
        className="absolute top-2 right-2 text-xl z-10"
      >
        <i
          className={`ri-heart-${isFavorite ? 'fill text-rose-500' : 'line text-gray-400'} transition`}
        />
      </button>
      <Link to={`/mentor/${encodeURIComponent(mentor.fullName)}`}>
        <img
          src={mentor.profilePic || '/noimage.jpg'}
          onError={handleImageError}
          alt={mentor.fullName}
          className="h-[25vh] w-full object-cover"
        />
        <div className="p-2">
          <h3 className="text-[0.9rem] font-semibold truncate">{mentor.fullName}</h3>
          <p className={`text-[0.75rem] truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {mentor.headline}
          </p>
          <p className={`text-[0.65rem] mt-1 truncate ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            {mentor.expertiseTags?.join(', ')}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default MentorCard;
