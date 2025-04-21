import { WeatherData, ForecastDay, HourlyForecast, Location, AirQuality } from '@/types/weather';

// Base URL for the Open-Meteo API
const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1';
const GEO_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

// Fetch weather data from the Open-Meteo API
export async function fetchWeatherData(
  latitude: number,
  longitude: number,
  units: 'metric' | 'imperial' = 'metric'
): Promise<WeatherData> {
  try {
    const tempUnit = units === 'metric' ? 'celsius' : 'fahrenheit';
    const windUnit = units === 'metric' ? 'kmh' : 'mph';
    
    const url = `${OPEN_METEO_BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,surface_pressure,visibility,wind_speed_10m,wind_direction_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    const data = await response.json();
    
    // Transform API data into our app's data structure
    return transformWeatherData(data, units);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

// Search for locations using the geocoding API
export async function searchLocations(query: string): Promise<Location[]> {
  try {
    const url = `${GEO_API_URL}?name=${encodeURIComponent(query)}&count=10&language=en&format=json`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    
    const data = await response.json();
    
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }
    
    // Transform API data into our app's data structure
    return data.results.map((result: any) => ({
      id: result.id,
      name: result.name,
      country: result.country,
      latitude: result.latitude,
      longitude: result.longitude,
      timezone: result.timezone,
      admin1: result.admin1,
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    throw error;
  }
}

// Mock API for air quality - in real app, use a real air quality API
export async function fetchAirQuality(
  latitude: number,
  longitude: number
): Promise<AirQuality> {
  // Simulating an API call with mock data
  return {
    aqi: Math.floor(Math.random() * 150) + 20,
    pm25: Math.floor(Math.random() * 30) + 5,
    pm10: Math.floor(Math.random() * 50) + 10,
    o3: Math.floor(Math.random() * 100) + 20,
    no2: Math.floor(Math.random() * 50) + 10,
    so2: Math.floor(Math.random() * 20) + 5,
    co: Math.floor(Math.random() * 10) + 1,
    category: getRandomAqiCategory(),
  };
}

// Helper functions to transform API data
function transformWeatherData(data: any, units: 'metric' | 'imperial'): WeatherData {
  const current = {
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    precipitation: data.current.precipitation,
    weatherCode: data.current.weather_code,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    isDay: data.current.is_day === 1,
    pressure: data.current.surface_pressure,
    description: getWeatherDescription(data.current.weather_code),
    icon: getWeatherIcon(data.current.weather_code, data.current.is_day === 1),
  };

  const daily: ForecastDay[] = [];
  for (let i = 0; i < data.daily.time.length; i++) {
    daily.push({
      date: new Date(data.daily.time[i]),
      maxTemperature: data.daily.temperature_2m_max[i],
      minTemperature: data.daily.temperature_2m_min[i],
      maxFeelsLike: data.daily.apparent_temperature_max[i],
      minFeelsLike: data.daily.apparent_temperature_min[i],
      weatherCode: data.daily.weather_code[i],
      precipitationSum: data.daily.precipitation_sum[i],
      precipitationProbability: data.daily.precipitation_probability_max[i],
      sunrise: new Date(data.daily.sunrise[i]),
      sunset: new Date(data.daily.sunset[i]),
      uvIndex: data.daily.uv_index_max[i],
      description: getWeatherDescription(data.daily.weather_code[i]),
      icon: getWeatherIcon(data.daily.weather_code[i], true),
    });
  }

  const hourly: HourlyForecast[] = [];
  for (let i = 0; i < 24; i++) {
    const hour = new Date(data.hourly.time[i]);
    const isDay = hour.getHours() >= 6 && hour.getHours() < 18;
    
    hourly.push({
      time: hour,
      temperature: data.hourly.temperature_2m[i],
      feelsLike: data.hourly.apparent_temperature[i],
      humidity: data.hourly.relative_humidity_2m[i],
      precipitationProbability: data.hourly.precipitation_probability[i],
      precipitation: data.hourly.precipitation[i],
      weatherCode: data.hourly.weather_code[i],
      windSpeed: data.hourly.wind_speed_10m[i],
      windDirection: data.hourly.wind_direction_10m[i],
      uvIndex: data.hourly.uv_index[i],
      visibility: data.hourly.visibility[i],
      description: getWeatherDescription(data.hourly.weather_code[i]),
      icon: getWeatherIcon(data.hourly.weather_code[i], isDay),
    });
  }

  return {
    current,
    daily,
    hourly,
    units,
  };
}

function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };

  return descriptions[code] || 'Unknown';
}

function getWeatherIcon(code: number, isDay: boolean): string {
  // Map weather codes to Lucide icon names
  const iconMap: Record<number, { day: string; night: string }> = {
    0: { day: 'sun', night: 'moon' },
    1: { day: 'sun', night: 'moon' },
    2: { day: 'cloud-sun', night: 'cloud-moon' },
    3: { day: 'cloud', night: 'cloud' },
    45: { day: 'cloud-fog', night: 'cloud-fog' },
    48: { day: 'cloud-fog', night: 'cloud-fog' },
    51: { day: 'cloud-drizzle', night: 'cloud-drizzle' },
    53: { day: 'cloud-drizzle', night: 'cloud-drizzle' },
    55: { day: 'cloud-drizzle', night: 'cloud-drizzle' },
    56: { day: 'snowflake', night: 'snowflake' },
    57: { day: 'snowflake', night: 'snowflake' },
    61: { day: 'cloud-rain', night: 'cloud-rain' },
    63: { day: 'cloud-rain', night: 'cloud-rain' },
    65: { day: 'cloud-rain', night: 'cloud-rain' },
    66: { day: 'cloud-snow', night: 'cloud-snow' },
    67: { day: 'cloud-snow', night: 'cloud-snow' },
    71: { day: 'cloud-snow', night: 'cloud-snow' },
    73: { day: 'cloud-snow', night: 'cloud-snow' },
    75: { day: 'cloud-snow', night: 'cloud-snow' },
    77: { day: 'cloud-snow', night: 'cloud-snow' },
    80: { day: 'cloud-rain', night: 'cloud-rain' },
    81: { day: 'cloud-rain', night: 'cloud-rain' },
    82: { day: 'cloud-rain', night: 'cloud-rain' },
    85: { day: 'cloud-snow', night: 'cloud-snow' },
    86: { day: 'cloud-snow', night: 'cloud-snow' },
    95: { day: 'cloud-lightning', night: 'cloud-lightning' },
    96: { day: 'cloud-lightning', night: 'cloud-lightning' },
    99: { day: 'cloud-lightning', night: 'cloud-lightning' },
  };

  const iconInfo = iconMap[code] || { day: 'help-circle', night: 'help-circle' };
  return isDay ? iconInfo.day : iconInfo.night;
}

function getRandomAqiCategory(): string {
  const categories = ['Good', 'Moderate', 'Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous'];
  return categories[Math.floor(Math.random() * 3)]; // Bias toward better air quality
}