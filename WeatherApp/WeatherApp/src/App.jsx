import { useState, useEffect } from 'react';
import search from "./assets/search.png";
import './App.css';
import clouds from './assets/clouds.png';
import drizzle from './assets/drizzle.png';
import rain from './assets/rain.png';
import snowy from './assets/snowy.png';
import humidity from './assets/humidity.png';
import sun from './assets/sun.png';
import wind from './assets/wind.png';
import WeatherDetails from './WeatherDetails.jsx';
import { on } from 'events';
import responseofWeatherApi from "./Services.js";

function App() {
  const [Icon, setIcon] = useState(rain);
  const [temperature, setTemperature] = useState(25);
  const [city, setCity] = useState("CHENNAI");
  const [country, setCountry] = useState("IN");
  const [latitude, setLatitude] = useState("13.0827° N");
  const [longitude, setLongitude] = useState("80.2707° E");
  const [Humidity, setHumidity] = useState("87%");
  const [WindSpeed, setWindSpeed] = useState("10");
  const [textInput, setTextInput] = useState("chennai");
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    const IconsMapping={
    "01d": sun,
    "01n": sun,
    "02d": clouds,
    "02n": clouds,
    "03d": drizzle,
    "03n": drizzle,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "11d": rain,
    "11n": rain,
    "13d": snowy,
    "13n": snowy,
    "50d": clouds,
    "50n": clouds
  };
const handleCity = (e) => {
    setTextInput(e.target.value);
 }
async function weatherAPICall(textInput){

   try{
      setLoading(true);
      let {data,response} = await responseofWeatherApi(textInput);
      console.log(data);
      setLoading(true);
      if(!response.ok){
      throw new Error('City not found');
     
      setCityNotFound(true);
      return;
      }
      setCity(data.name);
      setCountry(data.sys.country);
      setTemperature(data.main.temp);
      setLatitude(data.coord.lat);
      setLongitude(data.coord.lon);
      setHumidity(data.main.humidity);
      setWindSpeed(data.wind.speed);
      setIcon(IconsMapping[data.weather[0].icon] || IconsMapping["01d"]);
      setCityNotFound(false);
       setError(false);
   }catch (error) {
    console.error('Error fetching weather data:', error);
     setError(error.message);
     setCityNotFound(true);
  }finally{
    setLoading(false);
  }
}
const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Trigger search action
      weatherAPICall(textInput);}
}

  return (
    <>
      <div className="container" >
        <div className="input-container">
          <input type="text" onChange={handleCity} className="cityInput" placeholder="Enter city name" value={textInput} onKeyDown={handleKeyDown}/>
          <div className="search-icon">
            <img src={search} alt="search city" onClick={()=> weatherAPICall(textInput)}/>
          </div>
        </div>
        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
       {!loading && !cityNotFound && <WeatherDetails icon={Icon} temperature={temperature} location={city} country={country} latitude={latitude} longitude={longitude} Humidity={Humidity} WindSpeed={WindSpeed}/>}
      <p className="copyright">Designed by <span>Ragavi</span></p>
      </div>
    </>
  );
}

export default App;
