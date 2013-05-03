"use strict";

/**
 *  Map implementation
 **/
var Map = function (params) {
    /* Class params */
    this.instance = null;
    this.params = {
        zoom: 4,
        zoom_geoposition: 10,
        lat: 55,
        lng: 35,
        minHeight: 250,
        height: 400
    };

    $.extend(true, this.params, params);

    /* Class constructor */
    this.__construct = function () {
        this.instance = new L.Map('map', {
            layers: core.map_tools.getLayers(),
            center: new L.LatLng(this.params.lat, this.params.lng),
            zoom: this.params.zoom
        });

        this.instance.addControl(new L.Control.FullScreen());
        this.instance.addControl(new L.Control.Locate());

        $('.leaflet-control-attribution').html('О наших <a href="/control/about#maps">картах</a>');

        setTimeout(function () {
            $('.leaflet-control-attribution').fadeOut(3000);
        }, 10000);
    };

    /* Methods */
    this.invalidateSize = function () {
        this.instance.invalidateSize();
    };

    /* Init actions */
    this.__construct();
};

/**
 *  Marker implementation
 **/
var Marker = function (params) {
    /* Class params */
    //this.layer = null;
    this.instance = null;
    this.params = {
        metrics: {
            lat: 0,
            lng: 0,
            speed: 0,
            heding: 0,
            altitude: 0,
            date: 0
        },
        options: {
            clickable: true,
            draggable: false,
            opacity: 1,
            riseOnHover: true,
            riseOffset: 250,
            zIndexOffset: 1,
            title: ''
        },
        car_id: null,
        focus_on_click: false,
        on_click: null,
        geocoder_data: null,
        geocoder: false, // TODO: WARNING, DO NOT ENABLE!!! VERY EXPERIMENTAL FEATURE, STILL IN PRIVATE BETA!
        map_instance: null,
        draw: true
    };

    $.extend(true, this.params, params);

    /* Class constructor */
    this.__construct = function () {
        var t = this;

        this.instance = L.marker(
            [this.params.metrics.lat, this.params.metrics.lng],
            this.params.options
        );

        this.instance.on('click', function () {
            if (t.params.focus_on_click === true) {
                t.focus();
            }

            if (t.params.on_click) {
                t.params.on_click(t);
            }
        })

        if (this.params.draw === true) {
            this.draw();
        }
    };

    /* Abstraction */
    this.getPopupHtml = function () {
        return;
    };

    /* Methods */
    /* Bind Popup */
    this.setPopup = function () {
        this.instance.bindPopup(this.getPopupHtml(), {
            maxWidth: 300,
            minWidth: 100
        });
    };

    this.renewPopupHtml = function () {
        if (this.instance._popup) {
            this.instance._popup.setContent(this.getPopupHtml());
        }
    };

    /* Draw marker on a map */
    this.draw = function () {
        if (this.params.map_instance) {
            this.params.map_instance.addLayer(this.instance);
        }
    };

    /* Remove marker from a map */
    this.remove = function () {
        if (this.params.map_instance) {
            this.params.map_instance.removeLayer(this.instance);
        }
    };

    /* Move marker in new position */ // TODO: DEPRECATED TO USE DIRECTLY! USE Marker.updateMetrics() METHOD INSTEAD!
    this.move = function (lat, lng) {
        if (this.params.metrics.lat != lat || this.params.metrics.lng != lng) {
            this.params.metrics.lat = lat;
            this.params.metrics.lng = lng;

            this.instance.setLatLng(new L.LatLng(lat, lng));
            this.renewGeocoderData();
        }
    };

    /* Pan to a marker */
    this.focus = function () {
        if (this.params && this.params.map_instance) {
            this.params.map_instance.panTo(this.instance.getLatLng());
        }
    };

    /* Renew position data, based (geocoding) */
    this.renewGeocoderData = function () {
        if (this.params.geocoder === true) {
            var t = this;

            core.map_tools.geocodingRequest(this.params.metrics.lat, this.params.metrics.lng, function (data) {
                t.params.geocoder_data = data;
            });
        }
    };

    /* Renew all the metrics */
    this.updateMetrics = function (metrics) {
        var data_changed = false;

        if ((metrics.lat && metrics.lng) && (this.params.metrics.lat != metrics.lat || this.params.metrics.lng != metrics.lng)) {
            this.move(metrics.lat, metrics.lng);
            data_changed = true;
        }

        if (metrics.heading && this.params.metrics.heding != metrics.heading) {
            this.params.metrics.heading = metrics.heading;

            if (this.setHeadingIcon) {
                this.setHeadingIcon(metrics.heading);
            }

            data_changed = true;
        }

        if (metrics.speed && this.params.metrics.speed != metrics.speed) {
            this.params.metrics.speed = metrics.speed;
            data_changed = true;
        }

        if (metrics.altitude && this.params.metrics.altitude != metrics.altitude) {
            this.params.metrics.altitude = metrics.altitude;
            data_changed = true;
        }

        if (metrics.date && this.params.metrics.date != metrics.date) {
            // TODO: Make the dates comparsion by Date.getTime() method. And make the all input dates parser to objects
            this.params.metrics.date = metrics.date;
            data_changed = true;
        }

        if (data_changed === true) {
            this.renewPopupHtml();
        }
    };

    /* Init actions */
    this.__construct();
};

