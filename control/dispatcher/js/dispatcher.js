"use strict";

/**
 *  Car implementation
 **/
var DCar = function (params) {
    /* Instances */
    this.instance_map = null;
    this.dom_object = null;

    this.params = {
        /* Extendable */
        metrics: {},
        active: null,
        color: null,
        fleet_id: null,
        fleet_name: null,
        g_id: null,
        id: null,
        imei: null,
        last_point_date: null,
        last_path_point_id: null,
        last_update: null,
        make: null,
        model: null,
        name: null,
        online: null,
        point_id: null,
        sat_count: null,
        extensions: null,

        popup: false,
        car_label: false
    };

    $.extend(true, this.params, params);

    /* Class constructor */
    this.__construct = function () {
        this.createMap();
        this.__proto__ = new Car(this.params, this.instance_map);
        this.dom_object = $('#item_' + this.params.id);
        this.parseExtensions();
    };

    /* Methods */
    this.createMap = function () {
        this.instance_map = new Map({
            map_container_id: 'car-map-' + this.params.id,
            scroll: false,
            zoom: 13,
            controls: {
                fullscreen: false,
                locate: false,
                scale: false
            }
        });
    };

    this.showMap = function () {
        this.dom_object.find('.map-hider').fadeOut(150);
    };

    this.hideMap = function () {
        this.dom_object.find('.map-hider').css({
            top: this.dom_object.find('.head').height() + 11
        }).fadeIn(150);
    };

    this.drawData = function () {
        var html = '',
            classname = 'offline';

        if (this.params.metrics.online === true) {
            classname = 'online';
        }

        html += '<div class="params ' + classname + '">';

        if (this.params.metrics && this.params.metrics.online === true) {
            html += '<div class="param">' +
                '<div class="key">' +
                '<span class="status-text green">Онлайн</span>' +
                '</div>' +
                '<div class="value"></div>' +
                '</div>';

            html += '<div class="param">';

            if (this.params.metrics.csq) {
                html += '<div class="key">' + core.utilities.getCSQIndicator(this.params.metrics.csq, true) + '</div>';
            }

            if (this.params.metrics.hdop) {
                html += '<div class="value">' + core.utilities.getHDOPIndicator(this.params.metrics.hdop, this.params.sat_count, true) + '</div>';
            }

            html += '</div>';

        } else {
            html += '<div class="param">' +
                '<div class="key">' +
                '<span class="status-text gray-light">Офлайн</span>' +
                '</div>' +
                '<div class="value"></div>' +
                '</div>';
        }

        html += '<div class="clear"></div>';

        if (this.params.metrics) {
            html += '<div class="separated-block">';

            if (this.params.metrics && this.params.metrics.speed) {
                html += '<div class="param">' +
                    '<div class="key">Скорость</div>' +
                    '<div class="value">' + core.utilities.convertKnotsToKms(this.params.metrics.speed) + ' км/ч</div>' +
                    '<div class="clear"></div>' +
                    '</div>';
            }

            if (this.params.metrics && this.params.metrics.altitude) {
                html += '<div class="param">' +
                    '<div class="key">Высота</div>' +
                    '<div class="value">' + this.params.metrics.altitude + ' м' + '</div>' +
                    '<div class="clear"></div>' +
                    '</div>';
            }

            if (this.params.metrics && this.params.metrics.params && this.params.metrics.params.power_inp_normal_level && (this.params.metrics.params.power_inp || this.params.metrics.params.power_inp === 0)) {
                html += '<div class="param">' +
                    '<div class="key">Питание</div>' +
                    '<div class="value">' + core.utilities.getVoltsIndicator(this.params.metrics.params.power_inp, this.params.metrics.params.power_inp_normal_level) + '</div>' +
                    '<div class="clear"></div>' +
                    '</div>';
            }

            if (this.params.metrics && this.params.metrics.params && this.params.metrics.params.power_bat_normal_level && (this.params.metrics.params.power_bat || this.params.metrics.params.power_bat === 0)) {
                html += '<div class="param">' +
                    '<div class="key">Батарея</div>' +
                    '<div class="value">' + core.utilities.getVoltsIndicator(this.params.metrics.params.power_bat, this.params.metrics.params.power_bat_normal_level) + '</div>' +
                    '<div class="clear"></div>' +
                    '</div>';
            }

            if (this.params.metrics && this.params.metrics.params && this.params.metrics.params.fls === true && (this.params.metrics.params.fuel || this.params.metrics.params.fuel === 0)) {
                html += '<div class="param">' +
                    '<div class="key">Топливо</div>' +
                    '<div class="value">' + core.utilities.getFuelIndicator(this.params.metrics.params.fuel, this.params.metrics.params.fuel_tank_capacity, true) + '</div>' +
                    '<div class="clear"></div>' +
                    '</div>';
            }

            html += '<div class="clear"></div>';

            html += '</div>';

            html += '<div class="param one-col">' +
                '<div class="key">Тек. положение</div>' +
                '<div class="value">' + core.utilities.dateRange(this.params.metrics.date, new Date()) + '</div>' +
                '</div>';

            html += '<div class="param one-col">' +
                '<div class="key">Данные статуса</div>' +
                '<div class="value">' + core.utilities.dateRange(this.params.metrics.last_update, new Date()) + '</div>' +
                '</div>';

            html += '<div class="clear"></div>';
        }

        html += '</div>';

        this.dom_object.find('.foot').html(html);
    };

    /* Init actions */
    this.__construct();
};

