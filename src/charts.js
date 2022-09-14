import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as utilities from './utilities.js';

class WeatherDataCharts {
    constructor(weather, tz, ctx, type) {
        this.weather = weather;
        this.tz = tz;
        this.type = type;
        this.ctx = ctx;
    }

    #times;
    #temps;
    #precip;

    createChartjs() {
        this.#times = this.weather.map(({ dt }) => dt);
        this.#temps = this.weather.map(({ temp }) => temp);
        this.#precip = this.weather.map(({ pop }) => Math.round(pop*100));
        let days = [];
        this.#times.forEach(time => {
            if (this.type==='daily')
                days.push(utilities.getDate(time,this.tz).day);
            else days.push(utilities.getDate(time,this.tz).time);
        });

        const chart = new Chart(this.ctx, {
            type: this.#getTypeOfChart(),
            data: {
                labels: days,
                datasets: this.#getDailyOrHourlyData(days)
            },
            plugins: [ChartDataLabels],
            options: this.#getDailyOrHourlyOptions()
        });
    }

    #getTypeOfChart() {
        if (this.type==='daily')
            return 'bar';
        else return 'line';
    }

    #getDailyOrHourlyData(days) {
        if (this.type==='daily') {
            const data = [{
                data: this.#temps.map((tmp) => {
                        return [Math.round(tmp.min), Math.round(tmp.max)];
                    }
                ),
                type: 'bar',
                backgroundColor: 'red',
                yAxisID: 'tempAxis',
                datalabels: {
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
                    data: this.#precip,
                    type: 'bar',
                    backgroundColor: 'blue',
                    yAxisID: 'rainAxis',
                    datalabels: {
                        display: (ctx) => {
                            return ctx.dataset.data[ctx.dataIndex] > 0 ? 'auto' : false;
                        },
                        labels: {
                            value: {
                                anchor: 'start',
                                align: 'start',
                                color: 'blue'
                            }
                        }
                    }
                }
            ];
            return data;
        } else {
            const data = [{
                data: days.map((d,index) => {
                    return Math.round(this.#temps[index]);
                }),
                type: 'line',
                backgroundColor: 'yellow',
                borderColor: 'orange',
                datalabels: {
                    labels: {
                        value: {
                            anchor: 'end',
                            align: 'end',
                            color: 'orange'
                        }
                    }
                },
                tension: 0.2,
                fill: true
            }];
            console.log(data);
            return data;
        }
    }

    #getDailyOrHourlyOptions() {
        if (this.type==='daily') {
            const config = {
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
                layout: {
                    padding: {
                        bottom: 30
                    }
                },
                scales: {
                    daysAxis: {
                        position: 'top',
                        grid: {
                            drawTicks: false
                        }
                    },
                    tempAxis: {
                        position: 'left',
                        beginAtZero: false,
                        // display: false,
                        ticks: {
                            display: false,
                        },
                        grid: {
                            drawTicks: false,
                            display: false
                        },
                        suggestedMax: Math.max(...this.#temps.map(tmp => tmp.max))+2,
                        suggestedMin: Math.min(...this.#temps.map(tmp => tmp.min))-2
                    },
                    rainAxis: {
                        position: 'right',
                        ticks: {
                            display: false
                        },
                        grid: {
                            drawTicks: false,
                            display: false
                        },
                        suggestedMax: 100
                    }
                }
            };
            return config;
        } else {
            const config = {
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
                layout: {
                    padding: {
                        bottom: 30
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            display: false
                        },
                        grid: {
                            display: false,
                            drawTicks: false
                        },
                        suggestedMax: Math.max(...this.#temps)+2,
                        suggestedMin: Math.min(...this.#temps)-2
                    }
                }
            };
            console.log(config);
            return config;
        }
    }
}


export {
    WeatherDataCharts
}