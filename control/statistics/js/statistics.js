"use strict";

Array.prototype.max = function () {
    return Math.max.apply(Math, this);
};

var Charts = function () {
    this.data_raw = null;
    this.points_count = 0;
    this.data_parsed = null;
    this.current_param = {
        value: 'speed',
        name: 'Скорость (Км/ч)'
    };
    this.min_points = 10;
    this.max_points = 40;
    this.shown_percentage = 100;
    this.start = 0;
    this.height = 551;

    this.parseData = function (data) {
        var data_parsed = {
            x: [],
            y: []
        };

        for (var i = this.start, l = this.max_points; i < l; i++) {
            data_parsed.x.push(core.utilities.humanizeTimeFromDateObject(core.utilities.parseDateMysqlStrToDateOdject(data[i].date)));
            data_parsed.y.push(core.utilities.convertKnotsToKms(data[i][this.current_param.value]));
        }

        return data_parsed;
    };

    this.draw = function (animation) {
        var options = {
                container_id: 'chart',
                line_opts: {
                    scaleFontSize: 11,

                    //Boolean - If we show the scale above the chart data
                    scaleOverlay: true,

                    //Boolean - If we want to override with a hard coded scale
                    scaleOverride: true,

                    //** Required if scaleOverride is true **
                    //Number - The number of steps in a hard coded scale
                    scaleSteps: this.data_parsed.y.max() / 5,

                    //Number - The value jump in the hard coded scale
                    scaleStepWidth: 5,

                    //Number - The scale starting value
                    scaleStartValue: 0,

                    animation: animation
                }
            },
            datasets = [],
            x = this.data_parsed.x,
            y = this.data_parsed.y;


        $('#chart').attr('width', 0).attr('width', $('#chart').parent().width());

        datasets.push({
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            data: y
        });

        var line = {
            labels: x,
            datasets: datasets
        };

        var chart = new Chart(document.getElementById('chart').getContext("2d")).Line(line, options.line_opts);
    };

    /*this.draw = function () {
        $('#chart').dxChart({
            dataSource: this.data_parsed,
            commonSeriesSettings: {
                type: "spline",
                argumentField: "date"
            },
            commonAxisSettings: {
                grid: {
                    visible: true
                }
            },
            argumentAxis:{
                grid:{
                    visible: true
                }
            },
            series: [
                {
                    valueField: this.current_param.value,
                    name: this.current_param.name
                }
            ],
            tooltip:{
                enabled: true
            },
            legend: {
                verticalAlignment: "bottom",
                horizontalAlignment: "center"
            },
            title: "Показатель " + this.current_param.name,
            commonPaneSettings: {
                border:{
                    visible: true,
                    bottom: true
                }
            },
            animation: true
        });
    };*/

    this.prepareData = function (data) {
        this.data_raw = data;
        this.data_parsed = this.parseData(this.data_raw);
        this.points_count = data.length;
    };

    this.init = function (data) {
        $('#chart').attr({height: this.height});

        this.prepareData(data);

        var t = this;

        this.draw(true);

        $('.chart-timeline>div').slider({
            step: 1,
            range: true,
            min: 0,
            max: this.points_count,
            values: [ 0, this.max_points ],
            stop: function( event, ui ) {
                var points_start = ui.value;

                console.log('points_start', points_start, 't.points_count', t.points_count, 't.max_points', t.max_points)

                t.max_points = ui.values[ 1 ];
                t.start = ui.values[ 0 ];
                t.data_parsed = t.parseData(t.data_raw);

                t.draw(false);
            }
        });

        $(window).on('resize.chart', function(){
            t.draw(false);
        });

        /*.draggable({
            grid: [ Math.ceil($('.chart-timeline').width() / t.points_count), 0 ],
            containment: 'parent',
            stop: function (event, ui) {
                var arm_start_percent = Math.ceil((ui.position.left / $('.chart-timeline').width()) * 100),
                    points_per_percent = Math.ceil(t.points_count / 100),
                    points_start = Math.ceil(points_per_percent * arm_start_percent);

                console.log('points_start', points_start, 'points_per_percent', points_per_percent, 't.points_count', t.points_count, 't.max_points', t.max_points)

                if(points_start + t.max_points > t.points_count){
                    points_start = t.points_count - t.max_points;
                }

                t.data_parsed = t.parseData(t.data_raw);
                t.start = points_start;

                t.draw({
                    animation: false
                });
            }
        });*/
    };
};

/**
 *  View realisation
 **/
