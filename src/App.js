import './index.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [cityData, setCityData] = useState([]);

  useEffect(() => {
    const cities = [
      { name: 'Lansing', coordinates: '42.7335,-84.5555' },
      { name: 'New York', coordinates: '40.7128,-74.0060' },
      { name: 'Los Angeles', coordinates: '34.0522,-118.2437' },
      { name: 'Chicago', coordinates: '41.8781,-87.6298' },
      { name: 'Houston', coordinates: '29.7604,-95.3698' }
    ];
    const weatherApiKey = '59ce3a80fe2c9388238366c9f3c48530'; 
    const trafficApiKey = 'sp63lJiSDV85PuII26DyfoszBGQ7oopD';

    const fetchData = async () => {
      const cityPromises = cities.map(async city => {
        const weatherData = await fetchWeatherData(city, weatherApiKey);
        const trafficData = await fetchTrafficData(city, trafficApiKey);
        return { ...weatherData, ...trafficData };
      });
      
      try {
        const cityData = await Promise.all(cityPromises);
        setCityData(cityData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  const fetchWeatherData = async (city, apiKey) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${apiKey}`);
      const data = await response.json();
      return { weather: data.weather[0].main, temperature: (data.main.temp - 273.15).toFixed(1), humidity: data.main.humidity, windSpeed: data.wind.speed };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  };

  const fetchTrafficData = async (city, apiKey) => {
    try {
      const response = await fetch(`https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${city.coordinates}&key=${apiKey}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}, ${response.statusText}`);
      }

      const data = await response.json();
      const trafficSpeed = data.flowSegmentData.currentSpeed ? data.flowSegmentData.currentSpeed + ' mph' : 'N/A';
      return { traffic: trafficSpeed };
    } catch (error) {
      console.error('Error fetching traffic data:', error);
      return { traffic: 'N/A' };
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen p-4">
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-4">Weather & Traffic</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {cityData.map((data, index) => (
            <div key={index} className="weather-card">
              <h2 className="text-lg font-bold mb-2">{data.name}</h2>
              <div className="flex items-center justify-center">
                <img src={`https://openweathermap.org/img/wn/${data.weather.icon}.png`} alt="Weather Icon" className="weather-icon" />
                <p className="text-gray-700">{data.weather}</p>
              </div>
              <p className="text-gray-700 temperature">Temperature: {data.temperature}°C</p>
              <p className="text-gray-700 humidity">Humidity: {data.humidity}%</p>
              <p className="text-gray-700">Wind Speed: {data.windSpeed} m/s</p>
              <p className="text-gray-700">Traffic: {data.traffic}</p>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
