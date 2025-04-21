'use client';

import { useState, useEffect } from 'react';
import { searchLocations } from '@/lib/api';
import { Location } from '@/types/weather';

interface UseGeolocationReturn {
  currentLocation: Location | null;
  loading: boolean;
  error: Error | null;
  setManualLocation: (location: Location) => void;
}

export default function useGeolocation(): UseGeolocationReturn {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Try to get saved location first
    const savedLocation = localStorage.getItem('weatherapp-location');
    if (savedLocation) {
      try {
        setCurrentLocation(JSON.parse(savedLocation));
        setLoading(false);
        return;
      } catch (e) {
        // If parsing fails, continue with geolocation
        localStorage.removeItem('weatherapp-location');
      }
    }

    // Otherwise, use browser geolocation
    if (!navigator.geolocation) {
      setError(new Error('Geolocation is not supported by your browser'));
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Use reverse geocoding to get location name from coordinates
          const locations = await searchLocations(
            `${position.coords.latitude.toFixed(4)},${position.coords.longitude.toFixed(4)}`
          );
          
          if (locations && locations.length > 0) {
            const location = locations[0];
            setCurrentLocation(location);
            localStorage.setItem('weatherapp-location', JSON.stringify(location));
          } else {
            // If no named location found, create a custom one
            const customLocation: Location = {
              id: 0,
              name: 'Current Location',
              country: '',
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            };
            setCurrentLocation(customLocation);
            localStorage.setItem('weatherapp-location', JSON.stringify(customLocation));
          }
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to get location name'));
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(new Error(`Geolocation error: ${err.message}`));
        setLoading(false);
      }
    );
  }, []);

  const setManualLocation = (location: Location) => {
    setCurrentLocation(location);
    localStorage.setItem('weatherapp-location', JSON.stringify(location));
  };

  return { currentLocation, loading, error, setManualLocation };
}