var View = function () {
    this.mode = 'chart';
    this.chart = new Charts();

    /* Class constructor */
    this.__construct = function () {
        this.bindViewModeSwithcher();
    };

    this.bindDatepicker = function(date){
        $('#datepicker').datepicker({
            firstDay: 1,
            minDate: '-30d',
            maxDate: '+0d',
            prevText: 'Назад',
            nextText: 'Вперед',
            defaultDate: date,
            dayNames: [ "Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота" ],
            dayNamesMin: [ "Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб" ],
            dayNamesShort: [ "Вос", "Пон", "Вто", "Сре", "Чет", "Пят", "Суб" ],
            monthNames: [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ],
            monthNamesShort: [ "Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек" ]
        });
    };

    this.bindViewModeSwithcher = function () {
        if (this.mode == 'table') {
            $('#export').show();
        }

        $('.view-mode-switcher a.btn').removeClass('active');
        $('.view-mode-switcher a.btn[rel="' + this.mode + '"]').addClass('active');

        $('.view-mode-switcher a.btn').off('click').on('click', function (e) {
            var mode = $(this).attr('rel');
            MC.View.mode = mode;

            $('.view-mode-switcher a.btn').removeClass('active');
            $('.view-mode-switcher a.btn[rel="' + mode + '"]').addClass('active');

            MC.View.showCurrent();

            if (mode == 'table') {
                $('#export').fadeIn(200);
            } else {
                $('#export').fadeOut(200);
            }

            e.preventDefault();
        });
    };

    this.showNoSelectedCar = function () {
        $('#statistics').html('Выберите машину из списка.');
    };

    this.showChart = function (data) {
        var html = '<div class="chart-header">' +
            '<nav class="chart-options">' +
            //'<a href="#">Скорость</a>' +
            //'<a href="#">Высота</a>' +
            '</nav>' +
            '</div>' +
            '<div class="chart-timeline">' +
                '<div></div>' +
            '</div>' +
            '<div class="chart-container">' +
                '<canvas id="chart"></canvas>' +
            '</div>';

        $('#statistics').html(html);

        this.chart.init(data);
    };

    this.showTable = function (data) {
        var html = '<table class="width-100 hovered">',
            data_r = data.slice(0); // Clone Array hack

        data_r.reverse();

        html += '<tr>' +
            '<th width="1%"><strong>№</strong></th>' +
            '<th width="20%"><strong>Время</strong></th>' +
            '<th width="15%"><strong>Скорость, км/ч</strong></th>' +
            '<th width="1%"><strong>Альтитуда</strong></th>' +
            '<th width="70%"><strong>Положение</strong></th>' +
            '</tr>';

        for (var i = 0, l = data_r.length; i < l; i++) {
            html += '<tr>' +
                '<td>' + ((data_r.length) - i) + '</td>' +
                '<td>' + core.utilities.humanizeTimeFromDateObject(core.utilities.parseDateMysqlStrToDateOdject(data_r[i].date)) + '</td>' +
                '<td>' + core.utilities.convertKnotsToKms(data_r[i].speed) + '</td>' +
                '<td>' + data_r[i].altitude + '</td>' +
                '<td>' + data_r[i].id + '</td>' +
                '</tr>';
        }

        html += '</table>';

        $('#statistics').html(html);
    };

    this.showCurrent = function () {
        if (MC.Data.current_car && MC.Data.current_car.id && MC.Data.current_car.statistics && MC.Data.current_car.statistics.length >= 1) {
            if (this.mode == 'table') {
                this.showTable(MC.Data.current_car.statistics);
            } else if (this.mode == 'chart') {
                this.showChart(MC.Data.current_car.statistics);
            }

        } else if (MC.Data.current_car) {
            $('#statistics').html('Данных для машины &laquo;' + MC.Data.current_car.name + '&raquo; на выбранную дату нет, выберите другую дату.');
        } else {
            $('#statistics').html('Выберите машину из списка.');
        }
    };

    /* Create fleets selects */
    this.createCarsAndFleetsMenu = function () {
        //Cars select
        var exclude = null;

        if (MC.Data.fleet != 'none' && MC.Data.fleet != '' && MC.Data.current_fleet) {
            exclude = {
                key_name: 'fleet_id',
                value_name: MC.Data.fleet
            };
        }

        core.ui.createSelect('#cars-menu', {
            id: 'cars-menu-select',
            default_opt: {
                val: 'none',
                name: '-'
            },
            default: MC.Data.car,
            key_name: 'id',
            value_name: 'name',
            exclude: exclude,
            items: MC.Data.cars,
            onChange: function (val) {
                document.location.hash = '#fleet=' + MC.Data.fleet + '&car=' + val;
            }
        });

        //Groups select
        core.ui.createSelect('#fleets-menu', {
            id: 'fleets-menu-select',
            default_opt: {
                val: 'all',
                name: 'Все группы'
            },
            default: MC.Data.fleet,
            key_name: 'id',
            value_name: 'name',
            items: MC.Data.fleets,
            onChange: function (val) {
                document.location.hash = '#fleet=' + val;
            }
        });

        core.loading.unsetLoading('fleets-and-cars-menu-block');
    };

    /* Set header texts */
    this.setHeaderTexts = function () {
        var html = '';

        if (MC.Data.current_fleet) {
            html += ' / ' + MC.Data.current_fleet.name;
        }

        if (MC.Data.current_car) {
            html += ' / ' + MC.Data.current_car.name + ' ' + core.utilities.drawGId(MC.Data.current_car.g_id, 'small');
            html += '<span class="g_id-spacer"></span>';
        }

        $('#current-fleet-and-car').html(html);
    };

    /* Init actions */
    this.__construct();
};

