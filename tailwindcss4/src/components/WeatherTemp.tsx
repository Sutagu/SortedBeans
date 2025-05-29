import React, {useEffect, useState} from 'react';

const apiKey = 'ffcc4752fb2881576286105573cc295c';

const WeatherTemp : React.FC = () =>{
    const[temperature, setTemperature] = useState <number | null>(null);
    
    const fetchTemp = (lat: number, lon: number) => {
        
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if(data.main && typeof data.main.temp === 'number'){
                    setTemperature(data.main.temp);
                }
            })
            .catch((err) => console.error('Failed to fetch temperature', err));
    };

    useEffect(() =>{
        if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          fetchTemp(lat, lon); // fetch right after getting location
        },
        (err) => {
          console.error(err);
        }
      );
    }else{
        console.error('Geo location not supported');
    }
        fetchTemp(-34.9285, 138.6007)
        const interval = setInterval(fetchTemp, 1800000);//default adelaide location
        return () => clearInterval(interval);
    }, []);

    return(
        <div>
            {temperature !== null ? (
                <p> {temperature.toFixed(1)}°C</p>
            ) : (
                <p>Loading temperature...</p>
            )}
        </div>
    );
};

export default WeatherTemp;