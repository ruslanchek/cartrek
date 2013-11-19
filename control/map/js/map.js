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
        var speed;

        if (animation === true) {
            speed = 250;
        } else {
            speed = 0;
        }

        $('.map-notice').addClass('close-animation').fadeOut(speed, function () {
            $('.map-notice').remove();
        });

        $('body').off('keyup.showMapMessage');
    };

    this.bindDatepicker = function(date){
        $('.datepicker .widget').datepicker('setDate', core.utilities.humanizeDate(date) );

        $('.datepicker .widget').datepicker({
            onSelect: function(text, obj){
                var car = MC.Data.car,
                    fleet = MC.Data.fleet,
                    h = '#';

                if(fleet){
                    h += 'fleet=' + fleet;
                }

                if(car){
                    if(fleet){
                        h += '&';
                    }

                    h += 'car=' + car;
                }

                var tm_date = new Date();

                tm_date.setDate(obj.selectedDay);
                tm_date.setMonth(obj.selectedMonth);
                tm_date.setFullYear(obj.selectedYear);

                if(core.utilities.compareDates(MC.Data.date, tm_date) !== true){
                    if(!car && !fleet){
                        h += '#';
                    }else{
                        h += '&';
                    }

                    h += 'timemachine=' + obj.selectedDay + '-' + (obj.selectedMonth + 1) + '-' + obj.selectedYear;
                }

                document.location.hash = h;

                /*selectedDay: 3
                selectedMonth: 8
                selectedYear: 2013*/
            },
            firstDay: 1,
            dateFormat: 'd M, yy',
            minDate: '-30d',
            maxDate: '+0d',
            prevText: 'Назад',
            nextText: 'Вперед',
            defaultDate: date,
            dayNames: [ "Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота" ],
            dayNamesMin: [ "Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб" ],
            dayNamesShort: [ "Вос", "Пон", "Вто", "Сре", "Чет", "Пят", "Суб" ],
            monthNames: [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ],
            monthNamesShort: [ "января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря" ]
        });
    };

    this.showMapMessage = function (options) {
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

        $('body').off('keyup.showMapMessage').on('keyup.showMapMessage', function(e){
            if(e.keyCode == 27){
                MC.View.hideMapMessage(true);
            }
        });
    };

    /* Set header texts */
    this.renewCurrentStatusViews = function () {
        var current_info_html       = '',
            current_cars_list_html  = '',
            multiple                = false,
            selected                = 0,
            viewed                  = 0,
            cars_on_map             = MC.Data.current_cars_obj;

        if (core.utilities.compareDates(MC.Data.date, new Date()) === true) {
            $('#date-menu .icon').removeClass('timemachine').addClass('calendar').attr('title', 'Выбрать дату для машины времени');
        }else{
            $('#date-menu .icon').removeClass('calendar').addClass('timemachine').attr('title', 'Машина времени активна (' + core.utilities.humanizeDate(MC.Data.date) + ')');
        }

        if (MC.Data.current_car) {
            var status = '',
                speed = '',
                hdop = '',
                csq = '',
                name = '';

            if (MC.Data.current_car.params.metrics && MC.Data.current_car.params.metrics.online === true) {
                status = '<span class="status-text green">Онлайн</span>';
                hdop = core.utilities.getHDOPIndicator(MC.Data.current_car.params.metrics.hdop, MC.Data.current_car.params.sat_count, true);
                csq = core.utilities.getCSQIndicator(MC.Data.current_car.params.metrics.csq, true);
                name = '<a href="#">' + MC.Data.current_car.params.name + '</a>';
            }else{
                status = '<span class="status-text gray">Офлайн</span>';
                name = '<span>' + MC.Data.current_car.params.name + '</span>';
            }

            if(MC.Data.current_car.params.metrics.speed > 0 && MC.Data.current_car.params.metrics.online === true){
                speed = '<span class="status-text green">' + core.utilities.convertKnotsToKms(MC.Data.current_car.params.metrics.speed) + '</span>';
            }else if ( MC.Data.current_car.params.metrics.online === true ){
                speed = '<span class="status-text gray">0 км/ч</span>';
            }

            current_info_html +=
                '<div class="status-info-table-block">' +
                    '<table>' +
                        '<tr>' +
                            '<td>' +
                                '<div>' + core.utilities.drawGId(MC.Data.current_car.params.g_id, 'small') + '</div>' +
                                name +

                                '<div class="clear"></div>' +

                                '<div class="status-block">' +

                                    '<div class="item">' +
                                        status +
                                    '</div>' +

                                    '<div class="item">' +
                                        speed +
                                    '</div>' +

                                    '<div class="item">' +
                                        csq +
                                    '</div>' +

                                    '<div class="item">' +
                                        hdop +
                                    '</div>' +

                                    '<div class="clear"></div>' +

                                '</div>' +
                            '</td>' +
                        '</tr>';
                    '</table>' +
                '</div>';

        } else if (MC.Data.current_fleet){
            multiple    = true;
            selected    = MC.Data.current_fleet.cars;
            viewed      = MC.Data.getCarsOnMap().length;
        } else {
            multiple    = true;
            selected    = MC.Data.current_cars.length;
            viewed      = MC.Data.getCarsOnMap().length;
        }

        if(multiple === true){
            current_info_html +=
                '<div class="status-info-table-block">' +
                '<table>' +
                '<tr>' +
                '<td width="99%">Выбрано автомобилей</td>' +
                '<td width="1%"><span class="badge">' + selected + '</span></td>' +
                '</tr>' +
                '<tr>' +
                '<td>Из них на карте</td>' +
                '<td><span class="badge">' + viewed + '</span></td>' +
                '</tr>' +
                '</table>' +
                '</div>';

            if(cars_on_map.length > 0){
                for(var i = 0, l = cars_on_map.length; i < l; i++){
                    var status = '',
                        speed = '',
                        hdop = '',
                        csq = '',
                        name = '';

                    if (cars_on_map[i].params.metrics && cars_on_map[i].params.metrics.online === true) {
                        status = '<span class="status-text green">Онлайн</span>';
                        hdop = core.utilities.getHDOPIndicator(cars_on_map[i].params.metrics.hdop, cars_on_map[i].params.sat_count, true);
                        csq = core.utilities.getCSQIndicator(cars_on_map[i].params.metrics.csq, true);
                        name = '<a href="#">' + cars_on_map[i].params.name + '</a>';
                    }else{
                        status = '<span class="status-text gray">Офлайн</span>';
                        name = '<span>' + cars_on_map[i].params.name + '</span>';
                    }

                    if(cars_on_map[i].params.metrics.speed > 0 && cars_on_map[i].params.metrics.online === true){
                        speed = '<span class="status-text green">' + core.utilities.convertKnotsToKms(cars_on_map[i].params.metrics.speed) + '</span>';
                    }else if ( cars_on_map[i].params.metrics.online === true ){
                        speed = '<span class="status-text gray">0 км/ч</span>';
                    }

                    current_cars_list_html +=   '<tr>' +
                                                '<td>' +
                                                    '<div>' + core.utilities.drawGId(cars_on_map[i].params.g_id, 'small') + '</div>' +
                                                    name +
                                                    '<div class="clear"></div>' +

                                                    '<div class="status-block">' +
                                                        '<div class="item">' +
                                                            status +
                                                        '</div>' +

                                                        '<div class="item">' +
                                                            speed +
                                                        '</div>' +

                                                        '<div class="item">' +
                                                            csq +
                                                        '</div>' +

                                                        '<div class="item">' +
                                                            hdop +
                                                        '</div>' +

                                                        '<div class="clear"></div>' +
                                                    '</div>' +
                                                '</td>' +
                                                '</tr>';
                }

                current_info_html += '<div class="block-separator"></div>';
                current_info_html +=
                    '<div class="status-info-table-block">' +
                        '<table>' +
                            current_cars_list_html +
                        '</table>' +
                    '</div>';
            }
        }

        $('#current-date').html(core.utilities.humanizeDate(MC.Data.date));
        $('#current-info').html(current_info_html);

        this.mapView();
    };

    /* Set map and side tools sizes */
    this.mapView = function () {
        var resize = function () {
            $('#map, .map-container').css({
                height: 0
            }).css({
                height: $('body').height() - $('header.header').height() - $('footer').height() - 15,
                width: $('.map-container').parent().width() + 60
            });

            var ib_height = $('.map-container').height() - 120;

            if(ib_height > $('#current-info').height()){
                ib_height = $('#current-info').height();
            }

            $('.map-tools-info-block').css({
                minHeight: ib_height,
                maxHeight: ib_height
            });

            if (MC.Map.instance) {
                MC.Map.instance.invalidateSize();
            }

            $('.map-tools-info-block').jScrollPane();
        };

        resize();

        $(window).off('resize.map').on('resize.map', function () {
            resize();

            setTimeout(function(){
                $(window).trigger('resize');
            }, 200);
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
            type: 'customSelector',
            id: 'cars-menu-select',
            default_opt: {
                val: 'all',
                name: 'Все автомобили'
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
            type: 'customSelector',
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

        $('.map-tools-top-right').removeClass('init');
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

        $('.map-tools-top-right .icon, #current-date').off('click').on('click', function(){
            if($('.datepicker').data('showed') == true){
                $('.map-tools-top-right #date-menu').removeClass('active');
                $('.datepicker').data('showed', false).fadeOut(100);
            }else{
                $('.map-tools-top-right #date-menu').addClass('active');
                $('.datepicker').data('showed', true).fadeIn(100);
            }
        });

        $('.map-tools-top-right #date-menu input').on('focus blur change', function(){
            return;
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
    this.current_cars_obj = [];
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

        MC.View.bindDatepicker(this.date);
    };

    /* Soft load - binds starter methods without cars and fleets data loader */
    this.softLoad = function () {
        if(this.current_car){
            this.current_car.resetPathPoints();
        }

        MC.View.zoomed_on_car = false;
        MC.View.no_points_message = false;
        MC.View.hideMapMessage(false);

        this.readOptionsFromCookies();
        this.setParamsFromHash();
        this.bindCurrentFleetAndCar();
        this.getSetCurrentCars();
        this.loadDynamicCarsData(true);

        MC.View.bindMapOptionsController();
        MC.View.createCarsAndFleetsMenu();
        MC.View.renewCurrentStatusViews()

        MC.View.bindDatepicker(this.date);
    };

    this.getCarsOnMap = function(){
        return $.grep(this.cars, function (e) {
            return e.params.on_map === true;
        });
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
        this.cars = [];
        this.fleets = [];

        this.cars = data.devices;
        this.fleets = data.fleets;

        this.createCarsObjects();
        this.bindCurrentFleetAndCar();

        MC.View.renewCurrentStatusViews();
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
                    message: 'Ошибка, автомобиля с ID ' + this.car + ' не существует!'
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
        this.current_cars_obj = [];

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
            this.current_cars_obj.push(cars[i]);
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
        MC.View.renewCurrentStatusViews();
    };

    /* Remove cars from a map */
    this.removeCars = function () {
        this.cars_on_map = 0;

        for (var i = 0, l = this.cars.length; i < l; i++) {
            this.cars[i].removePath();
            this.cars[i].remove();
        }
    };

    this.presenceStatusAndMessages = function () {// TODO: Перенести а View()
        //MC.View.hideMapMessage(false);

        if (this.cars_on_map < 1) {
            var day, message = false;

            if (core.utilities.humanizeDateTime(this.date, false) == core.utilities.humanizeDateTime(new Date(), false)) {
                day = 'сегодня';
            } else {
                day = core.utilities.humanizeDateTime(this.date, false);
            }

            if (this.car == 'all') {
                message = 'На ' + day + ' не зарегистрированно ни одной отметки, ни для одного автомобиля';

            } else if (this.car != 'all' && this.current_car && !this.current_car.params.last_point_date) {
                message = 'Для автомобиля &laquo;' + this.current_car.params.name + '&raquo; нет ни одной отметки';

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

                message = 'На ' + day + ' не зарегистрированно ни одной отметки для автомобиля &laquo;' +
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
        if(firstload === true){
            MC.Data.removeCars();
        }

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
                MC.View.renewCurrentStatusViews();

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