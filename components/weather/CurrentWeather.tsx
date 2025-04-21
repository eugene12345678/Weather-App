'use client';

import React from 'react';
import { useWeatherContext } from '@/context/WeatherContext';
import { Temperature, Wind, Precipitation } from '@/components/ui/unit-display';
import { MapPin, ThermometerIcon, DropletIcon, WindIcon } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the weather icons to avoid server/client hydration mismatch
const WeatherIcon = dynamic(() => import('@/components/weather/WeatherIcon'), {
  ssr: false,
  loading: () => <div className="h-20 w-20 animate-pulse bg-primary/10 rounded-full" />
});

export default function CurrentWeather() {
  const { weatherData, units, location } = useWeatherContext();
  
  if (!weatherData || !location) {
    return (
      <div className="animate-pulse p-6 rounded-xl bg-background/20 backdrop-blur-md">
        <div className="h-8 w-48 bg-primary/10 rounded mb-4"></div>
        <div className="flex items-center justify-between">
          <div className="h-24 w-24 bg-primary/10 rounded-full"></div>
          <div className="h-16 w-32 bg-primary/10 rounded"></div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="h-12 bg-primary/10 rounded"></div>
          <div className="h-12 bg-primary/10 rounded"></div>
          <div className="h-12 bg-primary/10 rounded"></div>
        </div>
      </div>
    );
  }
  
  const { current } = weatherData;
  
  return (
    <div className="p-6 rounded-xl bg-background/20 backdrop-blur-md border border-border/50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-4">
            <WeatherIcon 
              weatherCode={current.weatherCode} 
              isDay={current.isDay} 
              className="w-20 h-20 text-white" 
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                <Temperature value={current.temperature} units={units} />
              </h1>
              <p className="text-lg text-gray/90 mt-1">
                Feels like <Temperature value={current.feelsLike} units={units} />
              </p>
              <p className="text-base font-medium mt-2 text-white">{current.description}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 md:mt-0">
          <div className="flex flex-col items-center justify-center bg-background/30 backdrop-blur-sm rounded-lg p-2 text-white">
            <ThermometerIcon className="h-5 w-5 mb-1" />
            <p className="text-xs uppercase tracking-wide">Humidity</p>
            <p className="text-lg font-semibold">{current.humidity}%</p>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-background/30 backdrop-blur-sm rounded-lg p-2 text-white">
            <WindIcon className="h-5 w-5 mb-1" />
            <p className="text-xs uppercase tracking-wide">Wind</p>
            <p className="text-lg font-semibold">
              <Wind speed={current.windSpeed} units={units} />
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-background/30 backdrop-blur-sm rounded-lg p-2 text-white">
            <DropletIcon className="h-5 w-5 mb-1" />
            <p className="text-xs uppercase tracking-wide">Rain</p>
            <p className="text-lg font-semibold">
              <Precipitation value={current.precipitation} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}