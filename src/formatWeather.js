import * as utilities from './utilities.js';

function formatWeather(data) {
    const { current, daily, timezone_offset } = data;
    // console.log(current);
    formatMainWeatherData(current);
    formatCurrentWeatherData(current);
    formatDailyWeatherData(daily, timezone_offset);
}

function formatMainWeatherData(current) {
    // const { temp, feels_like } = main;
    // const { description, icon } = weather;
    const { temp, weather } = current;
    const currTemp = document.querySelector('#overview-temp');
    currTemp.innerHTML = Math.round(temp);
    const location = document.querySelector('#overview-location');
    const locationFromInput = document.querySelector('#autocomplete');
    location.innerHTML = locationFromInput.value;
    const currCondition = document.querySelector('#overview-condition');
    currCondition.innerHTML = weather[0].description;
    const conditionImg = document.querySelector('#overview-img');
    conditionImg.src = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    conditionImg.alt = weather[0].description;
    conditionImg.title = weather[0].description;
}

function formatCurrentWeatherData(current) {
    const { feels_like, pressure, humidity, clouds, wind_speed, visibility } = current;
    const feelsLikeDOM = document.querySelector('#current-feels-like');
    feelsLikeDOM.innerHTML = Math.round(feels_like);
    const pressureDOM = document.querySelector('#current-pressure');
    pressureDOM.innerHTML = `${pressure} hPa`;
    const humidityDOM = document.querySelector('#current-humidity');
    humidityDOM.innerHTML = `${Math.round(humidity)}% humidity`;
    const cloudDOM = document.querySelector('#current-cloud');
    cloudDOM.innerHTML = `${Math.round(clouds)}% clouds`;
    const windSpeedDOM = document.querySelector('#current-wind-speed');
    windSpeedDOM.innerHTML = `${Math.round(wind_speed)} mph`;
    const visDOM = document.querySelector('#current-visibility');
    visDOM.innerHTML = `${visibility} meters`;
}

function formatDailyWeatherData(daily, tz) {
    // console.log(daily);
    const forecast = document.querySelector('#forecastWeather');
    daily.forEach(day => {
        const { temp, weather, pop, dt } = day;
        const card = document.createElement('div');
        const cardBody = document.createElement('div');
        const cardDay = document.createElement('div');
        const cardTemp = document.createElement('span')
        const rain = document.createElement('span');
        const condition = document.createElement('img');
        card.classList.add('card');
        cardBody.classList.add('card-body');
        cardDay.classList.add('card-footer');
        cardTemp.classList.add('card-text');
        rain.classList.add('card-text');
        cardTemp.innerHTML = `${Math.round(temp.max)}/${Math.round(temp.min)}`;
        rain.innerHTML = `${Math.round(pop*100)}% rain`;
        cardDay.innerHTML = utilities.getDate(dt,tz);
        condition.src = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
        condition.alt = weather[0].description;
        condition.title = weather[0].description;
        cardBody.append(cardTemp);
        cardBody.append(condition);
        cardBody.append(rain);
        card.append(cardBody);
        card.append(cardDay);
        forecast.append(card);
    });
}

// function getDate(time,tz) {
//     const unixTime = (time+tz)*1000;
//     const date = new Date(unixTime);
//     console.log(date);
//     const options = {
//         weekday: 'short',
//         day: 'numeric'
//     };
//     // const day = new Intl.DateTimeFormat('en-US',options).format(date);
//     const day = date.toLocaleDateString(undefined, options);
//     return day;
// }

export {
    formatWeather
}