/**
 *  Position marker implementation
 **/
var PosMarker = function (params) {
    /* Class params */
    this.params = {
        car_label: false,
        car_label_data: {
            name: '',
            g_id: ''
        },
        options: {
            icon: null,
            title: '',
            zIndexOffset: (params.car_id) ? (params.car_id + 10000) : 10000
        },
        geocoder: false // TODO: WARNING, DO NOT ENABLE!!! VERY EXPERIMENTAL FEATURE, STILL IN PRIVATE BETA!
    };

    $.extend(true, this.params, params);

    /* Class constructor */
    this.__construct = function () {
        this.params.options.icon = this.getHeadingIcon();
        this.__proto__ = new Marker(this.params);
        this.setPopup();
    };

    /* Methods */
    /* Create icon HTML based on heading degrees */
    this.getHeadingIcon = function () {
        var icon;

        // Compensate the over 360 degree heading
        if (this.params.metrics.heading > 360) {
            var h1 = this.params.metrics.heading / 360,
                h2 = h1 - Math.floor(h1);

            this.params.metrics.heading = Math.round(h2 * 360);
        }

        var degrees_zone = Math.round(parseInt(this.params.metrics.heading) / 15) * 1;

        if (isNaN(degrees_zone)) {
            degrees_zone = 0;
        }

        if (degrees_zone == 360) {
            degrees_zone = 0;
        }

        degrees_zone = degrees_zone * 40;

        if (this.params.car_label === true && this.params) {
            var html =
                '<div class="icon" style="background-position: -' + degrees_zone + 'px 0px"></div>' +
                    '<div class="info-block">' +
                    '<i class="arm"></i>' +
                    '<div class="name">' + this.params.car_label_data.name + '</div>' +
                    '<div class="id">' + core.utilities.drawGId(this.params.car_label_data.g_id, 'small') + '</div>' +
                    '</div>';

            icon = new L.DivIcon({
                html: html,
                iconSize: [16, 16], // size of the icon
                iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
                popupAnchor: [0, -20],
                className: 'marker-with-info'
            });
        } else {
            var html = '<div class="icon" style="background-position: -' + degrees_zone + 'px 0px"></div>';

            icon = new L.DivIcon({
                html: html,
                iconSize: [40, 40], // size of the icon
                iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
                popupAnchor: [0, -20],
                className: 'marker-with-info'
            });
        }

        return icon;
    };

    /* Renew heading param and redraw marker icon */ // TODO: DEPRECATED TO USE DIRECTLY! USE Marker.updateMetrics() METHOD INSTEAD!
    this.setHeadingIcon = function (heading) {
        this.instance.setIcon(this.getHeadingIcon());
    };

    /* Generate current position popup HTML */
    this.getPopupHtml = function () {
        var html = '<div class="tooltip-content">';

        html += '<h3>Текущее положение</h3>';

        if (this.params.metrics.date) {
            html += core.utilities.humanizeDate(this.params.metrics.date, 'MYSQLTIME') + '<br>';
        }

        html += '<div class="table-wrapper"><table class="bordered hovered">';

        if (this.params.metrics.speed) {
            html += '<tr><th>Скорость</th><td>' + core.utilities.convertKnotsToKms(this.params.metrics.speed) + ' км/ч</td></tr>';
        }

        if (this.params.metrics.altitude) {
            html += '<tr><th>Высота</th><td>' + this.params.metrics.altitude + ' м' + '</td></tr>';
        }

        if (this.params.metrics.lat && this.params.metrics.lng) {
            html += '<tr><th>Координаты Ш/Д</th><td>' + this.params.metrics.lat + '&deg; / ' + this.params.metrics.lng + '&deg;</td></tr>';
        }

        html += '</table></div>';
        html += '</div>';

        return html;
    };

    /* Init actions */
    this.__construct();
};

/**
 *  Waypoint marker implementation
 **/
