const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;

async function getWeather(lat,lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=imperial`);
    const weather = await response.json();
    return weather;
}

async function getCoordinates(location) {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${OPENWEATHER_KEY}`);
    const data = await response.json();
    const coords = data[0];
    // console.log(coords);
    return coords;
}

export {
    getWeather,
    getCoordinates
};