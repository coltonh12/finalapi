import React, { useEffect, useState } from 'react';

function App() {
  const [cityData, setCityData] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

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

    const fetchUserLocationData = async (latitude, longitude) => {
      const weatherData = await fetchWeatherData(latitude, longitude);
      const trafficData = await fetchTrafficData(latitude, longitude);

      const userData = {
        name: 'Your Location',
        weather: weatherData.weather,
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        windSpeed: weatherData.windSpeed,
        traffic: trafficData.traffic
      };

      setUserLocation(userData);
    };

    const fetchWeatherData = async (latitude, longitude) => {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}`);
      const data = await response.json();
      return {
        weather: data.weather[0].main,
        temperature: (data.main.temp - 273.15).toFixed(1),
        humidity: data.main.humidity,
        windSpeed: data.wind.speed
      };
    };

    const fetchTrafficData = async (latitude, longitude) => {
      const response = await fetch(`https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${latitude},${longitude}&key=${trafficApiKey}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}, ${response.statusText}`);
      }
      const data = await response.json();
      const trafficSpeed = data.flowSegmentData.length > 0 ? `${data.flowSegmentData[0].currentSpeed} mph` : 'N/A';
      return { traffic: trafficSpeed };
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          fetchUserLocationData(latitude, longitude);
        },
        error => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }

    const fetchData = async () => {
      const cityPromises = cities.map(async city => {
        const weatherData = await fetchWeatherData(city.coordinates.split(',')[0], city.coordinates.split(',')[1]);
        const trafficData = await fetchTrafficData(city.coordinates.split(',')[0], city.coordinates.split(',')[1]);
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

  return (
    <div className="bg-gray-200 min-h-screen p-4">
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-4">Weather & Traffic</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {userLocation && (
            <div className="weather-card">
              <h2 className="text-lg font-bold mb-2">{userLocation.name}</h2>
              <p className="text-gray-700">Weather: {userLocation.weather}</p>
              <p className="text-gray-700">Temperature: {userLocation.temperature}°C</p>
              <p className="text-gray-700">Humidity: {userLocation.humidity}%</p>
              <p className="text-gray-700">Wind Speed: {userLocation.windSpeed} m/s</p>
              <p className="text-gray-700">Traffic: {userLocation.traffic}</p>
            </div>
          )}
          {cityData.map((data, index) => (
            <div key={index} className="weather-card">
              <h2 className="text-lg font-bold mb-2">{data.name}</h2>
              <p className="text-gray-700">Weather: {data.weather}</p>
              <p className="text-gray-700">Temperature: {data.temperature}°C</p>
              <p className="text-gray-700">Humidity: {data.humidity}%</p>
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

