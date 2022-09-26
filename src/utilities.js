
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

function convertImperialMetric(num, tmp) {
    return tmp==='metric' ? Math.round(num*1.609344) : Math.round(num/1.609344);
}

function convertFahrenheitCelsius(num, tmp) {
    return tmp==='metric' ? Math.round((num-32)*(5/9)) : Math.round((num*1.8)+32);
}

function convertMmCmIn(num, tmp) {
    return tmp==='metric' ? (num*0.1).toFixed(2) : (num*0.0393700787).toFixed(2);
}

function getMphKm(tmp) {
    return tmp==='metric' ? 'km' : 'mph';
}

function getCmIn(tmp) {
    return tmp==='metric' ? 'cm' : 'in';
}

function getToggleTemp() {
    const changeTempBtn = document.querySelector('#temperature-toggle');
    return changeTempBtn.checked ? 'metric' : 'imperial';
}

function clearDom() {
    document.querySelector('#hourly-chart-icons').innerHTML = '';
    document.querySelector('#daily-chart-icons').innerHTML = '';
    document.querySelector('#current-weather').innerHTML = '';
    document.querySelector('#parallax-pic').removeChild(document.querySelector('#parallax-pic').firstChild);
    document.querySelector('.alert-body').innerHTML = '';
    document.querySelector('.daily-body').innerHTML = '';
}

export {
    getDate,
    convertFahrenheitCelsius,
    convertImperialMetric,
    getMphKm,
    getToggleTemp,
    convertMmCmIn,
    getCmIn,
    clearDom
}