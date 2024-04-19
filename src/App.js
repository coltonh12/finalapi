import './index.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [weatherData, setWeatherData] = useState([]);

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

    const fetchWeatherData = async (city) => {
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${weatherApiKey}`);
        const data = await response.json();
        return { name: city.name, weather: data.weather[0].main, temperature: (data.main.temp - 273.15).toFixed(1), humidity: data.main.humidity, windSpeed: data.wind.speed };
      } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
      }
    };

    const fetchTrafficData = async (city) => {
      try {
        const response = await fetch(`https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${city.coordinates}&key=${trafficApiKey}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}, ${response.statusText}`);
        }
    
        const data = await response.json();
        return { name: city.name, traffic: data.flowSegmentData.currentSpeed };
      } catch (error) {
        console.error('Error fetching traffic data:', error);
        return null;
      }
    };
    

    const fetchData = async () => {
      const weatherPromises = cities.map(city => fetchWeatherData(city));
      const trafficPromises = cities.map(city => fetchTrafficData(city));
      
      try {
        const weatherData = await Promise.all(weatherPromises);
        const trafficData = await Promise.all(trafficPromises);
        
        const combinedData = weatherData.map((weather, index) => {
          if (trafficData[index]) { // Check if trafficData[index] is not null
            return { ...weather, traffic: trafficData[index].traffic };
          } else {
            return weather; // Return weather object without traffic data
          }
        });
        setWeatherData(combinedData); // Ensure combinedData is an array
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="bg-gray-200 min-h-screen p-4">
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-4">Weather&Traffic</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {weatherData.map((data, index) => (
            <div key={index} className="bg-white rounded p-4 shadow">
              <h2 className="text-lg font-bold">{data.name}</h2>
              <p className="text-gray-700">{data.weather}</p>
              <p className="text-gray-700">Temperature: {data.temperature}°C</p>
              <p className="text-gray-700">Humidity: {data.humidity}%</p>
              <p className="text-gray-700">Wind Speed: {data.windSpeed} m/s</p>
              <p className="text-gray-700">Traffic: {data.traffic ? data.traffic + ' mph' : 'N/A'}</p>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;

