const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;

async function getWeather(lat,lon) {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${OPENWEATHER_KEY}&units=imperial`;
    try {
        const response = await fetch(url);
        const weather = await response.json();
        return weather;
    } catch (err) {
        // do extra stuff here
        console.log(err);
    }
}

async function getCoordinates(location) {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${OPENWEATHER_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const coords = data[0];
        return coords;
    } catch (err) {
        // do extra stuff here
        console.log(err);
    }
}

export {
    getWeather,
    getCoordinates
};