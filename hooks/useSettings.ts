'use client';

import { useState, useEffect } from 'react';
import { UserPreferences } from '@/types/weather';

const DEFAULT_PREFERENCES: UserPreferences = {
  units: 'metric',
  updateInterval: 30, // 30 minutes
  favorites: [],
};

export default function useSettings() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const savedPreferences = localStorage.getItem('weatherapp-preferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences({
          ...DEFAULT_PREFERENCES,
          ...parsed,
        });
      } catch (e) {
        console.error('Error parsing preferences:', e);
        localStorage.removeItem('weatherapp-preferences');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('weatherapp-preferences', JSON.stringify(preferences));
  }, [preferences]);

  const updateUnits = (units: 'metric' | 'imperial') => {
    setPreferences(prev => ({ ...prev, units }));
  };

  const updateRefreshInterval = (minutes: number) => {
    setPreferences(prev => ({ ...prev, updateInterval: minutes }));
  };

  return {
    preferences,
    updateUnits,
    updateRefreshInterval,
  };
}