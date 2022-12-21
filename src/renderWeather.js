import * as utilities from './utilities.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { getWeatherHeaderImage } from './api.js';
import RenderDailyWeather from './renderDailyWeather.js';
import RenderHourlyWeather from './renderHourlyWeather.js';

class RenderWeatherData {
    constructor(weatherData, name, state, country) {
        this.#weatherData = weatherData;
        this.#name = name;
        this.#state = state;
        this.#country = country;
    }
    
    #weatherData;
    #name;
    #state;
    #country;
    #renderDaily;
    #renderHourly;

    // Calls other functions to render weather data
    async renderWeather() {
        if (this.#renderDaily || this.#renderHourly) {
            this.deleteCharts()
            utilities.clearDom();
        }
        const { alerts, daily, timezone_offset, hourly } = this.#weatherData;
        this.#renderDaily = new RenderDailyWeather(daily);
        this.#renderHourly = new RenderHourlyWeather(hourly);

        this.#renderMainWeatherData();
        this.#renderCurrentWeatherData();
        await this.#renderDaily.renderDailyWeatherData();
        await this.#renderHourly.renderHourlyWeatherData();
    }

    // Renders weather data to the current weather div
    #renderMainWeatherData(current, alerts, tz) {
        const { temp, weather, dt } = this.#weatherData.current;
        const parentDiv = document.querySelector('#parallax-pic');
        const cardDiv = document.createElement('div');
        const cardBody = document.createElement('div');
        const overviewData = document.createElement('div');
        const currTemp = document.createElement('h1');
        const location = document.createElement('h6');
        const currCondition = document.createElement('h6');
        const imgWrapper = document.createElement('div');
        const conditionImg = document.createElement('img');
        const date = document.createElement('div');

        cardDiv.setAttribute('class', 'bg-light bg-opacity-85 card position-absolute bottom-0 start-50 translate-middle-x mb-5');
        cardBody.setAttribute('class', 'card-body d-flex');
        currTemp.setAttribute('class', 'display-1');
        date.setAttribute('class', 'card-footer');

        overviewData.append(currTemp, location, currCondition);
        imgWrapper.append(conditionImg);
        cardBody.append(overviewData,imgWrapper);
        cardDiv.append(cardBody, date);
        parentDiv.prepend(cardDiv);
        
        currTemp.textContent = `${Math.round(temp)}°`;
        if (this.#state)
            location.textContent = `${this.#name}, ${this.#state}`;
        else location.textContent = `${this.#name}, ${this.#country}`;
        currCondition.textContent = weather[0].description;
        conditionImg.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
        conditionImg.alt = weather[0].description;
        conditionImg.title = weather[0].description;
        let time = utilities.getDate(dt, 0);
        date.textContent = `${time.time}, ${time.day}`;

        // Renders alerts if there are any
        if (this.#weatherData.alerts) {
            const alertImg = document.createElement('h1');
            alertImg.setAttribute('class', 'text-warning bi bi-exclamation-triangle-fill text-center');
            alertImg.setAttribute('data-bs-toggle', 'modal');
            alertImg.setAttribute('data-bs-target', '#alert-modal');
            alertImg.style.cursor = 'pointer';
            imgWrapper.append(alertImg);
            this.#renderAlertModal(this.#weatherData.alerts);
        }
    }

