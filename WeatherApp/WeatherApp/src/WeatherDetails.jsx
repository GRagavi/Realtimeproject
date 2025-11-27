import React from "react";
import search from "./assets/search.png";
import clouds from './assets/clouds.png';
import drizzle from './assets/drizzle.png';
import rain from './assets/rain.png';
import snowy from './assets/snowy.png';
import humidity from './assets/humidity.png';
import sun from './assets/sun.png';
import wind from './assets/wind.png';
import './WeatherDetails.css';
const WeatherDetails = ({icon, temperature, location, country, latitude, longitude, Humidity, WindSpeed})=>{
  return(
    <>
      <div className="image">
        <img src={icon} alt="Images" />
      </div>
      <div className="temperature">{temperature}°C</div>
      <div className="location">{location}</div>
      <div className="countryname">{country}</div>
      <div className="coord">
        <div>
          <span className="lat">latitude</span>
          <span> {latitude}</span>
        </div>
        <div>
          <span className="long">longitude</span>
          <span> {longitude}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element"> 
          <img src={humidity} alt="humidity" className="Icon" />
        <div className="data"> 
          <div className="humidity-percent">{Humidity}</div>
          <div className="text">Humidity</div>
        </div>
        </div>
        <div className="element"> 
          <img src={wind} alt="wind" className="Icon" />
        <div className="data"> 
          <div className="wind-speed">{WindSpeed}Km/h</div>
          <div className="text">Wind Speed</div>
        </div>
        </div>
      </div>
    </>
  )
};

export default WeatherDetails