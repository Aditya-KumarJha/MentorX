import { useState, useEffect, useCallback } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

export const useFavoritesLogic = () => {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoriteMentors, setFavoriteMentors] = useState([]);

  const fetchFavorites = useCallback(async () => {

    if (!user?.token) {
      setFavoriteIds([]);
      setFavoriteMentors([]);
      return;
    }

    try {
      const res = await axios.get('/api/users/favorites', {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setFavoriteIds(res.data.favoriteIds || []);
      setFavoriteMentors(res.data.favoriteMentors || []);
    } catch (err) {
      console.error('❌ [useFavorites] Failed to fetch favorites:', err);
      setFavoriteIds([]);
      setFavoriteMentors([]);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = async (mentorId) => {
    if (!user?.token) {
      console.error('⛔ Attempted to toggle favorite without token');
      throw new Error('Unauthorized');
    }

    try {
      const res = await axios.post(
        '/api/users/favorites',
        { mentorId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      if (favoriteIds.includes(mentorId)) {
        setFavoriteIds((prev) => prev.filter((id) => id !== mentorId));
        setFavoriteMentors((prev) => prev.filter((mentor) => mentor._id !== mentorId));
      } else {
        setFavoriteIds((prev) => [...prev, mentorId]);

        if (res.data.mentor) {
          setFavoriteMentors((prev) => [...prev, res.data.mentor]);
        } else {
          console.warn('⚠️ No mentor returned in response');
        }
      }

      return res.data.message;
    } catch (err) {
      console.error('❌ [useFavorites] Error toggling favorite:', err);
      throw err;
    }
  };

  return {
    favoriteIds,
    favoriteMentors,
    toggleFavorite,
    fetchFavorites,
  };
};
