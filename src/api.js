const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;

async function getWeather(lat,lon) {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=imperial`;
    const response = await fetch(url);
    const weather = await response.json();
    return weather;
}

async function getCoordinates(location) {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${OPENWEATHER_KEY}`;
    // console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    const coords = data[0];
    // console.log(coords);
    return coords;
}

export {
    getWeather,
    getCoordinates
};