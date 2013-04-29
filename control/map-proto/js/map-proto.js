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
var MapController = function () {
    this.instance = null;

    this.params = {
        zoom: 4,
        zoom_geoposition: 10,
        lat: 55,
        lng: 35,
        minHeight: 250,
        height: 400
    };

    this.init = function () {
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

    this.invalidateSize = function () {
        this.instance.invalidateSize();
    };

    // Construct methods calls
    this.init();
};

/**
 *  Marker implementation
 **/
var Marker = function (params) {
    this.layer = null;

    this.params = {
        lat: 0,
        lng: 0,
        options: { },
        geocoder_data: null,
        geocoder: false, // TODO: WARNING!!! VERY EXPERIMENTAL FEATURE, STILL IN PRIVATE BETA!
        map_instance: null
    };

    $.extend(this.params, params);

    this.instance = L.marker(
        [this.params.lat, this.params.lng],
        this.params.options
    );

    this.draw = function () {
        if (this.params.map_instance) {
            this.params.map_instance.addLayer(this.instance);
        }
    };

    this.remove = function () {
        if (this.params.map_instance) {
            this.params.map_instance.removeLayer(this.instance);
        }
    };

    this.move = function (lat, lng) {
        if(this.params.lat != lat || this.params.lng != lng){
            this.params.lat = lat;
            this.params.lng = lng;

            this.instance.setLatLng(new L.LatLng(lat, lng));

            this.renewGeocoderData();
        }
    };

    this.focus = function () {
        if(this.params && this.params.map_instance){
            this.params.map_instance.panTo(this.instance.getLatLng());
        }
    };

    this.renewGeocoderData = function () {
        if (this.params.geocoder === true) {
            var t = this;

            core.map_tools.geocodingRequest(this.params.lat, this.params.lng, function (data) {
                t.params.geocoder_data = data;
            });
        }
    };
};


/**
 *  Position marker implementation
 **/
var PosMarker = function (params) {
    this.params = {
        heading: 0,
        show_info: false,
        car_data: null,
        geocoder: false // TODO: WARNING!!! VERY EXPERIMENTAL FEATURE, STILL IN PRIVATE BETA!
    };
    $.extend(this.params, params);

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

        if (this.show_info === true && this.params.car_data) {
            var html = '<div class="marker-with-info">' +
                '<div class="icon" style="background-position: -' + this.getHeadingIconSpriteOffset(heading) + 'px 0px"></div>' +
                '<div class="info-block">' +
                '<i class="arm"></i>' +
                '<div class="name">' + this.params.car_data.name + '</div>' +
                '<div class="id">' + core.utilities.drawGId(this.params.car_data.g_id, 'small') + '</div>' +
                '</div>' +
                '</div>';

            icon = new L.HtmlIcon({
                html: html,
                iconSize: [16, 16], // size of the icon
                iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
                popupAnchor: [0, -20]
            });
        } else {
            var html = '<div class="marker-with-info">' +
                '<div class="icon" style="background-position: -' + this.getHeadingIconSpriteOffset(heading) + 'px 0px"></div>' +
                '</div>';

            icon = new L.HtmlIcon({
                html: html,
                iconSize: [40, 40], // size of the icon
                iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
                popupAnchor: [0, -20]
            });
        }

        return icon;
    };

    this.setHeading = function (heading) {
        this.params.heading = heading;
        this.instance.setIcon(this.getHeadingIcon(heading));
    };

    this.params.options = {
        icon: this.getHeadingIcon(params.heading),
        title: '',
        clickable: true,
        draggable: false,
        opacity: 1,
        riseOnHover: true,
        riseOffset: 10000
    };

    this.__proto__ = new Marker(this.params);
};

/**
 *  Waypoint marker implementation
 **/
var WpMarker = function () {
    this.__proto__ = new Marker(this.params);
};

/**
 *  Data collector implementation
 **/
var DataCollector = function () {

};

//Global controller instances
var Map, View, m;

/**
 *  Map
 **/
var map = {
    init: function () {
        Map = new MapController();
        View = new ViewController();

        m = new PosMarker({
            heading: 55,
            lat: 33,
            lng: 55,
            map_instance: Map.instance
        });

        m.draw()
        m.move(22, 33)
    }
}