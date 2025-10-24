'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { FavoritesState } from '@/types/match';

const FavoritesContext = createContext<FavoritesState | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: React.ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favoriteMatches, setFavoriteMatches] = useState<Set<string>>(
    new Set()
  );

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('mozzart_favorites');
    if (savedFavorites) {
      try {
        const favoritesArray = JSON.parse(savedFavorites);
        setFavoriteMatches(new Set(favoritesArray));
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    const favoritesArray = Array.from(favoriteMatches);
    localStorage.setItem('mozzart_favorites', JSON.stringify(favoritesArray));
  }, [favoriteMatches]);

  const addFavorite = useCallback((matchId: string) => {
    setFavoriteMatches((prev) => new Set([...prev, matchId]));
  }, []);

  const removeFavorite = useCallback((matchId: string) => {
    setFavoriteMatches((prev) => {
      const newSet = new Set(prev);
      newSet.delete(matchId);
      return newSet;
    });
  }, []);

  const isFavorite = useCallback(
    (matchId: string) => {
      return favoriteMatches.has(matchId);
    },
    [favoriteMatches]
  );

  const toggleFavorite = useCallback(
    (matchId: string) => {
      if (favoriteMatches.has(matchId)) {
        removeFavorite(matchId);
      } else {
        addFavorite(matchId);
      }
    },
    [favoriteMatches, addFavorite, removeFavorite]
  );

  const value: FavoritesState = {
    favoriteMatches,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
