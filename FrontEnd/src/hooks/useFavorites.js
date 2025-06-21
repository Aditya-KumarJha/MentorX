import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useFavoritesLogic = () => {
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [favoriteMentors, setFavoriteMentors] = useState([]);
  
    const fetchFavorites = useCallback(async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setFavoriteIds([]);
        setFavoriteMentors([]);
        return;
      }
  
      try {
        const res = await axios.get('http://localhost:5050/api/users/favorites', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setFavoriteIds(res.data.favoriteIds || []);
        setFavoriteMentors(res.data.favoriteMentors || []);
      } catch (err) {
        console.error('❌ Failed to fetch favorites:', err);
        setFavoriteIds([]);
        setFavoriteMentors([]);
      }
    }, []);
  
    useEffect(() => {
      fetchFavorites();
    }, [fetchFavorites]);
  
    const toggleFavorite = async (mentorId) => {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      try {
        const res = await axios.post(
          'http://localhost:5050/api/users/favorites',
          { mentorId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        if (favoriteIds.includes(mentorId)) {
          setFavoriteIds((prev) => prev.filter((id) => id !== mentorId));
          setFavoriteMentors((prev) => prev.filter((mentor) => mentor._id !== mentorId));
        } else {
          setFavoriteIds((prev) => [...prev, mentorId]);
          if (res.data.mentor) {
            setFavoriteMentors((prev) => [...prev, res.data.mentor]);
          }
        }
  
        return res.data.message;
      } catch (err) {
        console.error('❌ Toggle favorite error:', err);
        throw err;
      }
    };
  
    return { favoriteIds, favoriteMentors, toggleFavorite, fetchFavorites };
  };
  