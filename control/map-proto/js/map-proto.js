"use strict";

/**
 *  Map implementation
 **/
var Map = function (params) {
    /* Class params */
    this.instance = null;
    this.busy = false;
    this.params = {
        zoom: 4,
        zoom_geoposition: 10,
        lat: 55,
        lng: 37,
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

        var t = this;

        this.instance.on('dragstart', function () {
            t.busy = true;
        });

        this.instance.on('dragend', function () {
            t.busy = false;
        });

        this.instance.on('zoomstart', function () {
            t.busy = true;
        });

        this.instance.on('zoomend', function () {
            t.busy = false;
        });

        this.instance.on('movestart', function () {
            t.busy = true;
        });

        this.instance.on('moveend', function () {
            t.busy = false;
        });
    };

    /* Methods */
    this.invalidateSize = function () {
        this.instance.invalidateSize();
    };

    this.returnToRoots = function () {
        this.instance.panTo(new L.LatLng(this.params.lat, this.params.lng));
        this.instance.setZoom(this.params.zoom);
    };

    this.panTo = function (lat, lng) {
        this.instance.panTo(new L.LatLng(lat, lng));
    };

    this.zoom = function (zoom) {
        this.instance.setZoom(zoom);
    };

    this.fitBounds = function (bounds) {
        this.instance.fitBounds(bounds);
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
        if (MC.Map.instance) {
            MC.Map.instance.addLayer(this.instance);
        }
    };

    /* Remove marker from a map */
    this.remove = function () {
        if (MC.Map.instance) {
            MC.Map.instance.removeLayer(this.instance);
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
        if (this.params && MC.Map.instance) {
            MC.Map.instance.panTo(this.instance.getLatLng());
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
            title: (params.car_label_data && params.car_label_data.name) ? params.car_label_data.name + ' &mdash; текущее положение' : 'Текущее положение',
            zIndexOffset: 10000
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
        if (this.params.metrics && this.params.metrics.heading > 360) {
            var h1 = this.params.metrics.heading / 360,
                h2 = h1 - Math.floor(h1);

            this.params.metrics.heading = Math.round(h2 * 360);
        }

        if (this.params.metrics && this.params.metrics.heading) {
            var degrees_zone = Math.round(parseInt(this.params.metrics.heading) / 15) * 1;
        } else {
            degrees_zone = 0;
        }

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

        html += '<h3>' + this.params.car_label_data.name + '</h3>';

        html += '<em class="small gray">Текущее положение';

        if (this.params.metrics && this.params.metrics.date) {
            html += ' от ' + core.utilities.humanizeDateTime(this.params.metrics.date);
        }

        html += '</em>';

        if (this.params.metrics && (this.params.metrics.speed || this.params.metrics.altitude || (this.params.metrics.lat && this.params.metrics.lng))) {
            html += '<div class="table-wrapper"><table class="bordered hovered">';

            if (this.params.metrics && this.params.metrics.speed) {
                html += '<tr><th>Скорость</th><td>' + core.utilities.convertKnotsToKms(this.params.metrics.speed) + ' км/ч</td></tr>';
            }

            if (this.params.metrics && this.params.metrics.altitude) {
                html += '<tr><th>Высота</th><td>' + this.params.metrics.altitude + ' м' + '</td></tr>';
            }

            if (this.params.metrics && this.params.metrics.lat && this.params.metrics.lng) {
                html += '<tr><th>Координаты Ш/Д</th><td>' + this.params.metrics.lat + '&deg; / ' + this.params.metrics.lng + '&deg;</td></tr>';
            }

            html += '</table></div>';
        }

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
        if (MC.Map.instance) {
            MC.Map.instance.addLayer(this.instance);
        }
    };

    /* Remove path from a map */
    this.remove = function () {
        if (MC.Map.instance) {
            MC.Map.instance.removeLayer(this.instance);
        }
    };

    /* Add path point */
    this.addPoint = function (lat, lng) {
        this.instance.addLatLng(new L.LatLng(lat, lng));
    };

    /* Add path point */
    this.addPoints = function (points) {
        for (var i = 0, l = points.length; i < l; i++) {
            if (points[i][0] && points[i][1]) {
                this.addPoint(points[i][0], points[i][1]);
            } else {
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
var Car = function (params) {
    /* Instances */
    this.pos_marker = null;
    this.path = null;

    /* Data */

    /* Class params */
    this.params = {
        /* Standart */
        on_map: false,
        has_metrics: false,

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

        /* Storage */
        path_points: []
    };

    $.extend(true, this.params, params);

    /* Class constructor */
    this.__construct = function () {
        this.params.last_point_date = core.utilities.timestampToDate(this.params.last_point_date);

        this.createPosMarker();
    };

    /* Methods */
    this.updateParams = function (params) {
        if (params.lat) {
            this.params.metrics.lat = params.lat;
        }

        if (params.lon) {
            this.params.metrics.lng = params.lon;
        }

        if (params.speed) {
            this.params.metrics.speed = params.speed;
        }

        if (params.altitude) {
            this.params.metrics.altitude = params.altitude;
        }

        if (params.last_point_date) {
            this.params.metrics.date = core.utilities.timestampToDate(params.last_point_date);
        }

        if (params.heading) {
            this.params.metrics.heading = params.heading;
        }

        if (params.active) {
            this.params.active = params.active;
        }

        if (params.csq) {
            this.params.csq = params.csq;
        }

        if (params.hdop) {
            this.params.hdop = params.hdop;
        }

        if (params.journey) {
            this.params.journey = params.journey;
        }

        if (params.last_update) {
            this.params.last_update = core.utilities.timestampToDate(params.last_update);
        }

        if (params.online) {
            this.params.online = params.online;
        }

        if (params.params) {
            this.params.params = params.params;
        }

        if (params.point_id) {
            this.params.point_id = params.point_id;
        }

        if (params.sat_count) {
            this.params.sat_count = params.sat_count;
        }

        if (this.params.metrics.lat && this.params.metrics.lng) {
            this.params.has_metrics = true;
        } else {
            this.params.has_metrics = false;
        }

        this.pos_marker.updateMetrics(this.params.metrics);
    };

    this.createPosMarker = function () {
        this.pos_marker = new PosMarker({
            metrics: {
                date: this.params.last_point_date
            },
            draw: false,
            car_id: this.params.id,
            car_label: true,
            car_label_data: {
                name: this.params.name,
                g_id: this.params.g_id
            },
            focus_on_click: true,
            on_click: function (e) {
                //console.log(e)
            }
        });
    };

    this.loadPathPoints = function (last_point_id, callback) {
        if ((last_point_id || last_point_id === false) && this.params.id && MC.Data.date) {
            var t = this;

            $.ajax({
                url: '/control/map/?ajax',
                data: {
                    action: 'getPoints',
                    date: core.utilities.tmToDate(MC.Data.date),
                    device_id: this.params.id,
                    last_point_id: last_point_id
                },
                dataType: 'json',
                type: 'get',
                beforeSend: function () {
                    core.loading.setGlobalLoading('Car.loadPathData.' + t.params.id);
                },
                success: function (data) {
                    core.loading.unsetGlobalLoading('Car.loadPathData.' + t.params.id);

                    if (callback) {
                        callback(data)
                    }
                },
                error: function () {
                    core.loading.unsetGlobalLoading('Car.loadPathData.' + t.params.id);
                    MC.Data.error(); // TODO: Сделать ajaxError() в core.ui
                }
            });
        }
    };

    this.getPathPoints = function (callback) {
        // Get from server (new data)
        if (this.params.last_path_point_id === null || this.params.point_id > this.params.last_path_point_id) {
            var last_point_id;

            if (this.params.last_path_point_id === null) {
                last_point_id = false;
            } else {
                last_point_id = this.params.last_path_point_id;
            }

            this.loadPathPoints(last_point_id, function (data) {
                if (callback) {
                    callback(data);
                }
            })
        } else {
            if (callback) {
                callback([]);
            }
        }
    };

    this.drawPath = function () {
        var t = this;

        this.getPathPoints(function (data) {
            t.params.path_points = t.params.path_points.concat(data);

            if(t.params.path_points[t.params.path_points.length - 1]){
                t.params.last_path_point_id = t.params.path_points[t.params.path_points.length - 1].id;
            }

            var points = [];

            for(var i = 0, l = data.length; i < l; i++){
                points.push(new L.latLng(data[i].lat, data[i].lon));
            }

            if (t.path === null) {
                t.path = new Path({
                    options: {
                        color: '#000',
                        opacity: 1,
                        weight: 3
                    },
                    points: points
                });
            }else{
                t.path.addPoints(points);
            }

            t.path.draw();
        });
    };

    this.removePath = function(){
        if(this.path){
            this.path.remove();
        }
    };

    this.draw = function () {
        this.pos_marker.draw();
        this.params.on_map = true;
    };

    this.remove = function () {
        this.pos_marker.remove();
        this.params.on_map = false;
    };

    this.focus = function () {
        this.pos_marker.focus();
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
        this.mapView();
    };

    /* Methods */
    this.showMapMessage = function (message) {
        $('.map-container .map-notice').remove();

        message = '<p>' + message + '</p>';

        message += '<a id="hide-map-notice" href="javascript:void(0)" class="btn">Закрыть</a>';

        $('.map-container').append('<div class="map-notice"><div class="mn-inner">' + message + '</div></div>');

        $('.map-container .map-notice').css({
            marginTop: -$('.map-container .map-notice').height() / 2
        });

        $('#hide-map-notice').on('click', function () {
            $('.map-notice').fadeOut(150, function () {
                $('.map-notice').remove();
            });
        });
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
                height: $('body').height() - $('.top-panel').height() - $('footer').height() - 20,
                width: $('body').width() - $('.map-side-panel').width()
            });

            $('.map-full-sized-frame .h1').css({
                width: $('body').width() - $('.map-side-panel').width()
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
                param_name: 'fleet_id',
                param_value: MC.Data.fleet
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
    this.bindMapOptionsController = function () {
        var auto_renew_active = true,
            show_car_path_active = true;

        if (MC.Data.timemachine === true) {
            auto_renew_active = false;
            show_car_path_active = false;
        }

        if (MC.Data.auto_renew === true && auto_renew_active === true) {
            $('#auto-renew').slickswitch('tOn');
        } else {
            $('#auto-renew').slickswitch('tOff');
        }

        if (MC.Data.show_car_path === true && show_car_path_active === true) {
            $('#show-path').slickswitch('tOn');
        } else {
            $('#show-path').slickswitch('tOff');
        }

        if (MC.Data.auto_focus === true) {
            $('#auto-focus').slickswitch('tOn');
        } else {
            $('#auto-focus').slickswitch('tOff');
        }

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

        if (show_car_path_active === false) {
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

        if ($('#auto-renew').next('a.slickswitch').length < 1) {
            $('#auto-renew').slickswitch({
                toggled: function () {
                    if (MC.Data.auto_renew === true) {
                        MC.Data.auto_renew = false;
                        $.cookie('auto-renew', '0', core.options.cookie_options);

                        // Форсируем загрузку пути, т.к во время отключения
                        // автозагрузки могли появится новые точки.
                        // this.drawCarPath(true);
                    } else {
                        MC.Data.auto_renew = true;
                        $.cookie('auto-renew', '1', core.options.cookie_options);
                    }
                }
            });
        }

        if ($('#show-path').next('a.slickswitch').length < 1) {
            $('#show-path').slickswitch({
                toggled: function () {
                    if (MC.Data.show_car_path === true) {
                        MC.Data.show_car_path = false;
                        $.cookie('car-path', '0', core.options.cookie_options);

                        // Форсируем загрузку пути, т.к во время отключения
                        // автозагрузки могли появится новые точки.
                        // this.m_ctrl.first_loaded_car_id = false;
                        // this.drawCarPath(true);

                        if(MC.Data.current_car){
                            MC.Data.current_car.removePath();
                        }
                    } else {
                        MC.Data.show_car_path = true;
                        $.cookie('car-path', '1', core.options.cookie_options);

                        if(MC.Data.current_car){
                            MC.Data.current_car.drawPath();
                        }

                        // this.m_ctrl.removeAllThePath(this.map);
                        // this.m_ctrl.removeAllCurrentPositionMarkers(this.map);
                        // this.m_ctrl.focus(this.map);
                    }
                }
            });
        }

        if ($('#auto-focus').next('a.slickswitch').length < 1) {
            $('#auto-focus').slickswitch({
                toggled: function () {
                    if (MC.Data.auto_focus === true) {
                        MC.Data.auto_focus = false;
                        $.cookie('auto-focus', '0', core.options.cookie_options);

                    } else {
                        MC.Data.auto_focus = true;
                        $.cookie('auto-focus', '1', core.options.cookie_options);
                    }
                }
            });
        }

        $('#focus').on('click', function () {
            MC.View.focus();
        });
    };

    /* Smart focus on a current sutuation on a map */
    this.focus = function () {
        if (MC.Map.busy === true) {
            return;
        }

        if (MC.Data.current_cars.length > 1 && MC.Data.car == 'all') {
            var bounds = [],
                single = null;

            for (var i = 0, l = MC.Data.current_cars.length; i < l; i++) {
                var car = MC.Data.getCarById(MC.Data.current_cars[i]);

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

            if (bounds.length > 1) {
                MC.Map.fitBounds(bounds);
            } else if (single) {
                MC.Map.zoom(14);
                single.focus();
            } else {
                MC.Map.returnToRoots();
            }

        } else if (MC.Data.current_cars.length == 1 && MC.Data.car == 'all') {
            var car = MC.Data.getCarById(MC.Data.current_cars[0]);
            car.focus();

        } else if (MC.Data.current_cars.length == 1 && MC.Data.car != 'all') {
            if (MC.Data.current_car.params.on_map === true) {
                MC.Map.zoom(14);
                MC.Data.current_car.focus();
            } else {
                MC.Map.returnToRoots();
            }
        } else {

        }
    };

    /* Init actions */
    this.__construct();
};

/**
 *  Data implementation
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
        this.readOptionsFromCookies();
        this.setParamsFromHash();
        MC.View.bindMapOptionsController();
        this.getUserFleetsAndDevices();
    };

    /* Soft load - binds starter methods without cars and fleets data loader */
    this.softLoad = function () {
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
                this.show_car_path = false;
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
            this.cars[i] = new Car(this.cars[i]);
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
                MC.View.showMapMessage('Ошибка, машины с ID ' + this.car + ' не существует!');
            }
        }

        if (this.fleet != 'all' && this.fleet) {
            this.current_fleet = this.getFleetById(this.fleet);

            if (!this.current_fleet) {
                this.fleet = 'all';
                MC.View.showMapMessage('Ошибка, группы с ID ' + this.fleet + ' не существует!');
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
        }
    };

    /* Remove cars from a map */
    this.removeCars = function () {
        this.cars_on_map = 0;

        for (var i = 0, l = this.cars.length; i < l; i++) {
            this.cars[i].remove();
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
                 включаем автообновление, если оно, конечно не отключено в куках и если тайм машина не запущена */
                if (firstload === true) {
                    MC.Data.auto_renew_blocker = false;
                }

                MC.Data.mergeCarsData(data);

                if (firstload === true) {
                    MC.Data.removeCars();
                }

                MC.Data.drawCars();

                if(firstload) {
                    MC.View.focus();
                }

                if(MC.Data.show_car_path === true && MC.Data.current_car){
                    MC.Data.current_car.drawPath();
                }
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
                MC.Data.error();
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