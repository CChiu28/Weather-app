export function getDate(time,tz) {
    // console.log(time, tz);
    const unixTime = (time+tz)*1000;
    const date = new Date(unixTime);
    // console.log(date);
    const options = {
        weekday: 'short',
        day: 'numeric'
    };
    const day = new Intl.DateTimeFormat(undefined,options).format(date);
    // return date.toLocaleDateString(undefined, options);
    return day;
}

export function getTime(time, tz) {
    const unixTime = (time+tz)*1000;
    const date = new Date(unixTime);
    const options = {
        timeStyle: 'short'
    }
    return new Intl.DateTimeFormat(undefined,options).format(date);
}