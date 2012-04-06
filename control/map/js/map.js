core.map = {
    options: {
        show_tracks_on_map: 1,
        show_markers_on_map: 1,
        default_position : {
            lat: 30,
            lng: 30
        }
    },

    registered: {
        max_speed: 0,
        average_speed: 0,
        total_markers: 0
    },

    convertNMEAtoWGS84: function(value){
        var nTemp = value / 100.0;
        nTemp = nTemp - (nTemp%1);
        var flMin = value - 100.0 * nTemp;
        var result = nTemp + flMin / 60.0;
        return result.toFixed(6);
    },

    convertKnotsToKms: function(value){
        return (value * 1.852).toFixed(1);
    },

    humanizeGPSTime: function(value){
        var h = value.substring(0, 2),
            m = value.substring(2, 4),
            s = value.substring(4, 6);

        return h + ':' + m + ':' + s;
    },

    setMapsPrototypes: function(){
        google.maps.LatLng.prototype.kmTo = function(a){
            var e = Math, ra = e.PI/180;
            var b = this.lat() * ra, c = a.lat() * ra, d = b - c;
            var g = this.lng() * ra - a.lng() * ra;
            var f = 2 * e.asin(e.sqrt(e.pow(e.sin(d/2), 2) + e.cos(b) * e.cos
            (c) * e.pow(e.sin(g/2), 2)));
            return f * 6378.137;
        };

        google.maps.Polyline.prototype.inKm = function(n){
            var a = this.getPath(n), len = a.getLength(), dist = 0;
            for (var i=0; i < len-1; i++) {
               dist += a.getAt(i).kmTo(a.getAt(i+1));
            };
            return dist.toFixed(2)+' км';
        };
    },

    createMap: function(options){
        var latlng = new google.maps.LatLng(options.lat, options.lng);

        var myOptions = {
            zoom      : options.zoom,
            center    : latlng,
            mapTypeId : google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById(options.map_container_id), myOptions);

        return map;
    },

    makeMarkerDescription: function(point_data){
        var text = new String();

        text += '<p>Уникальный номер метки: <b>' + point_data.id + '</b></p>';
        text += '<p>Время: <b>' + this.humanizeGPSTime(point_data.time) + '</b></p>';
        text += '<p>Скорость: <b>' + this.convertKnotsToKms(point_data.velocity) + ' км/ч</b></p>';

        return text;
    },

    registerMarkerData: function(i){
        var marker = this.markers['marker_'+i],
            velocity = parseFloat(marker.data.velocity);

        if(this.registered.max_speed < velocity){
            this.registered.max_speed = marker.data.velocity;
            this.registered.max_speed_marker = marker;
        };

        this.registered.average_speed += velocity;
        this.registered.total_markers = i;
    },

    showRegisteredData: function(){
        this.registered.average_speed = this.registered.average_speed/this.registered.total_markers;

        $('#max_speed').html(this.convertKnotsToKms(this.registered.max_speed) + ' км/ч');
        $('#average_speed').html(this.convertKnotsToKms(this.registered.average_speed) + ' км/ч');
        $('#distance_driven').html(this.registered.distance);
    },

    focusToMarker: function(marker, open_balloon){
        this.map.panTo(marker.getGeoPoint(), {
            flying: true,
            callback: function(){
                if(open_balloon){
                    marker.openBalloon();
                };
            }
        });
    },

    createCurrentPositionMarker: function(options){
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(
                this.convertNMEAtoWGS84(options.data.lat),
                this.convertNMEAtoWGS84(options.data.lng)
            ),
            map: options.map,
            title: options.data.dev,
            data: options.data,
            description: this.makeMarkerDescription(options.data)
        });

        google.maps.event.addListener(marker, 'click', function(){
            options.click(marker);
        });

        return marker;
    },

    drawMarkers: function(points){
        this.markers = {};

        if(points && points.length > 0){
            if(this.last_marker){
                //this.last_marker.setStyle("marker#waypoint_marker");
            };

            for(var i = 1, l = points.length - 1; i < l; i++){
                this.createWaypointMarker(i, points[i]);
            };

            this.last_marker = this.createCurrentPositionMarker(points.length, points[points.length - 1]);
            this.map.panTo(this.last_marker.getPosition());
        };
    },

    showPath: function(){

    },

    hidePath: function(){

    },

    showWaypointMarkers: function(){

    },

    hideWaypointMarkers: function(){

    },

    drawPath: function(points){
        if(points && points.length > 0){
            var polyline_shape = new Array();

            for(var i = 1, l = points.length; i < l; i++){
                polyline_shape.push(
                    new google.maps.LatLng(
                        this.convertNMEAtoWGS84(points[i].lat),
                        this.convertNMEAtoWGS84(points[i].lng)
                    )
                );
            };

            var polyline = new google.maps.Polyline({
                path: polyline_shape,
                strokeColor: "#02DEAD",
                strokeOpacity: 0.75,
                strokeWeight: 3,
                clickable: false
            });

            polyline.setMap(this.map);
            this.registered.distance = polyline.inKm();
        };
    },

    loadData: function(){
        if(this.data_loading_process){
            this.data_loading_process.abort();
        };

        this.data_loading_process = $.ajax({
            url : '/control/map/?ajax',
            data : {
                action  : 'getPoints'
            },
            dataType : 'json',
            type : 'get',
            beforeSend: function(){
                core.loading.setLoadingWithNotify('global', false, 'Загрузка данных');
            },
            success: function(data){
                setTimeout(function(){
                    core.loading.unsetLoading('global', false);
                }, 200);

                core.map.drawPath(data);
                core.map.drawMarkers(data);
                core.map.showRegisteredData();
            },
            error: function(){
                core.loading.unsetLoading('global', false);
            }
        });
    },

    execSettings: function(settings){
        if(settings){
            this.options.show_tracks_on_map = settings.show_tracks_on_map;
            this.options.show_markers_on_map = settings.show_markers_on_map;

            $.cookie('show_tracks_on_map', this.options.show_tracks_on_map, core.options.cookie_options);
            $.cookie('show_markers_on_map', this.options.show_markers_on_map, core.options.cookie_options);
        }else{
            if($.cookie('show_tracks_on_map')){
                this.options.show_tracks_on_map = $.cookie('show_tracks_on_map');
            };

            if($.cookie('show_markers_on_map')){
                this.options.show_markers_on_map = $.cookie('show_markers_on_map');
            };
        };

        if(this.options.show_tracks_on_map == 1){
            this.showPath();
        }else{
            this.hidePath();
        };

        if(this.options.show_markers_on_map == 1){
            this.showWaypointMarkers();
        }else{
            this.hideWaypointMarkers();
        };
    },

    getVeiwSettingsContent: function(){
        var options = {};

        options.header = 'Настройка вида';
        options.content = core.forms.drawSettingsTable('settings_table', [
            {id: 'show_tracks_on_map', label: 'Показывать треки на карте', value: $.cookie('show_tracks_on_map')},
            {id: 'show_markers_on_map', label: 'Показывать отметки на карте', value: $.cookie('show_markers_on_map')}
        ]);

        options.action = function(){
            core.map.execSettings(core.forms.redaDataFormSettingsTable('settings_table'));
            core.modal.hide();
        };

        return options;
    },

    binds: function(){
        $(window).unload(function(){
            core.map.map.destructor();
        });

        $('#max_speed').live('click', function(){
            core.map.focusToMarker(core.map.registered.max_speed_marker, true);
        });

        $('#where_is_my_car').live('click', function(){
            core.map.focusToMarker(core.map.last_marker, true);
        });

        $('#view_settings').live('click', function(){
            core.modal.show(core.map.getVeiwSettingsContent());
        });
    },

    changeDate: function(date){
        alert(date)
    },

    createDatepicker: function(){
        $('#datepicker').datepicker({
            embed       : true,
            format      : 'dd-mm-yy',
            today       : true,
            callback    : function(event, date, year, month, day){
                core.map.changeDate({
                    year    : year,
                    month   : month,
                    day     : day
                });
            }
        });
    },

    resizeMap: function(bind){
        $('#map').css({
            height: $(window).height() - $('#map').offset().top - 40
        });

        if(bind){
            $(window).on('resize', function(){
                core.map.resizeMap();
            });
        };
    },

    setDeviceFocus: function(marker){
        core.map.map.panTo(marker.getPosition());
        $('#car_name_info').text(marker.data.name);


    },

    drawDevices: function(){
        for(var i = 0, l = this.options.devices.length; i < l; i++){
            this.options.devices[i].current_position_marker = this.createCurrentPositionMarker({
                map         : this.map,
                data        : this.options.devices[i],
                click       : function(marker){
                    core.map.setDeviceFocus(marker);
                }
            });
        };
    },

    loadOptions: function(){
        if(this.data_loading_process){
            this.data_loading_process.abort();
        };

        this.data_loading_process = $.ajax({
            url : '/control/map/?ajax',
            data : {
                action  : 'getOptions'
            },
            dataType : 'json',
            type : 'get',
            beforeSend: function(){
                core.loading.unsetLoading('global', false);
                core.loading.setLoadingWithNotify('global', false, 'Загрузка данных');
            },
            success: function(options){
                setTimeout(function(){
                    core.loading.unsetLoading('global', false);
                }, 200);

                core.map.options = $.extend(core.map.options, options);
                core.map.initGlobal();
            },
            error: function(){
                core.loading.unsetLoading('global', false);
            }
        });
    },

    initGlobal: function(){
        var lat, lng;

        if(this.options.devices.length > 0){
            lat = this.options.devices[0].lat;
            lng = this.options.devices[0].lng;
        }else{
            lat = this.options.default_position.lat;
            lng = this.options.default_position.lng;
        };

        this.map = this.createMap({
            map_container_id: 'map',
            lat: this.convertNMEAtoWGS84(lat),
            lng: this.convertNMEAtoWGS84(lng),
            zoom: 12
        });

        this.resizeMap(true);
        this.setMapsPrototypes();
        this.drawDevices();
        this.createDatepicker();
    },

    init: function(){
        this.loadOptions();

        /*this.options = $.extend(this.options, $.parseJSON(options));

        this.initGlobalMap();

        this.binds();
        this.createDatepicker();*/
    }
}