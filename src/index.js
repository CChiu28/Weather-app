import './style.css';
import { getCoordinates, getWeather } from './api.js';
import { formatWeather } from './formatWeather';

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
    // console.log(locationInput.value);
    const { lat, lon } = await getCoordinates(locationInput.value);
    // console.log(lat, lon);
    const weather = await getWeather(lat,lon);
    // console.log(weather);
    formatWeather(weather);
}