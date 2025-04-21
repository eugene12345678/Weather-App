'use client';

import React from 'react';
import { useWeatherContext } from '@/context/WeatherContext';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Temperature, Probability } from '@/components/ui/unit-display';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';

// Dynamically import the weather icons to avoid server/client hydration mismatch
const WeatherIcon = dynamic(() => import('@/components/weather/WeatherIcon'), {
  ssr: false,
  loading: () => <div className="h-8 w-8 animate-pulse bg-primary/10 rounded-full" />
});

export default function DailyForecast() {
  const { weatherData, units } = useWeatherContext();
  
  if (!weatherData) {
    return (
      <div className="my-4">
        <div className="h-6 w-32 bg-primary/10 rounded animate-pulse mb-4"></div>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4 py-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Card key={i} className="animate-pulse min-w-[140px] bg-background/20 backdrop-blur-md">
                <CardContent className="p-4">
                  <div className="h-5 w-20 bg-primary/10 rounded mb-3"></div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full mx-auto mb-3"></div>
                  <div className="flex justify-between">
                    <div className="h-6 w-10 bg-primary/10 rounded"></div>
                    <div className="h-6 w-10 bg-primary/10 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    );
  }
  
  return (
    <div className="my-4">
      <h2 className="text-lg font-semibold mb-3 text-white">7-Day Forecast</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 py-2">
          {weatherData.daily.map((day, index) => {
            const isToday = index === 0;
            const date = new Date(day.date);
            const dayName = isToday ? 'Today' : format(date, 'EEE');
            
            return (
              <Card 
                key={index} 
                className="min-w-[140px] bg-background/20 backdrop-blur-md border border-border/50 transition-all hover:bg-background/30"
              >
                <CardContent className="p-4">
                  <div className="text-center mb-2">
                    <p className="font-medium text-gray-200">{dayName}</p>
                    <p className="text-xs text-muted-foreground">{format(date, 'd MMM')}</p>
                  </div>
                  
                  <div className="flex flex-col items-center my-3">
                    <WeatherIcon 
                      weatherCode={day.weatherCode} 
                      isDay={true} 
                      size={32}
                      className="mb-1 text-gray-200" 
                    />
                    <p className="text-xs text-center text-gray-200/80">{day.description}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-sm font-semibold text-gray-200">
                      <Temperature value={day.maxTemperature} units={units} showUnit={false} />°
                    </div>
                    <div className="text-sm text-gray-200">
                      <Temperature value={day.minTemperature} units={units} showUnit={false} />°
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-2 border-t border-border/30 text-xs flex justify-between">
                    <span className="text-muted-foreground">Rain:</span>
                    <span className="text-gray-200 font-medium">
                      <Probability value={day.precipitationProbability} />
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}