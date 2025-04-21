'use client';

import React from 'react';
import { useWeatherContext } from '@/context/WeatherContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wind } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export default function AirQuality() {
  const { airQuality } = useWeatherContext();
  
  if (!airQuality) {
    return (
      <Card className="bg-background/20 backdrop-blur-md animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-5 w-32 bg-primary/10 rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="h-8 w-20 bg-primary/10 rounded mb-4 mx-auto"></div>
          <div className="h-4 bg-primary/10 rounded mb-6"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-primary/10 rounded"></div>
            <div className="h-10 bg-primary/10 rounded"></div>
            <div className="h-10 bg-primary/10 rounded"></div>
            <div className="h-10 bg-primary/10 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Helper function to determine color based on AQI
  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return "bg-green-500";
    if (aqi <= 100) return "bg-yellow-500";
    if (aqi <= 150) return "bg-orange-500";
    if (aqi <= 200) return "bg-red-500";
    if (aqi <= 300) return "bg-purple-500";
    return "bg-rose-900";
  };
  
  // Render advice based on AQI category
  const renderAdvice = () => {
    switch (airQuality.category) {
      case "Good":
        return "Air quality is satisfactory, and air pollution poses little or no risk.";
      case "Moderate":
        return "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.";
      case "Unhealthy for Sensitive Groups":
        return "Members of sensitive groups may experience health effects. The general public is less likely to be affected.";
      case "Unhealthy":
        return "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.";
      case "Very Unhealthy":
        return "Health alert: The risk of health effects is increased for everyone.";
      case "Hazardous":
        return "Health warning of emergency conditions: everyone is more likely to be affected.";
      default:
        return "No air quality data available.";
    }
  };
  
  // Calculate progress percentage for AQI (0-500 scale)
  const aqiProgress = Math.min(100, (airQuality.aqi / 300) * 100);
  
  return (
    <Card className="bg-background/20 backdrop-blur-md border border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wind className="h-4 w-4" /> Air Quality
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className="text-3xl font-bold">{airQuality.aqi}</div>
          <div className={cn(
            "text-sm font-medium py-1 px-2 rounded inline-block my-2",
            getAqiColor(airQuality.aqi).replace("bg-", "text-").replace("-500", "-600")
          )}>
            {airQuality.category}
          </div>
          <Progress 
            value={aqiProgress} 
            className="h-2 mb-4"
            indicatorClassName={cn(getAqiColor(airQuality.aqi))} 
          />
          <p className="text-sm text-muted-foreground mt-1">{renderAdvice()}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-background/30 backdrop-blur-sm p-2 rounded-lg text-center">
            <div className="text-xs text-muted-foreground mb-1">PM2.5</div>
            <div className="font-semibold">{airQuality.pm25} µg/m³</div>
          </div>
          <div className="bg-background/30 backdrop-blur-sm p-2 rounded-lg text-center">
            <div className="text-xs text-muted-foreground mb-1">PM10</div>
            <div className="font-semibold">{airQuality.pm10} µg/m³</div>
          </div>
          <div className="bg-background/30 backdrop-blur-sm p-2 rounded-lg text-center">
            <div className="text-xs text-muted-foreground mb-1">O₃</div>
            <div className="font-semibold">{airQuality.o3} µg/m³</div>
          </div>
          <div className="bg-background/30 backdrop-blur-sm p-2 rounded-lg text-center">
            <div className="text-xs text-muted-foreground mb-1">NO₂</div>
            <div className="font-semibold">{airQuality.no2} µg/m³</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}