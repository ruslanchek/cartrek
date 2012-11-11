var geozones = {
    map: null,

    m_options: {
        zoom: 10,
        coordinates: {
            lat: 55,
            lon: 35
        },
        minHeight: 250,
        height: 400
    },

    createMap: function(callback){
        wax.tilejson(
            'http://a.tiles.mapbox.com/v3/ruslanchek.map-5sa7s6em.jsonp',
            function(tilejson){
                var map = new L.Map('map');

                map.addLayer(new wax.leaf.connector(tilejson));
                map.setView(new L.LatLng(geozones.m_options.coordinates.lat, geozones.m_options.coordinates.lon), geozones.m_options.zoom);
                map.addControl(new L.Control.FullScreen());

                var interaction = wax.leaf.interaction(map, tilejson);

                callback(map);
            }
        );
    },

    init: function(){
        this.createMap(function(map){
            geozones.map = map;

            core.map_tools.getGeoposition(function(position){
                geozones.map.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));
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