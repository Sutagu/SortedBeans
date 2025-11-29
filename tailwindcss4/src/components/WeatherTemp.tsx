import React, { useEffect, useState } from 'react';
import weatherIcons from '../assets/images/weather/weatherIcons';
const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

const WeatherTemp: React.FC = () => {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [iconPath, setIconPath] = useState<string>(weatherIcons['clear.png']);
  const [description, setDescription] = useState<string>('loading');
  type WeatherData = {
    weather: {
      description: string;
      icon: string;
      main: string;
      id: number;
    }[];
    main: {
      temp: number;
    };
  };

  const fetchTemp = (lat: number, lon: number) => {
    const wurl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    fetch(wurl)
      .then((res) => res.json())
      .then((data) => {
        if (data.main && typeof data.main.temp === 'number') {
          setTemperature(data.main.temp);
        }
        const weather = (data: WeatherData) => {
          const name = (data.weather[0]?.main ?? 'clear').toLowerCase();
          setIconPath(
            weatherIcons[`./${name}.png`] || weatherIcons['./clear.png']
          );
          setDescription(name);
        };
        weather(data);
      })
      .catch((err) => console.error('Failed to fetch temperature', err));
  };

  useEffect(() => {
    let usedFallback = false;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchTemp(lat, lon); // fetch right after getting location
          console.log('location set temperature set');
        },
        (err) => {
          console.error(err);
        }
      );
    } else {
      usedFallback = true;
      fetchTemp(-34.9285, 138.6007);
      console.error('Geo location not supported');
    }
    const interval = setInterval(() => {
      if (usedFallback) {
        fetchTemp(-34.9285, 138.6007);
      } else {
        navigator.geolocation.getCurrentPosition(
          (pos) => fetchTemp(pos.coords.latitude, pos.coords.longitude),
          () => fetchTemp(-34.9285, 138.6007)
        );
      }
    }, 1800000);
    return () => clearInterval(interval);
  });

  return (
    <span>
      {temperature !== null ? (
        <div className="text-sm lg:text-base text-left flex justify-center items-center gap-4">
          <div className="w-1/4 md:w-1/5">
            <img src={iconPath} alt="Weather icon" />
          </div>
          <div>
            <p> {temperature.toFixed()}°C</p>
            <p> {description.toUpperCase()}</p>
          </div>
        </div>
      ) : (
        <p>Loading temperature...</p>
      )}
    </span>
  );
};

export default WeatherTemp;
