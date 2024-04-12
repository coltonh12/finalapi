// App.js

import React, { useEffect, useState } from 'react';

function App() {
  const [weather, setWeather] = useState(null);
  const [traffic, setTraffic] = useState(null);

  useEffect(() => {
    // Fetch weather data from OpenWeather API
    fetch('https://api.openweathermap.org/data/2.5/weather?q=Lansing,us&appid=59ce3a80fe2c9388238366c9f3c48530')
      .then(response => response.json())
      .then(data => {
        setWeather(data);
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });

    // Fetch traffic data from TomTom API
    fetch('https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=42.7335,-84.5555&key=R1t70C69lxJyezKuC4dR8eifiuLP5YoS')
      .then(response => response.json())
      .then(data => {
        setTraffic(data);
      })
      .catch(error => {
        console.error('Error fetching traffic data:', error);
      });
  }, []);

  return (
    <div className="bg-gray-200 min-h-screen p-4">
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-4">Weather and Traffic Information</h1>
        {weather && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Weather in Lansing, Michigan</h2>
            <p>Temperature: {weather.main.temp}°C</p>
            {/* Display additional weather information as needed */}
          </div>
        )}
        {traffic && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Traffic in Lansing, Michigan</h2>
            <p>Current traffic flow: {traffic.flowSegmentData.currentSpeed} mph</p>
            {/* Display additional traffic information as needed */}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
