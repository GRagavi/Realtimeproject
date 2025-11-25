import { useState } from 'react';
import search from "./assets/search.png";
import './App.css';
import clouds from './assets/clouds.png';
import drizzle from './assets/drizzle.png';
import rain from './assets/rain.png';
import snowy from './assets/snowy.png';
import humidity from './assets/humidity.png';
import sun from './assets/sun.png';
import wind from './assets/wind.png';


export const WeatherDetails = ({icon, temperature, location, country, latitude, longitude  })=>{

  return(
    <>
      <div className="image">
        <img src={icon} alt="Images" />
      </div>
      <div className="temperature">{temperature}°C</div>
      <div className="location">{location}</div>
      <div className="countryname">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">latitude</span>
          <span> {latitude}</span>
        </div>
        <div>
          <span className="long">longitude</span>
          <span> {longitude}</span>
        </div>
      </div>
    </>
  );
};

function App() {
  const [Icon, setIcon] = useState(sun);
  const [temperature, setTemperature] = useState(25);
  const [city, setCity] = useState("Chennai");
  const [country, setCountry] = useState("IN");
  const [latitude, setLatitude] = useState("13.0827° N");
  const [longitude, setLongitude] = useState("80.2707° E");


  return (
    <>
      <div className="container" >
        <div className="input-container">
          <input type="text" className="cityInput" placeholder="Enter city name" />
          <div className="search-icon">
            <img src={search} alt="search city" />
          </div>
        </div>
        <WeatherDetails icon={Icon} temperature={temperature} location={city} country={country} latitude={latitude} longitude={longitude}/>
      </div>
    </>
  );
}

export default App;
