'use strict';

core.map = {
    options: {
        current_device_id: null,
        devices: [],
        default_position : {
            lat: 55,
            lng: 38,
            zoom: 5
        },
        marker_styles: {
            waypoint: {
                image: new google.maps.MarkerImage(
                    'img/markers/waypoint.png',
                    new google.maps.Size(7,7),
                    new google.maps.Point(0,0),
                    new google.maps.Point(3.5,3.5)
                ),
                shadow: null,
                shape: {
                    coord: [5,0,6,1,6,2,6,3,6,4,6,5,5,6,1,6,0,5,0,4,0,3,0,2,0,1,1,0,5,0],
                    type: 'poly'
                }
            },
            waypoint_stop: {
                image: new google.maps.MarkerImage(
                    '/control/map/img/markers/waypoint_stop.png',
                    new google.maps.Size(7,7),
                    new google.maps.Point(0,0),
                    new google.maps.Point(3,3)
                ),
                shape: {
                    coord: [5,0,6,1,6,2,6,3,6,4,6,5,5,6,1,6,0,5,0,4,0,3,0,2,0,1,1,0,5,0],
                    type: 'poly'
                }
            }
        }
    },

    getHeadingIcon: function(heading){
        var degrees_zone = Math.round(parseInt(heading)/15) * 15;

        if(isNaN(degrees_zone)){
            degrees_zone = 0; //TODO Сделать иконку без хеадинга для NaN
        };

        if(degrees_zone == 360){
            degrees_zone = 0;
        };

        var image = new google.maps.MarkerImage(
            '/control/map/img/markers/heading/'+degrees_zone+'.png',
            new google.maps.Size(16,16),
            new google.maps.Point(0,0),
            new google.maps.Point(8,8)
        );

        var shadow = new google.maps.MarkerImage(
            '/control/map/img/markers/heading/flat_shadow.png',
            new google.maps.Size(30,30),
            new google.maps.Point(0,0),
            new google.maps.Point(15,12)
        );

        var shape = {
            coord: [11,0,13,1,14,2,14,3,15,4,15,5,15,6,15,7,15,8,15,9,15,10,15,11,14,12,14,13,13,14,11,15,4,15,2,14,1,13,1,12,0,11,0,10,0,9,0,8,0,7,0,6,0,5,0,4,1,3,1,2,2,1,4,0,11,0],
            type: 'poly'
        };

        return {
            image: image,
            shadow: shadow,
            shape: shape
        };
    },

    getWaypointIcon: function(heading){
        var degrees_zone = Math.round(parseInt(heading)/15) * 15;

        var image = new google.maps.MarkerImage(
            'img/markers/waypoint/'+degrees_zone+'.png',
            new google.maps.Size(11,11),
            new google.maps.Point(0,0),
            new google.maps.Point(5.5,5.5)
        );

        var shadow = {};

        var shape = {
            coord: [7,2,7,3,8,4,8,5,9,6,9,7,9,8,9,9,1,9,1,8,1,7,1,6,2,5,2,4,3,3,3,2,7,2],
            type: 'poly'
        };

        return {
            image: image,
            shadow: shadow,
            shape: shape
        };
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
            var a = this.getPath(n), dist = 0;

            for (var i = 0, l = a.getLength(); i < l-1; i++){
                dist += a.getAt(i).kmTo(a.getAt(i+1));
            };

            return dist.toFixed(2);
        };

        //Label
        this.label.prototype = new google.maps.OverlayView;

        // Implement onAdd
        this.label.prototype.onAdd = function() {
            var pane = this.getPanes().overlayLayer;
            pane.appendChild(this.div_);

            // Ensures the label is redrawn if the text or position is changed.
            var me = this;
            this.listeners_ = [
                google.maps.event.addListener(this, 'position_changed', function() { me.draw(); }),
                google.maps.event.addListener(this, 'text_changed', function() { me.draw(); })
            ];
        };

        // Implement onRemove
        this.label.prototype.onRemove = function() {
            this.div_.parentNode.removeChild(this.div_);

            // Label is removed from the map, stop updating its position/text.
            for (var i = 0, I = this.listeners_.length; i < I; ++i) {
                google.maps.event.removeListener(this.listeners_[i]);
            };
        };

        // Implement draw
        this.label.prototype.draw = function() {
            var projection = this.getProjection();
            var position = projection.fromLatLngToDivPixel(this.get('position'));

            var div = this.div_;
            div.style.left = position.x + 4 + 'px';
            div.style.top = position.y - 4 + 'px';
            div.style.display = 'block';

            this.span_.innerHTML = this.get('text');
        };
    },

    createMap: function(options){
        var latlng = new google.maps.LatLng(options.lat, options.lng);

        var map_options = {
            zoom      : options.zoom,
            center    : latlng,
            mapTypeId : google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById(options.map_container_id), map_options);

        return map;
    },

    showPath: function(){

    },

    hidePath: function(){

    },

    showWaypointMarkers: function(type){
        var markers = this.options.devices[this.getDeviceIndexById(this.options.current_device_id)].path.waypoint_markers;

        for(var i = 0, l = markers.length; i < l; i++){
            if(type == markers[i].type || !type){
                console.log(markers[i])
                markers[i].setMap(this.map);
            };
        };
    },

    hideWaypointMarkers: function(type){
        var markers = this.options.devices[this.getDeviceIndexById(this.options.current_device_id)].path.waypoint_markers;

        for(var i = 0, l = markers.length; i < l; i++){
            if(type == markers[i].type || !type){
                markers[i].setMap(null);
            };
        };
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
            core.map.execSettings(core.forms.readDataFormSettingsTable('settings_table'));
            core.modal.hide();
        };

        return options;
    },

    changeDate: function(date){
        this.hideAllDevicesCurrentPositions();
        this.hideAllDevicesInfo();
        $('.current_date').html(core.utilities.humanizeDate(date, 'COMMON'));

        this.loadOptions(true);
    },

    createDatepicker: function(){
        $('#datepicker').datepicker({
            dateFormat      : "dd-mm-yy",
            dayNames        : ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
            dayNamesMin     : ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
            monthNames      : ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
            monthNamesMin   : ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
            minDate         : (this.options.min_date) ? core.utilities.convertDateMYSQLtoCOMMON(this.options.min_date) : "today",
            firstDay        : 1,
            setDate         : this.options.date,
            maxDate         : "today",
            onSelect        : function(dateText, inst){
                if(core.map.date_loading_process){
                    core.map.date_loading_process.abort();
                };

                core.map.date_loading_process = $.ajax({
                    url: '/control/map/?ajax',
                    data: {
                        action: 'setCurrentDate',
                        date: dateText
                    },
                    beforeSend: function(){
                        core.loading.setGlobalLoading();
                    },
                    success: function(){
                        core.loading.unsetGlobalLoading();
                        core.map.changeDate(dateText);
                    }
                });
            },
            nextText        : 'Следующий месяц',
            prevText        : 'Предыдущий месяц'
        });

        /*$('#datepicker').datepicker({
            embed       : true,
            format      : 'dd-mm-yy',
            today       : true,
            setDate     : this.options.date,
            callback    : function(event, date, year, month, day){
                if(core.map.date_loading_process){
                    core.map.date_loading_process.abort();
                };

                core.map.date_loading_process = $.ajax({
                    url: '/control/map/?ajax',
                    data: {
                        action: 'setCurrentDate',
                        date: date
                    },
                    beforeSend: function(){
                        core.loading.unsetLoading('global', false);
                        core.loading.setLoadingWithNotify('global', false, 'Загрузка данных');
                    },
                    success: function(){
                        core.loading.unsetLoading('global', false);
                        core.map.changeDate(date, event);
                    }
                })
            }
        });*/
    },



    resizeMap: function(bind){
        $('#map').css({
            height: $(window).height() - $('#map').offset().top - 20
        });

        if(bind){
            $(window).on('resize', function(){
                core.map.resizeMap();
            });
        };

        if(this.map){
            google.maps.event.trigger(this.map, 'resize');
        };
    },

    getDeviceIndexById: function(id){
        for(var i = 0, l = this.options.devices.length; i < l; i++){
            if(this.options.devices[i].id == id){
                return i;
            };
        };
    },

    setDeviceFocus: function(marker){
        if(marker){
            //this.map.panTo(marker.getPosition());
            this.showMarkerData(marker);
        };
    },

    drawDeviceLabel: function(id){
        var device  = this.options.devices[this.getDeviceIndexById(id)],
            marker  = device.current_position_marker;

        if(marker){
            var label   = new this.label({
                map: this.map
            });

            var g_id = core.utilities.drawGId(device.g_id, 'small');

            label.bindTo('position', marker, 'position');
            label.bindTo('text', marker, 'position');
            label.div_.innerHTML =  '<i class="marker_tip"></i>' +
                                    '<span class="marker_label" id="device_label_'+id+'">' +
                                        '<b>'+device.name+'</b><br>' +
                                        '<nobr>'+device.make+' '+((device.model != null) ? device.model : '')+'</nobr><br>' +
                                        g_id +
                                    '</span>';

            device.current_position_label = label;
        };
    },

    drawDevice: function(id){
        var device = this.options.devices[this.getDeviceIndexById(id)],
            marker = this.createCurrentPositionMarker({
                map         : this.map,
                device      : device,
                click       : function(marker){
                    core.map.setDeviceFocus(marker);
                }
            });

        device.current_position_marker = marker;
    },

    drawDevices: function(){
        for(var i = 0, l = this.options.devices.length; i < l; i++){
            this.drawDevice(this.options.devices[i].id);
            this.drawDeviceLabel(this.options.devices[i].id);
        };
    },

    hideAllDevicesCurrentPositions: function(){
        for(var i = 0, l = this.options.devices.length; i < l; i++){
            if(this.options.devices[i].current_position_marker){
                if(this.options.devices[i].current_position_marker){
                    this.options.devices[i].current_position_marker.setMap(null);
                };

                if(this.options.devices[i].current_position_label){
                    this.options.devices[i].current_position_label.setMap(null);
                };
            };
        };

        $('#registered_data').html('').fadeOut(100);
        $('#registered_info').html('').fadeOut(100);
    },

    hideAllDevicesInfo: function(){
        for(var i = 0, l = this.options.devices.length; i < l; i++){
            this.hideDeviceInfo(this.options.devices[i].id);
        };

        $('#registered_data').html('');
        $('#registered_info').html('');
    },

    hideDeviceInfo: function(id){
        var device = this.options.devices[this.getDeviceIndexById(id)];

        if(device.path){
            device.path.polyline.setVisible(false);

            for(var i = 0, l = device.path.waypoint_markers.length; i < l; i++){
                device.path.waypoint_markers[i].setVisible(false);
            };
        };
    },

    setCurrentDeviceName: function(device_id){
        var device = this.options.devices[this.getDeviceIndexById(device_id)];

        if(device){
            $('#car_name_info').html('<b>'+device.name+'</b> '+device.make+' '+((device.model != null) ? device.model : '')+' '+core.utilities.drawGId(device.g_id, 'small'));
            $('#car_name_info').css({paddingRight: $('#car_name_info .g_id').width() + 8});
        }else{
            $('#car_name_info').html('<b>Все машины</b> <span class="badge">'+this.options.devices.length+'</span>');
            $('#car_name_info').css({paddingRight: 0});
        };
    },

    getDeviceDataHtml: function(device){
        var max_speed_block = '';

        if(device.max_speed_marker){
            max_speed_block =   '<tr>' +
                                    '<th>Макс. скорость</th>' +
                                    '<td><a id="max_speed" class="label label-info" href="javascript:void(0)">'+device.path.statistics.max_speed+' км/ч</a></td>' +
                                '</tr>';
        };

        //Show statistics
        var html =  '<b>Сводка за день <a href="javascript:void(0)" class="caret"></a></b>' +
                    '<div class="side_block_content"><table class="">' +
                        max_speed_block +
                        '<tr>' +
                            '<th>Средняя скорость</th>' +
                            '<td><span id="average_speed">'+device.path.statistics.average_speed+' км/ч</span></td>' +
                        '</tr>' +
                        '<tr>' +
                            '<th>Пройдено пути</th>' +
                            '<td><span id="distance_driven">'+device.path.statistics.distance+' км</span></td>' +
                        '</tr>' +
                        '<tr>' +
                            '<th>Остановки</th>' +
                            '<td><span id="distance_driven">'+device.path.statistics.stops+'</span></td>' +
                        '</tr>' +
                        '<tr>' +
                            '<th title="Последнее обновление местоположения">Обн. местополож.</th>' +
                            '<td><span id="distance_driven" title="'+core.utilities.humanizeDate(device.last_registered_point.date, 'MYSQL')+', в '+core.utilities.humanizeTime(device.last_registered_point.date)+'">'+
                                '<span id="position_time_gone" data-time_from="'+device.last_registered_point.date+'">'+core.utilities.dateRange(device.last_registered_point.date, new Date())+'</span>'+
                            '</span></td>' +
                        '</tr>' +
                        '<tr>' +
                            '<th title="Последнее обновление статуса устройства">Обн. статуса</th>' +
                            '<td><span id="distance_driven" title="'+core.utilities.humanizeDate(device.last_update, 'MYSQL') +', в '+core.utilities.humanizeTime(device.last_update)+'">'+
                                '<span id="status_time_gone" data-time_from="'+device.last_update+'">'+core.utilities.dateRange(device.last_update, new Date())+'</span>'+
                            '</span></td>' +
                        '</tr>' +
                        /*'<tr>' +
                            '<th>График</th>' +
                            '<td><a href="javascript:void(0)" class="label label-info" onclick="core.map.showCharts()">Показать</a></td>' +
                        '</tr>' +*/
                    '</table></div>';

        return html;
    },

    getDeviceInfoHtml: function(device){
        var heading     = core.utilities.humanizeHeadingDegrees(device.last_registered_point.bb),
            html        =   '<b>Cостояние устройства <a href="javascript:void(0)" class="caret"></a></b>' +
                            '<div class="side_block_content"><table class="">' +
                                /*'<tr>' +
                                    '<td width="70%">Последнее обновление местоположения</td>' +
                                    '<td width="30%"><span class="label">' +
                                        core.utilities.humanizeDate(device.last_registered_point.date, 'MYSQL')+'<br>'+
                                        core.utilities.humanizeTime(device.last_registered_point.date)+'</span>' +
                                    '</td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td width="70%">Последнее обновление статуса</td>' +
                                    '<td width="30%"><span class="label">' +
                                        core.utilities.humanizeDate(device.last_update, 'MYSQL')+'<br>'+
                                        core.utilities.humanizeTime(device.last_update)+'</span>' +
                                    '</td>' +
                                '</tr>' +*/

                                '<tr>' +
                                    '<th>Курс</th>' +
                                    '<td><span><i class="heading_icon hi_'+heading.code+'" title="'+device.last_registered_point.bb+'&deg;"></i><span>'+heading.name+'</span></span></td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<th>Скорость</th>' +
                                    '<td><span>'+core.utilities.convertKnotsToKms(device.last_registered_point.velocity)+' км/ч</span></td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<th>Высота</th>' +
                                    '<td><span>'+device.last_registered_point.altitude+' м</span></td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<th>Сигнал GSM</td>' +
                                    '<td>'+core.utilities.getCSQIndicator(device.csq)+'</td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<th>Сигнал GPS</td>' +
                                    '<td>'+core.utilities.getHDOPIndicator(device.hdop)+'</td>' +
                                '</tr>' +
                            '</table></div>';

        return html;
    },

    showDeviceData: function(device_id){
        var device = this.options.devices[this.getDeviceIndexById(device_id)];

        if(device.path){
            //Path show
            device.path.polyline.setVisible(true);

            if(device.path.waypoint_markers){
                for(var i = 0, l = device.path.waypoint_markers.length; i < l; i++){
                    device.path.waypoint_markers[i].setVisible(true);
                };
            };

            if(device.path && device.path.statistics){
                $('#registered_data').html(this.getDeviceDataHtml(device)).fadeIn(150);
            };

            $('#where_is_my_car').show();

            //this.fitToDevicePathBounds();
        }else{
            //Load points and recall this fn
            this.loadDevicePathData(device_id);
        };

        if(device.last_registered_point){
            $('#registered_info').html(this.getDeviceInfoHtml(device)).fadeIn(150);
        };
    },

    drawPath: function(points, device, map){
        if(points && points.length > 0){
            var polyline_shape = new Array(),
                stops = 0;

            for(var i = 0, l = points.length; i < l; i++){
                polyline_shape.push(
                    new google.maps.LatLng(
                        points[i].lat,
                        points[i].lng
                    )
                );

                if(points[i].velocity <= 0){
                    stops++;
                };
            };

            var polyline = new google.maps.Polyline({
                path            : polyline_shape,
                strokeColor     : device.color,
                strokeOpacity   : 0.65,
                strokeWeight    : 5,
                clickable       : false,
                visible         : false
            });

            polyline.setMap(map);

            return {polyline: polyline, stops: stops};
        };
    },

    drawWaypointMarkers: function(points, device, map){
        if(points && points.length > 0){
            var waypoint_markers = new Array(),
                max_speed = 0,
                max_speed_point = null,
                max_speed_marker = null;


            for(var i = 0, l = points.length-1; i < l; i++){
                if((max_speed_point === null && max_speed == 0) || (points[i].velocity*1 > max_speed)){
                    max_speed_point = points[i];
                    max_speed = points[i].velocity*1;
                };
            };

            for(var i = 0, l = points.length-1; i < l; i++){
                if(points[i].velocity == 0 || points[i].id == max_speed_point.id){
                    var marker = this.createWaypointMarker({
                        map         : map,
                        device      : device,
                        point       : points[i],
                        click       : function(marker){
                            core.map.showMarkerData(marker);
                        }
                    });

                    waypoint_markers.push(marker);

                    if(points[i].id == max_speed_point.id){
                        max_speed_marker = marker;
                    };
                };
            };

            return {
                waypoint_markers: waypoint_markers,
                max_speed_marker: max_speed_marker
            };
        };
    },

    label: function(opt_options){
        this.setValues(opt_options);

        // Label specific
        var span = this.span_ = document.createElement('span');
        var div = this.div_ = document.createElement('div');
        div.appendChild(span);
        div.style.cssText = 'position: absolute; display: none';
    },

    createCurrentPositionMarker: function(options){
        if(options.device.point){
            var icon = this.getHeadingIcon(options.device.point.bb);
            var marker = new google.maps.Marker({
                position    : new google.maps.LatLng(
                    options.device.point.lat,
                    options.device.point.lng
                ),
                zIndex      : 10000,
                icon        : icon.image,
                shadow      : icon.shadow,
                shape       : icon.shape,
                point       : options.device.point,
                map         : options.map,
                title       : options.device.name+' — ('+options.device.make+' '+((options.device.model != null) ? options.device.model : '')+' '+options.device.g_id+')',
                device_id   : options.device.id
            });

            google.maps.event.addListener(marker, 'click', function(){
                options.click(marker);
            });

            return marker;
        };
    },

    createWaypointMarker: function(options){
        var style, title, type;

        if(options.point.velocity <= 0){
            title = options.device.name+' — остановка';
            style = this.options.marker_styles.waypoint_stop;
            type  = 'stop';
        }else{
            title = options.device.name+' — в пути ('+core.utilities.convertKnotsToKms(options.point.velocity)+' км/ч)';
            //style = this.getWaypointIcon(options.point.bb);
            style = this.options.marker_styles.waypoint;
            type  = 'move';
        };

        var marker = new google.maps.Marker({
            position    : new google.maps.LatLng(
                options.point.lat,
                options.point.lng
            ),
            icon        : style.image,
            shape       : style.shape,
            shadow      : style.shadow,
            point       : options.point,
            map         : options.map,
            title       : title,
            type        : type,
            device_id   : options.device.id
        });

        google.maps.event.addListener(marker, 'click', function(){
            options.click(marker);
        });

        return marker;
    },

    showMarkerData: function(marker){
        var device = this.options.devices[this.getDeviceIndexById(marker.device_id)],
            status, status_class, additional = new String(), gps, gsm;

        if(marker.point.id == device.current_position_marker.point.id){
            status = 'Текущее положение';
            status_class = 'label-info';
            if(this.options.current_device_id != marker.device_id){
                additional = '<a class="btn btn-info select_car_button" rel="'+marker.device_id+'" href="javascript:void(0)"><i class="icon-share-alt icon-white"></i> Выбрать машину</a>';
            };

            gps = core.utilities.getHDOPIndicator(device.hdop);
            gsm = core.utilities.getCSQIndicator(device.csq);
        }else{
            if(marker.point.velocity > 0){
                status = 'В пути';
                status_class = 'label-success';
            }else{
                status = 'Остановка';
                status_class = 'label-important';
            };

            gps = core.utilities.getHDOPIndicator(marker.point.hdop);
            gsm = core.utilities.getCSQIndicator(marker.point.csq);
        };

        var html =  '<p><b>'+device.name+'</b> '+device.make+' '+ ((device.model != null) ? device.model : '') + ' ' +core.utilities.drawGId(device.g_id, 'small')+ '</p>' +
                    '<table class="table table-bordered table-condensed">' +
                        '<tr>' +
                            '<td>Отметка</td>' +
                            '<td><span class="label '+status_class+'">'+status+'</span></td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>Время</td>' +
                            '<td><span class="label">'+core.utilities.humanizeTime(marker.point.date)+'</span></td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>Направление</td>' +
                            '<td><span class="label" title="'+marker.point.bb+'&deg;">'+core.utilities.humanizeHeadingDegrees(marker.point.bb).name+'</span></td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>Скорость</td>' +
                            '<td><span class="label">'+core.utilities.convertKnotsToKms(marker.point.velocity)+' км/ч</span></td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>Высота</td>' +
                            '<td><span class="label">'+marker.point.altitude+' м</span></td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>Сигнал GSM</td>' +
                            '<td>'+gsm+'</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>Сигнал GPS</td>' +
                            '<td>'+gps+'</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>Координаты</td>' +
                            '<td>'+marker.point.lat+', '+marker.point.lng+'</td>' +
                        '</tr>' +
                    '</table>' + additional;

        if(this.infowindow){
            this.infowindow.close();
        };

        this.infowindow = new google.maps.InfoWindow({
            content: '<div class="info_window_content">'+html+'</div>'
        });

        this.infowindow.open(this.map, marker);
    },

    getAverageSpeed: function(points){
        var average_speed = 0;

        for(var i = 0, l = points.length; i < l; i++){
            average_speed += parseFloat(points[i].velocity);
        };

        return core.utilities.convertKnotsToKms(average_speed/points.length);
    },

    createDevicePathData: function(device_id, points){
        var polyline = this.drawPath(points, core.map.options.devices[core.map.getDeviceIndexById(device_id)], this.map),
            waypoint_markers_result = this.drawWaypointMarkers(points, core.map.options.devices[core.map.getDeviceIndexById(device_id)], this.map),
            max_speed = null;

        if(waypoint_markers_result.max_speed_marker){
            max_speed = core.utilities.convertKnotsToKms(waypoint_markers_result.max_speed_marker.point.velocity);
        };

        this.options.devices[this.getDeviceIndexById(device_id)].max_speed_marker = waypoint_markers_result.max_speed_marker;
        this.options.devices[this.getDeviceIndexById(device_id)].path = {
            points          : points,
            polyline        : polyline.polyline,
            waypoint_markers: waypoint_markers_result.waypoint_markers,
            statistics      : {
                distance        : polyline.polyline.inKm(),
                average_speed   : this.getAverageSpeed(points),
                max_speed       : max_speed,
                stops           : polyline.stops
            }
        };

        core.map.showDeviceData(device_id);
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
                core.loading.setGlobalLoading();
            },
            success: function(points){
                core.loading.unsetGlobalLoading();

                if(points.length > 0){
                    core.map.createDevicePathData(device_id, points);
                };
            },
            error: function(){
                core.loading.unsetGlobalLoading();
            }
        });
    },

    loadOptions: function(reinit){
        if(this.options_loading_process){
            this.options_loading_process.abort();
        };

        this.options_loading_process = $.ajax({
            url : '/control/map/?ajax',
            data : {
                action  : 'getOptions',
                fleet   : this.options.fleet_id
            },
            dataType : 'json',
            type : 'get',
            beforeSend: function(){
                core.loading.setGlobalLoading();
            },
            success: function(options){
                core.loading.unsetGlobalLoading();
                core.map.options = $.extend(core.map.options, options);

                if(reinit){
                    core.map.reinitGlobal();
                }else{
                    core.map.initGlobal();
                };
            },
            error: function(){
                core.loading.unsetGlobalLoading();
            }
        });
    },

    focusToMarker: function(marker){
        marker.map.panTo(marker.getPosition());
        google.maps.event.trigger(marker, 'click');
    },

    fitToDevicePathBounds: function(device_id){
        var bounds  = new google.maps.LatLngBounds(),
            device  = this.options.devices[this.getDeviceIndexById(device_id)],
            path    = core.map.options.devices[0].path.polyline.getPath();

        if(device.path && device.path.polyline && path && path.getLength() > 3){
            for(var i = 0; i < path.getLength(); i++) {
                bounds.extend(path.getAt(i));
            };

            this.map.fitBounds(bounds);
        }else{
            this.focusToMarker(device.current_position_marker);
        };
    },

    fitToAllDevicesMarkersBounds: function(){
        var bounds = new google.maps.LatLngBounds();
        var cond = false;

        for(var i = 0, l = this.options.devices.length; i < l; i++){
            if(this.options.devices[i].current_position_marker){
                bounds.extend(this.options.devices[i].current_position_marker.getPosition());
                cond = true;
            };
        };

        // Don't zoom in too far on only one marker
        if(bounds.getNorthEast().equals(bounds.getSouthWest())){
            var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.01, bounds.getNorthEast().lng() + 0.01);
            var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.01, bounds.getNorthEast().lng() - 0.01);
            bounds.extend(extendPoint1);
            bounds.extend(extendPoint2);
        };

        if(cond){
            this.map.fitBounds(bounds);
        };
    },

    selectCar: function(car_id){
        this.hideAllDevicesCurrentPositions();
        this.hideAllDevicesInfo();

        if(this.infowindow){
            this.infowindow.close();
        };

        if(car_id){
            $.cookie('car_id', car_id, this.options.cookie_options);
        }else{
            if($.cookie('car_id')){
                car_id = $.cookie('car_id');
            }else{
                car_id = 'all';
            };
        };

        if(car_id != 'all' && !this.options.devices[this.getDeviceIndexById(car_id)]){
            car_id = 'all';
        };

        if(!$('#where_is_my_car').is(':visible')){
            $('#where_is_my_car').show();
        };

        this.options.current_device_id = car_id;

        if(car_id == 'all'){
            this.setCurrentDeviceName();
            this.drawDevices();
            this.fitToAllDevicesMarkersBounds();
        }else{
            this.setCurrentDeviceName(car_id);
            this.drawDevice(car_id);
            this.showDeviceData(car_id);
            this.fitToAllDevicesMarkersBounds();

            if(this.options.devices[this.getDeviceIndexById(car_id)].current_position_marker){
                this.map.panTo(this.options.devices[this.getDeviceIndexById(car_id)].current_position_marker.getPosition());
            };
        };

        this.checkPeriodPoints(car_id);
    },

    showMapNotice: function(message){
        var html = '<div class="map_notice">'+message+'<a id="hide_map_notice" href="javascript:void(0)" class="btn">Закрыть</a></div>';

        $('body').prepend(html);

        var setMapNoticeSize = function(){
            $('.map_notice').css({
                width: ($('#map').width() * 0.55) - 50 ,
                top: $('#map').offset().top + (($('#map').height() / 2) - ($('.map_notice').height() / 2)) - 25,
                left: $('#map').offset().left + (($('#map').width() / 2) - ($('.map_notice').width() / 2)) - 25
            });
        };

        setMapNoticeSize();
        setMapNoticeSize();

        $(window).on('resize', function(){
            setMapNoticeSize();
        });

        $('#hide_map_notice').off('click').on('click', function(){
            core.map.hideMapNotice();
        });
    },

    hideMapNotice: function(){
        $('.map_notice').remove();
    },

    setMapToDefaultPoint: function(){
        this.map.setCenter(new google.maps.LatLng(
            this.options.default_position.lat,
            this.options.default_position.lng
        ));

        this.map.setZoom(this.options.default_position.zoom);
    },

    checkPeriodPoints: function(car_id){
        this.hideMapNotice();

        var no_points = true;

        if(car_id == 'all'){
            for(var i = 0, l = this.options.devices.length; i < l; i++){
                if(this.options.devices[i].current_position_marker){
                    no_points = false;
                };
            };

            if(no_points){
                var html =  '<p>На&nbsp;<b>'+core.utilities.humanizeDate(this.options.date, 'COMMON')+'</b> ' +
                            'не&nbsp;зарегистрированно ни&nbsp;одной отметки, ни&nbsp;для&nbsp;одной&nbsp;машины</p>';

                this.showMapNotice(html);
                $('#where_is_my_car').hide();

                this.setMapToDefaultPoint();
            }else{
                $('#where_is_my_car').show();
            };
        }else{
            var device = this.options.devices[this.getDeviceIndexById(car_id)];

            if(!device.current_position_marker){
                if(device.last_registered_point){
                    var message =   '<p>На&nbsp;выбранный период не&nbsp;зарегистрированно ни&nbsp;одной отметки для&nbsp;машины&nbsp;<b>&laquo;'+device['name']+'&raquo;</b>.</p>' +
                                    '<p>Последняя отметка была зарегистрированна&nbsp;<b>'+core.utilities.humanizeDate(device.last_registered_point.date, 'MYSQL')+'</b></p>';
                }else{
                    var message =   '<p>Для&nbsp;машины&nbsp;<b>&laquo;'+device['name']+'&raquo;</b> нет ни одной отметки</p>';
                };

                this.showMapNotice(message);
                $('#where_is_my_car').hide();
                $('#registered_info').hide();

                this.setMapToDefaultPoint();
            }else{
                $('#where_is_my_car').show();
            };
        };
    },

    reinitGlobal: function(){
        this.selectCar();
    },

    initGlobal: function(){
        var cars_menu_html = '<li><a href="javascript:void(0)" rel="all"><b>Все машины</b> <span class="badge">'+this.options.devices.length+'</span></a></li>';

        for(var i = 0, l = this.options.devices.length; i < l; i++){
            cars_menu_html +=   '<li>' +
                                    '<a href="javascript:void(0)" rel="'+this.options.devices[i].id+'">' +
                                        '<b>'+this.options.devices[i].name+'</b> '+
                                        this.options.devices[i].make+' '+((this.options.devices[i].model != null) ? this.options.devices[i].model : '') +' ' +
                                        core.utilities.drawGId(this.options.devices[i].g_id, 'small') +
                                    '</a>' +
                                '</li>';
        };

        $('.current_date').html(core.utilities.humanizeDate(this.options.date, 'COMMON'));

        setTimeout(function(){
            $('.calendar_place').animate({
                height: $('.calendar_place .ui-datepicker-calendar').height() + 63,
                top: -$('.calendar_place .ui-datepicker-calendar').height()
            }, 400, 'easeOutExpo').addClass('closed');
        }, 600);

        $('#cars_menu').html(cars_menu_html);
        setTimeout("$('.select_car').show(250);", 500);

        this.map = this.createMap({
            map_container_id: 'map',
            lat: this.options.default_position.lat,
            lng: this.options.default_position.lng,
            zoom: this.options.default_position.zoom
        });

        this.resizeMap(true);
        this.createDatepicker();

        this.selectCar();
    },

    binds: function(){
        $('#max_speed').live('click', function(){
            if(core.map.options.current_device_id){
                core.map.focusToMarker(core.map.options.devices[core.map.getDeviceIndexById(core.map.options.current_device_id)].max_speed_marker);
            };
        });

        $('#where_is_my_car').live('click', function(){
            if(core.map.options.current_device_id && core.map.options.current_device_id != 'all'){
                //core.map.focusToMarker(core.map.options.devices[core.map.getDeviceIndexById(core.map.options.current_device_id)].current_position_marker);
                core.map.fitToDevicePathBounds(core.map.options.current_device_id);
            }else{
                core.map.fitToAllDevicesMarkersBounds();
            };
        });

        $('#refresh_data').live('click', function(){
            core.map.loadOptions();
        });

        $('#hide_current_car_info').live('click', function(){
            if(core.map.options.current_device_id > 0){
                core.map.hideDeviceInfo(core.map.options.current_device_id);
            };
        });

        $('#cars_menu li a').live('click', function(){
            core.map.selectCar($(this).attr('rel'));
        });

        $('a.select_car_button').live('click', function(){
            core.map.selectCar($(this).attr('rel'));
        });

        $('.calendar_place a.opener').live('click', function(){
            if($('.calendar_place').hasClass('closed')){
                $('.calendar_place').stop().animate({
                    top: 34,
                    height: $('.calendar_place .ui-datepicker-calendar').height() + 63,
                    opacity: 0.96
                }, 400, 'easeOutExpo').removeClass('closed').addClass('opened');
            }else{
                $('.calendar_place').stop().animate({
                    top: -$('.calendar_place .ui-datepicker-calendar').height(),
                    height: $('.calendar_place .ui-datepicker-calendar').height() + 63,
                    opacity: 0.75
                }, 400, 'easeOutExpo').removeClass('opened').addClass('closed');
            };
        });

        $('.calendar_place').live('mouseleave', function(){
            core.map.options.calendar_timeout = setTimeout(
                function(){
                    $('.calendar_place').stop().animate({
                        top: -$('.calendar_place .ui-datepicker-calendar').height(),
                        height: $('.calendar_place .ui-datepicker-calendar').height() + 63,
                        opacity: 0.75
                    }, 400, 'easeOutExpo').removeClass('opened').addClass('closed')
                },
                1000
            );
        });

        $('.calendar_place').live('mouseenter', function(){
            clearTimeout(core.map.options.calendar_timeout);
        });

        $('.map_container .side_block>b').live('click', function(){
            var p = $(this).parent();
            if(p.hasClass('closed')){
                p.find('table').show();
                p.animate({height: 140}, 300, 'easeOutExpo');
                p.removeClass('closed');

                $.cookie(p.attr('id'), '1', core.map.options.cookie_options);
            }else{
                p.find('table').hide();
                p.animate({height: 19}, 300, 'easeOutExpo');
                p.addClass('closed');

                $.cookie(p.attr('id'), '0', core.map.options.cookie_options);
            };
        });

        $('.map_container .side_block').each(function(){
            if($.cookie($(this).attr('id')) === '1'){
                $(this).removeClass('closed');
                $(this).css({height: 140});
            }else{
                $(this).addClass('closed');
                $(this).css({height: 19});
            };
        });

        $('#fleets_menu li a').live('click', function(){
            core.map.selectFleet($(this));
        });

        /*$('#view_settings').live('click', function(){
            core.modal.show(core.map.getVeiwSettingsContent());
        });*/
    },

    getChartData: function(device_id, info_type){
        var device = this.options.devices[this.getDeviceIndexById(device_id)];

        var points = [];

        for(var i = 0, l = device.path.points.length; i < l; i += 1){
            var d = new Date(device.path.points[i].date);
            points.push([d.getTime(), core.utilities.convertKnotsToKms(device.path.points[i].velocity)]);
        };

        return [{
            label: "Скорость",
            data: points,
            xaxis: {
                mode: "time",
                timeformat: "%h:%M:%S"
            }
        }];
    },

    showCharts: function(){
        var content =   '<div class="tabbable tabs-right">' +
                            '<ul class="nav nav-tabs">' +
                            '</ul>' +
                            '<div class="tab-content">' +
                                '<div id="chart1"></div>' +
                                '<div id="chart2"></div>' +
                                '<div id="chart3"></div>' +
                                '<div id="chart4"></div>' +
                            '</div>' +
                        '</div>';

        core.modal.show({
            header: 'График',
            content: content,
            width: 700,
            action: function(){
                //alert('zzz')
            }
        });

        $('#chart1').css({
            height: 350,
            width: '100%'
        });

        var plot = $.plot(
            $("#chart1"),
            this.getChartData(this.options.current_device_id)
        );
    },

    setSelectedFleet: function(){
        if(this.options.fleet_id == 'all' || !this.options.fleet_id){
            $('#fleet_name_info').html('Все');
        }else{
            $('#fleet_name_info').html($('ul#fleets_menu li a[fleet_id="'+$.cookie('fleet_id')+'"]').html());
        };
    },

    selectFleet: function(o){
        $('#fleet_name_info').html(o.html());
        $.cookie('fleet_id', o.attr('fleet_id'), this.options.cookie_options);
        document.location.reload();
    },

    addPointToCurrentPath: function(point){
        if(this.options.current_device_id != 'all' && this.options.devices[this.getDeviceIndexById(this.options.current_device_id)]){
            var cd = this.options.devices[this.getDeviceIndexById(this.options.current_device_id)];

            if(point && cd.current_position_marker.point.id != point.id){
                var latLng = new google.maps.LatLng(
                    point.lat,
                    point.lng
                );

                cd.current_position_marker.setPosition(latLng);
                //cd.current_position_marker.map.panTo(latLng); //TODO: Убрать потом!
                cd.current_position_marker.setIcon(this.getHeadingIcon(point.bb).image);

                if(cd.path.polyline){
                    var path = cd.path.polyline.getPath();
                    path.push(latLng);
                };

                cd.current_position_marker.point = point;
            };
        };
    },

    renewCurrentDeviceData: function(data){
        var device = this.options.devices[this.getDeviceIndexById(this.options.current_device_id)];

        for(var i = 0, l = data.length; i < l; i++){
            if(data[i].id == device.id){
                var d = data[i];
            };
        };

        if(d){
            $.extend(device, d);
        };

        this.addPointToCurrentPath(device.point);

        if(device.path && device.path.statistics){
            $('#registered_data').html(this.getDeviceDataHtml(device));
        };

        $('#registered_info').html(this.getDeviceInfoHtml(device));

        $('#position_time_gone').text(
            core.utilities.dateRange($('#position_time_gone').data('time_from'), new Date())
        );

        $('#status_time_gone').text(
            core.utilities.dateRange($('#status_time_gone').data('time_from'), new Date())
        );
    },

    renewAllDevicesData: function(data){
        for(var i = 0, l = this.options.devices.length; i < l; i++){
            if((data[i].point && this.options.devices[i].point) && data[i].point.id != this.options.devices[i].point.id){
                this.options.devices[i].current_position_marker.setPosition(
                    new google.maps.LatLng(
                        data[i].point.lat,
                        data[i].point.lng
                    )
                );

                this.options.devices[i].point = data[i].point;
            };
        };
    },

    renewDataReq: function(){
        this.renew_data_req = $.ajax({
            url: '/control/map/?ajax',
            dataType: 'json',
            type: 'get',
            //cache: false,
            data: {
                action: 'getRenewedData'
            },
            beforeSend: function(){
                if(this.renew_data_req){
                    this.renew_data_req.abort();
                };

                core.loading.showTopIndicator();
            },
            success: function(data){
                core.loading.hideTopIndicator();

                if(core.map.options.current_device_id == 'all'){
                    core.map.renewAllDevicesData(data);
                }else{
                    core.map.renewCurrentDeviceData(data);
                };
            }
        });
    },

    init: function(){
        core.ticker.delay = 2000;

        core.ticker.addIntervalMethod(function(){
            core.map.renewDataReq();
        });

        if(!$.cookie('fleet_id')){
            $.cookie('fleet_id', 'all', this.options.cookie_options);
        };

        if(!$.cookie('car_id')){
            $.cookie('car_id', 'all', this.options.cookie_options);
        };

        this.options.fleet_id = $.cookie('fleet_id');

        this.setSelectedFleet();
        this.setMapsPrototypes();
        this.loadOptions();
        this.binds();
    }
};

//todo: Нужно сделать так, чтобы при клике по тачке на карте все осталось как есть, а вот при клике в меню - загружалась последняя зарегистрированная точка и автоматом выбиралась дата...