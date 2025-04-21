'use client';

import React from 'react';
import { useWeatherContext } from '@/context/WeatherContext';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Temperature, Probability } from '@/components/ui/unit-display';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '@/lib/utils';

// Dynamically import the weather icons to avoid server/client hydration mismatch
const WeatherIcon = dynamic(() => import('@/components/weather/WeatherIcon'), {
  ssr: false,
  loading: () => <div className="h-8 w-8 animate-pulse bg-primary/10 rounded-full" />
});

export default function HourlyForecast() {
  const { weatherData, units } = useWeatherContext();
  
  if (!weatherData) {
    return (
      <div className="my-4">
        <div className="h-6 w-40 bg-primary/10 rounded animate-pulse mb-4"></div>
        <Card className="bg-background/20 backdrop-blur-md p-4 animate-pulse h-80">
          <div className="h-8 w-40 bg-primary/10 rounded mb-4"></div>
          <div className="h-[200px] bg-primary/10 rounded"></div>
        </Card>
      </div>
    );
  }
  
  // Prepare data for charts
  const hourlyData = weatherData.hourly.map((hour) => {
    return {
      time: format(new Date(hour.time), 'HH:mm'),
      temperature: hour.temperature,
      feelsLike: hour.feelsLike,
      precipitation: hour.precipitation,
      precipitationProbability: hour.precipitationProbability,
      windSpeed: hour.windSpeed,
      weatherCode: hour.weatherCode,
      isDay: new Date(hour.time).getHours() >= 6 && new Date(hour.time).getHours() < 20,
      hour: new Date(hour.time),
    };
  });
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-border shadow-md">
          <p className="font-semibold">{label}</p>
          <div className="flex items-center gap-2 mt-1">
            <WeatherIcon 
              weatherCode={data.weatherCode} 
              isDay={data.isDay} 
              size={16} 
            />
            <p className="text-sm">
              <Temperature value={data.temperature} units={units} />
            </p>
          </div>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-xs mt-1" style={{ color: entry.stroke }}>
              {entry.name}: {entry.value}
              {entry.name === 'Precip. Chance' ? '%' : ''}
              {entry.name === 'Precipitation' ? ' mm' : ''}
              {entry.name === 'Wind' ? (units === 'metric' ? ' km/h' : ' mph') : ''}
            </p>
          ))}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="my-4">
      <h2 className="text-lg font-semibold mb-3 text-white">Hourly Forecast</h2>
      
      <Tabs defaultValue="temperature">
        <TabsList className="mb-4 bg-background/20 backdrop-blur-md">
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="precipitation">Precipitation</TabsTrigger>
          <TabsTrigger value="wind">Wind</TabsTrigger>
          <TabsTrigger value="hourly">Hourly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="temperature">
          <Card className={cn(
            "bg-background/20 backdrop-blur-md border border-border/50 p-4",
            "overflow-hidden"
          )}>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={hourlyData}
                  margin={{ top: 10, right: 10, left: 5, bottom: 30 }}
                >
                  <defs>
                    <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="feelsLikeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.2} />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }} 
                    stroke="hsl(var(--muted-foreground))" 
                    tickMargin={10}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }} 
                    stroke="hsl(var(--muted-foreground))" 
                    unit={units === 'metric' ? '°C' : '°F'} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="temperature" 
                    name="Temperature" 
                    stroke="hsl(var(--chart-1))" 
                    fillOpacity={1}
                    fill="url(#temperatureGradient)"
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="feelsLike" 
                    name="Feels Like" 
                    stroke="hsl(var(--chart-2))" 
                    fillOpacity={1}
                    fill="url(#feelsLikeGradient)"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="precipitation">
          <Card className={cn(
            "bg-background/20 backdrop-blur-md border border-border/50 p-4",
            "overflow-hidden"
          )}>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={hourlyData}
                  margin={{ top: 10, right: 10, left: 5, bottom: 30 }}
                >
                  <defs>
                    <linearGradient id="precipGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.2} />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }} 
                    stroke="hsl(var(--muted-foreground))" 
                    tickMargin={10}
                  />
                  <YAxis 
                    yAxisId="left"
                    tick={{ fontSize: 12 }} 
                    stroke="hsl(var(--muted-foreground))" 
                    domain={[0, 100]}
                    unit="%" 
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }} 
                    stroke="hsl(var(--muted-foreground))" 
                    unit=" mm" 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="precipitationProbability" 
                    name="Precip. Chance" 
                    stroke="hsl(var(--chart-3))" 
                    fill="none"
                    strokeWidth={2}
                  />
                  <Area 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="precipitation" 
                    name="Precipitation" 
                    stroke="hsl(var(--chart-2))" 
                    fill="url(#precipGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="wind">
          <Card className={cn(
            "bg-background/20 backdrop-blur-md border border-border/50 p-4",
            "overflow-hidden"
          )}>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={hourlyData}
                  margin={{ top: 10, right: 10, left: 5, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.2} />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }} 
                    stroke="hsl(var(--muted-foreground))" 
                    tickMargin={10}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }} 
                    stroke="hsl(var(--muted-foreground))" 
                    unit={units === 'metric' ? ' km/h' : ' mph'} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="windSpeed" 
                    name="Wind" 
                    stroke="hsl(var(--chart-4))" 
                    strokeWidth={2}
                    dot={{ stroke: 'hsl(var(--chart-4))', strokeWidth: 1, r: 3, fill: 'hsl(var(--background))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="hourly">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-4 py-2">
              {hourlyData.map((hour, index) => (
                <Card 
                  key={index} 
                  className="min-w-[80px] bg-background/20 backdrop-blur-md border border-border/50 transition-all hover:bg-background/30"
                >
                  <CardContent className="p-3 flex flex-col items-center">
                    <p className="text-xs font-medium text-gray-200">{hour.time}</p>
                    
                    <WeatherIcon 
                      weatherCode={hour.weatherCode} 
                      isDay={hour.isDay} 
                      size={28}
                      className="my-2 text-gray-200" 
                    />
                    
                    <p className="text-sm font-semibold text-gray-200">
                      <Temperature value={hour.temperature} units={units} showUnit={false} />°
                    </p>
                    
                    <div className="mt-2 text-xs text-muted-foreground">
                      <Probability value={hour.precipitationProbability} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}