/**
 *  Data realisation
 **/
var Data = function () {
    /* Class params */
    this.cars = [];
    this.fleets = [];
    this.hash = core.ui.getHashData();
    this.car = 'none';
    this.fleet = 'all';
    this.timemachine = false;
    this.date = new Date();

    /* Class constructor */
    this.__construct = function () {
        this.hardLoad();

        $(window).on('hashchange', function () {
            MC.Data.softLoad();
        });
    };

    this.hardLoad = function () {
        this.setParamsFromHash();
        this.getUserFleetsAndDevices();
        MC.View.bindDatepicker(this.date);
    };

    this.softLoad = function () {
        this.setParamsFromHash();
        this.bindCurrentFleetAndCar();

        MC.View.setHeaderTexts();
        MC.View.createCarsAndFleetsMenu();

        this.getStatistics();
    };

    /* Bind current car and current fleet data */
    this.bindCurrentFleetAndCar = function () {
        this.current_car = null;
        this.current_fleet = null;

        if (this.car != 'all' && this.car) {
            this.current_car = this.getCarById(this.car);

            if (!this.current_car) {
                this.car = 'none';
                MC.View.showNoSelectedCar();
                // MC.View.showMapMessage('Ошибка, машины с ID ' + this.car + ' не существует!');
            }
        }

        if (this.fleet != 'all' && this.fleet) {
            this.current_fleet = this.getFleetById(this.fleet);

            if (!this.current_fleet) {
                this.fleet = 'all';
                // MC.View.showMapMessage('Ошибка, группы с ID ' + this.fleet + ' не существует!');
            }
        }
    };

    /* Get car by id from loaded data */
    this.getCarById = function (id) {
        return $.grep(this.cars, function (e) {
            return e.id == id;
        })[0];
    };

    /* Get fleet by id from loaded data */
    this.getFleetById = function (id) {
        return $.grep(this.fleets, function (e) {
            return e.id == id;
        })[0];
    };

    /* Read params from document.location.hash string */
    this.setParamsFromHash = function () {
        this.hash = core.ui.getHashData();

        if (this.hash) {
            if (this.hash.fleet) {
                this.fleet = this.hash.fleet;
            } else {
                this.fleet = 'all';
            }

            if (this.hash.car) {
                this.car = this.hash.car;
            } else {
                this.car = 'none';
            }

            if (this.hash.timemachine) {
                this.timemachine = true;
                this.date = core.utilities.timestampToDateYearLast(this.hash.timemachine);
            } else {
                this.timemachine = false;
                this.date = new Date();
            }
        }
    };

    /* Postprocess cars and fleets data loader */
    this.processLoadedData = function (data) {
        this.cars = data.devices;
        this.fleets = data.fleets;

        this.bindCurrentFleetAndCar();

        MC.View.setHeaderTexts();
        MC.View.createCarsAndFleetsMenu();

        this.getStatistics();
    };

    //Load fleets and their cars data
    this.getUserFleetsAndDevices = function () {
        $.ajax({
            url: '/control/statistics/?ajax',
            data: {
                action: 'getUserFleetsAndDevices'
            },
            dataType: 'json',
            type: 'get',
            beforeSend: function () {
                core.loading.setGlobalLoading('getUserFleetsAndDevices');
            },
            success: function (data) {
                core.loading.unsetGlobalLoading('getUserFleetsAndDevices');

                MC.Data.processLoadedData(data);
                MC.View.showNoSelectedCar();
            },
            error: function () {
                core.loading.unsetGlobalLoading('getUserFleetsAndDevices');
                core.ajax.errorHandler();
            }
        });
    };

    /* Get cars metrics */
    this.getStatistics = function () {
        if (this.current_car && this.current_car.id) {
            $.ajax({
                url: '/control/statistics/?ajax&action=getStatistics&date=' + core.utilities.tmToDate(this.date),
                data: {
                    device_id: this.current_car.id
                },
                dataType: 'json',
                type: 'get',
                beforeSend: function () {
                    core.loading.setGlobalLoading('getStatistics');
                },
                success: function (data) {
                    core.loading.unsetGlobalLoading('getStatistics');

                    MC.Data.prepareData(data);
                    MC.View.showCurrent();
                },
                error: function () {
                    core.loading.unsetGlobalLoading('getStatistics');

                    core.ajax.errorHandler();
                }
            });
        }
    };

    this.prepareData = function (data) {
        MC.Data.current_car.statistics = data;
    };

    this.autoRenewStack = function () {

    };
};

var MC = {
    init: function () {
        this.View = new View();
        this.Data = new Data();
        this.Data.__construct();
    }
};

$(function () {
    MC.init();
});