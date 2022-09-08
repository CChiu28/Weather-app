import * as utilities from './utilities.js';
// import Chart from 'chart.js/auto';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as amChart from '@amcharts/amcharts5';
import * as am5xy from "@amcharts/amcharts5/xy";

function formatWeather(data) {
    const { current, daily, timezone_offset, hourly } = data;
    // console.log(current);
    formatMainWeatherData(current);
    formatCurrentWeatherData(current);
    formatDailyWeatherData(daily, timezone_offset);
    formatHourlyWeatherData(hourly, timezone_offset);
    formatWeatherMap();
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
    // const chart = new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //         labels: time.map(tmp => { return tmp[1]; }),
    //         datasets: [{
    //             data: temps.map((tmp) => {
    //                 return tmp.temp;
    //             }),
    //             // backgroundColor: 'blue',
    //             fill: true,
    //             borderColor: 'blue',
    //             tension: 0.3
    //         }]
    //     },
    //     plugins: [
    //         ChartDataLabels, {
    //         // afterDraw: chart => {
    //         //     let xAxis = chart.scales['x-axis-0'];
    //         //     let yAxis = chart.scales['y-axis-0'];
    //         //     xAxis.ticks.forEach((val,index) => {
    //         //         let x = xAxis.getPixelForTick(index);
    //         //         ctx.drawImage(time[index][0], x-12, yAxis.bottom+10);
    //         //     });
    //         // }
    //     }],
    //     options: {
    //         aspectRatio: 16/9,
    //         maintainAspectRatio: false,
    //         responsive: false,
    //         layout: {
    //             padding: {
    //                 bottom: 30,
    //                 right: 15
    //             }
    //         },
    //         plugins: {
    //             legend: {
    //                 display: false
    //             },
    //             labels: {
    //                 render: 'image',
    //                 images: time[0][0]
    //             }
    //         }
    //     }
    // });
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
    createChart(daily,tz);
}

function createChart(daily, tz) {
    const temps = daily.map(({ temp }) => temp);
    const times = daily.map(({ dt }) => dt);
    const icons = daily.map(({ weather }) => {
        return `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    });
    let days = [];
    times.forEach(time => days.push(utilities.getDate(time,tz)));
    const ctx = document.querySelector('#forecastChart');
    let data = [];
    days.forEach((day,index) => {
        data.push({
            'day': day,
            'min': Math.round(temps[index].min),
            'max': Math.round(temps[index].max),
            'icon': icons[index]
        });
    });
    console.log(icons);

    const root = amChart.Root.new('forecastChart');
    root.autoResize = false;
    const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            layout: root.verticalLayout
        })
    );

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        visible: false,
        renderer: am5xy.AxisRendererY.new(root, {
        })
    }));
    // yAxis.data.setAll(data);

    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        categoryField: 'day',
        renderer: am5xy.AxisRendererX.new(root, {}),
        bullet: (root,axis,dataItem) => {
            return am5xy.AxisBullet.new(root, {
                location: 0.5,
                sprite: amChart.Picture.new(root, {
                    src: dataItem.dataContext.icon,
                    centerX: amChart.p50,
                    centerY: amChart.percent(25)
                })
            })
        }
    }));
    xAxis.get("renderer").labels.template.setAll({
        paddingTop: 60
    });
    xAxis.data.setAll(data);

    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        openValueYField: 'min',
        valueYField: 'max',
        categoryXField: 'day',
        sequencedInterpolation: true,
        maskBullets: false
    }));

    series.bullets.push(() => {
        return amChart.Bullet.new(root, {
            sprite: amChart.Label.new(root, {
                text: '{min}',
                centerX: amChart.percent(50),
                populateText: true
            }),
            locationY: 0
        })
    });
    series.bullets.push(() => {
        return amChart.Bullet.new(root, {
            sprite: amChart.Label.new(root, {
                text: '{max}',
                centerX: amChart.percent(50),
                centerY: amChart.percent(100),
                populateText: true
            }),
            locationY: 1
        })
    })

    // series.columns.template.setAll({
    //     height: amChart.percent(50)
    // });
    series.data.setAll(data);

    // const chart = new Chart(ctx, {
    //     type: 'bar',
    //     data: {
    //         labels: days,
    //         datasets: [{
    //             // datalabels: {
    //             //     color: 'black'
    //             // },
    //             data: days.map((day,index) => {
    //                 return [Math.round(temps[index].min),Math.round(temps[index].max)];
    //             }),
    //             backgroundColor: 'red',
    //         }]
    //     },
    //     plugins: [ChartDataLabels],
    //     options: {
    //         plugins: {
    //             legend: {
    //                 display: false
    //             },
    //             tooltip: {
    //                 enabled: false
    //             },
    //             datalabels: {
    //                 // align: 'end',
    //                 // anchor: 'end',
    //                 labels: {
    //                     max: {
    //                         color: 'blue',
    //                         align: 'end',
    //                         anchor: 'end',
    //                         formatter: (value,ctx) => {
    //                             return ctx.dataset.data[ctx.dataIndex][1];
    //                         }
    //                     },
    //                     value: {
    //                         anchor: 'start',
    //                         align: 'start',
    //                         color: 'green',
    //                         formatter: (value,ctx) => {
    //                             return ctx.dataset.data[ctx.dataIndex][0];
    //                         }
    //                     }
    //                 }
    //             }
    //         },
    //         scales: {
    //             y: {
    //                 beginAtZero: false,
    //                 display: true
    //             }
    //         }
    //     }
    // });
}

export {
    formatWeather
}