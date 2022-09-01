const lat = 40.606348;
const lon = -74.003313;

async function getWeather() {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_KEY}&units=imperial`);
    const data = await response.json();
    return data;
}

// async function getCurrentWeather() {
//     const { main, name } = await getWeather();
//     // console.log(main);
//     return { main, name };
// }

// async function getWeatherStatus() {
//     const { weather } = await getWeather();
//     // console.log(weather);
//     return weather;
// }

// async function getSunriseSunset() {
//     const { sys } = await getWeather();
//     return sys;
// }

async function getGeocode(location) {
    
}
export {
    getWeather
};