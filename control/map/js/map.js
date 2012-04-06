core.map = {
    options: {
        show_tracks_on_map: 1,
        show_markers_on_map: 1,
        default_position : {
            lat: 30,
            lng: 30
        }
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
            return dist.toFixed(2);
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

    makeMarkerDescription: function(data){
        var text = new String();

        text += '<p>Уникальный номер метки: <b>' + data.point.id + '</b></p>';
        text += '<p>Время: <b>' + this.humanizeGPSTime(data.point.time) + '</b></p>';
        text += '<p>Скорость: <b>' + this.convertKnotsToKms(data.point.velocity) + ' км/ч</b></p>';

        return text;
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
                this.convertNMEAtoWGS84(options.device.point.lat),
                this.convertNMEAtoWGS84(options.device.point.lng)
            ),
            map: options.map,
            title: options.device.name+' ('+options.device.make+' '+options.device.model+', '+options.device.g_id+')',
            device: options.device,
            description: this.makeMarkerDescription(options.device)
        });

        google.maps.event.addListener(marker, 'click', function(){
            options.click(options.device.id);
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

    getDeviceIndexById: function(id){
        for(var i = 0, l = this.options.devices.length; i < l; i++){
            if(this.options.devices[i].id == id){
                return i;
            };
        };
    },

    setDeviceFocus: function(device_id){
        var device = this.options.devices[this.getDeviceIndexById(device_id)];

        core.map.map.panTo(device.current_position_marker.getPosition());

        if(this.options.current_devece_id != device_id){
            $('#car_name_info').html(device.name+' &mdash; '+device.make+' '+device.model+' <span class="g_id">'+device.g_id+'</span>');
            this.showDevicePath(device.id);
            this.options.current_devece_id = device_id;
        };
    },

    drawDevices: function(){
        for(var i = 0, l = this.options.devices.length; i < l; i++){
            this.options.devices[i].current_position_marker = this.createCurrentPositionMarker({
                map         : this.map,
                device      : this.options.devices[i],
                click       : function(device_id){
                    core.map.setDeviceFocus(device_id);
                }
            });
        };
    },

    hideAllDievicesPaths: function(){
        for(var i = 0, l = this.options.devices.length; i < l; i++){
            if(this.options.devices[i].path){
                this.options.devices[i].path.polyline.setVisible(false);
            };
        };
    },

    showDevicePath: function(device_id){
        var device = this.options.devices[this.getDeviceIndexById(device_id)];

        if(device.path){
            this.hideAllDievicesPaths();

            //Path show
            device.path.polyline.setVisible(true);

        }else{
            //Load points and recall this fn
            this.loadDevicePathData(device_id);
        };
    },

    drawPath: function(points, device, map){
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
                path            : polyline_shape,
                strokeColor     : device.color,
                strokeOpacity   : 0.75,
                strokeWeight    : 3,
                clickable       : false,
                visible         : false
            });

            polyline.setMap(map);

            return polyline;
        };
    },

    getAverageSpeed: function(points){
        var average_speed = 0;

        for(var i = 0, l = points.length; i < l; i++){
            average_speed += parseFloat(points[i].velocity);
        };

        return this.convertKnotsToKms(average_speed/points.length);
    },

    getMaxSpeed: function(points){
        var max_speed = 0;

        for(var i = 0, l = points.length; i < l; i++){
            if(points[i].velocity > max_speed){
                max_speed = parseFloat(points[i].velocity);
            };
        };

        return this.convertKnotsToKms(max_speed);
    },

    createDevicePathData: function(device_id, points){
        var polyline = this.drawPath(points, core.map.options.devices[core.map.getDeviceIndexById(device_id)], this.map),
            device = core.map.options.devices[core.map.getDeviceIndexById(device_id)].path = {
            points      : points,
            polyline    : polyline,
            statistics  : {
                distance        : polyline.inKm(),
                average_speed   : this.getAverageSpeed(points),
                max_speed       : this.getMaxSpeed(points)
            }
        };
    },

    loadDevicePathData: function(device_id){
        if(this.path_loading_process){
            this.path_loading_process.abort();
        };

        this.path_loading_process = $.ajax({
            url : '/control/map/?ajax',
            data : {
                action      : 'getPoints',
                device_id   : device_id
            },
            dataType : 'json',
            type : 'get',
            beforeSend: function(){
                core.loading.unsetLoading('global', false);
                core.loading.setLoadingWithNotify('global', false, 'Загрузка данных');
            },
            success: function(points){
                setTimeout(function(){
                    core.loading.unsetLoading('global', false);
                }, 200);

                core.map.createDevicePathData(device_id, points);
                core.map.showDevicePath(device_id);
            },
            error: function(){
                core.loading.unsetLoading('global', false);
            }
        });
    },

    loadOptions: function(){
        if(this.options_loading_process){
            this.options_loading_process.abort();
        };

        this.options_loading_process = $.ajax({
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
            lat = this.options.devices[0].point.lat;
            lng = this.options.devices[0].point.lng;
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
};