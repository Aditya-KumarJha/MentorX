import React, { createContext, useContext } from 'react';
import { useFavoritesLogic } from '../hooks/useFavorites';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { favoriteIds, toggleFavorite, fetchFavorites } = useFavoritesLogic();

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, fetchFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
