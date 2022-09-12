import * as utilities from './utilities.js';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

function formatWeather(data) {
    const { current, daily, timezone_offset, hourly } = data;
    // console.log(current);
    formatMainWeatherData(current);
    formatCurrentWeatherData(current);
    formatHourlyWeatherData(hourly, timezone_offset);
    formatDailyWeatherData(daily, timezone_offset);
    // formatWeatherMap();
}

function formatMainWeatherData(current) {
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

function formatHourlyWeatherData(hourly, tz) {
    const ctx = document.querySelector('#hourlyDiv');
    // const { dt, temp, weather, pop, rain } = hourly;
    // const temps = hourly.map(({ temp, pop }) => ({'temp': Math.round(temp), 'rain':pop*100}));
    // const time = hourly.map(({ weather, dt }) => {
    //     const img = new Image();
    //     img.src = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`
    //     return [img, utilities.getTime(dt,tz)];
    // });
    // console.log(time);
    hourly.forEach(({ temp, pop, weather, dt}) => {
        // const tmp = `${Math.round(temp)}`;

        const div = document.createElement('div');
        const tmp = document.createElement('span');
        const rain = document.createElement('span');
        const icon = document.createElement('img');
        const time = document.createElement('span');

        tmp.innerText = `${Math.round(temp)}`;
        rain.innerText = `${Math.round(pop*100)}% rain`;
        icon.src = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
        icon.alt = weather[0].description;
        icon.title = weather[0].description;
        time.innerText = utilities.getTime(dt,tz);
        div.append(tmp,icon,rain,time);
        ctx.append(div);
    })
    // utilities.createChart(hourly, tz, 'hourly');
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
        cardDay.innerHTML = utilities.getDate(dt,tz).day;
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
    // utilities.createChart(daily,tz, 'daily');

    const ctx = document.querySelector('#chart2');
    const times = daily.map(({ dt }) => dt);
    const temps = daily.map(({ temp }) => temp);
    const weather = daily.map(({weather}) => weather);
    const precip = daily.map(({ pop }) => Math.round(pop*100));
    let days = [];
    times.forEach(time => days.push(utilities.getDate(time,tz).day));
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: days,
            datasets: [{
                // datalabels: {
                //     color: 'black'
                // },
                data: days.map((day,index) => {
                    return [Math.round(temps[index].min),Math.round(temps[index].max)];
                }),
                backgroundColor: 'red',
                yAxisID: 'tempAxis',
                datalabels: {
                    // align: 'end',
                    // anchor: 'end',
                    labels: {
                        max: {
                            color: 'blue',
                            align: 'end',
                            anchor: 'end',
                            formatter: (value,ctx) => {
                                return ctx.dataset.data[ctx.dataIndex][1];
                            }
                        },
                        value: {
                            anchor: 'start',
                            align: 'start',
                            color: 'green',
                            formatter: (value,ctx) => {
                                return ctx.dataset.data[ctx.dataIndex][0];
                            }
                        }
                    }
                }
            },
            {
                data: precip,
                backgroundColor: 'blue',
                yAxisID: 'rainAxis',
                datalabels: {
                    labels: {
                        value: {
                            anchor: 'start',
                            align: 'start',
                            color: 'blue'
                        }
                    }
                }
            }]
        },
        plugins: [ChartDataLabels],
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            scales: {
                tempAxis: {
                    position: 'left',
                    beginAtZero: false,
                    display: false,
                    ticks: {
                        display: false
                    },
                    suggestedMax: Math.max(...temps)+2,
                    suggestedMin: Math.min(...temps)-1
                },
                rainAxis: {
                    position: 'right',
                    ticks: {
                        display: false
                    },
                    suggestedMax: Math.max(...precip)
                }
                // x: {
                //     ticks: {
                //         display: false
                //     }
                // }
            }
        }
    });
    
    console.log(temps);
    const c2ico = document.querySelector('#chart2icons');
    weather.map((weather) => {
        let img = new Image();
        img.src = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
        img.alt = weather[0].description;
        img.title = weather[0].description;
        // img.setAttribute('id','icon');
        c2ico.append(img);
    })
}

export {
    formatWeather
}