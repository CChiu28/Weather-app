import './style.css';
import './scss/style.scss';
// import bootstrap from 'bootstrap';
import { getCoordinates, getWeather } from './api.js';
import { RenderWeatherData } from './renderWeather.js';
import { getToggleTemp } from './utilities';

(function init() {
    const submitBtn = document.querySelector('#submitLocation');
    const hourlyBtn = document.querySelectorAll('.hourly-btn');
    const changeTempBtn = document.querySelector('#temperature-toggle');
    let render;

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (render) {
            render.deleteCharts();
            document.querySelector('#hourly-chart-icons').innerHTML = '';
            document.querySelector('#chart2icons').innerHTML = '';
            document.querySelector('#current-weather').innerHTML = '';
        }
        getWeatherAndCoords();
    });

    hourlyBtn.forEach((btn) => {
        btn.addEventListener('click', () => {
            render.updateCharts(btn.value);
        })
    });

    changeTempBtn.addEventListener('click', () => {
        render.changeImperialMetric(getToggleTemp());
    });

    async function getWeatherAndCoords() {
        const locationInput = document.querySelector('#autocomplete');
        const { lat, lon } = await getCoordinates(locationInput.value);
        const weather = await getWeather(lat,lon, getToggleTemp());
        render = new RenderWeatherData(weather, getToggleTemp());
        render.renderWeather();
    }

    // function getToggleTemp() {
    //     const changeTempBtn = document.querySelector('#temperature-toggle');
    //     return changeTempBtn.checked ? 'metric' : 'imperial';
    // }
})();