    // Renders extra info for current weather
    // Calls generic function that will render each div appropriately with different info
    #renderCurrentWeatherData(current) {
        const { feels_like, pressure, humidity, clouds, wind_speed, uvi } = this.#weatherData.current;
        this.#renderCurrentWeatherDiv('Feels Like', 'bi bi-thermometer', `${Math.round(feels_like)}°`);
        this.#renderCurrentWeatherDiv('Pressure', 'bi bi-speedometer', `${pressure}`);
        this.#renderCurrentWeatherDiv('Humidity', 'bi bi-moisture', `${Math.round(humidity)}%`);
        this.#renderCurrentWeatherDiv('Clouds', 'bi bi-clouds', `${Math.round(clouds)}%`);
        this.#renderCurrentWeatherDiv('Wind Speed', 'bi bi-wind', `${Math.round(wind_speed)}`, `${utilities.getMphKm(utilities.getToggleTemp())}`);
        this.#renderCurrentWeatherDiv('UV Index', 'bi bi-brightness-high', uvi);
    }

    // Grabs weather image for background
    // Fallbacks to a non-API source due to limited API calls
    async renderWeatherHeaderImage(current) {
        const { weather } = current;
        const div = document.querySelector('#parallax-pic');
        if (div.lastChild&&div.lastChild.nodeName==='P')
            div.removeChild(div.lastChild);
        let imgObj = await getWeatherHeaderImage(weather[0].description);
        if (imgObj!=null) {
            div.style.backgroundImage = `url(${imgObj.img})`;
            const owner = document.createElement('p');
            owner.setAttribute('class', 'position-absolute bottom-0 end-0 m-2 p-1 bg-light');
            owner.innerHTML = `Photo by <a href="${imgObj.owner}?utm_source=weather-app&utm_medium=referral">${imgObj.name}</a> on <a href="https://unsplash.com/?utm_source=weather-app&utm_medium=referral">Unsplash</a>`;
            div.append(owner);
        } else div.style.backgroundImage = `url("https://source.unsplash.com/random/?${weather[0].description}")`;
    }

    // Generic function to create card divs for current weather
    // Eliminates need to repeat the creation of dom elements for the current weather section
    #renderCurrentWeatherDiv(label, icon, data, windMetric) {
        const addLabel = document.createElement('h6');
        const addIcon = document.createElement('h4');
        const addData = document.createElement('p');
        const div = document.createElement('div');
        const cardDiv = document.createElement('div');
        const parentDiv = document.createElement('div');
        const article = document.querySelector('#current-weather');

        parentDiv.setAttribute('class', 'card text-center shadow-sm mb-2 mt-2 current');
        div.setAttribute('class', 'card-body d-flex flex-column align-items-center');
        addLabel.textContent = label;
        addLabel.setAttribute('class', 'fw-bold m-auto');
        addIcon.setAttribute('class', `${icon} m-auto text-secondary`);
        addData.setAttribute('class', 'display-6 m-auto');
        if (label==='Wind Speed') {
            const speedDiv = document.createElement('div');
            const speed = document.createElement('p');
            addData.textContent = data;
            speed.textContent = windMetric;
            speed.setAttribute('class', 'align-self-end');
            speedDiv.setAttribute('class', 'd-flex');
            speedDiv.append(addData,speed);
            div.append(addIcon,addLabel,speedDiv);
        } else {
            addData.textContent = data;
            div.append(addIcon, addLabel, addData);
        }
        cardDiv.append(div);
        parentDiv.append(div);
        article.append(parentDiv);
    }

    // Renders data for alert modal
    #renderAlertModal(data) {
        const parent = document.querySelector('.alert-body');
        data.forEach((alerts) => {
            const div = document.createElement('div');
            const sender = document.createElement('h6');
            const event = document.createElement('h6');
            const times = document.createElement('p');
            const endTime = document.createElement('p');
            const desc = document.createElement('p');
            const start = utilities.getDate(alerts.start,0);
            const end = utilities.getDate(alerts.end,0);

            div.setAttribute('class', 'card p-3')
            event.setAttribute('class', 'display-6');

            sender.textContent = alerts.sender_name;
            event.textContent = alerts.event;
            times.textContent = `${start.day}, ${start.time} to ${end.day}, ${end.time}`;
            desc.textContent = alerts.description;
            div.append(sender,event,times,endTime,desc);
            parent.append(div);
        })
    }

    // Called when changing charts for the hourly chart
    updateCharts(val) {
        this.#renderHourly.updateCharts(val);
    }

    // Called when retrieving/updating new weather info
    deleteCharts() {
        this.#renderDaily.deleteChart();
        this.#renderHourly.deleteChart();
    }

    // Flips weather data from imperial to metric and vice versa
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
}

export {
    RenderWeatherData
}