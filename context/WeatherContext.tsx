'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import useGeolocation from '@/hooks/useGeolocation';
import useWeather from '@/hooks/useWeather';
import useFavorites from '@/hooks/useFavorites';
import useSettings from '@/hooks/useSettings';
import { Location, WeatherData, AirQuality } from '@/types/weather';

interface WeatherContextType {
  location: Location | null;
  setLocation: (location: Location) => void;
  weatherData: WeatherData | null;
  airQuality: AirQuality | null;
  loading: boolean;
  error: Error | null;
  refreshWeather: () => Promise<void>;
  favorites: Location[];
  addFavorite: (location: Location) => void;
  removeFavorite: (locationId: number) => void;
  isFavorite: (locationId: number) => boolean;
  units: 'metric' | 'imperial';
  setUnits: (units: 'metric' | 'imperial') => void;
  updateInterval: number;
  setUpdateInterval: (minutes: number) => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const { currentLocation, loading: locationLoading, error: locationError, setManualLocation } = useGeolocation();
  const [location, setLocation] = useState<Location | null>(null);
  const { preferences, updateUnits, updateRefreshInterval } = useSettings();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  
  // Set location from geolocation once available
  React.useEffect(() => {
    if (currentLocation) {
      setLocation(currentLocation);
    }
  }, [currentLocation]);

  // Get weather data based on current location and preferences
  const { 
    weatherData, 
    airQuality, 
    loading: weatherLoading, 
    error: weatherError, 
    refreshWeather 
  } = useWeather(
    location,
    preferences.units,
    preferences.updateInterval
  );

  // Load theme from localStorage
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('weatherapp-theme');
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme as 'light' | 'dark' | 'system');
    }
  }, []);

  // Save theme to localStorage
  React.useEffect(() => {
    localStorage.setItem('weatherapp-theme', theme);
  }, [theme]);

  const loading = locationLoading || weatherLoading;
  const error = locationError || weatherError;

  return (
    <WeatherContext.Provider
      value={{
        location,
        setLocation: (loc) => {
          setLocation(loc);
          setManualLocation(loc);
        },
        weatherData,
        airQuality,
        loading,
        error,
        refreshWeather,
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        units: preferences.units,
        setUnits: updateUnits,
        updateInterval: preferences.updateInterval,
        setUpdateInterval: updateRefreshInterval,
        theme,
        setTheme,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeatherContext must be used within a WeatherProvider');
  }
  return context;
}