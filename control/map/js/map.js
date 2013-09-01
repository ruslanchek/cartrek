"use strict";

/**
 *  View realisation
 **/
var View = function () {
    this.zoomed_on_car = false;
    this.no_points_message = false;

    /* Class constructor */
    this.__construct = function () {
        this.mapView();
    };

    /* Methods */
    this.hideMapMessage = function (animation) {
        var d = $.Deferred();

        var speed;

        if (animation === true) {
            speed = 250;
        } else {
            speed = 0;
        }

        $('.map-notice').addClass('close-animation').fadeOut(speed, function () {
            MC.View.map_notice_deferred.resolve();
            $('.map-notice').remove();
        });

        return d;
    };

    this.showMapMessage = function (options) {
        var d = $.Deferred();

        $('.map-container .map-notice').remove();

        var message = '',
            icon = 'warning';

        if(options.icon){
            icon = options.icon;
        }

        message = '<i class="icon-64 ' + icon + '"></i><p>' + options.message + '</p>';
        message += '<a id="hide-map-notice" href="javascript:void(0)" class="btn">Закрыть</a>';

        $('.map-container').append('<div class="map-notice"><div class="mn-inner">' + message + '</div></div>');

        $('.map-container .map-notice').css({
            marginTop: -$('.map-container .map-notice').height() / 2
        });

        setTimeout(function(){
            $('.map-container .map-notice').addClass('open-animation');
        }, 100);

        $('#hide-map-notice').on('click', function () {
            MC.View.hideMapMessage(true);
        });

        return d;
    };

    /* Set header texts */
    this.setHeaderTexts = function () {
        var html = '',
            hash = core.ui.getHashData();

        if (hash && hash.timemachine) {
            html += '<span class="header-timemeachine"> / ' + core.utilities.humanizeDate(core.utilities.parseDateStrToDateOdject(hash.timemachine)) + '</span>';
        }

        if (MC.Data.current_fleet) {
            html += ' / ' + MC.Data.current_fleet.name;
        }

        if (MC.Data.current_car) {
            html += ' / ' + MC.Data.current_car.params.name + ' ' + core.utilities.drawGId(MC.Data.current_car.params.g_id, 'small');
            html += '<span class="g_id-spacer"></span>';
        } else if (MC.Data.current_fleet) {
            html += ' <span class="badge">' + MC.Data.current_fleet.cars + ' ' + core.utilities.plural(MC.Data.current_fleet.cars, 'машина', 'машины', 'машин') + '</span>';
        } else {
            html += ' <span class="badge">' + MC.Data.cars.length + ' ' + core.utilities.plural(MC.Data.cars.length, 'машина', 'машины', 'машин') + '</span>';
        }

        $('#current-fleet-and-car').html(html);
    };

    /* Set map and side tools sizes */
    this.mapView = function () {
        var resize = function () {
            $('#map, .map-container').css({
                height: $('body').height() - 92
            });

            $('.map-side-panel').css({
                minHeight: $('.map-container').height()
            });

            if (MC.Map.instance) {
                MC.Map.instance.invalidateSize();
            }
        };

        resize();

        $(window).on('resize', function () {
            resize();
        });
    };

    /* Create fleets selects */
    this.createCarsAndFleetsMenu = function () {
        //Cars select
        var exclude = null;

        if (MC.Data.fleet != 'all' && MC.Data.fleet != '' && MC.Data.current_fleet) {
            exclude = {
                key_name: 'fleet_id',
                value_name: MC.Data.fleet
            };
        }

        core.ui.createSelect('#cars-menu', {
            id: 'cars-menu-select',
            default_opt: {
                val: 'all',
                name: 'Все машины'
            },
            default: MC.Data.car,
            key_name: 'id',
            value_name: 'name',
            inner_object: 'params',
            exclude: exclude,
            items: MC.Data.cars,
            onChange: function (val) {
                var tm_hash = '';

                if (MC.Data.timemachine === true) {
                    tm_hash = '&timemachine=' + MC.Data.hash.timemachine;
                }

                document.location.hash = '#fleet=' + MC.Data.fleet + '&car=' + val + tm_hash;
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
                var tm_hash = '';

                if (MC.Data.timemachine === true) {
                    tm_hash = '&timemachine=' + MC.Data.hash.timemachine;
                }

                document.location.hash = '#fleet=' + val + tm_hash;
            }
        });
    };

    /* Bind map view options controller */
    this.bindMapOptionsController = function (first_time) {
        var auto_renew_active = true,
            show_car_path_active = true;

        if (MC.Data.timemachine === true) {
            auto_renew_active = false;
            show_car_path_active = false;
        }

        /* Togle auto-renew trigger */
        if (auto_renew_active === false) {
            $('#auto-renew')
                .addClass('unactive')
                .removeClass('active')
                .parent()
                .addClass('unactive')
                .removeClass('active');
        } else {
            $('#auto-renew')
                .addClass('active')
                .removeClass('unactive')
                .parent()
                .addClass('active')
                .removeClass('unactive');
        }

        /* Togle show-path trigger */
        if (show_car_path_active === false || MC.Data.car == 'all') {
            $('#show-path')
                .addClass('unactive')
                .removeClass('active')
                .parent()
                .addClass('unactive')
                .removeClass('active');
        } else {
            $('#show-path')
                .addClass('active')
                .removeClass('unactive')
                .parent()
                .addClass('active')
                .removeClass('unactive');
        }

        /* Bind slickswitch to auto-renew trigger */
        if ($('#auto-renew').next('a.slickswitch').length < 1) {
            $('#auto-renew').slickswitch({
                toggled: function () {
                    if (MC.Data.auto_renew === true) {
                        MC.Data.auto_renew = false;
                        $.cookie('auto-renew', '0', core.options.cookie_options);

                    } else {
                        MC.Data.auto_renew = true;
                        $.cookie('auto-renew', '1', core.options.cookie_options);
                    }
                }
            });
        }

        /* Bind slickswitch to focus trigger */
        if ($('#auto-focus').next('a.slickswitch').length < 1) {
            $('#auto-focus').slickswitch({
                toggled: function () {
                    if (MC.Data.auto_focus === true) {
                        MC.Data.auto_focus = false;
                        $.cookie('auto-focus', '0', core.options.cookie_options);

                    } else {
                        MC.Data.auto_focus = true;
                        $.cookie('auto-focus', '1', core.options.cookie_options);
                        MC.View.focus();
                    }
                }
            });
        }

        /* Bind slickswitch to path trigger */
        if ($('#show-path').next('a.slickswitch').length < 1) {
            $('#show-path').slickswitch({
                toggled: function () {
                    if (MC.Data.show_car_path === true) {
                        MC.Data.show_car_path = false;
                        $.cookie('car-path', '0', core.options.cookie_options);

                        if (MC.Data.current_car) {
                            MC.Data.current_car.removePath();
                        }

                    } else {
                        MC.Data.show_car_path = true;
                        $.cookie('car-path', '1', core.options.cookie_options);

                        if (MC.Data.current_car) {
                            MC.Data.current_car.drawPath();
                        }

                        if (MC.Data.car != 'all') {
                            $('#auto-focus').slickswitch('tOff');
                            MC.Data.auto_focus = false;
                            $.cookie('auto-focus', '0', core.options.cookie_options);

                            MC.View.focusOnPath();
                        }
                    }
                }
            });
        }

        /* Toggle auto-renew slickswitch */
        if (MC.Data.auto_renew === true && auto_renew_active === true) {
            $('#auto-renew').slickswitch('tOn', first_time);
        } else {
            $('#auto-renew').slickswitch('tOff', first_time);
        }

        /* Toggle auto-focus slickswitch */
        if (MC.Data.auto_focus === true) {
            if (MC.Data.show_car_path !== true || first_time) {
                $('#auto-focus').slickswitch('tOn', first_time);
            }
        } else {
            $('#auto-focus').slickswitch('tOff', first_time);
        }

        /* Toggle show-path slickswitch */
        if (MC.Data.show_car_path === true && show_car_path_active === true) {
            if (MC.Data.car != 'all' && !first_time) {
                $('#auto-focus').slickswitch('tOff');
                MC.Data.auto_focus = false;
                $.cookie('auto-focus', '0', core.options.cookie_options);
            }

            $('#show-path').slickswitch('tOn', first_time);
        } else {
            $('#show-path').slickswitch('tOff', first_time);
        }

        /* Bind focus link */
        $('#focus-toggler').on('click', function () {
            MC.View.focus();
        });

        /* Bind path link */
        $('#path-toggler').on('click', function () {
            if (MC.Data.car != 'all') {
                $('#auto-focus').slickswitch('tOff');
                MC.Data.auto_focus = false;
                $.cookie('auto-focus', '0', core.options.cookie_options);
            }

            MC.View.focusOnPath();
        });
    };

    /* Focus on current showed path */
    this.focusOnPath = function () {
        if (MC.Data.current_car && MC.Data.current_car.path && MC.Data.show_car_path === true) {
            MC.Data.current_car.focusOnPath();
        }
    };

    /* Smart focus on a current sutuation on a map */
    this.focus = function () {
        if (MC.Map.busy === true) {
            return;
        }

        // Process focus scenery for multiple cars
        if (MC.Data.current_cars.length > 1 && MC.Data.car === 'all') {
            var bounds = [],
                single = null;

            // Collect cars bounds
            for (var i = 0, l = MC.Data.current_cars.length; i < l; i++) {
                var car = MC.Data.getCarById(MC.Data.current_cars[i]);

                // Remember car for if this is single om-map-car
                if (car.params.on_map === true) {
                    single = car;
                }

                if (car.params.on_map && car.params.metrics && car.params.metrics.lat && car.params.metrics.lng) {
                    bounds.push([
                        car.params.metrics.lat,
                        car.params.metrics.lng
                    ]);
                }
            }

            // Fit to collected bounds if count of cars on map > 1
            if (bounds.length > 1) {
                MC.Map.fitBounds(bounds);

                // Otherwise focus to single car if it present
            } else if (single) {
                if(this.zoomed_on_car !== true){
                    this.zoomed_on_car = true;
                    MC.Map.setZoom(14);
                }

                single.focus();

                // Otherwise focus to map defaults
            } else {
                //MC.Map.returnToRoots();
            }

            // Process focus scenery for single car on a map but if selected all
        } else if (MC.Data.current_cars.length == 1 && MC.Data.car == 'all') {
            var car = MC.Data.getCarById(MC.Data.current_cars[0]);
            car.focus();

            // Process focus scenery for single selected car
        } else if (MC.Data.current_cars.length == 1 && MC.Data.car != 'all') {
            // If current car is on a map
            if (MC.Data.current_car.params.on_map === true) {
                // Simply focus on a car

                MC.Data.current_car.focus();

                if(this.zoomed_on_car !== true){
                    this.zoomed_on_car = true;
                    MC.Map.setZoom(14);
                }

                // Otherwise focus to map defaults
            } else {
                MC.Map.returnToRoots();
            }
        } else {
            MC.Map.returnToRoots();
        }
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
    this.timemachine = false;
    this.date = new Date();
    this.hash = core.ui.getHashData();
    this.car = 'all';
    this.fleet = 'all';
    this.current_car = null;
    this.current_fleet = null;
    this.auto_renew = true;
    this.auto_focus = true;
    this.show_car_path = false;
    this.current_cars = [];
    this.auto_renew_blocker = false;
    this.cars_on_map = 0;

    /* Class constructor */
    this.__construct = function () {
        this.hardLoad();

        $(window).on('hashchange', function () {
            MC.Data.softLoad();
        });

        core.ticker.addIntervalMethod(function () {
            MC.Data.autoRenewStack();
        });
    };

    /* Methods */
    /* Hard load - is cars and fleets data loader with binds starter methods */
    this.hardLoad = function () {
        MC.View.zoomed_on_car = false;
        MC.View.no_points_message = false;
        MC.View.hideMapMessage(false);

        this.readOptionsFromCookies();
        this.setParamsFromHash();
        MC.View.bindMapOptionsController(true);
        this.getUserFleetsAndDevices();
    };

    /* Soft load - binds starter methods without cars and fleets data loader */
    this.softLoad = function () {
        MC.View.zoomed_on_car = false;
        MC.View.no_points_message = false;
        MC.View.hideMapMessage(false);

        this.readOptionsFromCookies();
        this.setParamsFromHash();
        this.bindCurrentFleetAndCar();
        this.getSetCurrentCars();
        this.loadDynamicCarsData(true);

        MC.View.bindMapOptionsController();
        MC.View.setHeaderTexts();
        MC.View.createCarsAndFleetsMenu();
    };

    /* Read map view options */
    this.readOptionsFromCookies = function () {
        // Проверяем на наличие отключенного автообновления в куках
        if ($.cookie('auto-renew')) {
            if ($.cookie('auto-renew') == '0') {
                this.auto_renew = false;
            } else {
                this.auto_renew = true;
            }
        }

        if ($.cookie('auto-focus')) {
            if ($.cookie('auto-focus') == '1') {
                this.auto_focus = true;
            } else {
                this.auto_focus = false;
            }
        }

        if ($.cookie('car-path')) {
            if ($.cookie('car-path') == '1') {
                this.show_car_path = true;
            } else {
                this.show_car_path = false;
            }
        }
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
                this.car = 'all';
            }

            if (this.hash.timemachine) {
                this.timemachine = true;
                this.date = core.utilities.timestampToDateYearLast(this.hash.timemachine);

                this.auto_renew = false;
                this.show_car_path = true;
            } else {
                this.timemachine = false;
                this.date = new Date();

                // Re init params when TM is off
                this.readOptionsFromCookies();
            }
        }
    };

    /* Get car by id from loaded data */
    this.getCarById = function (id) {
        return $.grep(this.cars, function (e) {
            return e.params.id == id;
        })[0];
    };

    /* Get fleet by id from loaded data */
    this.getFleetById = function (id) {
        return $.grep(this.fleets, function (e) {
            return e.id == id;
        })[0];
    };

    /* Show an loading error */
    this.error = function () {
        $.meow({
            title: 'Ошибка',
            message: 'Внутренняя ошибка сервиса',
            duration: 8000
        });
    };

    /* Create cars */
    this.createCarsObjects = function () {
        for (var i = 0, l = this.cars.length; i < l; i++) {
            this.cars[i] = new Car(this.cars[i], MC.Map);
        }
    };

    /* Postprocess cars and fleets data loader */
    this.processLoadedData = function (data) {
        this.cars = data.devices;
        this.fleets = data.fleets;

        this.createCarsObjects();
        this.bindCurrentFleetAndCar();

        MC.View.setHeaderTexts();
        MC.View.createCarsAndFleetsMenu();
    };

    /* Bind current car and current fleet data */
    this.bindCurrentFleetAndCar = function () {
        this.current_car = null;
        this.current_fleet = null;

        if (this.car != 'all' && this.car) {
            this.current_car = this.getCarById(this.car);

            if (!this.current_car) {
                this.car = 'all';
                MC.View.showMapMessage({
                    icon: 'warning',
                    message: 'Ошибка, машины с ID ' + this.car + ' не существует!'
                });
            }
        }

        if (this.fleet != 'all' && this.fleet) {
            this.current_fleet = this.getFleetById(this.fleet);

            if (!this.current_fleet) {
                this.fleet = 'all';
                MC.View.showMapMessage({
                    icon: 'warning',
                    message: 'Ошибка, группы с ID ' + this.fleet + ' не существует!'
                });
            }
        }
    };

    /* Get-set curent cars to process */
    this.getSetCurrentCars = function () {
        this.current_cars = [];

        var cars;

        //Находим все тачки, соответствующие выбранным опциям (группа/тачка)
        if (this.current_car && this.current_car.params.id > 0) {
            cars = $.grep(this.cars, function (e) {
                return e.params.id == MC.Data.current_car.params.id;
            });

        } else if (this.current_fleet && this.current_fleet.id > 0) {
            cars = $.grep(this.cars, function (e) {
                return e.params.fleet_id == MC.Data.current_fleet.id;
            });

        } else {
            cars = this.cars;
        }

        for (var i = 0, l = cars.length; i < l; i++) {
            this.current_cars.push(cars[i].params.id);
        }
    };

    /* Merge cars data */
    this.mergeCarsData = function (data) {
        if (data) {
            for (var i = 0, l = data.length; i < l; i++) {
                this.getCarById(data[i].id).updateParams(data[i]);
            }

            if (this.auto_focus) {
                MC.View.focus();
            }
        }
    };

    /* Draw cars */
    this.drawCars = function () {
        for (var i = 0, l = this.current_cars.length; i < l; i++) {
            var car = this.getCarById(this.current_cars[i]);

            car.draw(function(status){
                if(status === true){
                    MC.Data.cars_on_map++;
                }
            });
        }

        this.presenceStatusAndMessages();
    };

    /* Remove cars from a map */
    this.removeCars = function () {
        this.cars_on_map = 0;

        for (var i = 0, l = this.cars.length; i < l; i++) {
            this.cars[i].removePath();
            this.cars[i].remove();
        }
    };

    this.presenceStatusAndMessages = function () {
        //MC.View.hideMapMessage(false);

        if (this.cars_on_map < 1) {
            var day, message = false;

            if (core.utilities.humanizeDateTime(this.date, false) == core.utilities.humanizeDateTime(new Date(), false)) {
                day = 'сегодня';
            } else {
                day = core.utilities.humanizeDateTime(this.date, false);
            }

            if (this.car == 'all') {
                message = 'На ' + day + ' не зарегистрированно ни одной отметки, ни для одной машины';

            } else if (this.car != 'all' && this.current_car && !this.current_car.params.last_point_date) {
                message = 'Для машины &laquo;' + this.current_car.params.name + '&raquo; нет ни одной отметки';

            } else if (
                this.car != 'all' &&
                    this.current_car &&
                    this.current_car.params.last_update &&
                    (core.utilities.humanizeDateTime(this.current_car.params.last_point_date, false) != core.utilities.humanizeDateTime(this.date, false))
                ) {

                var hash = '',
                    hs = '';

                if (MC.Data.hash != null && MC.Data.fleet != 'all' && MC.Data.fleet > 0) {
                    hash += 'fleet=' + MC.Data.fleet;
                }

                if (MC.Data.hash != null && MC.Data.car && MC.Data.fleet != 'all' && MC.Data.fleet > 0) {
                    hash += '&car=' + MC.Data.car;
                } else if (MC.Data.hash != null && MC.Data.car && (!MC.Data.fleet || MC.Data.fleet == 'all')) {
                    hash += 'car=' + MC.Data.car;
                }

                hash = '#' + hash;

                if (hash != '#') {
                    hs = hs + '&';
                }

                hash = hash +
                    hs +
                    'timemachine=' +
                    MC.Data.current_car.params.last_point_date.getDate() + '-' +
                    (parseInt(MC.Data.current_car.params.last_point_date.getMonth()) + 1) + '-' +
                    MC.Data.current_car.params.last_point_date.getFullYear();

                message = 'На ' + day + ' не зарегистрированно ни одной отметки для машины &laquo;' +
                    this.current_car.params.name +
                    '&raquo;. Последняя отметка была зарегистрированна ' +
                    '<a href="' + hash + '">' + core.utilities.humanizeDateTime(this.current_car.params.last_point_date, false) + '</a>';
            }

            if (message && MC.View.no_points_message === false) {
                MC.View.no_points_message = true;

                MC.View.hideMapMessage(false);
                MC.View.showMapMessage({
                    icon: 'warning',
                    message: message
                });
            }
        }
    }

    /* Get cars metrics */
    this.loadDynamicCarsData = function (firstload) {
        if (this.current_cars.length <= 0) {
            return;
        }

        $.ajax({
            url: '/control/map/?ajax&action=getDynamicDevicesData&date=' + core.utilities.tmToDate(this.date),
            data: {
                cars: JSON.stringify(this.current_cars),
                tm_flag: (this.timemachine === true) ? '1' : '0'
            },
            dataType: 'json',
            type: 'post',
            beforeSend: function () {
                /*  Если запрос был на обновление данных, а не на первичную загрузку -
                 отключем на время загрузки данных автообновление,
                 чтобы не было ситуации, когда маркеров на карте нет,
                 а функция обновления запускается */
                if (firstload === true) {
                    MC.Data.auto_renew_blocker = true;
                    // Не показываем глобал лоадинг, если запрос был на обновление данных
                    core.loading.setGlobalLoading('loadDynamicCarsData');
                }
            },
            success: function (data) {
                if (firstload === true) {
                    core.loading.unsetGlobalLoading('loadDynamicCarsData');
                }

                /*  Если запрос был на обновление данных, а не на первечную загрузку -
                 включаем автообновление */
                if (firstload === true) {
                    MC.Data.auto_renew_blocker = false;
                }

                MC.Data.mergeCarsData(data);

                if (firstload === true) {
                    MC.Data.removeCars();
                }

                MC.Data.drawCars();

                if (MC.Data.show_car_path === true && MC.Data.current_car) {
                    MC.Data.current_car.drawPath(function(){
                        if (firstload === true) {
                            MC.Data.current_car.focusOnPath();
                        }
                    });
                }else if(MC.Data.show_car_path !== true && firstload === true) {
                    MC.View.focus();
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

    //Load fleets and their cars data
    this.getUserFleetsAndDevices = function () {
        $.ajax({
            url: '/control/map/?ajax',
            data: {
                action: 'getUserFleetsAndDevices',
                date: core.utilities.tmToDate(this.date)
            },
            dataType: 'json',
            type: 'get',
            beforeSend: function () {
                core.loading.setGlobalLoading('getUserFleetsAndDevices');
            },
            success: function (data) {
                core.loading.unsetGlobalLoading('getUserFleetsAndDevices');

                MC.Data.processLoadedData(data);
                MC.Data.getSetCurrentCars();
                MC.Data.loadDynamicCarsData(true);
            },
            error: function () {
                core.loading.unsetGlobalLoading('getUserFleetsAndDevices');
                core.ajax.errorHandler();
            }
        });
    };

    this.autoRenewStack = function () {
        if (this.auto_renew !== true) {
            return;
        }

        if (this.auto_renew_blocker !== true) {
            MC.Data.loadDynamicCarsData(false);
        }

        if (this.auto_focus === true) {
            MC.View.focus();
        }
    }
};

var MC = {
    init: function () {
        core.ticker.delay = 1000;

        this.Map = new Map();
        this.View = new View();
        this.Data = new Data();
        this.Data.__construct();

        /* var m = new PosMarker({
         metrics: {
         heading: 55,
         lat: 33,
         lng: 55
         },
         car_id: 1
         });

         var m1 = new WpMarker({
         metrics: {
         heading: 55,
         lat: 35,
         lng: 54
         },
         focus_on_click: true,
         car_id: 2
         });

         var m2 = new PosMarker({
         metrics: {
         heading: 145,
         lat: 34,
         lng: 56,
         speed: 10,
         date: '2013-04-19 22:22:29',
         altitude: '112'
         },
         car_label: true,
         car_label_data: {
         name: 'Test',
         g_id: 'а777аа177'
         },
         car_id: 3,
         on_click: function (e) {
         console.log(e)
         }
         });

         var p = new Path({
         options: {
         color: '#000',
         opacity: 1,
         weight: 3
         },
         points: [
         new L.LatLng(33,54),
         new L.LatLng(34,45),
         new L.LatLng(32,65),
         new L.LatLng(33,41),
         new L.LatLng(31,49)
         ]
         });

         p.draw();*/
    }
};

$(window).on('load', function(){
    MC.init();
});