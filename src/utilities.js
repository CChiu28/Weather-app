export function getDate(time,tz) {
    // console.log(time, tz);
    const unixTime = (time+tz)*1000;
    const date = new Date(unixTime);
    // console.log(date);
    const options = {
        weekday: 'short',
        day: 'numeric'
    };
    // const day = new Intl.DateTimeFormat('en-US',options).format(date);
    const day = date.toLocaleDateString(undefined, options);
    return day;
}