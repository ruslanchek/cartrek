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
        this.dom_object.find('.map').css({
            visibility: 'visible'
        });
        this.dom_object.find('.map-hider').fadeOut(150);
    };

    this.hideMap = function () {
        var t = this;

        this.dom_object.find('.map-hider').css({
            top: this.dom_object.find('.head').height() + 11
        }).fadeIn(150, function () {
                t.dom_object.find('.map').css({
                    visibility: 'hidden'
                });

                t = null;
            });
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
                '<div class="key">Текущ. положение</div>' +
                '<div class="value">' + core.utilities.dateRange(this.params.last_point_date, new Date()) + '</div>' +
                '</div>';

            html += '<div class="param one-col">' +
                '<div class="key">Данные статуса</div>' +
                '<div class="value">' + core.utilities.dateRange(this.params.last_update, new Date()) + '</div>' +
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
    this.setFleetMenuIndicator = function (i, instant) {
        var $item = $('#fleets li[rel="' + i + '"]'),
            s = 150;

        if (instant === true) {
            s = 0;
        }

        $('#fleets i').text($item.text()).animate({
            top: $item.offset().top,
            left: $item.offset().left,
            width: $item.width()
        }, s, function () {
            if (instant !== true) {
                document.location.hash = '#fleet=' + i;
            }
        });

        MC.Data.fleet = i;
    };

    this.drawFleetMenu = function () {
        if (MC.Data.fleets.length > 0) {
            var html = '<ul class="nav-top" id="fleets"><i></i><li rel="all" class="active"><a href="#fleet=all">Все группы</a></li>';

            for (var i = 0, l = MC.Data.fleets.length; i < l; i++) {
                html += '<li rel="' + MC.Data.fleets[i].id + '"><a href="#fleet=' + MC.Data.fleets[i].id + '">' + MC.Data.fleets[i].name + '</a></li>';
            }

            html += '<div class="clear"></div></ul>';

            $('#fleets').html(html);
        }

        $('#fleets a').on('click', function (e) {
            MC.View.setFleetMenuIndicator($(this).parent().attr('rel'), false);
            e.preventDefault();

            MC.Data.reset();
        });
    };

    this.showCars = function (cb) {
        MC.View.resizeGrid(function () {
            var i = 0,
                l = $('.dispatcher .brick').length;

            var interval = setInterval(function () {
                $('.dispatcher .brick .item:eq(' + i + ')').animate({
                    opacity: 1
                }, 200).addClass('flipped');

                i++;

                if(i >= l){
                    clearInterval(interval);
                    if (cb) {
                        cb();
                    }
                }
            }, 70);
        });
    };

    this.gridInit = function () {
        $('.dispatcher .item .map').hover(function () {
            $(this).find('.leaflet-control-container').show();
        }, function () {
            $(this).find('.leaflet-control-container').fadeOut(150);
        });
    };

    this.resizeGrid = function (cb) {
        var h = 0,
            hb = 0,
            k = 4,
            items_k = $('.dispatcher .brick .item:visible').length;

        $('.dispatcher .brick .item').each(function () {
            var h1 = $(this).find('.foot .separated-block').height();

            if (h < h1) {
                h = h1;
            }
        });

        $('.dispatcher .brick .item .foot .separated-block').css({
            height: h
        });

        $('.dispatcher .brick').each(function () {
            var hb1 = $(this).height();

            if (hb < hb1) {
                hb = hb1;
            }
        });

        if (items_k % k != 0) {
            items_k = (items_k / k) * k + k;
        }

        var gi = Math.floor(items_k / k);

        $('.dispatcher').animate({
            height: hb * gi + ((18 * gi) - 10)
        }, 200, function () {
            MC.View.setFleetMenuIndicator(MC.Data.fleet, true);

            if (cb) {
                cb();
            }
        });
    };

    this.destroyCarsGrid = function (cb) {
        var i = 0,
            l = $('.dispatcher .brick').length;

        var interval = setInterval(function () {
            $('.dispatcher .brick .item:eq(' + i + ')').animate({
                opacity: 0
            }, 200).removeClass('flipped');

            i++;

            if(i >= l){
                clearInterval(interval);
                if (cb) {
                    cb();
                }
            }
        }, 70);

        this.setFleetMenuIndicator(MC.Data.fleet, true);
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

        $('.dispatcher').sortable('refresh');
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
                        core.ajax.errorHandler();
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
    this.devices = [];
    this.fleets = [];
    this.current_cars = [];
    this.auto_renew_blocker = false;
    this.fleet = 'all';
    this.hash = core.ui.getHashData();

    /* Class constructor */
    this.__construct = function () {
        this.getUserFleetsAndDevices();

        core.ticker.addIntervalMethod(function () {
            MC.Data.autoRenewStack();
        });

        if (this.hash && this.hash.fleet) {
            this.fleet = this.hash.fleet;
        }
    };

    this.reset = function () {
        this.cars = [];
        this.current_cars = [];

        MC.View.destroyCarsGrid(function () {
            MC.Data.processLoadedDataSoft();
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

    this.createCarsCollection = function (cars) {
        this.cars = [];
        this.current_cars = [];

        if (this.fleet == 'all' || !this.fleet) {
            for (var i = 0, l = cars.devices.length; i < l; i++) {
                this.cars.push(cars.devices[i]);
                this.current_cars.push(cars.devices[i].id);
            }
        } else {
            for (var i = 0, l = cars.devices.length; i < l; i++) {
                if (cars.devices[i].fleet_id == this.fleet) {
                    this.cars.push(cars.devices[i]);
                    this.current_cars.push(cars.devices[i].id);
                }
            }
        }
    };

    /* Postprocess cars and fleets data loader */
    this.processLoadedDataHard = function (data) {
        this.fleets = data.fleets;
        this.devices = data.devices;

        MC.View.drawFleetMenu();

        $(window).on('hashchange', function () {
            MC.Data.hash = core.ui.getHashData();

            if (MC.Data.hash && MC.Data.hash.fleet) {
                MC.Data.fleet = MC.Data.hash.fleet;
            }

            MC.View.setFleetMenuIndicator(MC.Data.fleet, false);
        });

        $(window).on('resize', function () {
            MC.View.setFleetMenuIndicator(MC.Data.fleet, true);
        });

        MC.View.setFleetMenuIndicator(MC.Data.fleet, true);

        this.createCarsCollection(data);

        MC.View.drawCarsGrid();

        this.createCarsObjects();
        this.auto_renew_blocker = true;
        this.loadDynamicCarsData(true);
    };

    /* Postprocess cars and fleets data loader */
    this.processLoadedDataSoft = function () {
        var data = {
            fleets: this.fleets,
            devices: this.devices
        };

        this.createCarsCollection(data);

        MC.View.destroyCarsGrid();
        MC.View.drawCarsGrid();

        this.createCarsObjects();
        this.auto_renew_blocker = true;

        this.loadDynamicCarsData(true);
    };

    /* Merge cars data */
    this.mergeCarsData = function (data) {
        if (data) {
            for (var i = 0, l = data.length; i < l; i++) {
                var car = this.getCarById(data[i].id);

                if (car) {
                    car.updateParams(data[i]);
                    car.drawData();
                }
            }

            MC.View.resizeGrid();
            MC.View.setFleetMenuIndicator(MC.Data.fleet, true);
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
                MC.Data.processLoadedDataHard(data);
            },
            error: function () {
                core.loading.unsetGlobalLoading('getUserFleetsAndDevices');
                core.ajax.errorHandler();
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
                }

                this.auto_renew_blocker = true;
            },
            success: function (data) {
                if (firstload === true) {
                    core.loading.unsetGlobalLoading('loadDynamicCarsData');
                }

                /*  Если запрос был на обновление данных, а не на первечную загрузку -
                 включаем автообновление */
                MC.Data.mergeCarsData(data);
                MC.Data.drawCars();

                if(firstload === true){
                    MC.View.showCars(function(){
                        MC.Data.auto_renew_blocker = false;
                    });
                }
            },
            error: function () {
                MC.Data.auto_renew_blocker = false;

                if (firstload === true) {
                    core.loading.unsetGlobalLoading('loadDynamicCarsData');
                }

                core.ajax.errorHandler();
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

core.ticker.delay = 100000;

$(function () {
    MC.init();
});