import './style.css';
import './scss/style.scss';
import * as bootstrap from 'bootstrap';
import { getCoordinates, getLocationName, getWeather } from './api.js';
import { RenderWeatherData } from './renderWeather.js';
import { getToggleTemp } from './utilities';

(function init() {
    const submitBtn = document.querySelector('#submitLocation');
    const hourlyBtn = document.querySelectorAll('.hourly-btn');
    const changeTempBtn = document.querySelector('#temperature-toggle');
    let render;

    submitBtn.addEventListener('click', (e) => {
        // e.preventDefault();
        if (render) {
            render.deleteCharts();
            document.querySelector('#hourly-chart-icons').innerHTML = '';
            document.querySelector('#chart2icons').innerHTML = '';
            document.querySelector('#current-weather').innerHTML = '';
        }
        getLocationByInput();
    });

    hourlyBtn.forEach((btn) => {
        btn.addEventListener('click', () => {
            render.updateCharts(btn.value);
        })
    });

    changeTempBtn.addEventListener('click', () => {
        if (render)
            render.changeImperialMetric(getToggleTemp());
        else changeTempBtn.checked ? console.log('metric') : console.log('imperial');
    });

    async function getLocationByInput() {
        const locationInput = document.querySelector('#autocomplete');
        try {
            const { lat, lon, name, state, country } = await getCoordinates(locationInput.value);
            getWeatherFromApi(lat, lon, name, state, country);
        } catch (err) {
            console.log('bad', err);
        }
    }

    async function getLocationByDevice(pos) {
        let { latitude, longitude } = pos.coords;
        try {
            const { name, state, country } = await getLocationName(latitude, longitude);
            getWeatherFromApi(latitude, longitude, name, state, country);
        } catch (err) {
            console.log('bad', err);
        }
    }

    async function getWeatherFromApi(lat, lon, name, state, country) {
        const weather = await getWeather(lat,lon, getToggleTemp());
        render = new RenderWeatherData(weather, name, state, country);
        render.renderWeather();
    }

    function noLocation(err) {
        console.log(err);
    }

    window.onload = () => {
        navigator.geolocation.getCurrentPosition(getLocationByDevice, noLocation);
    };
    // function getToggleTemp() {
    //     const changeTempBtn = document.querySelector('#temperature-toggle');
    //     return changeTempBtn.checked ? 'metric' : 'imperial';
    // }
})();