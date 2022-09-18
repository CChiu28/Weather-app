import './style.css';
import './scss/style.scss';
import bootstrap from 'bootstrap';
import { getCoordinates, getWeather } from './api.js';
import { renderWeather, RenderWeatherData } from './renderWeather.js';
import { changeTemp } from './utilities';

// getNewWeather();

// async function getNewWeather() {
//     let { main } = await getWeather();
//     console.log(main);
// }

const submitBtn = document.querySelector('#submitLocation');
const locationInput = document.querySelector('#autocomplete');
const forecast = document.querySelector('#forecastWeather');
const forecastChart = document.querySelector('#forecastChart');
const hourlyBtn = document.querySelectorAll('.hourly-btn');
const changeTempBtn = document.querySelector('#temperature-toggle');
let render;

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (render) {
        while (forecast.firstChild) {
            forecast.removeChild(forecast.lastChild);
        }
        render.deleteCharts();
    }
    getWeatherAndCoords();
});

hourlyBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
        render.updateCharts(btn.value);
    })
});

changeTempBtn.addEventListener('click', () => {
    if (changeTempBtn.checked)
        render.changeImperialMetric('C');
    else render.changeImperialMetric('F');
});

async function getWeatherAndCoords() {
    // console.log(locationInput.value);
    const { lat, lon } = await getCoordinates(locationInput.value);
    // console.log(lat, lon);
    const weather = await getWeather(lat,lon);
    // console.log(weather);
    render = new RenderWeatherData(weather);
    render.renderWeather();
}
