"use strict";

/**
 *  View
 **/
var ViewController = function () {
    this.mapView = function () {
        var resize = function (h) {
            $('#map, .map-container').css({
                height: $('body').height() - $('.top-panel').height() - $('footer').height() - h,
                width: $('body').width() - $('.map-side-panel').width()
            });

            $('.map-full-sized-frame .h1').css({
                width: $('body').width() - $('.map-side-panel').width()
            });

            $('.map-side-panel').css({
                minHeight: $('.map-container').height()
            });

            if (Map) {
                Map.invalidateSize();
            }
        };

        resize(60);

        $(window).on('resize', function () {
            resize(20);
        });
    };

    this.init = function () {
        this.mapView();
    };

    // Construct methods calls
    this.init();
};

/**
 *  Map implementation
 **/
var MapController = function (params) {
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

    // Construct methods calls
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
        lat: 0,
        lng: 0,
        options: {
            clickable: true,
            draggable: false,
            opacity: 1,
            riseOnHover: true,
            riseOffset: 250,
            zIndexOffset: 1,
            title: ''
        },
        focus_on_click: false,
        on_click: null,
        geocoder_data: null,
        geocoder: false, // TODO: WARNING, DO NOT ENABLE!!! VERY EXPERIMENTAL FEATURE, STILL IN PRIVATE BETA!
        map_instance: null,
        draw: true
    };

    $.extend(true, this.params, params);

    /* Class constructor */
    this.__construct = function(){
        var t = this;

        this.instance = L.marker(
            [this.params.lat, this.params.lng],
            this.params.options
        );

        this.instance.on('click', function() {
            if(t.params.focus_on_click === true){
                t.focus();
            }

            if(t.params.on_click){
                t.params.on_click(t);
            }
        })

        if(this.params.draw === true){
            this.draw();
        }
    }

    /* Methods */
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

    /* Move marker in new position */
    this.move = function (lat, lng) {
        if(this.params.lat != lat || this.params.lng != lng){
            this.params.lat = lat;
            this.params.lng = lng;

            this.instance.setLatLng(new L.LatLng(lat, lng));

            this.renewGeocoderData();
        }
    };

    /* Pan to a marker */
    this.focus = function () {
        if(this.params && this.params.map_instance){
            this.params.map_instance.panTo(this.instance.getLatLng());
        }
    };

    /* Renew position data, based  (geocoding) */
    this.renewGeocoderData = function () {
        if (this.params.geocoder === true) {
            var t = this;

            core.map_tools.geocodingRequest(this.params.lat, this.params.lng, function (data) {
                t.params.geocoder_data = data;
            });
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
        heading: 0,
        car_label: false,
        car_label_data: null,
        point_data: null,
        options: {
            icon: null,
            title: '',
            zIndexOffset: (params.car_label_data && params.car_label_data.id) ? (params.car_label_data.id + 10000) : 10000
        },
        geocoder: false // TODO: WARNING, DO NOT ENABLE!!! VERY EXPERIMENTAL FEATURE, STILL IN PRIVATE BETA!
    };

    $.extend(true, this.params, params);

    /* Class constructor */
    this.__construct = function(){
        this.params.options.icon = this.getHeadingIcon(this.params.heading);
        this.__proto__ = new Marker(this.params);
    }

    /* Methods */
    this.getHeadingIconSpriteOffset = function (heading) {
        var degrees_zone = Math.round(parseInt(heading) / 15) * 1;

        if (isNaN(degrees_zone)) {
            degrees_zone = 0;
        }

        if (degrees_zone == 360) {
            degrees_zone = 0;
        }

        return degrees_zone * 40;
    };

    this.getHeadingIcon = function (heading) {
        var icon;

        // Compensate the over 360 degree heading
        if (heading > 360) {
            var h1 = heading / 360,
                h2 = h1 - Math.floor(h1);

            heading = Math.round(h2 * 360);
        }

        if (this.params.car_label === true && this.params.car_label_data) {
            var html =
                    '<div class="icon" style="background-position: -' + this.getHeadingIconSpriteOffset(heading) + 'px 0px"></div>' +
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
            var html = '<div class="icon" style="background-position: -' + this.getHeadingIconSpriteOffset(heading) + 'px 0px"></div>';

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

    this.setHeading = function (heading) {
        this.params.heading = heading;
        this.instance.setIcon(this.getHeadingIcon(heading));
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
    this.__construct = function(){
        this.params.options.icon = this.getWpIcon(this.params.type);
        this.__proto__ = new Marker(this.params);
    }

    /* Methods */
    this.getWpIcon = function(type){
        switch(type){
            case 'stop' : {
                return L.icon({
                    iconUrl: '/control/map/img/markers/waypoint_stop.png',
                    iconSize: [7, 7], // size of the icon
                    iconAnchor: [3, 3], // point of the icon which will correspond to marker's location
                    popupAnchor: [0, -4] // point from which the popup should open relative to the iconAnchor
                });
            } break;

            case 'way' :
            default : {
                return L.icon({
                    iconUrl: '/control/map/img/markers/waypoint.png',
                    iconSize: [7, 7], // size of the icon
                    iconAnchor: [3, 3], // point of the icon which will correspond to marker's location
                    popupAnchor: [0, -4] // point from which the popup should open relative to the iconAnchor
                });
            } break;
        }
    };

    /* Init actions */
    this.__construct();
};

/**
 *  Data collector implementation
 **/
var DataCollector = function () {

};


/**
 *  Path implementation
 **/
var Path = function (params) {
    /* Class params */
    this.params = {
        options: {
            color: '#000000',
            weight: 5,
            opacity: 0.5,
            smoothFactor: 1.0,
            dashArray: null,
            clickable: true
        }
    };

    $.extend(true, this.params, params);

    /* Class constructor */
    this.__construct = function(){
        this.params.options.icon = this.getWpIcon(this.params.type);
        this.__proto__ = new Marker(this.params);
    }

    /* Methods */

    /* Init actions */
    this.__construct();
};

//Global controller instances
var Map, View, m, m1, m2, p;

/**
 *  Map
 **/
var map = {
    init: function () {
        Map = new MapController({
            zoom: 6,
            zoom_geoposition: 10,
            lat: 33,
            lng: 55,
            minHeight: 250,
            height: 400
        });

        View = new ViewController();

        m = new PosMarker({
            heading: 55,
            lat: 33,
            lng: 55,
            map_instance: Map.instance,
            car_label: true,
            car_label_data: {
                id: 2,
                name: 'Volvo S40 1',
                g_id: 'е086ом190'
            }
        });

        m1 = new WpMarker({
            heading: 55,
            lat: 35,
            lng: 54,
            map_instance: Map.instance,
            focus_on_click: true
        });

        m2 = new PosMarker({
            heading: 145,
            lat: 34,
            lng: 56,
            map_instance: Map.instance,
            car_label: true,
            car_label_data: {
                id: 1,
                name: 'Volvo S40 2',
                g_id: 'е086ом190'
            },
            on_click: function(e){
                console.log(e)
            }
        });
    }
}