import * as utilities from './utilities.js';
import { WeatherDataCharts } from './charts.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

class RenderWeatherData {
    constructor(weatherData) {
        this.#weatherData = weatherData;
    }
    
    #weatherData
    #hourlyWeatherChart;
    #dailyWeatherChart;

    renderWeather() {
        if (this.#dailyWeatherChart || this.#hourlyWeatherChart) {
            this.deleteCharts();
            document.querySelector('#hourly-chart-icons').innerHTML = '';
            document.querySelector('#chart2icons').innerHTML = '';
            document.querySelector('#current-weather').innerHTML = '';
        }
        const { current, daily, timezone_offset, hourly } = this.#weatherData;
        this.#renderWeatherHeaderImage(current);
        this.#renderMainWeatherData(current);
        this.#renderCurrentWeatherData(current);
        this.#renderDailyWeatherData(daily, timezone_offset);
        this.#renderHourlyWeatherData(hourly, timezone_offset);
    }

    #renderMainWeatherData(current) {
        const { temp, weather } = current;
        const currTemp = document.querySelector('#overview-temp');
        const location = document.querySelector('#overview-location');
        const locationFromInput = document.querySelector('#autocomplete');
        const currCondition = document.querySelector('#overview-condition');
        const conditionImg = document.querySelector('#overview-img');
        
