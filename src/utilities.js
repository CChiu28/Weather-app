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

export {
    getDate
}