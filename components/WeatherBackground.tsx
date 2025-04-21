'use client';

import React, { useMemo } from 'react';
import { useWeatherContext } from '@/context/WeatherContext';
import { cn } from '@/lib/utils';

export default function WeatherBackground() {
  const { weatherData } = useWeatherContext();
  
  const backgroundStyle = useMemo(() => {
    if (!weatherData) {
      return {
        background: 'hsl(var(--background))',
      };
    }
    
    const { current } = weatherData;
    const isDay = current.isDay;
    const code = current.weatherCode;
    
    // Group weather codes
    const isClear = code === 0;
    const isPartlyCloudy = code === 1 || code === 2;
    const isOvercast = code === 3;
    const isFoggy = code === 45 || code === 48;
    const isRainy = [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code);
    const isSnowy = [71, 73, 75, 77, 85, 86].includes(code);
    const isThunderstorm = [95, 96, 99].includes(code);
    
    let gradientStart: string;
    let gradientEnd: string;
    
    if (isDay) {
      if (isClear) {
        gradientStart = 'from-sky-400';
        gradientEnd = 'to-blue-300';
      } else if (isPartlyCloudy) {
        gradientStart = 'from-blue-400';
        gradientEnd = 'to-slate-300';
      } else if (isOvercast) {
        gradientStart = 'from-slate-400';
        gradientEnd = 'to-slate-500';
      } else if (isFoggy) {
        gradientStart = 'from-slate-300';
        gradientEnd = 'to-slate-400';
      } else if (isRainy) {
        gradientStart = 'from-slate-600';
        gradientEnd = 'to-slate-700';
      } else if (isSnowy) {
        gradientStart = 'from-slate-200';
        gradientEnd = 'to-blue-200';
      } else if (isThunderstorm) {
        gradientStart = 'from-slate-700';
        gradientEnd = 'to-slate-900';
      } else {
        gradientStart = 'from-blue-400';
        gradientEnd = 'to-blue-300';
      }
    } else {
      // Night colors
      if (isClear) {
        gradientStart = 'from-slate-900';
        gradientEnd = 'to-blue-950';
      } else if (isPartlyCloudy) {
        gradientStart = 'from-slate-800';
        gradientEnd = 'to-slate-900';
      } else if (isOvercast) {
        gradientStart = 'from-slate-800';
        gradientEnd = 'to-slate-950';
      } else if (isFoggy) {
        gradientStart = 'from-slate-700';
        gradientEnd = 'to-slate-800';
      } else if (isRainy) {
        gradientStart = 'from-slate-900';
        gradientEnd = 'to-slate-950';
      } else if (isSnowy) {
        gradientStart = 'from-slate-800';
        gradientEnd = 'to-slate-900';
      } else if (isThunderstorm) {
        gradientStart = 'from-slate-900';
        gradientEnd = 'to-slate-950';
      } else {
        gradientStart = 'from-slate-900';
        gradientEnd = 'to-blue-950';
      }
    }
    
    return {
      className: cn(
        'bg-gradient-to-b',
        gradientStart,
        gradientEnd,
        'opacity-90'
      )
    };
  }, [weatherData]);
  
  return (
    <div 
      className={cn(
        "fixed inset-0 z-[-1] transition-colors duration-1000",
        backgroundStyle.className
      )} 
    />
  );
}