var leaflet_ctrl = {
    current_position_markers_group  : null,
    run_markers_group               : null,
    stop_markers_group              : null,
    max_markers_group               : null,
    path                            : null,
    first_loaded_car_id             : false,
    max_speed_popup_opened          : false,
    path_points_length              : 0,

    icons: {
        heading: function(heading){
            return L.icon({
                iconUrl     : core.map_tools.getHeadingIcon(heading),
                shadowUrl   : '/control/map/img/markers/heading/flat_shadow.png',

                iconSize    : [16, 16], // size of the icon
                shadowSize  : [30, 30], // size of the shadow
                iconAnchor  : [8, 8], // point of the icon which will correspond to marker's location
                shadowAnchor: [15, 12],  // the same for the shadow
                popupAnchor : [0, -8]
            });
        },
        heading_with_info: function(car, point){
            var html =  '<div class="marker-with-info">' +
                            '<div class="icon" style="background: url('+core.map_tools.getHeadingIcon(point.heading)+')"></div>' +
                            '<div class="shadow"></div>' +
                            '<div class="info-block">' +
                                '<i class="arm"></i>' +
                                '<div class="name">'+car.name+'</div>' +
                                '<div class="id">'+core.utilities.drawGId(car.g_id, 'small')+'</div>' +
                            '</div>' +
                        '</div>';
            
            return new L.HtmlIcon({
                html        : html,
                iconSize    : [16, 16], // size of the icon
                iconAnchor  : [8, 8], // point of the icon which will correspond to marker's location
                popupAnchor : [0, -8]
            });
        },
        stop: function(){
            return L.icon({
                iconUrl     : '/control/map/img/markers/waypoint_stop.png',

                iconSize    : [7, 7], // size of the icon
                iconAnchor  : [3, 3], // point of the icon which will correspond to marker's location
                popupAnchor : [0, -4] // point from which the popup should open relative to the iconAnchor
            });
        },
        waypoint: function(){
            return L.icon({
                iconUrl     : '/control/map/img/markers/waypoint.png',

                iconSize    : [7, 7], // size of the icon
                iconAnchor  : [3, 3], // point of the icon which will correspond to marker's location
                popupAnchor : [0, -4] // point from which the popup should open relative to the iconAnchor
            });
        }
    },

    createMap: function(m_options, callback){
        wax.tilejson(
            'http://a.tiles.mapbox.com/v3/ruslanchek.map-5sa7s6em.jsonp',
            function(tilejson){
                var map_instance = new L.Map('map');

                map_instance.addLayer(new wax.leaf.connector(tilejson));
                map_instance.setView(new L.LatLng(m_options.coordinates.lat, m_options.coordinates.lon), m_options.zoom);
                map_instance.addControl(new L.Control.FullScreen());

                var interaction = wax.leaf.interaction(map_instance, tilejson);

                callback(map_instance);
            }
        );
    },

    createCurrentPositionMarker: function(map_instance, data){
        var car = map.cars_list[map.getCarIndexById(data.id)],
            icon;

        if(map.current_car){
            icon = this.icons.heading(data.heading);
        }else{
            icon = this.icons.heading_with_info(car, data);
        };

        var marker = L.marker(
            [data.lat, data.lon], {
                icon: icon,
                id: data.id
            }
        );

        marker.setZIndexOffset(data.id);

        /*var m = new R.Marker(new L.LatLng(data.lat, data.lon), {'fill': '#fff', 'stroke': '#000'});
        map_instance.addLayer(m);*/

        marker.on("mouseover", function() {
            this.setZIndexOffset(1000000);
            $('.leaflet-clickable.leaflet-zoom-animated').css({position: 'absolute'});
        });

        marker.on("mouseout", function() {
            this.setZIndexOffset(this.options.id);
            $('.leaflet-clickable.leaflet-zoom-animated').css({position: 'absolute'});
        });

        marker.on('click', function(){
            this.bindPopup(map.getCurrentPositionPopupHtml(this.options.id));
            this.openPopup();
        });

        car.cp_marker       = marker;
        car.last_point_id   = data.point_id;
        car.last_point      = {
            altitude: data.altitude,
            date    : data.date,
            heading : data.heading,
            id      : data.point_id,
            lat     : data.lat,
            lon     : data.lon,
            speed   : data.speed
        };
        car.last_point_date = data.last_point_date;
        car.last_update     = data.last_update;

        return marker;
    },

    drawCurrentPositionMarkersGroup: function(map_instance, data){
        if(this.current_position_markers_group){
            this.current_position_markers_group.clearLayers();
        };

        if(this.path){
            this.removeAllThePath(map_instance, false);
        };

        if(data){
            var markers = [];

            for(var i = 0, l = data.length; i < l; i++){
                if(data[i].lat && data[i].lon){
                    markers.push(this.createCurrentPositionMarker(map_instance, data[i]));
                };
            };

            if(markers.length > 0){
                this.current_position_markers_group = L.layerGroup(markers).addTo(map_instance);
                this.focus(map_instance);
                map.unsetNoPointsInfo();
            }else{
                map.setNoPointsInfo();
                map_instance.setView(new L.LatLng(map.m_options.coordinates.lat, map.m_options.coordinates.lon), map.m_options.zoom);
            };
        };
    },

    updateCurrentPositionMarker: function(marker, data){
        var car = map.cars_list[map.getCarIndexById(data.id)];

        car.last_point_date = data.last_point_date;
        car.last_update     = data.last_update;

        if(car.last_point_id != data.point_id){
            car.last_point_id   = data.point_id;

            marker.setLatLng(new L.LatLng(data.lat, data.lon));
            marker.setIcon(this.icons.heading(data.heading));
            marker.update();

            if(map.current_car && map.show_car_path){
                //Если у текущей тачки нет ни одной точки пути,
                // то создаем точку, чтобы отрисовать путь
                if(!map.current_car.path_points){
                    map.current_car.path_points = [];
                };

                if( map.current_car.path_points &&
                    map.current_car.path_points[map.current_car.path_points.length-1] &&
                    map.current_car.path_points[map.current_car.path_points.length-1].id != data.point_id
                ){
                    map.current_car.path_points.push({
                        altitude: data.altitude,
                        date    : data.date,
                        heading : data.heading,
                        id      : data.point_id,
                        lat     : data.lat,
                        lon     : data.lon,
                        speed   : data.speed
                    });
                };

                this.drawAllThePath(map.map, data.id);
            };
        };
    },

    changeCurrentPositionMarkersData: function(map_instance, data, options){
        for(var i = 0, l = data.length; i < l; i++){
            if(data[i].lat && data[i].lon){
                var car = map.cars_list[map.getCarIndexById(data[i].id)];

                console.log(car)

                //Если тачка уже имеет маркер текущего положения,
                // то обновляем положение
                if(car && car.cp_marker){
                    console.log('update')
                    this.updateCurrentPositionMarker(car.cp_marker, data[i], options);

                //Если нет, то создаем маркер текущего положения.
                // Это нужно тогда, когда машина выбрана,
                // а данных в базе еще нет, вдруг трекер отправляет точку,
                // и машина появляется на карте.
                }else{
                    console.log('create')

                    this.createCurrentPositionMarker(map_instance, data[i]);
                };
            };
        };
    },

    createPathMarker: function(map_instance, car, point, type){
        switch(type){
            case 'start' : {
                var marker = L.marker(
                    [point.lat, point.lon], {
                        icon: this.icons.stop(),
                        id: point.id,
                        car_id: car.id
                    }
                );

                marker.on("mouseover", function() {
                    this.setZIndexOffset(300000 + car.id + 10);
                });

                marker.on("mouseout", function() {
                    this.setZIndexOffset(1);
                });

                marker.on('click', function(){
                    this.bindPopup(
                        '<div class="tooltip-content"><h3>Начальное положение</h3>'+
                        core.utilities.humanizeDate(point.date, 'MYSQLTIME') +
                        '</div>'
                    );
                    this.openPopup();
                });
            }; break;

            case 'stop' : {
                var marker = L.marker(
                    [point.lat, point.lon], {
                        icon: this.icons.stop(),
                        id: point.id,
                        car_id: car.id
                    }
                );

                marker.on("mouseover", function() {
                    this.setZIndexOffset(300000 + car.id + 10);
                });

                marker.on("mouseout", function() {
                    this.setZIndexOffset(1);
                });

                marker.on('click', function(){
                    this.bindPopup(
                        '<div class="tooltip-content"><h3>Остановка</h3>'+
                        core.utilities.humanizeDate(point.date, 'MYSQLTIME') +
                        '</div>'
                    );
                    this.openPopup();
                });
            }; break;

            case 'run' : {
                var marker = L.marker(
                    [point.lat, point.lon], {
                        icon: this.icons.waypoint(),
                        id: point.id,
                        car_id: car.id
                    }
                );

                marker.on("mouseover", function() {
                    this.setZIndexOffset(300000 + car.id + 10);
                });

                marker.on("mouseout", function() {
                    this.setZIndexOffset(1);
                });

                marker.on('click', function(){
                    this.bindPopup('run');
                    this.openPopup();
                });
            }; break;

            case 'max_speed' : {
                var marker = L.marker(
                    [point.lat, point.lon], {
                        icon: this.icons.waypoint(),
                        id: point.id,
                        car_id: car.id
                    }
                );

                marker.on("mouseover", function() {
                    this.setZIndexOffset(300000 + car.id + 10);
                });

                marker.on("mouseout", function() {
                    this.setZIndexOffset(1);
                });

                marker.on('click', function(){
                    this.bindPopup(
                        '<div class="tooltip-content"><h3>Максимальная скорость &mdash; ' + core.utilities.convertKnotsToKms(point.speed) + ' км/ч</h3>'+
                        core.utilities.humanizeDate(point.date, 'MYSQLTIME') +
                        '</div>'
                    );
                    map.m_ctrl.max_speed_popup_opened = this.openPopup();
                });
            }; break;
        };

        if(marker){
            return marker;
        };
    },

    drawAllThePath: function(map_instance, car_id){
        var path_points = [],
            stop_markers = [],
            run_markers = [],
            car = map.cars_list[map.getCarIndexById(car_id)];

        if(car && car.path_points){
            if(car.path_points.length > this.path_points_length || !this.path){
                //Запоминаем количество путевых точек
                this.path_points_length = car.path_points.length;
            }else{

                //Если количество новых точек не больше предыдущего,
                // не рисуем путь заново
                return false;
            };

            //Если путевые маркеры уже отрисованы, то удаляем их
            this.removeAllThePath(map_instance);
        };

        if(car && car.path_points){
            car.stop_points             = 0;

            var max_speed               = 0,
                max_speed_marker        = null;

            for(var i = 0, l = car.path_points.length; i < l; i++){
                //Добавляем координаты для следующей точки отрисовки путевой линии
                path_points.push(new L.latLng(car.path_points[i].lat, car.path_points[i].lon));

                //Объявляем переменные маркера и его типа (по умолчанию - run, движение)
                var marker,
                    type = 'run';

                //Если точка не последняя, создаем маркер
                // (иначе будет рисоваться еще и маркер поверх маркера текущего положения)
                if(i < car.path_points.length-1){
                    //Приводим скорость к плавающему типу
                    car.path_points[i].speed = parseFloat(car.path_points[i].speed);

                    //Если скорость 0, добавляем +1 счетчику остановок
                    // и переопределяем тип - stop, остановка
                    if(car.path_points[i].speed <= 0){
                        car.stop_points++;
                        type = 'stop';
                    };

                    if(i == 0){
                        type = 'start';
                    };

                    //Создаем маркер-объект
                    marker = this.createPathMarker(map_instance, car, car.path_points[i], type);

                    //Если создался маркер id точки отличается от id точки текущего положения, добавляем маркер в массив
                    if(marker && car.last_point_id != car.path_points[i].id){
                        if(type == 'stop' || type == 'start'){
                            stop_markers.push(marker);
                        }else{
                            //run_markers.push(marker);
                        };
                    };
                };

                //Переопределяем переменные максимальной скорости и маркера максимальной скорости
                if(car.path_points[i] && car.path_points[i].speed && car.path_points[i].speed > max_speed){
                    max_speed           = car.path_points[i].speed;
                    max_speed_marker    = this.createPathMarker(map_instance, car, car.path_points[i], 'max_speed');
                };
            };

            if(!car.max_speed_marker){
                car.max_speed_marker = max_speed_marker;
            }else{
                car.max_speed_marker.setLatLng(max_speed_marker.getLatLng());
            };

            car.max_speed = max_speed;

            this.drawMaxSpeedMarker(map_instance, car);

            if(stop_markers.length > 0){
                this.stop_markers_group = L.layerGroup(stop_markers).addTo(map_instance);
            };

            if(run_markers.length > 0){
                this.run_markers_group = L.layerGroup(run_markers).addTo(map_instance);
            };

            //Если путь уже отрисован, то удаляем его
            if(this.path){
                map_instance.removeLayer(this.path);
            };

            //Рисуем путь
            if(path_points && path_points.length > 0){
                this.path = L.polyline(path_points, {
                    color: car.color,
                    smoothFactor: 2,
                    weight: 3,
                    opacity: 0.5
                    //dashArray: '1, 5'
                });

                if(this.path){
                    this.path.addTo(map_instance)
                };

                car.path_length = this.path.length_in_meters();
            };
        };

        //Ставим флаг, чтобы фокусировка роизошла только
        // при смене авто, а не каждое обновление пути
        if(this.first_loaded_car_id != car_id){
            this.focus(map_instance);
            this.first_loaded_car_id = car_id;
        };
    },

    removeAllThePath: function(map_instance){
        if(this.path){
            map_instance.removeLayer(this.path);
        };

        //Если путевые маркеры уже отрисованы, то удаляем их
        /*if(this.run_markers_group){
            this.run_markers_group.clearLayers();
        };*/

        if(this.stop_markers_group){
            this.stop_markers_group.clearLayers();
        };

        this.path_points_length = 0;
    },

    removeAllCurrentPositionMarkers: function(map_instance){
        for(var i = 0, l = map.cars_list.length; i < l; i++){
            if(map.cars_list[i].cp_marker){
                map_instance.removeLayer(map.cars_list[i].cp_marker);
            };
        };
    },

    focus: function(map_instance){
        if(map.current_car && map.show_car_path && this.path){
            map_instance.fitBounds(this.path.getBounds());
        }else{
            if(this.current_position_markers_group){
                var bounds = [];

                this.current_position_markers_group.eachLayer(function(marker){
                    bounds.push(marker.getLatLng());
                });

                map_instance.fitBounds(bounds);
            };
        };
    },

    getCenter: function(map_instance){
        return map_instance.getCenter();
    },

    panTo: function(map_instance, coordinates){
        map_instance.panTo(coordinates);
    },

    centering: function(map_instance){
        map_instance.panTo(map_instance.getCenter());
    },

    drawMaxSpeedMarker: function(map_instance, car){
        if(!this.max_speed_marker){
            this.removeMaxSpeedMarker();
            this.max_markers_group = L.layerGroup([car.max_speed_marker]).addTo(map_instance);
            this.max_speed_marker = true;
        }else{
            car.max_speed_marker.update();
        };
    },

    removeMaxSpeedMarker: function(){
        if(this.max_markers_group){
            this.max_markers_group.clearLayers();
            this.max_markers_group = false;
        };

        this.max_speed_marker = false;
    },

    topSpeedMarker: function(){
        if(map.current_car && map.current_car.max_speed_marker){
            map.current_car.max_speed_marker.fireEvent('click');
            map.map.panTo(map.current_car.max_speed_marker.getLatLng());
            map.map.setZoom(13);
        };
    }
};

