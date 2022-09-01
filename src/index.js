// import './style.css';
import { getCoordinates, getWeather } from './api.js';

// getNewWeather();

// async function getNewWeather() {
//     let { main } = await getWeather();
//     console.log(main);
// }

const submitBtn = document.querySelector('#submitLocation');
const locationInput = document.querySelector('#autocomplete');


submitBtn.addEventListener('click',(e)=> {
    e.preventDefault();
    getWeatherAndCoords();
})

async function getWeatherAndCoords() {
    const { lat, lon } = await getCoordinates(locationInput.value);
    // console.log(lat, lon);
    const weather = await getWeather(lat,lon);
    // console.log(weather);
    formatWeather(weather);
}

function formatWeather(data) {
    const { main, sys, weather, name } = data;
    console.log(main, sys, weather[0], name);
}