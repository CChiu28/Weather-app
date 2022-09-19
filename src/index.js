import './style.css';
import './scss/style.scss';
import bootstrap from 'bootstrap';
import { getCoordinates, getWeather } from './api.js';
import { RenderWeatherData } from './renderWeather.js';

const submitBtn = document.querySelector('#submitLocation');
const locationInput = document.querySelector('#autocomplete');
const forecast = document.querySelector('#forecastWeather');
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
    const { lat, lon } = await getCoordinates(locationInput.value);
    const weather = await getWeather(lat,lon);
    render = new RenderWeatherData(weather);
    render.renderWeather();
}
