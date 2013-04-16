var geozones = {
    map: null,
    zones_layers: null,
    geozones: {
        raw: [],
        polygons: []
    },

    m_options: {
        zoom: 4,
        coordinates: {
            lat: 55,
            lon: 35
        },
        minHeight: 250,
        height: 400
    },

    addGeozone: function (points, callback) {
        var edges = [];

        for (var i = 0, l = points.length; i < l; i++) {
            if (!points[i].lat && !points[i].lng) {
                edges.push([points[i][0], points[i][1]]);
            } else {
                edges.push([points[i].lat, points[i].lng]);
            }
        }

        if (edges.length > 0) {
            this.loading_process = $.ajax({
                url: '/control/user/geozones/?ajax&action=addGeozone',
                data: {
                    points: JSON.stringify(edges)
                },
                dataType: 'json',
                type: 'post',
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
                }
            });
        }
    },

    getGeozones: function (callback) {
        this.loading_process = $.ajax({
            url: '/control/user/geozones/?ajax',
            data: {
                action: 'getGeozones'
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
            }
        });
    },

    createMap: function (callback) {
        var map = new L.Map('map', {
            layers: core.map_tools.getLayers(),
            center: new L.LatLng(geozones.m_options.coordinates.lat, geozones.m_options.coordinates.lon),
            zoom: geozones.m_options.zoom
        });

        map.addControl(new L.Control.Draw({
            position: 'topright',
            polyline: false,
            circle: false,
            marker: false,
            rectangle: false,
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

        map.on('draw:poly-created', function (e) {
            geozones.addGeozone(e.poly.getLatLngs(), function (data) {
                geozones.addShape(e.poly.getLatLngs(), data);

                console.log(data);

                core.events_api.pushEvent({
                    status: 4,
                    type: 1,
                    message: 'Геозона «' + data.name + '» добавлена'
                });
            });
        });

        map.addControl(new L.Control.FullScreen());

        $('.leaflet-control-attribution').html('О наших <a href="/control/about#maps">картах</a>');

        setTimeout(function () {
            $('.leaflet-control-attribution').fadeOut(3000);
        }, 10000);

        callback(map);
    },

    addShape: function (lat_lngs, data) {
        var edges = [];

        if (lat_lngs) {
            for (var i = 0, l = lat_lngs.length; i < l; i++) {
                if (!lat_lngs[i].lat && !lat_lngs[i].lng) {
                    edges.push([lat_lngs[i][0], lat_lngs[i][1]]);
                } else {
                    edges.push([lat_lngs[i].lat, lat_lngs[i].lng]);
                }
            }
        }

        var html = 'xxx';

        //geozones.zones_layers.addLayer(e.poly);
        var polygon = L.polygon(edges, {
            color: 'red',
            data: data
        });

        polygon.bindPopup(html);
        polygon.on('click', function () {
            this.openPopup('s');
            console.log(this)
        });

        geozones.zones_layers.addLayer(polygon);

        return edges;
    },

    focusToGeozone: function(id){
        var gz = $.grep(this.geozones.raw, function(n, i){
            return (n.id == id);
        })[0];
    },

    editGeozone: function(){

    },

    drawMenu: function(data){
        var html = '<ul>';

        for (var i = 0, l = data.length; i < l; i++) {
            html += '<li><a data-id="'+data[i].id+'" href="#"><i data-id="'+data[i].id+'"></i>'+data[i].name+'</a></li>';
        }

        html += '</ul>';

        $('.geozones-menu').html(html);

        $('.geozones .geozones-menu ul li a i').on('click', function(e){
            geozones.focusToGeozone($(this).data('id'));

            e.preventDefault();
        });

        $('.geozones .geozones-menu ul li a').on('click', function(e){
            geozones.editGeozone($(this).data('id'));

            e.preventDefault();
        });
    },

    init: function () {
        this.zones_layers = new L.LayerGroup();

        this.createMap(function (map) {
            geozones.map = map;

            core.map_tools.getGeoposition(function (position) {
                geozones.map.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));
                geozones.map.setZoom(11);
            });

            if ($.cookie('map-gz-height') && $.cookie('map-gz-height') > geozones.m_options.minHeight) {
                $('#map, .map-container').css({
                    height: parseInt($.cookie('map-gz-height'))
                });

                $('.geozones-menu').css({
                    height: parseInt($.cookie('map-gz-height')) + 15
                });
            } else {
                $('#map, .map-container').css({
                    height: geozones.m_options.height
                });

                $('.geozones-menu').css({
                    height: geozones.m_options.height + 15
                });
            }

            geozones.map.invalidateSize();

            $('.map-container').resizable({
                handles: 's',
                minHeight: geozones.m_options.minHeight,
                resize: function (event, ui) {
                    $('#map').css({
                        height: ui.size.height,
                        width: $('.map-container').width() - 1
                    });

                    $('.geozones-menu').css({
                        height: 0
                    });

                    $('.geozones-menu').css({
                        height: ui.size.height + 15
                    });

                    if (geozones.map) {
                        geozones.map.invalidateSize();
                    }

                    $.cookie('map-gz-height', ui.size.height, core.options.cookie_options);
                }
            });

            $(window).on('resize', function () {
                $('#map').css({
                    width: $('.map-container').width() - 1
                });

                if (geozones.map) {
                    geozones.map.invalidateSize();
                }
            });

            geozones.getGeozones(function (data) {
                geozones.geozones.raw = data;

                if (data) {
                    geozones.drawMenu(data);

                    for (var i = 0, l = data.length; i < l; i++) {
                        geozones.addShape(JSON.parse(data[i].points), {
                            name: data[i].name,
                            id: data[i].id
                        });
                    }

                    geozones.map.addLayer(geozones.zones_layers);

                    geozones.map.fitBounds(geozones.zones_layers.getBounds());
                }
            });
        });
    }
};