core.map = {
    options: {
        show_tracks_on_map: 1,
        show_markers_on_map: 1
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

    createMapControls: function(map){
        map.addControl(new YMaps.TypeControl());
        map.addControl(new YMaps.ToolBar());
        map.addControl(new YMaps.Zoom());
        map.addControl(new YMaps.MiniMap());
        map.addControl(new YMaps.ScaleLine());

        map.enableHotKeys();
    },

    createMap: function(options){
        var map = new YMaps.Map(YMaps.jQuery(options.selector)[0]);

        map.setCenter(
            new YMaps.GeoPoint(
                options.lat,
                options.lng
            ),
            options.zoom
        );

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
        $('#distance_driven').html(YMaps.humanDistance(this.registered.distance));
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

    createWaypointMarker: function(i, options){
        this.markers['marker_'+i] = new YMaps.Placemark(
            new YMaps.GeoPoint(
                this.convertNMEAtoWGS84(options.lat),
                this.convertNMEAtoWGS84(options.lng)
            ), {
                style: "marker#waypoint_marker",
                hideIcon: false
            });

        this.markers['marker_'+i].data = options;
        this.markers['marker_'+i].name = options.dev;
        this.markers['marker_'+i].description = this.makeMarkerDescription(options);

        this.map.addOverlay(this.markers['marker_'+i]);
        this.registerMarkerData(i);

        return this.markers['marker_'+i];
    },

    createCurrentPositionMarker: function(i, options){
        this.markers['marker_'+i] = new YMaps.Placemark(
            new YMaps.GeoPoint(
                this.convertNMEAtoWGS84(options.lat),
                this.convertNMEAtoWGS84(options.lng)
            ), {
                style: "default#carIcon",
                hideIcon: true
            });

        this.markers['marker_'+i].data = options;
        this.markers['marker_'+i].name = options.dev;
        this.markers['marker_'+i].description = this.makeMarkerDescription(options);

        this.map.addOverlay(this.markers['marker_'+i]);
        this.registerMarkerData(i);

        return this.markers['marker_'+i];
    },

    drawMarkers: function(points){
        this.markers = {};

        if(points && points.length > 0){
            if(this.last_marker){
                this.last_marker.setStyle("marker#waypoint_marker");
            };

            for(var i = 1, l = points.length - 1; i < l; i++){
                this.createWaypointMarker(i, points[i]);
            };

            this.last_marker = this.createCurrentPositionMarker(points.length, points[points.length - 1]);

            console.log(points[points.length - 1]);

            this.map.panTo(this.last_marker.getGeoPoint());
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

    getPathDistance: function(polyline){
        var distance = 0;

        for (var i = 1, l = polyline.getNumPoints(), point; i < l; i++) {
            if(point){
                distance += point.distance(polyline.getPoint(i));
            };

            point = polyline.getPoint(i);
        };

        return distance;
    },

    drawPath: function(points){
        if(points && points.length > 0){
            var polyline_shape = new Array();

            for(var i = 1, l = points.length; i < l; i++){
                polyline_shape.push(
                    new YMaps.GeoPoint(
                        this.convertNMEAtoWGS84(points[i].lat),
                        this.convertNMEAtoWGS84(points[i].lng)
                    )
                );
            };

            var polyline = new YMaps.Polyline(
                polyline_shape, {
                    hasBalloon: false,
                    interactive: YMaps.Interactivity.NONE,
                    style: "line#line"
                }
            );

            this.map.addOverlay(polyline);
            this.registered.distance = this.getPathDistance(polyline);
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

    createOverlayStyles: function(){
        //Polyline styles
        var polyline_style = new YMaps.Style();
        polyline_style.lineStyle = new YMaps.LineStyle();
        polyline_style.lineStyle.strokeColor = '02dead65';
        polyline_style.lineStyle.strokeWidth = '5';
        YMaps.Styles.add("line#line", polyline_style);

        //Waypoint marker styles
        var waypoint_marker_style = new YMaps.Style();
        waypoint_marker_style.iconStyle = new YMaps.IconStyle();
        waypoint_marker_style.iconStyle.href = "/control/map/img/waypoint_marker.png";
        waypoint_marker_style.iconStyle.size = new YMaps.Point(7, 7);
        waypoint_marker_style.iconStyle.offset = new YMaps.Point(-4, -10);
        YMaps.Styles.add("marker#waypoint_marker", waypoint_marker_style);
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
                    year: year,
                    month:month,
                    day:day
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

    init: function(options){
        this.options = $.extend(this.options, $.parseJSON(options));

        this.map = this.createMap({
            selector: '#map',
            lat: this.convertNMEAtoWGS84(this.options.start_point.lat),
            lng: this.convertNMEAtoWGS84(this.options.start_point.lng),
            zoom: 12
        });

        console.log(this.options);

        this.createMapControls(this.map);
        this.binds();
        this.createOverlayStyles();
        this.loadData(0, 200);
        this.resizeMap(true);
        this.createDatepicker();
    }
}