var WpMarker = function (params) {
    /* Class params */
    this.params = {
        car_data: null,
        point_data: null,
        type: 'way',
        options: {
            icon: null,
            title: '',
            zIndexOffset: 5000
        },
        geocoder: false // TODO: WARNING, DO NOT ENABLE!!! VERY EXPERIMENTAL FEATURE, STILL IN PRIVATE BETA!
    };

    $.extend(true, this.params, params);

    /* Class constructor */
    this.__construct = function () {
        this.params.options.icon = this.getWpIcon(this.params.type);
        this.__proto__ = new Marker(this.params);
        this.setPopup();
    };

    /* Methods */
    this.getWpIcon = function (type) {
        switch (type) {
            case 'stop' :
            {
                return L.icon({
                    iconUrl: '/control/map/img/markers/waypoint_stop.png',
                    iconSize: [7, 7], // size of the icon
                    iconAnchor: [3, 3], // point of the icon which will correspond to marker's location
                    popupAnchor: [0, -4] // point from which the popup should open relative to the iconAnchor
                });
            }
                break;

            case 'way' :
            default :
            {
                return L.icon({
                    iconUrl: '/control/map/img/markers/waypoint.png',
                    iconSize: [7, 7], // size of the icon
                    iconAnchor: [3, 3], // point of the icon which will correspond to marker's location
                    popupAnchor: [0, -4] // point from which the popup should open relative to the iconAnchor
                });
            }
                break;
        }
    };

    /* Generate current position popup HTML */ // TODO: Complete this!
    this.getPopupHtml = function () {
        var html = '<div class="tooltip-content">';

        html += '<h3>Метка</h3>';
        html += '</div>';

        return html;
    };

    /* Init actions */
    this.__construct();
};

/**
 *  Path implementation
 **/
var Path = function (params) {
    this.instance = null;

    /* Class params */
    this.params = {
        options: {
            color: '#000000',
            weight: 5,
            opacity: 0.5,
            smoothFactor: 1.0,
            dashArray: null,
            clickable: true
        },
        map_instance: null,
        points: []
    };

    $.extend(true, this.params, params);

    /* Class constructor */
    this.__construct = function () {
        this.instance = L.polyline(
            this.params.points,
            this.params.options
        );
    };

    /* Methods */
    /* Draw path on a map */
    this.draw = function () {
        if (this.params.map_instance) {
            this.params.map_instance.addLayer(this.instance);
        }
    };

    /* Remove path from a map */
    this.remove = function () {
        if (this.params.map_instance) {
            this.params.map_instance.removeLayer(this.instance);
        }
    };

    /* Add path point */
    this.addPoint = function(lat, lng){
        this.instance.addLatLng(new L.LatLng(lat, lng));
    };

    /* Add path point */
    this.addPoints = function(points){
        for(var i = 0, l = points.length; i < l; i++){
            if(points[i][0] && points[i][1]){
                this.addPoint(points[i][0], points[i][1]);
            }else{
                this.addPoint(points[i].lat, points[i].lng);
            }
        }
    };

    /* Init actions */
    this.__construct();
};

/**
 *  Car implementation
 **/
var Car = function(params){

};

/**
 *  Data implementation
 **/
var Data = function () {
    /* Data items */
    this.cars = [];

    /* Methods */
    this.getCarById = function (id) {
        return $.grep(this.cars_list, function (e) {
            return e.id == id;
        })[0];
    }

    this.error = function () {
        $.meow({
            title   : 'Ошибка',
            message : 'Внутренняя ошибка сервиса',
            duration: 12000
        });
    },

    this.getCarPath = function (car_id, last_point_id, callback) {
        this.loading_process = $.ajax({
            url: '/control/map/?ajax',
            data: {
                action: 'getPoints',
                date: map.date,
                device_id: car_id,
                last_point_id: (last_point_id) ? last_point_id : '0'
            },
            dataType: 'json',
            type: 'get',
            beforeSend: function () {
                if (this.loading_process) {
                    this.loading_process.abort();
                    core.loading.unsetGlobalLoading();
                }

                core.loading.setGlobalLoading();
            },
            success: function (data) {
                core.loading.unsetGlobalLoading();
                callback(data);
            },
            error: function () {
                core.loading.unsetGlobalLoading();
                data_ctrl.error();
            }
        });
    },

    //Загружаем данные о группах и тачках с сервера
    this.getUserFleetsAndDevices = function (callback) {
        this.loading_process = $.ajax({
            url: '/control/map/?ajax',
            data: {
                action: 'getUserFleetsAndDevices',
                date: map.date
            },
            dataType: 'json',
            type: 'get',
            beforeSend: function () {
                if (this.loading_process) {
                    this.loading_process.abort();
                    core.loading.unsetGlobalLoading();
                }

                core.loading.setGlobalLoading();
            },
            success: function (data) {
                core.loading.unsetGlobalLoading();
                callback(data);
            },
            error: function () {
                core.loading.unsetGlobalLoading();
                data_ctrl.error();
            }
        });
    },

    //Загружаем динамические данные тачек (координаты, скорость, HDOP и пр.)
    this.getDynamicCarsData = function (cars, options, callback) {
        var h = core.ui.getHashData(),
            tm_flag = '0';

        if (h && h.timemachine) {
            tm_flag = '1';
        }

        this.loading_process = $.ajax({
            url: '/control/map/?ajax&action=getDynamicDevicesData&date=' + map.date,
            data: {
                cars: JSON.stringify(cars),
                tm_flag: tm_flag
            },
            dataType: 'json',
            type: 'post',
            beforeSend: function () {
                //Если запрос был на обновление данных, а не на первечную загрузку -
                // отключем на время загрузки данных автообновление,
                // чтобы не было ситуации, когда маркеров на карте нет,
                // а функция обновления запускается
                if (!options.renew) {
                    map.auto_renew = false;
                }

                if (this.loading_process) {
                    this.loading_process.abort();
                    core.loading.unsetGlobalLoading();
                }

                //Не показываем глобал лоадинг, если запрос был на обновление данных
                if (!options.renew) {
                    core.loading.setGlobalLoading();
                }
            },
            success: function (data) {
                //Если запрос был на обновление данных, а не на первечную загрузку -
                // включаем автообновление, если оно, конечно не отключено в куках
                if (!options.renew && $.cookie('auto-renew') != '0' && !map.checkTimemachineMode()) {
                    map.auto_renew = true;
                }

                if (!options.renew) {
                    core.loading.unsetGlobalLoading();
                }

                callback(data);
            },
            error: function () {
                if (!options.renew && $.cookie('auto-renew') != '0' && !map.checkTimemachineMode()) {
                    map.auto_renew = true;
                }

                if (!options.renew) {
                    core.loading.unsetGlobalLoading();
                }

                data_ctrl.error();
            }
        });
    }
};

