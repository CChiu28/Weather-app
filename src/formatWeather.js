function formatWeather(data) {
    const { main, sys, weather, name, visibility, wind, clouds } = data;
    console.log(main, sys, weather[0], name);
    formatMainWeatherData(main, weather[0], name);
    formatCurrentWeatherData(main, visibility, wind, clouds);
}

function formatMainWeatherData(main, weather, name) {
    // const { temp, feels_like } = main;
    // const { description, icon } = weather;
    const currTemp = document.querySelector('#overview-temp');
    currTemp.innerHTML = main.temp;
    const location = document.querySelector('#overview-location');
    location.innerHTML = name;
    const currCondition = document.querySelector('#overview-condition');
    currCondition.innerHTML = weather.description;
    document.querySelector('#overview-img').src = `http://openweathermap.org/img/wn/${weather.icon}@2x.png`;
}

function formatCurrentWeatherData(main, visibility, wind, clouds) {
    // const { feels_like, pressure, humidity } = main;
    const feelsLike = document.querySelector('#current-feels-like');
    feelsLike.innerHTML = main.feels_like;
    const pressure = document.querySelector('#current-pressure');
    pressure.innerHTML = main.pressure;
    const humidity = document.querySelector('#current-humidity');
    humidity.innerHTML = `${main.humidity}%`;
    const cloud = document.querySelector('#current-cloud');
    cloud.innerHTML = `${clouds.all}%`;
    const windSpeed = document.querySelector('#current-wind-speed');
    windSpeed.innerHTML = wind.speed;
    const vis = document.querySelector('#current-visibility');
    vis.innerHTML = `${visibility} meters`;
}

export {
    formatWeather
}