var data_ctrl = {
    error: function(){
        $.meow({
            title   : 'Ошибка',
            message : 'Внутренняя ошибка сервиса',
            duration: 12000
        });
    },

    getCarPath: function(car_id, last_point_id, callback){
        this.loading_process = $.ajax({
            url : '/control/map/?ajax',
            data : {
                action          : 'getPoints',
                date            : map.date,
                device_id       : car_id,
                last_point_id   : (last_point_id) ? last_point_id : '0'
            },
            dataType : 'json',
            type : 'get',
            beforeSend: function(){
                if(this.loading_process){
                    this.loading_process.abort();
                    core.loading.unsetGlobalLoading();
                };

                core.loading.setGlobalLoading();
            },
            success: function(data){
                core.loading.unsetGlobalLoading();
                callback(data);
            },
            error: function(){
                core.loading.unsetGlobalLoading();
            }
        });
    },

    //Загружаем данные о группах и тачках с сервера
    getUserFleetsAndDevices: function(callback){
        this.loading_process = $.ajax({
            url : '/control/map/?ajax',
            data : {
                action  : 'getUserFleetsAndDevices',
                date    : map.date
            },
            dataType : 'json',
            type : 'get',
            beforeSend: function(){
                if(this.loading_process){
                    this.loading_process.abort();
                    core.loading.unsetGlobalLoading();
                };

                core.loading.setGlobalLoading();
            },
            success: function(data){
                core.loading.unsetGlobalLoading();
                callback(data);
            },
            error: function(){
                core.loading.unsetGlobalLoading();
            }
        });
    },

    //Загружаем динамические данные тачек (координаты, скорость, HDOP и пр.)
    getDynamicCarsData: function(cars, options, callback){
        this.loading_process = $.ajax({
            url : '/control/map/?ajax&action=getDynamicDevicesData&date='+map.date,
            data : {
                cars    : JSON.stringify(cars)
            },
            dataType : 'json',
            type : 'post',
            beforeSend: function(){
                //Если запрос был на обновление данных, а не на первечную загрузку -
                // отключем на время загрузки данных автообновление,
                // чтобы не было ситуации, когда маркеров на карте нет,
                // а функция обновления запускается
                if(!options.renew){
                    map.auto_renew = false;
                };

                if(this.loading_process){
                    this.loading_process.abort();
                    core.loading.unsetGlobalLoading();
                };

                //Не показываем глобал лоадинг, если запрос был на обновление данных
                if(!options.renew){
                    core.loading.setGlobalLoading();
                };
            },
            success: function(data){
                //Если запрос был на обновление данных, а не на первечную загрузку -
                // включаем автообновление, если оно, конечно не отключено в куках
                if(!options.renew && $.cookie('auto-renew') != '0'){
                    map.auto_renew = true;
                };

                if(!options.renew){
                    core.loading.unsetGlobalLoading();
                };

                callback(data);
            },
            error: function(){
                if(!options.renew && $.cookie('auto-renew') != '0'){
                    map.auto_renew = true;
                };

                if(!options.renew){
                    core.loading.unsetGlobalLoading();
                };
            }
        });
    }
};