        currTemp.textContent = Math.round(temp);
        location.textContent = locationFromInput.value;
        currCondition.textContent = weather[0].description;
        conditionImg.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
        conditionImg.alt = weather[0].description;
        conditionImg.title = weather[0].description;
    }

    #renderCurrentWeatherData(current) {
        const { feels_like, pressure, humidity, clouds, wind_speed, uvi } = current;
        
        // const feelsLikeDOM = document.querySelector('#current-feels-like');
        // const pressureDOM = document.querySelector('#current-pressure');
        // const humidityDOM = document.querySelector('#current-humidity');
        // const cloudDOM = document.querySelector('#current-cloud');
        // const windSpeedDOM = document.querySelector('#current-wind-speed');
        // const uvDOM = document.querySelector('#current-uv');

        // pressureDOM.textContent = `${pressure} hPa`;
        // feelsLikeDOM.textContent = Math.round(feels_like);
        // humidityDOM.textContent = `${Math.round(humidity)}% humidity`;
        // cloudDOM.textContent = `${Math.round(clouds)}% clouds`;
        // windSpeedDOM.textContent = `${Math.round(wind_speed)} mph`;
        // uvDOM.textContent = uvi;

        // const feelsLikeDiv = document.querySelector('.current-feels-like-div');
        // const feelsLikeIcon = document.createElement('h2');
        // const title = document.createElement('h2');
        // feelsLikeIcon.setAttribute('class', 'text-center bi bi-thermometer');
        // title.textContent = 'Feels Like';
        // title.setAttribute('class','text-center fw-bold');
        // feelsLikeDiv.append(feelsLikeIcon, title);


        this.#renderCurrentWeatherDiv('Feels Like', 'bi bi-thermometer', '.current-feels-like-div', `${Math.round(feels_like)}`);
        this.#renderCurrentWeatherDiv('Pressure', 'bi bi-speedometer', '.current-pressure-div', `${pressure}`);
        this.#renderCurrentWeatherDiv('Humidity', 'bi bi-moisture', '.current-humidity-div', `${Math.round(humidity)}%`);
        this.#renderCurrentWeatherDiv('Clouds', 'bi bi-clouds', '.current-cloud-div', `${Math.round(clouds)}%`);
        this.#renderCurrentWeatherDiv('Wind Speed', 'bi bi-wind', '.current-wind-div', `${Math.round(wind_speed)}`);
        this.#renderCurrentWeatherDiv('UV Index', 'bi bi-brightness-high', '.current-uv-div', uvi);
    }

    #renderHourlyWeatherData(hourly, tz) {
        const ctx = document.querySelector('#hourlyDiv');
        // const hourlyBtn = document.querySelectorAll('.hourly-btn');

        // hourlyBtn.forEach((btn) => {
        //     btn.addEventListener('click', () => {
        //         this.#hourlyWeatherChart.updateChart(btn.value);
        //     })
        // })

        // hourly.forEach(({ temp, pop, weather, dt}) => {
        //     // const tmp = `${Math.round(temp)}`;

        //     const div = document.createElement('div');
        //     const tmp = document.createElement('span');
        //     const rain = document.createElement('span');
        //     const icon = document.createElement('img');
        //     const time = document.createElement('span');

        //     tmp.innerText = `${Math.round(temp)}`;
        //     rain.innerText = `${Math.round(pop*100)}% rain`;
        //     icon.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
        //     icon.alt = weather[0].description;
        //     icon.title = weather[0].description;
        //     time.innerText = utilities.getDate(dt,tz).time;
        //     div.append(tmp,icon,rain,time);
        //     ctx.append(div);
        // })
        // utilities.createChart(hourly, tz, 'hourly');
        const hourlyCtx = document.querySelector('#hourlyChart');
        this.#hourlyWeatherChart = new WeatherDataCharts(hourly,tz,hourlyCtx,'hourly');
        this.#hourlyWeatherChart.createChartjs();

        const weather = hourly.map(({weather}) => weather);
        let hourlyChartIcons = document.querySelector('#hourly-chart-icons');
        weather.map((weather) => {
            let div = document.createElement('div');
            // div.style.display = 'table-cell';
            let img = new Image();
            img.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
            img.alt = weather[0].description;
            img.title = weather[0].description;
            // img.setAttribute('id','icon');
            img.setAttribute('class','img-fluid position-relative');
            div.append(img);
            hourlyChartIcons.append(div);
        });
    }

    #renderDailyWeatherData(daily, tz) {
        // console.log(daily);
        // const forecast = document.querySelector('#forecastWeather');
        // daily.forEach((day) => {
        //     const { temp, weather, pop, dt } = day;
        //     const card = document.createElement('div');
        //     const cardBody = document.createElement('div');
        //     const cardDay = document.createElement('div');
        //     const cardTemp = document.createElement('span');
        //     const rain = document.createElement('span');
        //     const condition = document.createElement('img');
        //     card.classList.add('card');
        //     cardBody.classList.add('card-body');
        //     cardDay.classList.add('card-footer');
        //     cardTemp.classList.add('card-text');
        //     rain.classList.add('card-text');
        //     cardTemp.textContent = `${Math.round(temp.max)}/${Math.round(temp.min)}`;
        //     rain.textContent = `${Math.round(pop*100)}% rain`;
        //     cardDay.textContent = utilities.getDate(dt,tz).day;
        //     condition.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
        //     condition.alt = weather[0].description;
        //     condition.title = weather[0].description;
        //     cardBody.append(cardTemp);
        //     cardBody.append(condition);
        //     cardBody.append(rain);
        //     card.append(cardBody);
        //     card.append(cardDay);
        //     forecast.append(card);
        // });
        // utilities.createChart(daily,tz, 'daily');
        const ctx = document.querySelector('#chart2');
        this.#dailyWeatherChart = new WeatherDataCharts(daily,tz,ctx,'daily');
        this.#dailyWeatherChart.createChartjs();

        const weather = daily.map(({weather}) => weather);
        const c2ico = document.querySelector('#chart2icons');
        weather.map((weather) => {
            let div = document.createElement('div');
            div.style.maxWidth = '100%';
            let img = new Image();
            img.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
            img.alt = weather[0].description;
            img.title = weather[0].description;
            // img.setAttribute('class','img-fluid position-relative');
            div.append(img);
            c2ico.append(div);
        });
    }

    #renderWeatherHeaderImage(current) {
        const { weather } = current;
        const div = document.querySelector('#parallax-pic');
        div.style.backgroundImage = `url("https://source.unsplash.com/random/?${weather[0].description}")`;
    }

    #renderCurrentWeatherDiv(label, icon, parent, data) {
        let addLabel = document.createElement('h6');
        let addIcon = document.createElement('h4');
        let addData = document.createElement('p');
        let div = document.createElement('div');
        let cardDiv = document.createElement('div');
        let parentDiv = document.createElement('div');
        let article = document.querySelector('#current-weather');

        parentDiv.setAttribute('class', 'card text-center shadow-sm mb-2 mt-2 current');
        div.setAttribute('class', 'card-body d-flex flex-column align-items-center');
        addLabel.textContent = label;
        addLabel.setAttribute('class', 'fw-bold m-auto');
        addIcon.setAttribute('class', `${icon} m-auto`);
        addData.setAttribute('class', 'display-6 m-auto');
        addData.textContent = data;
        // cardDiv.setAttribute('class', 'd-flex')
        div.append(addIcon, addLabel, addData);
        cardDiv.append(div);
        parentDiv.append(div);
        article.append(parentDiv);
    }

    updateCharts(val) {
        this.#hourlyWeatherChart.updateChart(val);
    }

    deleteCharts() {
        this.#dailyWeatherChart.destroy();
        this.#hourlyWeatherChart.destroy();
    }

    changeImperialMetric(tmp) {
        const { current } = this.#weatherData;
        current.temp = utilities.convertFahrenheitCelsius(current.temp, tmp);
        current.feels_like = utilities.convertFahrenheitCelsius(current.feels_like, tmp);
        current.wind_speed = utilities.convertImperialMetric(current.wind_speed,tmp);

        this.#weatherData.daily.forEach(({ temp, wind_speed }) => {
            temp.min = utilities.convertFahrenheitCelsius(temp.min,tmp);
            temp.max = utilities.convertFahrenheitCelsius(temp.max,tmp);
            wind_speed = utilities.convertImperialMetric(wind_speed,tmp);
        });

        this.#weatherData.hourly.forEach((hourly) => {
            hourly.temp = utilities.convertFahrenheitCelsius(hourly.temp,tmp);
            hourly.wind_speed = utilities.convertImperialMetric(hourly.wind_speed,tmp);
            hourly.feels_like = utilities.convertFahrenheitCelsius(hourly.feels_like,tmp);
        });
        this.renderWeather();
    }

    get dailyWeatherChart() {
        return this.#dailyWeatherChart;
    }

    get hourlyWeatherChart() {
        return this.#hourlyWeatherChart;
    }

}

export {
    RenderWeatherData
}