/**
 *  Model implementation
 **/
var Model = function () {

};

/**
 *  View implementation
 **/
var View = function (params) {
    /* Class params */
    this.params = {
        map_instance: null
    };

    $.extend(true, this.params, params);

    /* Class constructor */
    this.__construct = function () {
        this.mapView();
    };

    /* Methods */
    /* Set map and side tools sizes */
    this.mapView = function () {
        var t = this;

        var resize = function () {
            $('#map, .map-container').css({
                height: $('body').height() - $('.top-panel').height() - $('footer').height() - 20,
                width: $('body').width() - $('.map-side-panel').width()
            });

            $('.map-full-sized-frame .h1').css({
                width: $('body').width() - $('.map-side-panel').width()
            });

            $('.map-side-panel').css({
                minHeight: $('.map-container').height()
            });

            if (t.params.map_instance) {
                t.params.map_instance.invalidateSize();
            }
        };

        resize();

        $(window).on('resize', function () {
            resize();
        });
    };

    this.createCarsAndFleetsMenu = function(fleet_id){
        //Cars select
        var exclude = null;

        if (fleet_id != 'all' && fleet_id != '') {
            exclude = {
                param_name: 'fleet_id',
                param_value: fleet_id
            };
        }

        core.ui.createSelect('#cars-menu', {
            id: 'cars-menu-select',
            default_opt: {
                val: 'all',
                name: 'Все машины'
            },
            default: this.hash.car,
            key_name: 'id',
            value_name: 'name',
            exclude: exclude,
            items: this.cars_list,
            onChange: function (val) {

            }
        });

        //Groups select
        core.ui.createSelect('#fleets-menu', {
            id: 'fleets-menu-select',
            default_opt: {
                val: 'all',
                name: 'Все группы'
            },
            default: this.hash.fleet,
            key_name: 'id',
            value_name: 'name',
            items: this.fleets_list,
            onChange: function (val) {

            }
        });
    };

    /* Init actions */
    this.__construct();
};

/**
 *  Object implementation
 **/
var Controller = function(){
    /* Class constructor */
    this.__construct = function(){
        this.Data = new Model();

        this.Map = new Map({
            zoom: 6,
            zoom_geoposition: 10,
            lat: 33,
            lng: 55,
            minHeight: 250,
            height: 400
        });

        this.Model = new Model();

        this.View = new View({
            map_instance: this.Map.instance
        });



        /**/
        var m = new PosMarker({
            metrics: {
                heading: 55,
                lat: 33,
                lng: 55
            },
            map_instance: this.Map.instance,
            car_id: 1
        });

        var m1 = new WpMarker({
            metrics: {
                heading: 55,
                lat: 35,
                lng: 54
            },
            map_instance: this.Map.instance,
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
            map_instance: this.Map.instance,
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
            map_instance: this.Map.instance,
            points: [
                new L.LatLng(33,54),
                new L.LatLng(34,45),
                new L.LatLng(32,65),
                new L.LatLng(33,41),
                new L.LatLng(31,49)
            ]
        });

        p.draw();
    }

    /* Init actions */
    this.__construct();
}