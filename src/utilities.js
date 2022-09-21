
function getDate(time,tz) {
    const unixTime = (time+tz)*1000;
    const date = new Date(unixTime);
    const options = {
        weekday: 'short',
        day: 'numeric',
    };
    const day = new Intl.DateTimeFormat(undefined,options).format(date);
    const times = new Intl.DateTimeFormat(undefined, {
        timeStyle: 'short'
    }).format(date);
    return {
        day: day,
        time: times
    };
}

// function changeTemp(weatherData, tmp) {
//     // let dailyChartElement = document.querySelector('#chart2');
//     // let hourlyChartElement = document.querySelector('#hourlyChart');
//     const dailyChart = weatherData.dailyWeatherChart;
//     const hourlyChart = weatherData.hourlyWeatherChart;
//     const dailyData = dailyChart.getData;
//     const hourlyData = hourlyChart.getData;
//     const currentTemp = parseInt(document.querySelector('#overview-temp').textContent);
//     const currentFeelsLike = parseInt(document.querySelector('#current-feels-like').textContent);
//     const currentWindSpeed = parseInt(document.querySelector('#current-wind-speed').textContent);
//     console.log(currentTemp, currentFeelsLike, currentWindSpeed, tmp);
//     document.querySelector('#overview-temp').textContent = convertFahrenheitCelsius(currentTemp, tmp);
//     document.querySelector('#current-feels-like').textContent = convertFahrenheitCelsius(currentFeelsLike, tmp);
//     document.querySelector('#current-wind-speed').textContent = convertImperialMetric(currentWindSpeed, tmp);

//     for (let [key,value] of Object.entries(hourlyData)) {
//         if (key==='wind')
//             value.forEach((num, index, value) => {
//                 value[index] = convertImperialMetric(num, tmp);
//             });
//         else value.forEach((num, index, value) => {
//             value[index] = convertFahrenheitCelsius(num, tmp);
//         });
//     }

//     for (let [key,value] of Object.entries(dailyData)) {
//         if (key==='wind')
//             value.forEach((num, index, value) => {
//                 value[index] = convertImperialMetric(num, tmp);
//             });
//         else if (key==='temp')
//             value.forEach((temp, index, value) => {
//                 value[index].min = convertFahrenheitCelsius(temp.min, tmp);
//                 value[index].max = convertFahrenheitCelsius(temp.max, tmp);
//             });
//     }

//     hourlyChart.updateChart('temp');
//     dailyChart.updateChart('daily');
// }

function convertImperialMetric(num, tmp) {
    return tmp==='metric' ? Math.round(num*1.609344) : Math.round(num/1.609344)
}

function convertFahrenheitCelsius(num, tmp) {
    return tmp==='metric' ? Math.round((num-32)*(5/9)) : Math.round((num*1.8)+32)
}

export {
    getDate,
    convertFahrenheitCelsius,
    convertImperialMetric
}