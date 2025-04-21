// Current weather information
export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  isDay: boolean;
  pressure: number;
  description: string;
  icon: string;
}

// Daily forecast information
export interface ForecastDay {
  date: Date;
  maxTemperature: number;
  minTemperature: number;
  maxFeelsLike: number;
  minFeelsLike: number;
  weatherCode: number;
  precipitationSum: number;
  precipitationProbability: number;
  sunrise: Date;
  sunset: Date;
  uvIndex: number;
  description: string;
  icon: string;
}

// Hourly forecast information
export interface HourlyForecast {
  time: Date;
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  visibility: number;
  description: string;
  icon: string;
}

// Complete weather data
export interface WeatherData {
  current: CurrentWeather;
  daily: ForecastDay[];
  hourly: HourlyForecast[];
  units: 'metric' | 'imperial';
}

// Location information
export interface Location {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  admin1?: string;
}

// Air quality information
export interface AirQuality {
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
  category: string;
}

// User preferences
export interface UserPreferences {
  units: 'metric' | 'imperial';
  updateInterval: number; // in minutes
  favorites: Location[];
}

// Alert information
export interface WeatherAlert {
  title: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  start: Date;
  end: Date;
}