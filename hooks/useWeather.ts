'use client';

import { useState, useEffect } from 'react';
import { fetchWeatherData, fetchAirQuality } from '@/lib/api';
import { WeatherData, Location, AirQuality } from '@/types/weather';

interface UseWeatherReturn {
  weatherData: WeatherData | null;
  airQuality: AirQuality | null;
  loading: boolean;
  error: Error | null;
  refreshWeather: () => Promise<void>;
}

export default function useWeather(
  location: Location | null,
  units: 'metric' | 'imperial',
  refreshInterval = 0 // in minutes, 0 means no auto-refresh
): UseWeatherReturn {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQuality | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!location) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [weather, airQuality] = await Promise.all([
        fetchWeatherData(location.latitude, location.longitude, units),
        fetchAirQuality(location.latitude, location.longitude)
      ]);
      
      setWeatherData(weather);
      setAirQuality(airQuality);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when location changes
  useEffect(() => {
    if (location) {
      fetchData();
    }
  }, [location, units]);

  // Set up automatic refresh if interval is greater than 0
  useEffect(() => {
    if (refreshInterval > 0 && location) {
      const intervalId = setInterval(fetchData, refreshInterval * 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [refreshInterval, location, units]);

  const refreshWeather = async () => {
    await fetchData();
  };

  return { weatherData, airQuality, loading, error, refreshWeather };
}