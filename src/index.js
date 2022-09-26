import './style.css';
import './scss/style.scss';
import { Modal, Button } from 'bootstrap';
import { getCoordinates, getLocationName, getWeather } from './api.js';
import { RenderWeatherData } from './renderWeather.js';
import { getToggleTemp, clearDom } from './utilities';

(function init() {
    const form = document.querySelector('#form-input');
    const submitBtn = document.querySelector('#submitLocation');
    const inputLocation = document.querySelector('#inputLocation');
    const hourlyBtns = document.querySelectorAll('.hourly-btn');
    const changeTempBtn = document.querySelector('#temperature-toggle');
    let render;

    form.addEventListener('submit', e => {
        e.preventDefault();
        if (render) {
            render.deleteCharts();
            clearDom();
        }
        getLocationByInput();
    })

    hourlyBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            if (render)
                render.updateCharts(btn.value);
        })
    });

    // Toggle switch imperial/metric
    changeTempBtn.addEventListener('click', () => {
        if (render) {
            render.changeImperialMetric(getToggleTemp());
        } else changeTempBtn.checked ? console.log('metric') : console.log('imperial');
    });

    // Get location from input
    async function getLocationByInput() {
        try {
            startLoader(true);
            const { lat, lon, name, state, country } = await getCoordinates(inputLocation.value);
            getWeatherFromApi(lat, lon, name, state, country);
        } catch (err) {
            console.log('bad input', err);
            inputLocation.classList.add('is-invalid');
            inputLocation.value = '';
            inputLocation.setAttribute('placeholder', 'Invalid location');
            setTimeout(() => {
                inputLocation.classList.remove('is-invalid');
                inputLocation.setAttribute('placeholder', 'Enter a Location');
            },3000)
        }
    }

    // Get location from device
    async function getLocationByDevice(pos) {
        let { latitude, longitude } = pos.coords;
        try {
            startLoader(true);
            const { name, state, country } = await getLocationName(latitude, longitude);
            getWeatherFromApi(latitude, longitude, name, state, country);
        } catch (err) {
            console.log('bad device', err);
        }
    }

    async function getWeatherFromApi(lat, lon, name, state, country) {
        const weather = await getWeather(lat,lon, getToggleTemp());
        render = new RenderWeatherData(weather, name, state, country);
        await render.renderWeatherHeaderImage(weather.current);
        await render.renderWeather();
        startLoader(false);
    }

    function noLocation(err) {
        console.log(err);
    }

    // Show/hide spinner whilerendering data
    function startLoader(load) {
        const loader = document.querySelector('#loader');
        const weatherPic = document.querySelector('#parallax-pic');
        const main = document.querySelector('#main-data');
        if (load) {
            loader.classList.remove('d-none');
            weatherPic.classList.add('d-none');
            main.classList.add('d-none');
        } else {
            loader.classList.add('d-none');
            weatherPic.classList.remove('d-none');
            main.classList.remove('d-none');
        }
    }

    window.onload = () => {
        navigator.geolocation.getCurrentPosition(getLocationByDevice, noLocation);
    };
})();