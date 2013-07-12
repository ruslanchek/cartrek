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
        var data_parsed = [];

        for (var i = 0, l = data.length; i < l; i++) {
            var obj = {
                date: core.utilities.humanizeTimeFromDateObject(core.utilities.parseDateMysqlStrToDateOdject(data[i].date))
            };

            obj[this.current_param.value] = core.utilities.convertKnotsToKms(data[i][this.current_param.value]);

            data_parsed.push(obj);
        }

        return data_parsed;
    };

    this.draw = function () {
        console.log(this.data_parsed)

        $('#chart').css({height: this.height}).dxChart({
            dataSource: this.data_parsed,
            commonSeriesSettings: {
                type: "stackedLine",
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
            }
        });
    };

    this.prepareData = function (data) {
        this.data_raw = data;
        this.data_parsed = this.parseData(this.data_raw);
        this.points_count = data.length;
        this.shown_percentage = data.length / this.max_points;
    };

    this.init = function (data) {
        this.prepareData(data);

        var t = this;

        this.draw();

        $('.chart-timeline .arm').css({
            width: Math.floor(this.shown_percentage) - 2 + '%'
        }).draggable({
                grid: [ Math.ceil($('.chart-timeline').width() / t.points_count), 0 ],
                containment: 'parent',
                drag: function (event, ui) {
                    var arm_start_percent = Math.ceil((ui.position.left / $('.chart-timeline').width()) * 100),
                        points_per_percent = Math.ceil(t.points_count / 100),
                        points_start = Math.ceil(points_per_percent * arm_start_percent);

                    t.data_parsed = t.parseData(t.data_raw);
                    t.start = points_start;

                    t.draw();
                }
            });
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
        this.bindDatepicker();
        this.bindViewModeSwithcher();
    };

    this.bindDatepicker = function(){
        $('#datepicker').datepicker();
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
                '<i class="arm"></i>' +
            '</div>' +
            '<div class="chart-container">' +
                '<div id="chart"></div>' +
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