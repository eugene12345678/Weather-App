'use client';

import { ThemeProvider } from '@/components/ThemeProvider';
import { WeatherProvider } from '@/context/WeatherContext';
import LocationSearch from '@/components/LocationSearch';
import FavoritesMenu from '@/components/FavoritesMenu';
import SettingsMenu from '@/components/SettingsMenu';
import CurrentWeather from '@/components/weather/CurrentWeather';
import DailyForecast from '@/components/weather/DailyForecast';
import HourlyForecast from '@/components/weather/HourlyForecast';
import AirQuality from '@/components/weather/AirQuality';
import SunriseSunset from '@/components/weather/SunriseSunset';
import WeatherBackground from '@/components/WeatherBackground';
import dynamic from 'next/dynamic';

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <WeatherProvider>
        <WeatherBackground />
        
        <main className="min-h-screen text-foreground mx-auto max-w-screen-xl px-4 py-4 md:py-8 relative z-10 backdrop-blur-sm">
          {/* Header */}
          <header className="flex justify-between items-center mb-6 bg-background/40 backdrop-blur-md rounded-lg p-3">
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold flex items-center gap-2 text-primary-foreground">
                <span className="hidden sm:inline text-white">Weather Forecast</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <LocationSearch />
              <FavoritesMenu />
              <SettingsMenu />
            </div>
          </header>
          
          {/* Main content */}
          <div className="grid grid-cols-1 gap-6">
            <CurrentWeather />
            
            <DailyForecast />
            
            <HourlyForecast />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SunriseSunset />
              <AirQuality />
            </div>
          </div>
          
          {/* Footer */}
          <footer className="mt-12 text-center text-xs text-white/60 bg-background/40 backdrop-blur-md rounded-lg p-3">
          <p>Created in 2025 using Next.js and Tailwind CSS. Data provided by Open-Meteo.</p>
        </footer>
        </main>
      </WeatherProvider>
    </ThemeProvider>
  );
}