var map = {
    m_ctrl          : null,
    map             : null,
    date            : null,

    initialized     : false,

    current_fleet   : null,
    current_car     : null,

    fleets_list     : [],
    cars_list       : [],
    cars_in_fleet   : 0,

    auto_renew      : true,
    auto_focus      : true,
    show_car_path   : false,

    m_options: {
        zoom: 4,
        coordinates: {
            lat: 55,
            lon: 35
        },
        minHeight: 250,
        height: 400
    },

    hash: {},

    prepareMap: function(callback){
        if($.cookie('map-height') && $.cookie('map-height') > this.m_options.minHeight){
            $('#map, .map-container').css({height: parseInt($.cookie('map-height'))});
        }else{
            $('#map, .map-container').css({height: this.m_options.height});
        };

        var center;

        this.m_ctrl = leaflet_ctrl;
        this.m_ctrl.createMap(this.m_options, callback);

        $('.map-container').resizable({
            handles: 's',
            minHeight: this.m_options.minHeight + 1,
            resize: function(event, ui){
                $('#map').css({
                    height: ui.size.height + 2,
                    width:  ui.size.width - 2
                });

                if(map.map){
                    map.map.invalidateSize();
                };

                $.cookie('map-height', ui.size.height, core.options.cookie_options);
            }
        });

        $(window).on('resize', function(){
            $('#map').css({
                width:  $('.map-container').width() - 2
            });

            if(map.map){
                map.map.invalidateSize();
            };
        });
    },

    createCarsSelect: function(fleet_id){
        //Создаем селект тачек
        var exclude = null;

        if(fleet_id !='all' && fleet_id != ''){
            exclude = {
                param_name      : 'fleet_id',
                param_value     : fleet_id
            };
        };

        core.ui.createSelect('#cars-menu', {
            id          : 'cars-menu-select',
            default_opt : {val: 'all', name: 'Все машины'},
            default     : this.hash.car,
            key_name    : 'id',
            value_name  : 'name',
            exclude     : exclude,
            items       : this.cars_list,
            onChange    : function(val){
                var tm_hash = '';

                if(core.ui.getHashData() && core.ui.getHashData().timemachine){
                    tm_hash = '&timemachine='+core.ui.getHashData().timemachine;
                };

                document.location.hash = '#fleet='+fleet_id+'&car='+val+tm_hash;
            }
        });
    },

    createFleetsSelect: function(){
        //Создаем селект групп
        core.ui.createSelect('#fleets-menu', {
            id          : 'fleets-menu-select',
            default_opt : {val: 'all', name: 'Все группы'},
            default     : this.hash.fleet,
            key_name    : 'id',
            value_name  : 'name',
            items       : this.fleets_list,
            onChange    : function(val){
                var tm_hash = '';

                if(core.ui.getHashData() && core.ui.getHashData().timemachine){
                    tm_hash = '&timemachine='+core.ui.getHashData().timemachine;
                };

                document.location.hash = '#fleet='+val+tm_hash;
                map.createCarsSelect(val);
            }
        });
    },

    setCurrentFleetAndCar: function(){
        var fleet = $.grep(this.fleets_list, function(e){
                return e.id == map.hash.fleet;
            }),
            car   = $.grep(this.cars_list, function(e){
                return e.id == map.hash.car;
            });

        if(fleet){
            this.current_fleet = fleet[0];
        }else{
            this.current_fleet = null;
        };

        if(car){
            this.current_car = car[0];
        }else{
            this.current_fleet = null;
        };
    },

    setHeaderTexts: function(){
        var html = '';

        if(this.current_fleet){
            html += ' / ' + this.current_fleet.name;
        };

        if(this.current_car){
            html += ' / ' + this.current_car.name + ' ' + core.utilities.drawGId(this.current_car.g_id, 'small');
        }else{
            html += ' <span class="badge">'+this.cars_in_fleet+' ' + core.utilities.plural(this.cars_in_fleet, 'машина', 'машины', 'машин') + '</span>';
        };

        $('#current-fleet-and-car').html(html);
    },

    renewOptions: function(){
        //Читаем параметры из адресной строки (хеш)
        var new_hash = core.ui.getHashData();

        if(new_hash){
            if(!new_hash.fleet){
                new_hash.fleet = 'all';
            };

            if(!new_hash.car){
                new_hash.car = 'all';
            };

            if(!new_hash.timemachine){
                new_hash.timemachine = this.date;
            }else{
                if(new_hash.timemachine != this.hash.timemachine){
                    this.changeDate(core.utilities.timestampToDateYearLast(new_hash.timemachine));
                };
            };

            $.extend(this.hash, new_hash);
        }else{
            this.hash = {
                fleet: 'all',
                car: 'all',
                timemachine:this.date
            };
        };

        this.createTimeMachine();

        //Создаем селекты
        this.createFleetsSelect();
        this.createCarsSelect(this.hash.fleet);

        //Находим в массиве тукущую тачку и группу и сохраняем
        this.setCurrentFleetAndCar();

        //Считаем количество машин всего и в текущей группе
        if(map.current_fleet && map.current_fleet.id > 0){
            this.cars_in_fleet = $.grep(this.cars_list, function(e){return e.fleet_id == map.current_fleet.id;}).length;
        }else{
            this.cars_in_fleet = this.cars_list.length;
        };

        //Ставим хедер
        this.setHeaderTexts();

        map.m_ctrl.removeMaxSpeedMarker();

        //Рисуем тачки на карте
        this.drawCars({renew: false});
    },

    addParamsToCars: function(data){
        for(var i = 0, l = data.length; i < l; i++){
            var car;
            if(car = this.cars_list[this.getCarIndexById(data[i].id)]){
                car.csq       = data[i].csq;
                car.hdop      = data[i].hdop;
                car.speed     = data[i].speed;
                car.params    = $.parseJSON(data[i].params);
            };
        };
    },

    drawDynamicCarsData: function(data, options){
        //Рисуем тачки на карте из полученного массива (последняя точка за сегодня)
        if(data.length > 0){
            if(options.renew === true){
                this.m_ctrl.changeCurrentPositionMarkersData(this.map, data, options);
            }else{
                this.m_ctrl.drawCurrentPositionMarkersGroup(this.map, data);
            };

            this.addParamsToCars(data);

            this.drawCarPath(false);
        };
    },

    drawCars: function(options){
        //Находим все тачки, соответствующие выбранным опциям (группа/тачка)
        if(this.current_car && this.current_car.id > 0){
            var cars = $.grep(this.cars_list, function(e){return e.id == map.current_car.id;});
        }else if(this.current_fleet && this.current_fleet.id > 0){
            var cars = $.grep(this.cars_list, function(e){return e.fleet_id == map.current_fleet.id;});
        }else{
            var cars = this.cars_list;
        };

        //Готовим массив с ID тачек
        var cars_ids = [];

        for(var i = 0, l = cars.length; i < l; i++){
            cars_ids.push(cars[i].id);
        };

        //Если набралась хотябы одна тачка - грузим динамические данные
        if(cars_ids.length > 0){
            data_ctrl.getDynamicCarsData(cars_ids, options, function(data){
                //Запускаем функцию отрисовки динамических данных о тачке или группе тачек
                map.drawDynamicCarsData(data, options);
                map.drawBottomPanels();
                map.initialized = true;

                if(!options.renew || options.renew && map.auto_focus){
                    map.m_ctrl.focus(map.map);
                };
            });
        };
    },

    renewIntervalPool: function(){
        if(this.auto_renew === true){
            map.drawCars({renew: true});
        };
    },

    prepareDFandControls: function(){
        //Грузим группы и тачки
        data_ctrl.getUserFleetsAndDevices(function(data){
            //Сохраняем принятые данные
            map.fleets_list = data.fleets;
            map.cars_list   = data.devices;

            map.renewOptions();
            map.bindControls();

            core.ticker.addIntervalMethod(function(){
                map.renewIntervalPool();
                map.drawBottomPanels();
            });
        });
    },

    //Проверяем на наличие отключенного автообновления в куках
    getCarIndexById: function(id){
        if(this.cars_list){
            for(var i = 0, l = this.cars_list.length; i < l; i++){
                if(this.cars_list[i].id == id){
                    return i;
                };
            };
        };
    },

    //HTML-код для попапа текущей отметки
    getCurrentPositionPopupHtml: function(car_id){
        var car = $.grep(this.cars_list, function(e){return e.id == car_id;})[0],
            html = '<div class="tooltip-content">';

        html += '<h3>Текущее положение</h3>';
        html += core.utilities.humanizeDate(car.last_point_date, 'MYSQLTIME') + '<br>';
        html += '<table>';
            html += '<tr><th>Скорость:</th><td>'+ core.utilities.convertKnotsToKms(car.last_point.speed) + ' км/ч</td></tr>';
            html += '<tr><th>Высота:</th><td>'+ car.last_point.altitude + ' м</td></tr>';
            html += '<tr><th>Координаты Ш/Д:</th><td>'+ car.last_point.lat + '&deg; / ' + car.last_point.lon + '&deg;</td></tr>';
        html += '</table>';

        if(!this.current_car){
            var h = core.ui.getHashData(), hash = '';

            if(h && h.fleet){
                hash += '#fleet='+h.fleet+'&car='+car_id;
            }else{
                hash += '#car='+car_id;
            };

            if(h && h.timemachine){
                hash += '&timemachine=' + h.timemachine;
            };

            html += '<a href="'+hash+'" class="btn btn-small">Выбрать эту машину</a>';
        };

        html += '</div>';

        return html;
    },

    setNoPointsInfo: function(){
        $('.map-container .map-notice').remove();

        var message;

        if(this.current_car){
            if(this.current_car.last_point_date != null){
                message =   '<p>На&nbsp;<b>'+core.utilities.humanizeDate(this.date, 'COMMON')+'</b> ' +
                            'не&nbsp;зарегистрированно ни&nbsp;одной отметки для&nbsp;машины <b>&laquo;'+this.current_car.name+'&raquo;</b>.</p>' +
                            '<p>Последняя отметка была зарегистрированна&nbsp;<b>'+core.utilities.humanizeDate(this.current_car.last_point_date, 'MYSQL')+'</b>.</p>';
            }else{
                message =  '<p>Для&nbsp;машины&nbsp;<b>&laquo;'+this.current_car.name+'&raquo;</b> нет ни одной отметки.</p>';
            };
        }else if(!this.current_car && this.current_fleet){
            message =  '<p>На&nbsp;<b>'+core.utilities.humanizeDate(this.date, 'COMMON')+'</b> ' +
                       'не&nbsp;зарегистрированно ни&nbsp;одной отметки, ни&nbsp;для&nbsp;одной&nbsp;машины в группе &laquo;'+this.current_fleet.name+'&raquo;.</p>';
        }else{
            message =  '<p>На&nbsp;<b>'+core.utilities.humanizeDate(this.date, 'COMMON')+'</b> ' +
                       'не&nbsp;зарегистрированно ни&nbsp;одной отметки, ни&nbsp;для&nbsp;одной&nbsp;машины.</p>';
        };

        message += '<a id="hide-map-notice" href="javascript:void(0)" class="btn">Закрыть</a>';

        var $mn = $('<div/>').addClass('map-notice').html(message);

        $('.map-container').append($mn);

        $('.map-container .map-notice').css({
            marginTop: -$('.map-container .map-notice').height() + 40 / 2
        });

        $('#focus').fadeOut(150);
    },

    unsetNoPointsInfo: function(){
        $('#focus').fadeIn(150);

        $('.map-container .map-notice').fadeOut(150, function(){
            $('.map-container .map-notice').remove();
        });
    },

    toggleCarPath: function(){
        if(!this.show_car_path){
            this.show_car_path = true;
            $.cookie('car-path', '1', core.options.cookie_options);

            //Форсируем загрузку пути, т.к во время отключения
            // автозагрузки могли появится новые точки.
            //this.m_ctrl.first_loaded_car_id = false;
            this.drawCarPath(true);
        }else{
            this.show_car_path = false;
            $.cookie('car-path', '0', core.options.cookie_options);

            this.m_ctrl.removeAllThePath(this.map, false);
            //this.m_ctrl.removeAllCurrentPositionMarkers(this.map);
            //this.m_ctrl.focus(this.map);
        };

        this.drawButtons();
    },

    toggleAutoFocus: function(){
        if(!this.auto_focus){
            this.auto_focus = true;
            $.cookie('auto-focus', '1', core.options.cookie_options);
        }else{
            this.auto_focus = false;
            $.cookie('auto-focus', '0', core.options.cookie_options);
        };

        this.drawButtons();
    },

    toggleAutoRenew: function(){
        if(!this.auto_renew){
            this.auto_renew = true;
            $.cookie('auto-renew', '1', core.options.cookie_options);

            //Форсируем загрузку пути, т.к во время отключения
            // автозагрузки могли появится новые точки.
            this.drawCarPath(true);
        }else{
            this.auto_renew = false;
            $.cookie('auto-renew', '0', core.options.cookie_options);
        };

        this.drawButtons();
    },

    drawButtons: function(){
        if(this.auto_renew){
            $('#auto-renew').attr('class', 'btn toggler toggler-on').html('Авто<i></i>');
        }else{
            $('#auto-renew').attr('class', 'btn toggler toggler-off').html('Авто<i></i>');
        };

        if(this.show_car_path){
            $('#show-path').attr('class', 'btn toggler toggler-on').html('Путь<i></i>');
        }else{
            $('#show-path').attr('class', 'btn toggler toggler-off').html('Путь<i></i>');
        };

        if(this.auto_focus){
            $('#auto-focus').attr('class', 'btn-part-left toggler toggler-on').html('&nbsp;<i></i>');
        }else{
            $('#auto-focus').attr('class', 'btn-part-left toggler toggler-off').html('&nbsp;<i></i>');
        };
    },

    createTimeMachine: function(){
        var html = '',
            i = 30,
            date = new Date(),
            hash = '',
            h = core.ui.getHashData(),
            current;

            if(h && h.fleet){
                hash += 'fleet='+h.fleet;
            };

            if(h && h.car){
                hash += '&car='+h.car;
            };

            hash = '#' + hash;

        if(h && h.timemachine){
            current = h.timemachine;
        }else{
            current = date.getDate() + '-' + (date.getMonth() + 1)  + '-' + date.getFullYear();
        };

        while(i > 0){
            var hs = '';

            if(hash != '#'){
                hs = hs+'&';
            };

            var date_str = date.getDate() + '-' + (date.getMonth() + 1)  + '-' + date.getFullYear(),
                isactive = (current == date_str) ? ' active' : '';

            html += '<a class="day'+isactive+'" style="left: '+ (3.3333333 * i) +'%" href="' + hash + hs + 'timemachine=' + date_str + '" data-day="'+date_str+'"></a>';

            i--;

            date.setDate(date.getDate() - 1);
        };

        $('#time-machine .days').html(html);

        $('#time-machine .days .day').off('click').on('click', function(e){
            $('#time-machine .days .day').removeClass('active');
            $(this).addClass('active');

            document.location.hash = $(this).attr('href');

            e.preventDefault();
        });

        $('#time-machine .days .day').off('hover').hover(function(e){
            $('#time-machine .days .day').removeClass('hover');
            $(this).addClass('hover');
        }, function(){
            $('#time-machine .days .day').removeClass('hover');
        });
    },

    drawCarPath: function(forced){
        if(this.current_car && this.current_car.cp_marker && this.show_car_path){
            if(!this.current_car.path_points || forced === true){
                data_ctrl.getCarPath(this.current_car.id, false, function(data){
                    map.current_car.path_points = [];
                    map.current_car.path_points = data;

                    if(map.current_car.path_points[map.current_car.path_points.length - 1].point_id != data.point_id){
                        map.current_car.path_points.push(map.current_car.last_point);
                    };

                    map.m_ctrl.drawAllThePath(map.map, map.current_car.id);
                    map.drawBottomPanels();
                    map.m_ctrl.focus(map.map);
                });
            }else{
                if(this.current_car && this.current_car.path_points){
                    if(this.current_car.path_points.length > 0 && this.current_car.last_point){
                        if(!this.current_car.path_points){
                            this.current_car.path_points = [];
                        };

                        if(this.current_car.path_points[this.current_car.path_points.length - 1].point_id != this.current_car.last_point_id.id){
                            this.current_car.path_points.push(this.current_car.last_point);
                        };
                    };
                };

                this.m_ctrl.drawAllThePath(this.map, this.current_car.id);
                this.drawBottomPanels();
            };
        };
    },

    drawBottomPanels: function(){
        var panel1_html = '',
            panel2_html = '',
            panel3_html = '';

        if(this.current_car){
            panel1_html +=  '<h3>Обновления данных</h3>' +
                            '<table>' +
                                '<tr title="'+core.utilities.humanizeDate(this.current_car.last_point_date, 'MYSQLTIME')+'">' +
                                    '<th>Координаты</th>' +
                                    '<td>'+core.utilities.dateRange(this.current_car.last_point_date, new Date())+'</td>' +
                                '</tr>' +

                                '<tr title="'+core.utilities.humanizeDate(this.current_car.last_update, 'MYSQLTIME')+'">' +
                                    '<th>Статус</th>' +
                                    '<td>'+core.utilities.dateRange(this.current_car.last_update, new Date())+'</td>' +
                                '</tr>' +
                            '</table>';

            if(this.current_car.stop_points && this.current_car.max_speed){
                panel2_html +=  '<h3>Метрика</h3>' +
                                '<table>' +
                                    /*'<tr>' +
                                        '<th>Остановок</th>' +
                                        '<td>'+this.current_car.stop_points+'</td>' +
                                    '</tr>' +*/

                                    '<tr>' +
                                        '<th>Макс. скорость</th>' +
                                        '<td><a id="max-speed-marker" class="badge" href="javascript:void(0)">'+core.utilities.convertKnotsToKms(this.current_car.max_speed) + ' км/ч</a></td>' +
                                    '</tr>' +

                                    '<tr>' +
                                        '<th>Пройдено пути</th>' +
                                        '<td>'+ this.current_car.path_length / 1000 + ' км</td>' +
                                    '</tr>' +
                               '</table>';
            };

            if(this.current_car.stop_points && this.current_car.max_speed){
                panel3_html +=  '<h3>Статус трекера</h3>' +
                                '<table>' +
                                    '<tr>' +
                                        '<th>Сигнал GPS</th>' +
                                        '<td>'+core.utilities.getHDOPIndicator(this.current_car.hdop)+'</td>' +
                                    '</tr>' +

                                    '<tr>' +
                                        '<th>Сигнал GSM</th>' +
                                        '<td>'+core.utilities.getCSQIndicator(this.current_car.csq)+'</td>' +
                                    '</tr>' +
                               '</table>';
            };
        };

        if(!panel1_html && !panel2_html && !panel3_html){
            $('.map-bottom-panel').hide();
        }else{
            $('.map-bottom-panel').show();

            $('#bottom-panel-1 .panel-content').html(panel1_html);
            $('#bottom-panel-2 .panel-content').html(panel2_html);
            $('#bottom-panel-3 .panel-content').html(panel3_html);
        }
    },

    setDate: function(date){
        this.date = core.utilities.pad(date.getDate(), 2) + '-' + core.utilities.pad(date.getMonth() + 1, 2) + '-' + date.getFullYear();
    },

    updateAllCarsData: function(){
        //this.m_ctrl.removeAllThePath(this.map);

        if(this.current_car){
            this.current_car.cp_marker = false;
            this.current_car.path_points = false;
            this.current_car.last_point_id = false;
        };

        if(this.cars_list){
            for(var i = 0, l = this.cars_list; i < l; i++){
                this.cars_list[i].cp_marker = false;
                this.cars_list[i].path_points = false;
                this.cars_list[i].last_point_id = false;
            };
        };

        this.drawCars({renew: false});
    },

    changeDate: function(date){
        this.setDate(date);
        this.updateAllCarsData();
    },

    setDateByHash: function(){
        var hash = core.ui.getHashData();

        if(hash && hash.timemachine){
            this.setDate(core.utilities.timestampToDateYearLast(hash.timemachine));
        }else{
            this.setDate(new Date());
        };
    },

    bindControls: function(){
        //Отлеживаем событие изменения хеша
        $(window).on('hashchange', function() {
            map.renewOptions();
            map.setDateByHash();
        });

        $('#focus').live('click', function(){
            map.m_ctrl.focus(map.map);
        });

        $('#hide-map-notice').live('click', function(){
            $('.map-container .map-notice').fadeOut(150, function(){
                $('.map-container .map-notice').remove();
            });
        });

        $('#auto-renew').live('click', function(){
            map.toggleAutoRenew();
        });

        $('#show-path').live('click', function(){
            map.toggleCarPath();
        });

        $('#auto-focus').live('click', function(){
            map.toggleAutoFocus();
        });

        $('#max-speed-marker').live('click', function(){
            map.m_ctrl.topSpeedMarker();
        });
    },

    readOptionsFromCookies: function(){
        //Проверяем на наличие отключенного автообновления в куках
        if($.cookie('auto-renew') == '0'){
            this.auto_renew = false;
        }else{
            this.auto_renew = true;
        };

        if($.cookie('auto-focus') == '1'){
            this.auto_focus = true;
        }else{
            this.auto_focus = false;
        };

        if($.cookie('car-path') == '1'){
            this.show_car_path = true;
        }else{
            this.show_car_path = false;
        };
    },

    init: function(){
        core.ticker.delay = 5000;

        this.setDateByHash();
        this.readOptionsFromCookies();
        this.drawButtons();

        //Готовим карту (контроллер карт может иметь синхронный вызов,
        // поэтому, дальнейшие действия вызываются через коллбэк)
        this.prepareMap(function(map_instance){
            map.map = map_instance;
            map.prepareDFandControls();
        });
    }
};
