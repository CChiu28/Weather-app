import * as amChart from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';

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
function getTime(time, tz) {
    const unixTime = (time+tz)*1000;
    const date = new Date(unixTime);
    const options = {
        timeStyle: 'short'
    }
    const times = new Intl.DateTimeFormat(undefined,options).format(date);
    return times;
}

function createChart(daily, tz, style) {
    const temps = daily.map(({ temp }) => temp);
    const times = daily.map(({ dt }) => dt);
    const icons = daily.map(({ weather }) => {
        return `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    });
    const entries = [];
    times.forEach(time => {
        // if(style==='daily') 
        //     entries.push(getDate(time,tz));
        // else entries.push(getTime(time,tz));
        entries.push(getDate(time,tz));
    });
    const ctx = document.querySelector(`#${style}Chart`);
    let data = [];
    entries.forEach((entry,index) => {
        if (style==='daily') {
            data.push({
                'day': entry.day,
                'min': Math.round(temps[index].min),
                'max': Math.round(temps[index].max),
                'icon': icons[index]
            });
        } else {
            data.push({
                'time': `${entry.time} ${entry.day}`,
                'day': entry.day,
                'tmp': Math.round(temps[index]),
                'icon': icons[index]
            });
        }
    });
    console.log(style, data);

    const root = amChart.Root.new(`${style}Chart`);
    root.autoResize = false;
    const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
            panX: true,
            panY: false,
            wheelY: "zoomX",
            layout: root.verticalLayout
        })
    );

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        visible: false,
        strictMinMax: true,
        renderer: am5xy.AxisRendererY.new(root, {})
    }));
    // yAxis.data.setAll(data);
    console.log('good');
    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        categoryField: getXAxis(style),
        start: 0.1,
        minZoomCount: 6,
        maxZoomCount: 6,
        renderer: am5xy.AxisRendererX.new(root, {}),
        minGridDistance: 5,
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
    // xAxis.events.once('datavalidated', (ev) => {
    //     ev.target.zoomToIndexes(1,5);
    // })
    console.log('good2');
    let series = getSeries(style, xAxis, yAxis, chart, root);
    console.log('good3');

    if (style==='daily') {
        series.bullets.push(() => {
            return amChart.Bullet.new(root, {
                sprite: amChart.Label.new(root, {
                    text: '{min}',
                    centerX: amChart.percent(50),
                    populateText: true
                }),
                locationY: 0
            });
        });
    }
    series.bullets.push(() => {
        return amChart.Bullet.new(root, {
            sprite: amChart.Label.new(root, {
                text: getDataLabel(style),
                centerX: amChart.percent(50),
                centerY: amChart.percent(100),
                populateText: true
            }),
            locationY: 1
        })
    })

    series.data.setAll(data);
}

function getSeries(style, x, y, chart, root) {
    if (style==='daily') {
        return chart.series.push(am5xy.ColumnSeries.new(root, {
            xAxis: x,
            yAxis: y,
            openValueYField: 'min',
            valueYField: 'max',
            categoryXField: 'day',
            sequencedInterpolation: true,
            maskBullets: false
        }));
    } else return chart.series.push(am5xy.LineSeries.new(root, {
            xAxis: x,
            yAxis: y,
            valueYField: 'tmp',
            categoryXField: 'time',
            // sequencedInterpolation: true,
            maskBullets: false
        }));
}

function getXAxis(style) {
    return style==='daily' ? 'day' : 'time';
}

function getDataLabel(style) {
    return style==='daily' ? '{max}' : '{tmp}';
}

export {
    getDate,
    getTime,
    createChart
}