import './style.css';
import './scss/style.scss';
import bootstrap from 'bootstrap';
import { getCoordinates, getWeather } from './api.js';
import { renderWeather } from './renderWeather.js';

// getNewWeather();

// async function getNewWeather() {
//     let { main } = await getWeather();
//     console.log(main);
// }

const submitBtn = document.querySelector('#submitLocation');
const locationInput = document.querySelector('#autocomplete');
const forecast = document.querySelector('#forecastWeather');
const forecastChart = document.querySelector('#forecastChart');

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (forecast.hasChildNodes()) {
        while (forecast.firstChild) {
            forecast.removeChild(forecast.lastChild);
        }
    }
    getWeatherAndCoords();
});

async function getWeatherAndCoords() {
    // console.log(locationInput.value);
    const { lat, lon } = await getCoordinates(locationInput.value);
    // console.log(lat, lon);
    const weather = await getWeather(lat,lon);
    // console.log(weather);
    renderWeather(weather);
}
