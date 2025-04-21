'use client';

import React from 'react';
import { 
  Cloud, 
  CloudDrizzle, 
  CloudFog, 
  CloudLightning, 
  CloudRain, 
  CloudSnow, 
  Sun, 
  Moon, 
  CloudSun,
  CloudMoon,
  Snowflake
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherIconProps {
  weatherCode: number;
  isDay: boolean;
  className?: string;
  size?: number;
}

export default function WeatherIcon({ 
  weatherCode, 
  isDay, 
  className, 
  size = 24 
}: WeatherIconProps) {
  const getIcon = () => {
    // Map weather codes to appropriate icons
    switch (weatherCode) {
      case 0: // Clear sky
        return isDay ? <Sun size={size} /> : <Moon size={size} />;
      case 1: // Mainly clear
        return isDay ? <Sun size={size} /> : <Moon size={size} />;
      case 2: // Partly cloudy
        return isDay ? <CloudSun size={size} /> : <CloudMoon size={size} />;
      case 3: // Overcast
        return <Cloud size={size} />;
      case 45: // Fog
      case 48: // Depositing rime fog
        return <CloudFog size={size} />;
      case 51: // Light drizzle
      case 53: // Moderate drizzle
      case 55: // Dense drizzle
        return <CloudDrizzle size={size} />;
      case 56: // Light freezing drizzle
      case 57: // Dense freezing drizzle
        return <CloudSnow size={size} />;
      case 61: // Slight rain
      case 63: // Moderate rain
      case 65: // Heavy rain
      case 80: // Slight rain showers
      case 81: // Moderate rain showers
      case 82: // Violent rain showers
        return <CloudRain size={size} />;
      case 66: // Light freezing rain
      case 67: // Heavy freezing rain
        return <CloudSnow size={size} />;
      case 71: // Slight snow fall
      case 73: // Moderate snow fall
      case 75: // Heavy snow fall
      case 77: // Snow grains
      case 85: // Slight snow showers
      case 86: // Heavy snow showers
        return <Snowflake size={size} />;
      case 95: // Thunderstorm
      case 96: // Thunderstorm with slight hail
      case 99: // Thunderstorm with heavy hail
        return <CloudLightning size={size} />;
      default:
        return <Cloud size={size} />;
    }
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {getIcon()}
    </div>
  );
}