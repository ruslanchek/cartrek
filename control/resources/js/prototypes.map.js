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
        height: 400,
        controls: {
            fullscreen: true,
            locate: true,
            scale: true
        },
        map_container_id: 'map',
        scroll: true
    };

    $.extend(true, this.params, params);

    /* Class constructor */
    this.__construct = function () {
        this.instance = new L.Map(this.params.map_container_id, {
            layers: core.map_tools.getLayers(),
            center: new L.LatLng(this.params.lat, this.params.lng),
            zoom: this.params.zoom,
            scrollWheelZoom: this.params.scroll // TODO: Dont work in Leaflet lib :-( Wery! Sad!
        });

        if (this.params.controls.fullscreen === true) {
            this.instance.addControl(new L.Control.FullScreen());
        }

        if (this.params.controls.locate === true) {
            this.instance.addControl(new L.Control.Locate());
        }

        if (this.params.controls.scale === true) {
            this.instance.addControl(new L.Control.Scale({
                imperial: false,
                maxWidth: 150
            }));
        }

        $('.leaflet-control-attribution').html('О наших <a href="/control/about#maps">картах</a>');

        setTimeout(function () {
            $('.leaflet-control-attribution').fadeOut(3000);
        }, 10000);

        var t = this;

        this.instance.on('dragstart', function () {
            t.busy = true;
        });

        this.instance.on('dragend', function (e) {
            t.busy = false;

            $.cookie('map-lat', t.instance.getCenter().lat, core.options.cookie_options);
            $.cookie('map-lng', t.instance.getCenter().lng, core.options.cookie_options);
        });

        this.instance.on('zoomend', function () {
            t.busy = false;

            $.cookie('map-zoom', t.instance.getZoom(), core.options.cookie_options);
        });

        this.instance.on('zoomstart', function () {
            t.busy = true;
        });

        /*this.instance.on('zoomstart', function () {
         t.busy = true;
         });

         this.instance.on('movestart', function () {
         t.busy = true;
         });

         this.instance.on('moveend', function () {
         t.busy = false;
         });*/
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
            heading: 0,
            altitude: 0,
            date: 0,
            hdop: null,
            csq: null,
            online: null
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
            maxWidth: 350,
            minWidth: 200
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

        if (metrics.heading && this.params.metrics.heading != metrics.heading) {
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

        if (metrics.online) {
            this.params.metrics.online = metrics.online;
            data_changed = true;
        }

        if (metrics.csq) {
            this.params.metrics.csq = metrics.csq;
            data_changed = true;
        }

        if (metrics.hdop) {
            this.params.metrics.hdop = metrics.hdop;
            data_changed = true;
        }

        if (metrics.hdop) {
            this.params.metrics.hdop = metrics.hdop;
            data_changed = true;
        }

        // TODO: Сделать проверку объектов, чтобы лишний раз не вызывалось renewPopouHtml()
        if (metrics.params) {
            this.params.metrics.params = metrics.params;
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
            title: (params.car_label_data && params.car_label_data.name) ? params.car_label_data.name + ' - текущее положение' : 'Текущее положение',
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

        if (this.params.car_label_data.make || this.params.car_label_data.model) {

            html += '<em class="small gray make-model">';

            if (this.params.car_label_data.make) {
                html += this.params.car_label_data.make;
            }

            if (this.params.car_label_data.model) {
                html += ' ' + this.params.car_label_data.model;
            }

            html += '</em>';
        }

        html += '<span class="indicators">';

        if (this.params.metrics && this.params.metrics.online === true) {

            if (this.params.metrics.hdop) {
                html += core.utilities.getHDOPIndicator(this.params.metrics.hdop);
            }

            if (this.params.metrics.csq) {
                html += core.utilities.getCSQIndicator(this.params.metrics.csq);
            }
        } else {
            html += '<span class="small gray">Офлайн</span>';
        }

        html += '</span><div class="clear"></div>';

        if (this.params.metrics && (this.params.metrics.speed || this.params.metrics.altitude || (this.params.metrics.lat && this.params.metrics.lng))) {
            html += '<div class="table-wrapper"><table class="bordered hovered">';

            if (this.params.metrics && this.params.metrics.speed) {
                html += '<tr><th>Скорость</th><td colspan="2">' + core.utilities.convertKnotsToKms(this.params.metrics.speed) + ' км/ч</td></tr>';
            }

            if (this.params.metrics && this.params.metrics.altitude) {
                html += '<tr><th>Высота</th><td colspan="2">' + this.params.metrics.altitude + ' м' + '</td></tr>';
            }

            if (this.params.metrics && this.params.metrics.lat && this.params.metrics.lng) {
                html += '<tr><th>Координаты Ш/Д</th><td>' + this.params.metrics.lat + '&deg;</td><td> ' + this.params.metrics.lng + '&deg;</td></tr>';
            }

            if (this.params.metrics && this.params.metrics.params && this.params.metrics.params.power_inp_normal_level && (this.params.metrics.params.power_inp || this.params.metrics.params.power_inp === 0)) {
                html += '<tr><th>Бортовое питание</th><td colspan="2">' + core.utilities.getVoltsIndicator(this.params.metrics.params.power_inp, this.params.metrics.params.power_inp_normal_level) + '</td></tr>';
            }

            if (this.params.metrics && this.params.metrics.params && this.params.metrics.params.power_bat_normal_level && (this.params.metrics.params.power_bat || this.params.metrics.params.power_bat === 0)) {
                html += '<tr><th>Батарея терминала</th><td colspan="2">' + core.utilities.getVoltsIndicator(this.params.metrics.params.power_bat, this.params.metrics.params.power_bat_normal_level) + '</td></tr>';
            }

            if (this.params.metrics && this.params.metrics.params && this.params.metrics.params.fls === true && (this.params.metrics.params.fuel || this.params.metrics.params.fuel === 0)) {
                html += '<tr><th>Топливо</th><td colspan="2">' + core.utilities.getFuelIndicator(this.params.metrics.params.fuel, this.params.metrics.params.fuel_tank_capacity, true) + '</td></tr>';
            }

            html += '</table></div>';
        }

        if (this.params.metrics && this.params.metrics.date) {
            html += '<em class="small gray">Текущее положение';
            html += ' от ' + core.utilities.humanizeDateTime(this.params.metrics.date, true);
            html += '</em>';
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

    /* Fit path bounds on map */
    this.focus = function () {
        MC.Map.fitBounds(this.instance.getBounds());
    };

    /* Init actions */
    this.__construct();
};