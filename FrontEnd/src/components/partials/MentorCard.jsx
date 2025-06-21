import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavouritesContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'remixicon/fonts/remixicon.css';

const MentorCard = ({ mentor, index }) => {
  const { darkMode } = useTheme();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [imgSrc, setImgSrc] = useState(mentor.profilePic || '/noimage.jpg');
  const [localFavorite, setLocalFavorite] = useState(false);

  // Safely check if mentor is in favorites
  useEffect(() => {
    if (Array.isArray(favoriteIds)) {
      setLocalFavorite(favoriteIds.includes(mentor._id));
    }
  }, [favoriteIds, mentor._id]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const msg = await toggleFavorite(mentor._id);
      const isNowFav = Array.isArray(favoriteIds) && !favoriteIds.includes(mentor._id);
      setLocalFavorite(isNowFav);

      toast(isNowFav ? '✅ Added to Favorites' : '❌ Removed from Favorites', {
        type: isNowFav ? 'success' : 'error',
        position: 'top-right',
        autoClose: 2500,
        theme: darkMode ? 'dark' : 'light',
      });
    } catch (err) {
      console.error('❌ Error toggling favorite:', err);
      toast.error('Something went wrong.', {
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
