var geozones = {
    map: null,

    m_options: {
        zoom: 4,
        coordinates: {
            lat: 55,
            lon: 35
        },
        minHeight: 250,
        height: 400
    },

    createMap: function(callback){
        var layer, map_layer = $.cookie('map-layer');

        switch(map_layer){
            case 'cloudmade' : {
                layer = new L.TileLayer(
                    'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
                    {
                        attribution : '',
                        maxZoom     : 18
                    }
                );
            }; break;

            default: {
                layer = new L.TileLayer(
                    'http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-streets/{z}/{x}/{y}.png',
                    {
                        attribution : '',
                        maxZoom     : 17
                    }
                );
            }; break;
        };

        var map = new L.Map('map', {
            layers      : [layer],
            center      : new L.LatLng(geozones.m_options.coordinates.lat, geozones.m_options.coordinates.lon),
            zoom        : geozones.m_options.zoom
        });

        map.addControl(new L.Control.Draw({
            polyline    : true,
            circle      : true,
            polygon: {
                allowIntersection: false,
                drawError: {
                    color: '#e1e100',
                    message: 'Линии зоны не могут пересекаться!'
                },
                shapeOptions: {
                    color: '#bada55'
                }
            }
        }));

        map.addControl(new L.Control.FullScreen());

        $('.leaflet-control-attribution').html('О наших <a href="/control/about-map">картах</a>');

        setTimeout(function(){
            $('.leaflet-control-attribution').fadeOut(3000);
        }, 10000);

        callback(map);
    },

    init: function(){
        this.createMap(function(map){
            geozones.map = map;

            core.map_tools.getGeoposition(function(position){
                geozones.map.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));
                geozones.map.setZoom(11);
            });

            if($.cookie('map-gz-height') && $.cookie('map-gz-height') > geozones.m_options.minHeight){
                $('#map, .map-container').css({height: parseInt($.cookie('map-gz-height'))});
            }else{
                $('#map, .map-container').css({height: geozones.m_options.height});
            };

            geozones.map.invalidateSize();

            $('.map-container').resizable({
                handles: 's',
                minHeight: geozones.m_options.minHeight + 1,
                resize: function(event, ui){
                    $('#map').css({
                        height: ui.size.height + 2,
                        width:  ui.size.width - 2
                    });

                    if(geozones.map){
                        geozones.map.invalidateSize();
                    };

                    $.cookie('map-gz-height', ui.size.height, core.options.cookie_options);
                }
            });

            $(window).on('resize', function(){
                $('#map').css({
                    width:  $('.map-container').width() - 2
                });

                if(geozones.map){
                    geozones.map.invalidateSize();
                };
            });
        });
    }
};