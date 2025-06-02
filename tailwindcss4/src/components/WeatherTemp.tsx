import React, {useEffect, useState} from 'react';
import weatherIcons from '../assets/images/weather/weatherIcons';
const apiKey = 'ffcc4752fb2881576286105573cc295c';

const WeatherTemp : React.FC = () =>{
    const[temperature, setTemperature] = useState <number | null>(null);
    const[iconPath, setIconPath] = useState <string>(weatherIcons['clear.png']);
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
                console.log(data);
                if(data.main && typeof data.main.temp === 'number'){
                    setTemperature(data.main.temp);
                }
                const weather = (data : WeatherData) =>{
                    const name = (data.weather[0]?.main??'clear').toLowerCase();
                    setIconPath(weatherIcons[`./${name}.png`]);
                    console.log(iconPath);
                }
                weather(data);
            })
            .catch((err) => console.error('Failed to fetch temperature', err));
    };


   
    useEffect(() =>{
        if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
        
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            console.log('Fetching temperature at user location');
            fetchTemp(lat, lon); // fetch right after getting location
        },
        (err) => {
          console.error(err);
        }
      );
    }else{
        console.error('Geo location not supported');
    }
        fetchTemp(-34.9285, 138.6007);
        const interval = setInterval(fetchTemp, 1800000);//default adelaide location
        return () => clearInterval(interval);
    }, []);

    return(
        <div>
            {temperature !== null ? (
                <div id='weather-container'>
                    <p id='weather-temperature'> {temperature.toFixed()}°C</p>
                    <img id='weather-png' src={iconPath} alt='Weather icon'/>
                </div>
            ) : (
                <p>Loading temperature...</p>
            )}
        </div>
    );
};

export default WeatherTemp;