"use strict";

/**
 *  View realisation
 **/
var View = function () {
    /* Class constructor */
    this.__construct = function () {

    };

    this.drawStatistics = function(){
        if(MC.Data.current_car && MC.Data.current_car.id && MC.Data.current_car.statistics && MC.Data.current_car.statistics.length >= 1){
            var data = MC.Data.current_car.statistics,
                formatted_data = [];

            $("#statistics").css({height: 700});

            for(var i = 0, l = data.length; i < l; i ++) {
                var item = data[i];

                formatted_data.push([
                    core.utilities.parseDateMysqlStrToDateOdject(item.date),
                    core.utilities.convertKnotsToKms(parseFloat(item.speed))
                ]);
            }

            var plot = $.plot("#statistics", [{data: formatted_data}], [{
                series: {
                    shadowSize: 1
                },
                yaxis: {
                    show: true
                },
                xaxis: {
                    show: true,
                    mode: 'time',
                    timeformat: "%Y-%m-%d %H:%M:%M"
                }
            }]);

            plot.draw();
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

    this.hardLoad = function(){
        this.setParamsFromHash();
        this.getUserFleetsAndDevices();
    };

    this.softLoad = function(){
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
            },
            error: function () {
                core.loading.unsetGlobalLoading('getUserFleetsAndDevices');
                core.ajax.errorHandler();
            }
        });
    };

    /* Get cars metrics */
    this.getStatistics = function () {
        if(this.current_car && this.current_car.id){
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

                    MC.Data.current_car.statistics = data;

                    MC.View.drawStatistics();
                },
                error: function () {
                    core.loading.unsetGlobalLoading('getStatistics');

                    core.ajax.errorHandler();
                }
            });
        }
    };

    this.autoRenewStack = function () {

    }
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