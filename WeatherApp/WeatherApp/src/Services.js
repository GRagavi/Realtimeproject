let city="chennai";
export default async function responseofWeatherApi(city){  
    const apiKey = 'cb5431885d848d1d159d1519227449f9';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    return {data, response};
}

