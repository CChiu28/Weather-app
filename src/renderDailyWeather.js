import { WeatherDataCharts } from "./charts.js";
import * as utilities from "./utilities.js";

class RenderDailyWeather {
	constructor(weatherData) {
		this.#weatherData = weatherData;
	}

	#weatherData;
	#dailyWeatherChart;

	// Renders the daily chart and weather icons
	async renderDailyWeatherData(daily, tz) {
		const ctx = document.querySelector('#daily-chart');
		this.#dailyWeatherChart = new WeatherDataCharts(this.#weatherData,0,ctx,'daily');
		this.#dailyWeatherChart.createChartjs();

		const weather = this.#weatherData.map(({weather}) => weather);
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
		this.#renderDailyModal();
	}

	// Renders data for daily forecast modal
	#renderDailyModal() {
		const forecast = document.querySelector('.daily-body')
		this.#weatherData.forEach((day) => {
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

	deleteChart() {
		this.#dailyWeatherChart.destroy();
	}

	updateCharts(val) {
		this.#dailyWeatherChart.updateChart(val);
	}
}

export default RenderDailyWeather;