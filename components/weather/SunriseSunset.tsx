'use client';

import React from 'react';
import { useWeatherContext } from '@/context/WeatherContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SunIcon, MoonIcon, SunriseIcon, SunsetIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function SunriseSunset() {
  const { weatherData } = useWeatherContext();
  
  if (!weatherData || !weatherData.daily[0]) {
    return (
      <Card className="bg-background/20 backdrop-blur-md animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-5 w-32 bg-primary/10 rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <div className="h-16 w-24 bg-primary/10 rounded"></div>
            <div className="h-16 w-24 bg-primary/10 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const today = weatherData.daily[0];
  const sunrise = new Date(today.sunrise);
  const sunset = new Date(today.sunset);
  
  // Calculate day length
  const dayLengthMs = sunset.getTime() - sunrise.getTime();
  const dayLengthHours = Math.floor(dayLengthMs / (1000 * 60 * 60));
  const dayLengthMinutes = Math.floor((dayLengthMs % (1000 * 60 * 60)) / (1000 * 60));
  
  // Calculate current position of sun (0-100%)
  const now = new Date();
  let sunPosition = 0;
  let isDay = false;
  
  if (now >= sunrise && now <= sunset) {
    isDay = true;
    sunPosition = ((now.getTime() - sunrise.getTime()) / dayLengthMs) * 100;
  } else if (now > sunset) {
    // After sunset but before midnight
    const nightLength = new Date(new Date().setHours(23, 59, 59, 999)).getTime() - sunset.getTime() + 
                        sunrise.getTime() - new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    sunPosition = ((now.getTime() - sunset.getTime()) / nightLength) * 100;
  } else {
    // After midnight but before sunrise
    const midnightToSunrise = sunrise.getTime() - new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    const sunsetToMidnight = new Date(new Date(sunset).setHours(23, 59, 59, 999)).getTime() - sunset.getTime();
    const nightLength = midnightToSunrise + sunsetToMidnight;
    sunPosition = ((now.getTime() - new Date(new Date().setHours(0, 0, 0, 0)).getTime()) / midnightToSunrise) * 100;
  }
  
  return (
    <Card className="bg-background/20 backdrop-blur-md border border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {isDay ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          {isDay ? 'Daylight' : 'Night Time'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-2 bg-background/30 rounded-full mb-6 mt-2">
          <div 
            className={cn(
              "absolute h-4 w-4 rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 z-10",
              isDay ? "bg-yellow-400" : "bg-blue-900"
            )}
            style={{ left: `${sunPosition}%` }}
          ></div>
          <div 
            className="absolute h-full rounded-l-full bg-yellow-400/50"
            style={{ width: `${isDay ? sunPosition : 0}%`, left: 0 }}
          ></div>
        </div>

        <div className="flex justify-between items-start">
          <div className="text-center">
            <div className="flex flex-col items-center">
              <SunriseIcon className="h-6 w-6 mb-1 text-yellow-400" />
              <div className="font-medium">{format(sunrise, 'h:mm a')}</div>
              <div className="text-xs text-muted-foreground">Sunrise</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-background/30 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
              {dayLengthHours}h {dayLengthMinutes}m
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex flex-col items-center">
              <SunsetIcon className="h-6 w-6 mb-1 text-orange-400" />
              <div className="font-medium">{format(sunset, 'h:mm a')}</div>
              <div className="text-xs text-muted-foreground">Sunset</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}