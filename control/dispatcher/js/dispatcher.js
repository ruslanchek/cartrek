"use strict";

/**
 *  Car implementation
 **/
var DCar = function (params) {
    /* Instances */
    this.instance_map = null;
    this.pos_marker = null;

    this.params = {

    };

    $.extend(true, this.params, params);

    /* Class constructor */
    this.__construct = function () {
        this.createMap();
        this.__proto__ = new Car(this.params, this.instance_map);
    };

    /* Methods */
    this.createMap = function () {
        this.instance_map = new Map({
            map_container_id: 'car-map-' + this.params.id,
            scroll: false,
            controls: {
                fullscreen: false,
                locate: false,
                scale: false
            }
        });
    };

    /* Init actions */
    this.__construct();
};

/**
 *  View implementation
 **/
var View = function () {
    /* Class constructor */
    this.__construct = function () {

    };

    /* Methods */
    this.gridInit = function () {
        $('.dispatcher .item .map').hover(function () {
            $(this).find('.leaflet-control-container').show();
        }, function () {
            $(this).find('.leaflet-control-container').fadeOut(150);
        });
    };

    this.drawCarsGrid = function () {
        var html = '';

        for (var i = 0, l = MC.Data.cars.length; i < l; i++) {
            var c = MC.Data.cars[i];

            html += '<div class="brick">' +
                        '<div class="item" id="item_' + c.id + '" data-id="' + c.id + '">' +
                        '<div class="head">' +
                        '<h2>' + c.name + '</h2>' +
                        '<div class="make_model">' + c.make + ' ' + c.model + '</div>' +
                        core.utilities.drawGId(c.g_id) +
                        '</div>' +

                        '<div class="map" id="car-map-{$item.id}">' +

                        '</div>' +
                    '</div>';
        }

        $('.dispatcher').html(html);

        this.gridInit();
        this.createSortable();
    };

    this.createSortable = function () {
        $('.dispatcher').sortable({
            items: '.brick',
            handle: '.head',
            cursor: 'move',
            opacity: 0.75,
            stop: function (e, ui) {
                var i = 0,
                    sorting_result = [];

                $('.dispatcher .item').each(function () {
                    i++;
                    sorting_result.push({
                        id: $(this).data('id'),
                        sort: i
                    });
                });

                $.ajax({
                    url: '/control/dispatcher/?ajax&action=setDivicesSorting',
                    data: {
                        sorting_result: sorting_result
                    },
                    dataType: 'json',
                    type: 'post',
                    beforeSend: function () {
                        core.loading.setGlobalLoading('dispatcher.sorting');
                    },
                    success: function () {
                        core.loading.unsetGlobalLoading('dispatcher.sorting');
                    },
                    error: function () {
                        core.loading.unsetGlobalLoading('dispatcher.sorting');
                    }
                });
            }
        });
    };

    /* Init actions */
    this.__construct();
};

/**
 *  Data implementation
 **/
var Data = function () {
    this.cars = [];
    this.fleets = [];

    /* Class constructor */
    this.__construct = function () {
        this.getUserFleetsAndDevices();
    };

    /* Get car by id from loaded data */
    this.getCarById = function (id) {
        return $.grep(this.cars, function (e) {
            return e.params.id == id;
        })[0];
    };

    /* Create cars */
    this.createCarsObjects = function () {
        for (var i = 0, l = this.cars.length; i < l; i++) {
            this.cars[i] = new DCar(this.cars[i]);
        }
    };

    /* Draw cars */
    this.drawCars = function () {
        for (var i = 0, l = this.current_cars.length; i < l; i++) {
            var car = this.getCarById(this.current_cars[i]);

            if (car.params.has_metrics && !car.params.on_map) {
                car.draw();
                this.cars_on_map++;
            }
        }
    };

    /* Remove cars from a map */
    this.removeCars = function () {
        this.cars_on_map = 0;

        for (var i = 0, l = this.cars.length; i < l; i++) {
            this.cars[i].remove();
        }
    };

    /* Postprocess cars and fleets data loader */
    this.processLoadedData = function (data) {
        this.cars = data.devices;
        this.fleets = data.fleets;

        MC.View.drawCarsGrid();

        //this.createCarsObjects();
        //this.drawCars();
    };

    /* Methods */
    //Load fleets and their cars data
    this.getUserFleetsAndDevices = function () {
        $.ajax({
            url: '/control/map/?ajax',
            data: {
                action: 'getUserFleetsAndDevices',
                date: core.utilities.tmToDate(new Date())
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
                MC.Data.error();
            }
        });
    };

    /* Show an loading error */
    this.error = function () {
        $.meow({
            title: 'Ошибка',
            message: 'Внутренняя ошибка сервиса',
            duration: 8000
        });
    };
};

var MC = {
    init: function () {
        this.View = new View();
        this.Data = new Data();
        this.Data.__construct();
    }
}

$(function () {
    MC.init();
});