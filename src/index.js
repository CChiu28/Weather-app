import './style.css';
import { getCurrentWeather,getWeatherStatus,getSunriseSunset } from './api.js';

getNewWeather();

async function getNewWeather() {
    let stuff = await getCurrentWeather();
    console.log(stuff.name);
    let stuff2 = await getWeatherStatus();
    console.log(stuff2);
    let stuff3 = await getSunriseSunset();
    console.log(stuff3.sunrise, stuff3.sunset);
}
