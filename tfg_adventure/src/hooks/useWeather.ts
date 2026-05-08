import { useState, useEffect } from 'react';

interface WeatherData {
    temp: number;
    feels_like: number;
    description: string;
    icon: string;
    humidity: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number;
    pressure: number;
    visibility: number;
    cloudiness: number;
    city: string;
}

interface UseWeatherResult {
    weather: WeatherData | null;
    loading: boolean;
    error: string | null;
}

const WEATHER_API_KEY = 'cd68960265d272422570f363eaccffd1';

export function useWeather(lat: number | null, lon: number | null): UseWeatherResult {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (lat === null || lon === null) return;

        setLoading(true);
        setError(null);

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=es`;

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('No se pudo obtener el tiempo');
                return res.json();
            })
            .then(data => {
                setWeather({
                    temp: Math.round(data.main.temp),
                    feels_like: Math.round(data.main.feels_like),
                    description: data.weather[0].description,
                    icon: data.weather[0].icon,
                    humidity: data.main.humidity,
                    wind_speed: Math.round(data.wind.speed * 10) / 10,
                    wind_deg: data.wind.deg || 0,
                    wind_gust: Math.round((data.wind.gust || 0) * 10) / 10,
                    pressure: data.main.pressure,
                    visibility: Math.round(data.visibility / 1000),
                    cloudiness: data.clouds.all,
                    city: data.name,
                });
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [lat, lon]);

    return { weather, loading, error };
}
