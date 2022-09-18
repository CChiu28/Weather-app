// import * as amChart from '@amcharts/amcharts5';
// import * as am5xy from '@amcharts/amcharts5/xy';

function getDate(time,tz) {
    // console.log(time, tz);
    const unixTime = (time+tz)*1000;
    const date = new Date(unixTime);
    // console.log(date);
    const options = {
        weekday: 'short',
        day: 'numeric',
    };
    const day = new Intl.DateTimeFormat(undefined,options).format(date);
    const times = new Intl.DateTimeFormat(undefined, {
        timeStyle: 'short'
    }).format(date);
    // return date.toLocaleDateString(undefined, options);
    return {
        day: day,
        time: times
    };
}

function changeTemp(weatherData, tmp) {
    // let dailyChartElement = document.querySelector('#chart2');
    // let hourlyChartElement = document.querySelector('#hourlyChart');
    const dailyChart = weatherData.dailyWeatherChart;
    const hourlyChart = weatherData.hourlyWeatherChart;
    const dailyData = dailyChart.getData;
    const hourlyData = hourlyChart.getData;
    const currentTemp = parseInt(document.querySelector('#overview-temp').textContent);
    const currentFeelsLike = parseInt(document.querySelector('#current-feels-like').textContent);
    const currentWindSpeed = parseInt(document.querySelector('#current-wind-speed').textContent);
    console.log(currentTemp, currentFeelsLike, currentWindSpeed, tmp);
    document.querySelector('#overview-temp').textContent = convertFahrenheitCelsius(currentTemp, tmp);
    document.querySelector('#current-feels-like').textContent = convertFahrenheitCelsius(currentFeelsLike, tmp);
    document.querySelector('#current-wind-speed').textContent = convertImperialMetric(currentWindSpeed, tmp);

    for (let [key,value] of Object.entries(hourlyData)) {
        if (key==='wind')
            value.forEach((num, index, value) => {
                value[index] = convertImperialMetric(num, tmp);
            });
        else value.forEach((num, index, value) => {
            value[index] = convertFahrenheitCelsius(num, tmp);
        });
    }

    for (let [key,value] of Object.entries(dailyData)) {
        if (key==='wind')
            value.forEach((num, index, value) => {
                value[index] = convertImperialMetric(num, tmp);
            });
        else if (key==='temp')
            value.forEach((temp, index, value) => {
                value[index].min = convertFahrenheitCelsius(temp.min, tmp);
                value[index].max = convertFahrenheitCelsius(temp.max, tmp);
            });
    }

    hourlyChart.updateChart('temp');
    dailyChart.updateChart('daily');
}

function convertImperialMetric(num, tmp) {
    if (tmp==='C')
        return Math.round(num*1.609344);
    else return Math.round(num/1.609344);
}

function convertFahrenheitCelsius(num, tmp) {
    if (tmp==='C')
        return Math.round((num-32)*(5/9));
    else return Math.round((num*1.8)+32);
}

export {
    getDate,
    changeTemp,
    convertFahrenheitCelsius,
    convertImperialMetric
}