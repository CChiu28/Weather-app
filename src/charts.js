import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as utilities from './utilities.js';

class WeatherDataCharts {
    constructor(weather, tz, ctx, type, degree) {
        this.#weather = weather;
        this.#tz = tz;
        this.#type = type;
        this.#ctx = ctx;
        this.#degree = degree;
    }

    #times;
    #temps;
    #precip;
    #feelsLike;
    #wind;
    #rain;
    #snow;
    #degree;
    #weather;
    #tz;
    #type;
    #ctx;
    #chart;

    createChartjs() {
        this.#times = this.#weather.map(({ dt }) => dt);
        this.#temps = this.#weather.map(({ temp }) => temp);
        this.#precip = this.#weather.map(({ pop }) => Math.round(pop*100));
        this.#feelsLike = this.#weather.map(({ feels_like }) => feels_like);
        this.#wind = this.#weather.map(({ wind_speed }) => Math.round(wind_speed));
        this.#rain = this.#weather.map(({ rain }) => {
            if (rain) {
                return rain['1h'];
            } else return 0;
        });
        this.#snow = this.#weather.map(({ snow }) => {
            if (snow)
                return snow['1h'];
            else return 0;
        });

        const days = [];
        this.#times.forEach(time => {
            if (this.#type==='daily')
                days.push(utilities.getDate(time,this.#tz).day);
            else days.push(utilities.getDate(time,this.#tz).time);
        });

        this.#chart = new Chart(this.#ctx, {
            type: this.#getTypeOfChart(),
            data: {
                labels: days,
                datasets: this.#getDailyOrHourlyData()
            },
            plugins: [ChartDataLabels],
            options: this.#getDailyOrHourlyOptions()
        });
    }

    #getTypeOfChart() {
        if (this.#type==='daily')
            return 'bar';
        else return 'line';
    }

    #getDailyOrHourlyData(info) {
        if (this.#type==='daily' || info==='daily') {
            const data = [this.#getWeatherData('dailyPrecip'), this.#getWeatherData('daily')];
            return data;
        } else return [this.#getWeatherData('temp')];
    }

    // Retrieve options for initial loading of charts
    #getDailyOrHourlyOptions() {
        if (this.#type==='daily') {
            const config = {
                maintainAspectRatio: false,
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
                        bottom: 30,
                        top: 30
                    }
                },
                scales: {
                    daysAxis: {
                        position: 'top',
                        grid: {
                            drawTicks: false
                        },
                        ticks: {
                            font: {
                                size: 20
                            }
                        }
                    },
                    tempAxis: {
                        position: 'left',
                        beginAtZero: false,
                        ticks: {
                            display: false,
                        },
                        grid: {
                            drawTicks: false,
                            display: false
                        },
                        suggestedMax: Math.max(...this.#temps.map(tmp => tmp.max))+3,
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
                maintainAspectRatio: false,
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
                        left: 50,
                        right: 50,
                        top: 30
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            font: {
                                size: 17
                            }
                        }
                    },
                    y: {
                        beginAtZero: false,
                        ticks: {
                            display: false
                        },
                        grid: {
                            display: false,
                            drawTicks: false
                        },
                        suggestedMax: Math.max(...this.#temps)+3,
                        suggestedMin: Math.min(...this.#temps)-2
                    }
                }
            };
            return config;
        }
    }

    // Update chart layout when different dataset is loaded
    updateChart(info) {
        this.#chart.data.datasets.pop();
        if (info==='precip') {
            this.#chart.data.datasets.pop();
            this.#chart.options.scales = {
                y: {
                    ticks: {
                        display: false
                    },
                    grid: {
                        display: false,
                        drawTicks: false
                    },
                    suggestedMax: 100
                },
                x: {
                    ticks: {
                        font: {
                            size: 17
                        }
                    }
                }
            }
        } else if (info==='rain') {
            this.#chart.data.datasets.pop();
            this.#chart.data.datasets.push(this.#getWeatherData('snow'));
            this.#chart.options.scales = {
                y: {
                    ticks: {
                        display: false
                    },
                    grid: {
                        display: false,
                        drawTicks: false
                    },
                    suggestedMax: Math.max(...this.#rain)+1
                },
                x: {
                    ticks: {
                        font: {
                            size: 17
                        }
                    }
                }
            }
        } else if (info!='daily') {
            this.#chart.data.datasets.pop();
            this.#chart.options.scales = {
                y: {
                    beginAtZero: false,
                    ticks: {
                        display: false
                    },
                    grid: {
                        display: false,
                        drawTicks: false
                    },
                    suggestedMax: Math.max(...this.#temps)+3,
                    suggestedMin: Math.min(...this.#temps)-2
                },
                x: {
                    ticks: {
                        font: {
                            size: 17
                        }
                    }
                }
            }
        } else if (info==='daily') {
            this.#chart.data.datasets.pop();
            this.#chart.data.datasets.push(this.#getWeatherData('dailyPrecip'));
            this.#chart.options.scales = {
                daysAxis: {
                    position: 'top',
                    grid: {
                        drawTicks: false
                    }
                },
                tempAxis: {
                    position: 'left',
                    beginAtZero: false,
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
        }
        this.#chart.data.datasets.push(this.#getWeatherData(info));
        this.#chart.update();
    }

    #getWeatherData(info) {
        let data = {};
        switch (info) {
            case 'temp':
                const tempGradient = this.#ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
                tempGradient.addColorStop(0, 'rgba(250,174,50,1)');   
                tempGradient.addColorStop(1, 'rgba(250,174,50,0)');
                data = {
                    data: this.#temps.map((tmp) => {
                        return Math.round(tmp);
                    }),
                    type: 'line',
                    backgroundColor: tempGradient,
                    borderColor: 'orange',
                    datalabels: {
                        labels: {
                            value: {
                                anchor: 'end',
                                align: 'end',
                                color: 'orange',
                                font: {
                                    size: 20
                                },
                                formatter: (val,ctx) => {
                                    return `${ctx.dataset.data[ctx.dataIndex]}°`
                                }
                            }
                        }
                    },
                    tension: 0.2,
                    fill: true,
                };
                break;
            case 'precip':
                const precipGradient = this.#ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
                precipGradient.addColorStop(0, 'hsla(232, 100%, 57%, 1)');   
                precipGradient.addColorStop(1, 'hsla(206, 100%, 85%, 1)');
                data = {
                    data: this.#precip.map((val) => {
                        return val;
                    }),
                    type: 'line',
                    backgroundColor: precipGradient,
                    borderColor: 'blue',
                    datalabels: {
                        display: (ctx) => {
                            return ctx.dataset.data[ctx.dataIndex] > 0 ? 'auto' : false;
                        },
                        labels: {
                            value: {
                                anchor: 'end',
                                align: 'end',
                                color: 'blue',
                                font: {
                                    size: 20
                                },
                                formatter: (val,ctx) => {
                                    return `${ctx.dataset.data[ctx.dataIndex]}%`
                                }
                            }
                        }
                    },
                    tension: 0.2,
                    fill: true,
                };
                break;
            case 'rain':
                const rainGradient = this.#ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
                rainGradient.addColorStop(0, 'hsla(232, 100%, 57%, 1)');   
                rainGradient.addColorStop(1, 'hsla(206, 100%, 85%, 1)');
                data = {
                    data: this.#rain.map((val) => {
                        return utilities.convertMmCmIn(val,this.#degree);
                    }),
                    type: 'line',
                    backgroundColor: rainGradient,
                    borderColor: 'blue',
                    datalabels: {
                        display: (ctx) => {
                            return ctx.dataset.data[ctx.dataIndex] > 0 ? 'auto' : false;
                        },
                        labels: {
                            value: {
                                anchor: 'end',
                                align: 'end',
                                color: 'blue',
                                font: {
                                    size: 20
                                },
                                formatter: (val,ctx) => {
                                    return `${ctx.dataset.data[ctx.dataIndex]} ${utilities.getCmIn(this.#degree)}`;
                                }
                            }
                        }
                    },
                    tension: 0.2,
                    fill: true,
                };
                break;
            case 'snow':
                const snowGradient = this.#ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
                snowGradient.addColorStop(0, 'hsla(197, 14%, 57%, 1)');   
                snowGradient.addColorStop(1, 'hsla(192, 17%, 94%, 1)');
                data = {
                    data: this.#snow.map((val) => {
                        return utilities.convertMmCmIn(val,this.#degree);
                    }),
                    type: 'line',
                    backgroundColor: snowGradient,
                    borderColor: 'gray',
                    datalabels: {
                        display: (ctx) => {
                            return ctx.dataset.data[ctx.dataIndex] > 0 ? 'auto' : false;
                        },
                        labels: {
                            value: {
                                anchor: 'end',
                                align: 'end',
                                color: 'black',
                                font: {
                                    size: 20
                                },
                                formatter: (val,ctx) => {
                                    return `${ctx.dataset.data[ctx.dataIndex]} ${utilities.getCmIn(this.#degree)}`;
                                }
                            }
                        }
                    },
                    tension: 0.2,
                    fill: true,
                };
                break;
            case 'feels-like':
                const feelsLikeGradient = this.#ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
                feelsLikeGradient.addColorStop(0, 'rgba(250,174,50,1)');   
                feelsLikeGradient.addColorStop(1, 'rgba(250,174,50,0)');
                data = {
                    data: this.#feelsLike.map((val) => {
                        return Math.round(val);
                    }),
                    type: 'line',
                    backgroundColor: feelsLikeGradient,
                    borderColor: 'orange',
                    datalabels: {
                        labels: {
                            value: {
                                anchor: 'end',
                                align: 'end',
                                color: 'orange',
                                font: {
                                    size: 20
                                },
                                formatter: (val,ctx) => {
                                    return `${ctx.dataset.data[ctx.dataIndex]}°`
                                }
                            }
                        }
                    },
                    tension: 0.2,
                    fill: true,
                };
                break;
            case 'wind':
                const windGradient = this.#ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
                windGradient.addColorStop(0, 'hsla(0, 0%, 33%, 1)');   
                windGradient.addColorStop(1, 'hsla(0, 0%, 82%, 1)');
                data = {
                    data: this.#wind.map((val) => {
                        return val;
                    }),
                    type: 'bar',
                    backgroundColor: windGradient,
                    borderColor: 'gray',
                    datalabels: {
                        labels: {
                            value: {
                                anchor: 'end',
                                align: 'end',
                                color: 'black',
                                font: {
                                    size: 20
                                },
                                formatter: (val,ctx) => {
                                    return `${ctx.dataset.data[ctx.dataIndex]} ${utilities.getMphKm(this.#degree)}`
                                }
                            }
                        }
                    },
                    tension: 0.2,
                    fill: true,
                };
                break;
            case 'daily':
                const dailyGradient = this.#ctx.getContext('2d').createLinearGradient(0,0,0,400);
                dailyGradient.addColorStop(0,'hsla(32, 93%, 55%, 1)');
                dailyGradient.addColorStop(1, 'hsla(60, 69%, 75%, 1)');
                data = {
                    data: this.#temps.map((tmp) => {
                            return [Math.round(tmp.min), Math.round(tmp.max)];
                        }
                    ),
                    type: 'bar',
                    backgroundColor: dailyGradient,
                    yAxisID: 'tempAxis',
                    maxBarThickness: 25,
                    borderRadius: Number.MAX_VALUE,
                    borderSkipped: false,
                    datalabels: {
                        labels: {
                            max: {
                                color: 'orange',
                                align: 'end',
                                anchor: 'end',
                                font: {
                                    size: 15
                                },
                                formatter: (value,ctx) => {
                                    return `${ctx.dataset.data[ctx.dataIndex][1]}°`;
                                }
                            },
                            value: {
                                anchor: 'start',
                                align: 'start',
                                color: 'orange',
                                font: {
                                    size: 15
                                },
                                formatter: (value,ctx) => {
                                    return `${ctx.dataset.data[ctx.dataIndex][0]}°`;
                                }
                            }
                        }
                    }
                };
                break;
            case 'dailyPrecip':
                const dailyPrecipGradient = this.#ctx.getContext('2d').createLinearGradient(0,0,0,400);
                dailyPrecipGradient.addColorStop(0,'hsla(217, 100%, 50%, 1)');
                dailyPrecipGradient.addColorStop(1, 'hsla(186, 100%, 69%, 1)');
                data = {
                    data: this.#precip,
                    type: 'bar',
                    backgroundColor: dailyPrecipGradient,
                    yAxisID: 'rainAxis',
                    maxBarThickness: 25,
                    datalabels: {
                        display: (ctx) => {
                            return ctx.dataset.data[ctx.dataIndex] > 0 ? 'auto' : false;
                        },
                        labels: {
                            value: {
                                anchor: 'start',
                                align: 'start',
                                color: 'blue',
                                font: {
                                    size: 15
                                },
                                formatter: (val,ctx) => {
                                    return `${ctx.dataset.data[ctx.dataIndex]}%`;
                                }
                            }
                        }
                    }
                };
                break;
        }
        return data;
    }

    destroy() {
        this.#chart.destroy();
    }

    get getData() {
        return {
            temp: this.#temps,
            feelsLike: this.#feelsLike,
            wind: this.#wind
        };
    }
}


export {
    WeatherDataCharts
}