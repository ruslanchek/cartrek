'use strict';

var google = google;

core.map = {
    options: {
        current_devece_id: null,
        default_position : {
            lat: 55,
            lng: 38,
            zoom: 5
        },
        marker_styles: {
            waypoint: {
                image: new google.maps.MarkerImage(
                    'markers/waypoint_image.png',
                    new google.maps.Size(7,7),
                    new google.maps.Point(0,0),
                    new google.maps.Point(3,3)
                ),
                shadow: null,
                shape: {
                    coord: [5,0,6,1,6,2,6,3,6,4,6,5,5,6,1,6,0,5,0,4,0,3,0,2,0,1,1,0,5,0],
                    type: 'poly'
                }
            },
            waypoint_stop: {
                image: new google.maps.MarkerImage(
                    'markers/waypoint_image_stop.png',
                    new google.maps.Size(7,7),
                    new google.maps.Point(0,0),
                    new google.maps.Point(3,3)
                ),
                shadow: null,
                shape: {
                    coord: [5,0,6,1,6,2,6,3,6,4,6,5,5,6,1,6,0,5,0,4,0,3,0,2,0,1,1,0,5,0],
                    type: 'poly'
                }
            }
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

    convertDateNMEAtoCOMMON: function(value){
        var d = value.substring(0, 2),
            m = value.substring(2, 4),
            y = value.substring(4, 6);

        return d+'-'+m+'-'+y;
    },

    convertDateMYSQLtoCOMMON: function(value){
        var d = value.substring(8, 10),
            m = value.substring(5, 7),
            y = value.substring(2, 4);

        return d+'-'+m+'-'+y;
    },

    humanizeDate: function(value, type){
        if(!type){
            type = 'NMEA';
        };

        var d, m, y, m_humanized, month_names = [
            'января',
            'февраля',
            'марта',
            'апреля',
            'мая',
            'июня',
            'июля',
            'августа',
            'сентября',
            'октября',
            'ноября',
            'декабря'
        ];

        switch(type){
            case 'NMEA' : {
                d = value.substring(0, 2),
                m = value.substring(2, 4),
                y = value.substring(4, 6);

                return d+' '+month_names[parseInt(m) - 1]+', 20'+y;
            }; break;

            case 'COMMON' : {
                d = value.substring(0, 2),
                m = value.substring(3, 5),
                y = value.substring(6, 11);

                return d+' '+month_names[parseInt(m) - 1]+', '+y;
            }; break;

            case 'MYSQL' : {
                d = value.substring(8, 10),
                m = value.substring(5, 7),
                y = value.substring(0, 4);

                return d+' '+month_names[parseInt(m) - 1]+', '+y;
            }; break;
        };
    },

    humanizeTime: function(value){
        var h = value.substring(11, 13),
            m = value.substring(14, 16),
            s = value.substring(17, 19);

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
            div.style.left = position.x + 'px';
            div.style.top = position.y + 'px';
            div.style.display = 'block';

            this.span_.innerHTML = this.get('text');
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
            core.map.execSettings(core.forms.readDataFormSettingsTable('settings_table'));
            core.modal.hide();
        };

        return options;
    },

    changeDate: function(date){
        this.hideAllDevicesCurrentPositions();
        this.hideAllDevicesInfo();
        $('.current_date').html(this.humanizeDate(date, 'COMMON'));

        this.loadOptions(true);
    },

    createDatepicker: function(){
        $('#datepicker').html('');
        $('#datepicker').datepicker({
            dateFormat      : "dd-mm-yy",
            dayNames        : ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
            dayNamesMin     : ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
            monthNames      : ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
            monthNamesMin   : ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
            minDate         : this.convertDateMYSQLtoCOMMON(this.options.min_date),
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
                        core.loading.unsetLoading('global', false);
                        core.loading.setLoadingWithNotify('global', false, 'Загрузка данных');
                    },
                    success: function(){
                        core.loading.unsetLoading('global', false);
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
            height: $(window).height() - $('#map').offset().top - 40
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

            label.bindTo('position', marker, 'position');
            label.bindTo('text', marker, 'position');
            label.div_.innerHTML =  '<span class="marker_label" id="device_label_'+id+'">' +
                                        '<a href="javascript:void(0)" class="close icon-minus"></a>' +
                                        '<b>'+device.name+'</b><br>' +
                                        '<nobr>'+device.make+' '+device.model+'</nobr><br>' +
                                        '<span class="g_id">'+device.g_id+'</span>' +
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
            $('#car_name_info').html('<b>'+device.name+'</b> &mdash; '+device.make+' '+device.model+' <span class="g_id">'+device.g_id+'</span>');
        }else{
            $('#car_name_info').html('<b>Все машины</b> <span class="badge">'+this.options.devices.length+'</span>');
        };
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

            //Show statistics
            var html =  '<table class="table table-bordered table-condensed">' +
                            '<tr><th class="info_tab_header" colspan="2">Сводка за день</th></tr>' +
                            '<tr>' +
                                '<td>Максимальная скорость</td>' +
                                '<td><a id="max_speed" class="label label-info" href="javascript:void(0)">'+device.path.statistics.max_speed+' км/ч</a></td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>Средняя скорость</td>' +
                                '<td><span id="average_speed" class="label">'+device.path.statistics.average_speed+' км/ч</span></td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>Пройдено пути</td>' +
                                '<td><span id="distance_driven" class="label">'+device.path.statistics.distance+' км</span></td>' +
                            '</tr>' +
                        '</table>';

            $('#registered_data').html(html).fadeIn(150);

            $('#where_is_my_car').fadeIn(100);

            //this.fitToDevicePathBounds();
        }else{
            //Load points and recall this fn
            this.loadDevicePathData(device_id);
        };

        var info_html =     '<table class="table table-bordered table-condensed">' +
                                '<tr><th class="info_tab_header" colspan="2">Текущее состояние</th></tr>' +
                                '<tr>' +
                                    '<td>Последнее обновление</td>' +
                                    '<td><span class="label">' +
                                        this.humanizeDate(device.last_registered_point.date, 'MYSQL')+'<br>'+
                                        this.humanizeTime(device.last_registered_point.date)+'</span>' +
                                    '</td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td>Курс</td>' +
                                    '<td><span class="label" title="112&deg;">Юго-запад</span></td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td>Сигнал GSM</td>' +
                                    '<td><div class="progress progress-success" style="margin-bottom: 0; height: 16px;"><div class="bar" style="width: 75%;"></div></div></td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td>Сигнал GPS</td>' +
                                    '<td><div class="progress progress-warning" style="margin-bottom: 0; height: 16px;"><div class="bar" style="width: 25%;"></div></div></td>' +
                                '</tr>' +
                            '</table>';

        $('#registered_info').html(info_html);
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
                strokeOpacity   : 0.65,
                strokeWeight    : 5,
                clickable       : false,
                visible         : false
            });

            polyline.setMap(map);

            return polyline;
        };
    },

    drawWaypointMarkers: function(points, device, map){
        if(points && points.length > 0){
            var waypoint_markers = new Array();

            for(var i = 1, l = points.length; i < l; i++){
                waypoint_markers.push(this.createWaypointMarker({
                    map         : map,
                    device      : device,
                    point       : points[i],
                    click       : function(marker){
                        core.map.showMarkerData(marker);
                    }
                }));
            };

            return waypoint_markers;
        };
    },

    label: function(opt_options){
        this.setValues(opt_options);

        // Label specific
        var span = this.span_ = document.createElement('span');
        span.className = 'marker_label';

        var div = this.div_ = document.createElement('div');
        div.appendChild(span);
        div.style.cssText = 'position: absolute; display: none';
    },

    createCurrentPositionMarker: function(options){
        if(options.device.point){
            var marker = new google.maps.Marker({
                position    : new google.maps.LatLng(
                    this.convertNMEAtoWGS84(options.device.point.lat),
                    this.convertNMEAtoWGS84(options.device.point.lng)
                ),
                point       : options.device.point,
                map         : options.map,
                title       : options.device.name+' — текущее положение ('+options.device.make+' '+options.device.model+', '+options.device.g_id+')',
                device_id   : options.device.id
            });

            google.maps.event.addListener(marker, 'click', function(){
                options.click(marker);
            });

            return marker;
        };
    },

    createWaypointMarker: function(options){
        var style, title;

        if(options.point.velocity <= 0){
            style = this.options.marker_styles.waypoint_stop;
            title = options.device.name+' — остановка';
        }else{
            style = this.options.marker_styles.waypoint;
            title = options.device.name+' — в пути ('+this.convertKnotsToKms(options.point.velocity)+' км/ч)';
        };

        var marker = new google.maps.Marker({
            position    : new google.maps.LatLng(
                this.convertNMEAtoWGS84(options.point.lat),
                this.convertNMEAtoWGS84(options.point.lng)
            ),
            icon        : style.image,
            shadow      : style.shadow,
            shape       : style.shape,
            point       : options.point,
            map         : options.map,
            title       : title,
            device_id   : options.device.id
        });

        google.maps.event.addListener(marker, 'click', function(){
            options.click(marker);
        });

        return marker;
    },

    showMarkerData: function(marker){
        var device = this.options.devices[this.getDeviceIndexById(marker.device_id)],
            status, status_class, additional = new String();

        if(marker.point.id == device.current_position_marker.point.id){
            status = 'Текущее положение';
            status_class = 'label-info';
            if(this.options.current_devece_id != marker.device_id){
                additional = '<a class="btn btn-info select_car_button" rel="'+marker.device_id+'" href="javascript:void(0)"><i class="icon-share-alt icon-white"></i> Выбрать машину</a>';
            };
        }else{
            if(marker.point.velocity > 0){
                status = 'В пути';
                status_class = 'label-success';
            }else{
                status = 'Остановка';
                status_class = 'label-important';
            };
        };

        var html =  '<p><b>'+device.name+'</b> &mdash; '+device.make+' '+device.model+' <span class="g_id">'+device.g_id+'</span></p>' +
                    '<table class="table table-bordered table-condensed">' +
                        '<tr>' +
                            '<td>Отметка</td>' +
                            '<td><span class="label '+status_class+'">'+status+'</span></td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>Время</td>' +
                            '<td><span class="label">'+this.humanizeTime(marker.point.date)+'</span></td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>Скорость</td>' +
                            '<td><span class="label">'+this.convertKnotsToKms(marker.point.velocity)+' км/ч</span></td>' +
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

        return this.convertKnotsToKms(average_speed/points.length);
    },

    getMaxSpeed: function(markers){
        if(markers){
            var max_speed = 0,
                result = {};

            for(var i = 0, l = markers.length; i < l; i++){
                if(markers[i].point.velocity > max_speed){
                    result.marker = markers[i];
                    max_speed = parseFloat(markers[i].point.velocity);
                };
            };
            result.value = this.convertKnotsToKms(max_speed);

            return result;
        };
    },

    createDevicePathData: function(device_id, points){
        var polyline = this.drawPath(points, core.map.options.devices[core.map.getDeviceIndexById(device_id)], this.map),
            waypoint_markers = this.drawWaypointMarkers(points, core.map.options.devices[core.map.getDeviceIndexById(device_id)], this.map),
            max_speed = this.getMaxSpeed(waypoint_markers);

        this.options.devices[this.getDeviceIndexById(device_id)].max_speed_marker = max_speed.marker;
        this.options.devices[this.getDeviceIndexById(device_id)].path = {
            points          : points,
            polyline        : polyline,
            waypoint_markers: waypoint_markers,
            statistics      : {
                distance        : polyline.inKm(),
                average_speed   : this.getAverageSpeed(points),
                max_speed       : max_speed.value
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
                core.loading.unsetLoading('global', false);
                core.loading.setLoadingWithNotify('global', false, 'Загрузка данных');
            },
            success: function(points){
                setTimeout(function(){
                    core.loading.unsetLoading('global', false);
                }, 200);

                if(points.length > 0){
                    core.map.createDevicePathData(device_id, points);
                };
            },
            error: function(){
                core.loading.unsetLoading('global', false);
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
                action  : 'getOptions'
            },
            dataType : 'json',
            type : 'get',
            beforeSend: function(){
                core.loading.unsetLoading('global', false);
                core.loading.setLoadingWithNotify('global', false, 'Загрузка данных');
            },
            success: function(options){
                core.loading.unsetLoading('global', false);
                core.map.options = $.extend(core.map.options, options);

                if(reinit){
                    core.map.reinitGlobal();
                }else{
                    core.map.initGlobal();
                };
            },
            error: function(){
                core.loading.unsetLoading('global', false);
            }
        });
    },

    focusToMarker: function(marker){
        marker.map.panTo(marker.getPosition());
        google.maps.event.trigger(marker, 'click');
    },

    fitToDevicePathBounds: function(device_id){
        var bounds  = new google.maps.LatLngBounds(),
            device  = this.options.devices[this.getDeviceIndexById(device_id)];

        if(device.path && device.path.waypoint_markers && device.path.waypoint_markers.length > 3){
            for(var i = 0, l = device.path.waypoint_markers.length; i < l; i++){
                bounds.extend(device.path.waypoint_markers[i].getPosition());
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

        if(!$('#where_is_my_car').is(':visible')){
            $('#where_is_my_car').fadeIn(100);
        };

        this.options.current_devece_id = car_id;

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

        this.checkPeriodPoints();
    },

    showMapNotice: function(message){
        var html = '<div class="map_notice">'+message+'</div>';

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

    checkPeriodPoints: function(){
        this.hideMapNotice();

        var no_points = true;

        if($.cookie('car_id') == 'all'){
            for(var i = 0, l = this.options.devices.length; i < l; i++){
                if(this.options.devices[i].current_position_marker){
                    no_points = false;
                };
            };

            if(no_points){
                var html =  '<p>На&nbsp;<b>'+this.humanizeDate(this.options.date, 'MYSQL')+'</b> не&nbsp;зарегистрированно ни&nbsp;одной отметки, ни&nbsp;для&nbsp;одной&nbsp;машины.</p>';

                this.showMapNotice(html);
                $('#where_is_my_car').fadeOut(100);

                this.setMapToDefaultPoint();
            }else{
                $('#where_is_my_car').fadeIn(100);
            };
        }else{
            var device = this.options.devices[this.getDeviceIndexById($.cookie('car_id'))];

            if(!device.current_position_marker){
                var message =   '<p>На&nbsp;выбранный период не&nbsp;зарегистрированно ни&nbsp;одной отметки для&nbsp;машины&nbsp;<b>&laquo;'+device['name']+'&raquo;</b>.</p>' +
                                '<p>Последняя отметка была зарегистрированна&nbsp;<b>'+this.humanizeDate(device.last_registered_point.date, 'MYSQL')+'</b>.</p>';

                this.showMapNotice(message);
                $('#where_is_my_car').fadeOut(100);

                this.setMapToDefaultPoint();
            }else{
                $('#where_is_my_car').fadeIn(100);
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
                                        '<b>'+this.options.devices[i].name+'</b> &mdash; '+
                                        this.options.devices[i].make+' '+this.options.devices[i].model+' ' +
                                        '<span class="g_id">'+this.options.devices[i].g_id+'</span>' +
                                    '</a>' +
                                '</li>';
        };

        $('.current_date').html(this.humanizeDate(this.options.date, 'COMMON'));
        $('#cars_menu').html(cars_menu_html);

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
            if(core.map.options.current_devece_id){
                core.map.focusToMarker(core.map.options.devices[core.map.getDeviceIndexById(core.map.options.current_devece_id)].max_speed_marker);
            };
        });

        $('#where_is_my_car').live('click', function(){
            if(core.map.options.current_devece_id && core.map.options.current_devece_id != 'all'){
                //core.map.focusToMarker(core.map.options.devices[core.map.getDeviceIndexById(core.map.options.current_devece_id)].current_position_marker);
                core.map.fitToDevicePathBounds(core.map.options.current_devece_id);
            }else{
                core.map.fitToAllDevicesMarkersBounds();
            };
        });

        $('#refresh_data').live('click', function(){
            core.map.loadOptions();
        });

        $('#hide_current_car_info').live('click', function(){
            if(core.map.options.current_devece_id > 0){
                core.map.hideDeviceInfo(core.map.options.current_devece_id);
            };
        });

        $('#cars_menu li a').live('click', function(){
            core.map.selectCar($(this).attr('rel'));
        });

        $('a.select_car_button').live('click', function(){
            core.map.selectCar($(this).attr('rel'));
        });


        /*$('#view_settings').live('click', function(){
            core.modal.show(core.map.getVeiwSettingsContent());
        });*/
    },

    init: function(){
        if(!$.cookie('car_id')){
            $.cookie('car_id', 'all', this.options.cookie_options);
        };

        this.setMapsPrototypes();
        this.loadOptions();
        this.binds();
    }
};

//todo: Нужно сделать так, чтобы при клике по тачке на карте все осталось как есть, а вот при клике в меню - загружалась последняя зарегистрированная точка и автоматом выбиралась дата...