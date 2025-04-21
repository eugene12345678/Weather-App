'use client';

import { useState, useEffect } from 'react';
import { Location } from '@/types/weather';

export default function useFavorites() {
  const [favorites, setFavorites] = useState<Location[]>([]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('weatherapp-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Error parsing favorites:', e);
        localStorage.removeItem('weatherapp-favorites');
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('weatherapp-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (location: Location) => {
    // Prevent duplicate favorites
    if (!favorites.some(fav => fav.id === location.id)) {
      setFavorites([...favorites, location]);
    }
  };

  const removeFavorite = (locationId: number) => {
    setFavorites(favorites.filter(location => location.id !== locationId));
  };

  const isFavorite = (locationId: number) => {
    return favorites.some(location => location.id === locationId);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  };
}