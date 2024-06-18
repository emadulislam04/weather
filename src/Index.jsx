import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


const API_KEY = 'd3485f907315cefd8773d73bf25d2ea3';

export const Index = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [unit, setUnit] = useState('metric'); // 'metric' for Celsius, 'imperial' for Fahrenheit
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeatherData(city, unit);
  }, [city, unit]);
  
  const fetchWeatherData = async (city, unit) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?units=${unit}&q=${city}&appid=${API_KEY}`
      );
      const data = await response.json();

      if (response.ok) {
        setWeatherData(data);
        setError(null);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setWeatherData(null);
      setError(error.message);
      console.error('Error fetching weather data:', error);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const cityInput = event.target.elements.city.value.trim();

    if (cityInput) {
      setCity(cityInput);
    } else {
      setError('Please enter a valid city name.');
      console.error('Validation Error: Please enter a valid city name.');
    }
  };

  const handleUnitChange = (unit) => {
    setUnit(unit);
  };

  return (
    <div className="container">
      <div className="weather__header">
        <form className="weather__search" onSubmit={handleSearch}>
          <input type="text" name="city" placeholder="Search for a city..." className="weather__searchform"  onChange={(e)=>setCity(e.target.value)}/>
        </form>
        <div className="weather__units">
          <span
            className={`weather_unit_celsius ${unit === 'metric' ? 'active' : ''}`}
            onClick={() => handleUnitChange('metric')}
          >
            &#176;C
          </span>
          <span
            className={`weather_unit_farenheit ${unit === 'imperial' ? 'active' : ''}`}
            onClick={() => handleUnitChange('imperial')}
          >
            &#176;F
          </span>
        </div>
      </div>
      {error && <p className="weather__error">{error}</p>}
      {weatherData && (
        <div className="weather__body">
          <h1 className="weather__city">{weatherData.name}</h1>
          <div className="weather__datetime">
            {/* Format date/time as needed */}
          </div>
          <div className="weather__forecast">{weatherData.weather[0].description}</div>
          <div className="weather__icon">
            {/* You can use weather icons from the API or other sources */}
            <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="weather icon" />
          </div>
          <p className="weather__temperature">{Math.round(weatherData.main.temp)}&#176;</p>
          <div className="weather__minmax">
            <p>Min: {Math.round(weatherData.main.temp_min)}&#176;</p>
            <p>Max: {Math.round(weatherData.main.temp_max)}&#176;</p>
          </div>
        </div>
      )}
      {weatherData && (
        <div className="weather__info">
          <div className="weather__card">
            <i className="fa-solid fa-temperature-full"></i>
            <div>
              <p>Real Feel</p>
              <p className="weather__realfeel">{Math.round(weatherData.main.feels_like)}&#176;</p>
            </div>
          </div>
          <div className="weather__card">
            <i className="fa-solid fa-droplet"></i>
            <div>
              <p>Humidity</p>
              <p className="weather__humidity">{weatherData.main.humidity}%</p>
            </div>
          </div>
          <div className="weather__card">
            <i className="fa-solid fa-wind"></i>
            <div>
              <p>Wind</p>
              <p className="weather__wind">{weatherData.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
            </div>
          </div>
          <div className="weather__card">
            <i className="fa-solid fa-gauge-high"></i>
            <div>
              <p>Pressure</p>
              <p className="weather__pressure">{weatherData.main.pressure} hPa</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
