import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'remixicon/fonts/remixicon.css';

const MentorCard = ({ mentor, index, isFavorite, onToggleFavorite }) => {
  const { darkMode } = useTheme();
  const [imgSrc, setImgSrc] = useState(mentor.profilePic || '/noimage.jpg');
  const [localFavorite, setLocalFavorite] = useState(isFavorite);

  useEffect(() => {
    setLocalFavorite(isFavorite);
  }, [isFavorite]);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const updated = !localFavorite;
    setLocalFavorite(updated);
    onToggleFavorite(mentor._id || index);

    if (updated) {
      toast.success('✅ Added to Favorites', {
        position: 'top-right',
        autoClose: 2500,
        theme: darkMode ? 'dark' : 'light',
      });
    } else {
      toast.error('❌ Removed from Favorites', {
        position: 'top-right',
        autoClose: 2500,
        theme: darkMode ? 'dark' : 'light',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.05,
        boxShadow: darkMode
          ? '0 8px 30px rgba(255,255,255,0.2)'
          : '0 8px 30px rgba(0,0,0,0.25)',
      }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      className={`relative rounded-xl overflow-hidden border w-[90%] mx-auto mt-2 ${
        darkMode
          ? 'bg-zinc-800 border-zinc-700 shadow-[0_12px_25px_rgba(255,255,255,0.12)]'
          : 'bg-white border-zinc-200 shadow-[0_12px_25px_rgba(0,0,0,0.2)]'
      } transition-all duration-300`}
    >
      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-2 right-2 text-xl z-20"
        title={localFavorite ? 'Unfavorite' : 'Add to Favorites'}
      >
        <i
          className={`ri-heart-${
            localFavorite ? 'fill text-rose-500' : 'line text-gray-400'
          } transition`}
        />
      </button>

      <Link to={`/mentor/${encodeURIComponent(mentor.fullName)}`}>
        <img
          src={imgSrc}
          onError={() => setImgSrc('/noimage.jpg')}
          alt={mentor.fullName}
          className="h-[25vh] w-full object-cover"
        />
        <div className="p-2">
          <h3 className="text-[0.9rem] font-semibold truncate">{mentor.fullName}</h3>
          <p
            className={`text-[0.75rem] truncate ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {mentor.headline}
          </p>
          <p
            className={`text-[0.65rem] mt-1 truncate ${
              darkMode ? 'text-gray-300' : 'text-gray-500'
            }`}
          >
            {mentor.expertiseTags?.join(', ')}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default MentorCard;
