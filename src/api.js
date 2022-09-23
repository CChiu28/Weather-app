const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;

async function getWeather(lat, lon, tmp) {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${OPENWEATHER_KEY}&units=${tmp}`;
    try {
        const response = await fetch(url);
        const weather = await response.json();
        return weather;
    } catch (err) {
        // do extra stuff here
        console.log('bad', err);
    }
}

async function getCoordinates(location) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${OPENWEATHER_KEY}`;
    let coords;
    try {
        const response = await fetch(url);
        const data = await response.json();
        coords = data[0];
    } catch (err) {
        // do extra stuff here
        console.log('bad', err);
    }
    return coords;
}

async function getLocationName(lat, lon) {
    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHER_KEY}`;
    let place;
    try {
        const response = await fetch(url);
        const data = await response.json();
        place = data[0];
    } catch (err) {
        console.log('bad place', err);
    }
    return place;
}

export {
    getWeather,
    getCoordinates,
    getLocationName
};