/**
 *  Map implementation
 **/
var Map = function(){
    this.map = null;

    this.params = {
        zoom: 4,
        lat: 55,
        lon: 35,
        minHeight: 250,
        height: 400
    };

    this.mapView = function(){
        $('#map, .map-container').css({
            height: $('body').height() - $('.top-panel').height() - $('footer').height() - 60,
            width: $('body').width() - $('.map-side-panel').width()
        });

        $('.map-full-sized-frame .h1').css({
            width: $('body').width() - $('.map-side-panel').width()
        });

        $(window).on('resize', function () {
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

            if (map.map) {
                map.map.invalidateSize();
            }
        });

        $('.map-side-panel').css({
            minHeight: $('.map-container').height()
        });
    };

    this.create = function(){
        var t = this;

        core.map_tools.getGeoposition(function (position) {
            var lat, lon, zoom;

            if (position) {
                lat = position.coords.latitude;
                lon = position.coords.longitude;
                zoom = 15;
            } else {
                lat = t.params.lat;
                lon = t.params.lon;
                zoom = t.params.zoom;
            }

            t.map = new L.Map('map', {
                layers: core.map_tools.getLayers(),
                center: new L.LatLng(lat, lon),
                zoom: zoom
            });

            t.map.addControl(new L.Control.FullScreen());

            $('.leaflet-control-attribution').html('О наших <a href="/control/about#maps">картах</a>');

            setTimeout(function () {
                $('.leaflet-control-attribution').fadeOut(3000);
            }, 10000);

            t.mapView();
        });
    }

    this.create()

    return this.map;
};

/**
 *  Marker implementation
 **/
var Marker = function(){

};

/**
 *  Position marker implementation
 **/
var PosMarker = function(){
    this.__proto__ = new Marker();
};

/**
 *  Waypoint marker implementation
 **/
var WpMarker = function(){
    this.__proto__ = new Marker();
};

/**
 *  Data collector implementation
 **/
var DataCollector = function(){

};

/**
 *  View
 **/
var View = function(){

};

/**
 *  Map
 **/
var map = {
    init: function(){
        this.map = new Map();
    }
}