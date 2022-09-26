import { WeatherDataCharts } from "./charts";
import * as utilities from "./utilities";

class RenderHourlyWeather {
	constructor(weatherData) {
		this.#weatherData = weatherData;
	}

	#weatherData;
	#hourlyWeatherChart;

	// Renders the hourly chart and weather icons
	async renderHourlyWeatherData() {
		const hourlyCtx = document.querySelector('#hourly-chart');
		this.#hourlyWeatherChart = new WeatherDataCharts(this.#weatherData,0,hourlyCtx,'hourly',utilities.getToggleTemp());
		this.#hourlyWeatherChart.createChartjs();

		const weather = this.#weatherData.map(({weather}) => weather);
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

	updateCharts(val) {
		this.#hourlyWeatherChart.updateChart(val);
	}

	deleteChart() {
		this.#hourlyWeatherChart.destroy();
	}
}

export default RenderHourlyWeather;