/**
 *  View realisation
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

    this.resizeGrid = function () {
        var h = 0;

        $('.dispatcher .brick .item').each(function () {
            var h1 = $(this).find('.foot .separated-block').height();

            if (h < h1) {
                h = h1;
            }
        });

        $('.dispatcher .brick .item .foot .separated-block').css({
            height: h
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
                '<div class="make_model">' + ((c.make) ? c.make : '') + ' ' + ((c.model) ? c.model : '') + '</div>' +
                core.utilities.drawGId(c.g_id) +
                '</div>' +

                '<div class="map-hider"><i title="Данные о текущем местоположении не получены"></i></div>' +
                '<div class="map" id="car-map-' + c.id + '"></div>' +
                '<div class="foot"></div>' +
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
            opacity: 1,
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
 *  Data realisation
 **/
var Data = function () {
    this.cars = [];
    this.fleets = [];
    this.current_cars = [];
    this.auto_renew_blocker = false;

    /* Class constructor */
    this.__construct = function () {
        this.getUserFleetsAndDevices();

        core.ticker.addIntervalMethod(function () {
            MC.Data.autoRenewStack();
        });
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
        for (var i = 0, l = this.cars.length; i < l; i++) {
            this.cars[i].draw(function (status, car) {
                if (status === true) {
                    car.showMap();
                } else if (status !== true && car.params.on_map !== true) {
                    car.hideMap();
                }
            });

            this.cars[i].focus();
        }
    };

    /* Remove cars from a map */
    this.removeCars = function () {
        for (var i = 0, l = this.cars.length; i < l; i++) {
            this.cars[i].remove();
        }
    };

    /* Postprocess cars and fleets data loader */
    this.processLoadedData = function (data) {
        this.current_cars = [];

        this.cars = data.devices;
        this.fleets = data.fleets;

        for (var i = 0, l = this.cars.length; i < l; i++) {
            this.current_cars.push(this.cars[i].id);
        }

        MC.View.drawCarsGrid();

        this.createCarsObjects();
        this.loadDynamicCarsData(true);
    };

    /* Merge cars data */
    this.mergeCarsData = function (data) {
        if (data) {
            for (var i = 0, l = data.length; i < l; i++) {
                var car = this.getCarById(data[i].id);

                car.updateParams(data[i]);
                car.drawData();
            }

            MC.View.resizeGrid();
        }
    };

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

    /* Get cars metrics */
    this.loadDynamicCarsData = function (firstload) {
        if (this.current_cars.length <= 0) {
            return;
        }

        $.ajax({
            url: '/control/map/?ajax&action=getDynamicDevicesData&date=' + core.utilities.tmToDate(new Date()),
            data: {
                cars: JSON.stringify(this.current_cars),
                tm_flag: '0'
            },
            dataType: 'json',
            type: 'post',
            beforeSend: function () {
                /*  Если запрос был на обновление данных, а не на первичную загрузку -
                 отключем на время загрузки данных автообновление,
                 чтобы не было ситуации, когда маркеров на карте нет,
                 а функция обновления запускается */
                if (firstload === true) {
                    // Не показываем глобал лоадинг, если запрос был на обновление данных
                    core.loading.setGlobalLoading('loadDynamicCarsData');
                    MC.Data.auto_renew_blocker = false;
                }
            },
            success: function (data) {
                MC.Data.auto_renew_blocker = false;

                if (firstload === true) {
                    core.loading.unsetGlobalLoading('loadDynamicCarsData');
                }

                /*  Если запрос был на обновление данных, а не на первечную загрузку -
                 включаем автообновление */
                MC.Data.mergeCarsData(data);
                MC.Data.drawCars();
            },
            error: function () {
                MC.Data.auto_renew_blocker = false;

                if (firstload === true) {
                    core.loading.unsetGlobalLoading('loadDynamicCarsData');
                }

                MC.Data.error();
            }
        });
    };

    this.autoRenewStack = function () {
        if (this.auto_renew_blocker !== true) {
            MC.Data.loadDynamicCarsData(false);
        }
    }

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