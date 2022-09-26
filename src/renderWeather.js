import * as utilities from './utilities.js';
import { WeatherDataCharts } from './charts.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { getWeatherHeaderImage } from './api.js';

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
    #hourlyWeatherChart;
    #dailyWeatherChart;

    // Calls other functions to render weather data
    async renderWeather() {
        if (this.#dailyWeatherChart || this.#hourlyWeatherChart) {
            this.deleteCharts();
            utilities.clearDom();
        }
        const { current, alerts, daily, timezone_offset, hourly } = this.#weatherData;
        this.#renderMainWeatherData(current, alerts, 0);
        this.#renderCurrentWeatherData(current);
        this.#renderDailyWeatherData(daily, 0);
        this.#renderHourlyWeatherData(hourly, 0);
    }

    // Renders weather data to the current weather div
    #renderMainWeatherData(current, alerts, tz) {
        const { temp, weather, dt } = current;
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

        cardDiv.setAttribute('class', 'bg-light bg-opacity-75 card position-absolute bottom-0 start-50 translate-middle-x mb-4');
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
        let time = utilities.getDate(dt, tz);
        date.textContent = `${time.time}, ${time.day}`;

        // Renders alerts if there are any
        if (alerts) {
            const alertImg = document.createElement('h1');
            alertImg.setAttribute('class', 'text-warning bi bi-exclamation-triangle-fill text-center');
            alertImg.setAttribute('data-bs-toggle', 'modal');
            alertImg.setAttribute('data-bs-target', '#alert-modal');
            imgWrapper.append(alertImg);
            this.#renderAlertModal(alerts);
        }
    }

    // Renders extra info for current weather
    // Calls generic function that will render each div appropriately with different info
    #renderCurrentWeatherData(current) {
        const { feels_like, pressure, humidity, clouds, wind_speed, uvi } = current;
        this.#renderCurrentWeatherDiv('Feels Like', 'bi bi-thermometer', '.current-feels-like-div', `${Math.round(feels_like)}°`);
        this.#renderCurrentWeatherDiv('Pressure', 'bi bi-speedometer', '.current-pressure-div', `${pressure}`);
        this.#renderCurrentWeatherDiv('Humidity', 'bi bi-moisture', '.current-humidity-div', `${Math.round(humidity)}%`);
        this.#renderCurrentWeatherDiv('Clouds', 'bi bi-clouds', '.current-cloud-div', `${Math.round(clouds)}%`);
        this.#renderCurrentWeatherDiv('Wind Speed', 'bi bi-wind', '.current-wind-div', `${Math.round(wind_speed)}`, `${utilities.getMphKm(utilities.getToggleTemp())}`);
        this.#renderCurrentWeatherDiv('UV Index', 'bi bi-brightness-high', '.current-uv-div', uvi);
    }

    // Renders the hourly chart and weather icons
    #renderHourlyWeatherData(hourly, tz) {
        const hourlyCtx = document.querySelector('#hourly-chart');
        this.#hourlyWeatherChart = new WeatherDataCharts(hourly,tz,hourlyCtx,'hourly',utilities.getToggleTemp());
        this.#hourlyWeatherChart.createChartjs();

        const weather = hourly.map(({weather}) => weather);
        let hourlyChartIcons = document.querySelector('#hourly-chart-icons');
        weather.map((weather) => {
            let div = document.createElement('div');
            let img = new Image();
            img.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
            img.alt = weather[0].description;
            img.title = weather[0].description;
            img.setAttribute('class','img-fluid position-relative');
            div.append(img);
            hourlyChartIcons.append(div);
        });
    }

    // Renders the daily chart and weather icons
    #renderDailyWeatherData(daily, tz) {
        const ctx = document.querySelector('#daily-chart');
        this.#dailyWeatherChart = new WeatherDataCharts(daily,tz,ctx,'daily');
        this.#dailyWeatherChart.createChartjs();

        const weather = daily.map(({weather}) => weather);
        const c2ico = document.querySelector('#daily-chart-icons');
        weather.map((weather) => {
            let div = document.createElement('div');
            div.style.maxWidth = '100%';
            let img = new Image();
            img.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
            img.alt = weather[0].description;
            img.title = weather[0].description;
            div.append(img);
            c2ico.append(div);
        });
        // Render data to modal
        this.#renderDailyModal(daily);
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
            owner.setAttribute('class', 'position-absolute bottom-0 end-0 me-3');
            owner.innerHTML = `Photo by <a href="${imgObj.owner}?utm_source=weather-app&utm_medium=referral">${imgObj.name}</a> on <a href="https://unsplash.com/?utm_source=weather-app&utm_medium=referral">Unsplash</a>`;
            div.append(owner);
        } else div.style.backgroundImage = `url("https://source.unsplash.com/random/?${weather[0].description}")`;
    }

    // Generic function to create card divs for current weather
    // Eliminates need to repeat the creation of dom elements for the current weather section
    #renderCurrentWeatherDiv(label, icon, parent, data, windMetric) {
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
        addIcon.setAttribute('class', `${icon} m-auto`);
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

    // Renders data for daily forecast modal
    #renderDailyModal(daily) {
        const forecast = document.querySelector('.daily-body')
        daily.forEach((day) => {
            const { temp, weather, pop, dt, humidity, uvi, rain, clouds, wind_speed } = day;
            const card = document.createElement('div');
            const cardBody = document.createElement('div');
            const cardDay = document.createElement('h1');
            const cardTemp = document.createElement('h3');
            const condition = document.createElement('img');
            const rainImg = document.createElement('h6');
            const weatherDesc = document.createElement('h4');
            const tempDiv = document.createElement('div');
            const infoDiv = document.createElement('div');
            const infoCol1 = document.createElement('div');
            const infoCol2 = document.createElement('div');

            card.classList.add('card','m-4');
            cardBody.classList.add('card-body');
            cardDay.classList.add('card-header','display-6');
            cardTemp.classList.add('card-title','align-self-center');
            rainImg.setAttribute('class', 'bi bi-umbrella-fill');
            weatherDesc.setAttribute('class', 'card-title');
            tempDiv.setAttribute('class','d-flex justify-content-center');

            // Render modal data 
            const precip = this.#renderWeatherModalData(`${Math.round(pop*100)}%`,'Precipitation','bi bi-umbrella-fill');
            let rainAmount;
            if (rain) {
                rainAmount = this.#renderWeatherModalData(`${utilities.convertMmCmIn(rain,utilities.getToggleTemp())} ${utilities.getCmIn(utilities.getToggleTemp())}`,'Rain','bi bi-droplet-fill');
            } else rainAmount = '';
            const humid = this.#renderWeatherModalData(`${Math.round(humidity)}%`,'Humidity','bi bi-moisture');
            const windSpeed = this.#renderWeatherModalData(`${Math.round(wind_speed)} ${utilities.getMphKm(utilities.getToggleTemp())}`,'Wind','bi bi-wind');
            const uv = this.#renderWeatherModalData(Math.round(uvi), 'UV Index', 'bi bi-brightness-high');
            const cloud = this.#renderWeatherModalData(`${clouds}%`,`Clouds`, 'bi bi-clouds-fill');

            infoDiv.setAttribute('class', 'row');
            infoDiv.append(infoCol1,infoCol2);
            infoCol1.setAttribute('class', 'col');
            infoCol2.setAttribute('class', 'col');
            infoCol1.append(precip,humid,cloud);
            infoCol2.append(rainAmount,windSpeed,uv);
            cardTemp.textContent = `${Math.round(temp.max)}°/${Math.round(temp.min)}°`;
            cardDay.textContent = utilities.getDate(dt,0).day;
            condition.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
            condition.alt = weather[0].description;
            condition.title = weather[0].description;
            weatherDesc.textContent = weather[0].description;

            tempDiv.append(condition,cardTemp);
            cardBody.append(weatherDesc,tempDiv,infoDiv);
            card.append(cardDay,cardBody);
            forecast.append(card);
        });
    }

    // Generic function for daily forecast modal that creates generic divs for different data
    // Eliminates need to repeat the same div creations multiple times
    // Called from function above
    #renderWeatherModalData(data, label, img) {
        const div = document.createElement('div');
        const p = document.createElement('p');
        const dataLabel = document.createElement('p');
        const labelImg = document.createElement('p');

        div.setAttribute('class','d-flex justify-content-start');
        p.textContent = data;
        dataLabel.textContent = `${label}: `;
        labelImg.setAttribute('class', `${img} me-2`);
        div.append(labelImg,dataLabel,p);
        return div;
    }

    // Called when changing charts for the hourly chart
    updateCharts(val) {
        this.#hourlyWeatherChart.updateChart(val);
    }

    // Called when retrieving/updating new weather info
    deleteCharts() {
        this.#dailyWeatherChart.destroy();
        this.#hourlyWeatherChart.destroy();
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

    // get dailyWeatherChart() {
    //     return this.#dailyWeatherChart;
    // }

    // get hourlyWeatherChart() {
    //     return this.#hourlyWeatherChart;
    // }

}

export {
    RenderWeatherData
}