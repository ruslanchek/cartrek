var leaflet_ctrl = {
    current_position_markers_group  : null,
    run_markers_group               : null,
    stop_markers_group              : null,
    start_markers                   : null,
    finish_markers_group            : null,
    max_markers_group               : null,
    path                            : null,
    ghost_path                      : null,
    first_loaded_car_id             : false,
    max_speed_popup_opened          : false,
    path_points_length              : 0,

    path_color                      : 'black',
    ghost_path_color                : '#2bd0ff',

    icons: {
        heading: function(heading){
            var html =  '<div class="marker-with-info">' +
                            '<div class="icon" style="background-position: -'+core.map_tools.getHeadingIconSpriteOffset(heading)+'px 0px"></div>' +
                        '</div>';

            return new L.HtmlIcon({
                html        : html,
                iconSize    : [40, 40], // size of the icon
                iconAnchor  : [20, 20], // point of the icon which will correspond to marker's location
                popupAnchor : [0, -20]
            });
        },
        heading_with_info: function(car, point){
            var html =  '<div class="marker-with-info">' +
                            '<div class="icon" style="background-position: -'+core.map_tools.getHeadingIconSpriteOffset(point.heading)+'px 0px"></div>' +
                            '<div class="info-block">' +
                                '<i class="arm"></i>' +
                                '<div class="name">'+car.name+'</div>' +
                                '<div class="id">'+core.utilities.drawGId(car.g_id, 'small')+'</div>' +
                            '</div>' +
                        '</div>';

            return new L.HtmlIcon({
                html        : html,
                iconSize    : [16, 16], // size of the icon
                iconAnchor  : [20, 20], // point of the icon which will correspond to marker's location
                popupAnchor : [0, -20]
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
        core.map_tools.getGeoposition(function(position){
            var lat, lon, zoom;

            if(position){
                lat = position.coords.latitude;
                lon = position.coords.longitude;
                zoom = 15;
            }else{
                lat = m_options.coordinates.lat;
                lon = m_options.coordinates.lon;
                zoom = m_options.zoom;
            };

            var map = new L.Map('map', {
                layers      : core.map_tools.getLayers(),
                center      : new L.LatLng(lat, lon),
                zoom        : zoom
            });

            map.addControl(new L.Control.FullScreen());

            $('.leaflet-control-attribution').html('О наших <a href="/control/about#maps">картах</a>');

            setTimeout(function(){
                $('.leaflet-control-attribution').fadeOut(3000);
            }, 10000);

            callback(map);
        });
    },

    createCurrentPositionMarker: function(map_instance, data){
        if(data){
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
                    id: data.id,
                    zIndexOffset: (data.id * 1 + 10) * 1000
                }
            );

            /* var m = new R.Marker(new L.LatLng(data.lat, data.lon), {'fill': '#fff', 'stroke': '#000'});
            map_instance.addLayer(m); */

            marker.on("mouseover", function() {
                this.setZIndexOffset((data.id * 1 + 11) * 1000);
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
                altitude    : data.altitude,
                date        : data.date,
                heading     : data.heading,
                id          : data.point_id,
                lat         : data.lat,
                lon         : data.lon,
                speed       : data.speed
            };

            car.last_point_date = data.last_point_date;
            car.last_update     = data.last_update;

            return marker;
        };
    },

    removeMarker: function(map_instance, marker){
        map_instance.removeLayer(marker);
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

                core.map_tools.getGeoposition(function(position){
                    var lat, lon, zoom = map.m_options.zoom;

                    if(position !== false){
                        lat     = position.coords.latitude;
                        lon     = position.coords.longitude;
                        zoom    = 15;
                    }else{
                        lat     = map.m_options.coordinates.lat;
                        lon     = map.m_options.coordinates.lon;
                        zoom    = map.m_options.zoom;
                    };

                    map_instance.setView(new L.LatLng(lat, lon), zoom);
                });
            };
        };
    },

    updateCurrentPositionMarker: function(marker, data){
        var car = map.cars_list[map.getCarIndexById(data.id)];

        car.last_point_date = data.last_point_date;
        car.last_update     = data.last_update;

        if(car.last_point_id != data.point_id){
            car.last_point_id   = data.point_id;

            if(data.lat && data.lon){
                marker.setLatLng(new L.LatLng(data.lat, data.lon));
            };

            marker.setIcon(this.icons.heading(data.heading));
            marker.update();

            if(marker._popup){
                marker._popup.setContent(map.getCurrentPositionPopupHtml(data.id));
            };

            if(map.current_car && map.show_car_path){
                // Если у текущей тачки нет ни одной точки пути,
                // то создаем точку, чтобы отрисовать путь
                if(!map.current_car.path_points){
                    map.current_car.path_points = [];
                };

                if( map.current_car.path_points &&
                    map.current_car.path_points[map.current_car.path_points.length-1] &&
                    map.current_car.path_points[map.current_car.path_points.length-1].id != data.point_id
                ){
                    map.current_car.path_points.push({
                        altitude    : data.altitude,
                        date        : data.date,
                        heading     : data.heading,
                        id          : data.point_id,
                        lat         : data.lat,
                        lon         : data.lon,
                        speed       : data.speed
                    });
                };

                this.drawAllThePath(map.map, data.id);
            };
        };
    },

    changeCurrentPositionMarkersData: function(map_instance, data, options){
        if(data){
            for(var i = 0, l = data.length; i < l; i++){
                if(data[i].lat && data[i].lon){
                    var car = map.cars_list[map.getCarIndexById(data[i].id)];

                    // Если тачка уже имеет маркер текущего положения,
                    // то обновляем положение
                    if(car && car.cp_marker){
                        this.updateCurrentPositionMarker(car.cp_marker, data[i], options);

                    // Если нет, то создаем маркер текущего положения.
                    // Это нужно тогда, когда машина выбрана,
                    // а данных в базе еще нет, вдруг трекер отправляет точку,
                    // и машина появляется на карте.
                    }else{
                        this.createCurrentPositionMarker(map_instance, data[i]);
                    };
                }
            };
        };
    },

    createPathMarker: function(map_instance, car, point, type){
        switch(type){
            case 'stop' : {
                var marker = L.marker(
                    [point.lat, point.lon], {
                        icon        : this.icons.stop(),
                        id          : point.id,
                        car_id      : car.id,
                        point_data  : point,
                        zIndexOffset: car.id * 1 + 10
                    }
                );

                marker.on("mouseover", function() {
                    this.setZIndexOffset(car.id * 1 + 11);
                });

                marker.on("mouseout", function() {
                    this.setZIndexOffset(car.id * 1 + 10);
                });

                marker.on('click', function(){
                    this.bindPopup(
                        '<div class="tooltip-content">' +
                            '<h3>Остановка</h3>'+
                            core.utilities.humanizeDate(point.date, 'MYSQLTIME') +
                        '</div>'
                    );
                    this.openPopup();
                });
            }; break;

            case 'start' : {
                var marker = L.marker(
                    [point.lat, point.lon], {
                        icon        : this.icons.waypoint(),
                        id          : point.id,
                        car_id      : car.id,
                        point_data  : point,
                        zIndexOffset: car.id * 1 + 10
                    }
                );

                marker.on("mouseover", function() {
                    this.setZIndexOffset(car.id * 1 + 11);
                });

                marker.on("mouseout", function() {
                    this.setZIndexOffset(car.id * 1 + 10);
                });

                marker.on('click', function(){
                    this.bindPopup(
                        '<div class="tooltip-content">' +
                            '<h3>Начальная точка</h3>'+
                            core.utilities.humanizeDate(point.date, 'MYSQLTIME') +
                        '</div>'
                    );
                    this.openPopup();
                });
            }; break;

            case 'finish' : {
                var marker = L.marker(
                    [point.lat, point.lon], {
                        icon        : this.icons.waypoint(),
                        id          : point.id,
                        car_id      : car.id,
                        point_data  : point,
                        zIndexOffset: car.id * 1 + 10
                    }
                );

                marker.on("mouseover", function() {
                    this.setZIndexOffset(car.id * 1 + 11);
                });

                marker.on("mouseout", function() {
                    this.setZIndexOffset(car.id * 1 + 10);
                });

                marker.on('click', function(){
                    this.bindPopup(
                        '<div class="tooltip-content">' +
                            '<h3>Конечная точка</h3>'+
                            core.utilities.humanizeDate(point.date, 'MYSQLTIME') +
                        '</div>'
                    );
                    this.openPopup();
                });
            }; break;

            case 'run' : {
                var marker = L.marker(
                    [point.lat, point.lon], {
                        icon        : this.icons.waypoint(),
                        id          : point.id,
                        car_id      : car.id,
                        point_data  : point,
                        zIndexOffset: car.id * 1 + 10
                    }
                );

                marker.on("mouseover", function() {
                    this.setZIndexOffset(car.id * 1 + 11);
                });

                marker.on("mouseout", function() {
                    this.setZIndexOffset(car.id * 1 + 10);
                });

                marker.on('click', function(){
                    this.bindPopup('run');
                    this.openPopup();
                });
            }; break;

            case 'max_speed' : {
                var marker = L.marker(
                    [point.lat, point.lon], {
                        icon        : this.icons.waypoint(),
                        id          : point.id,
                        car_id      : car.id,
                        point_data  : point,
                        zIndexOffset: car.id * 1 + 10
                    }
                );

                marker.on("mouseover", function() {
                    this.setZIndexOffset(car.id * 1 + 11);
                });

                marker.on("mouseout", function() {
                    this.setZIndexOffset(car.id * 1 + 10);
                });

                marker.on('click', function(){
                    this.bindPopup(
                        '<div class="tooltip-content">' +
                            '<h3>Максимальная скорость &mdash; ' + core.utilities.convertKnotsToKms(map.current_car.max_speed_marker.options.point_data.speed) + ' км/ч</h3>'+
                            core.utilities.humanizeDate(map.current_car.max_speed_marker.options.point_data.date, 'MYSQLTIME') +
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

    //TODO: Объединить - не нужно плодить методы!!!
    drawTimeMachineGhostPath: function(map_instance, car_id){
        var path_points     = [],
            car             = map.cars_list[map.getCarIndexById(car_id)];

        if(car && car.path_points){
            for(var i = 0, l = car.path_points.length; i < l; i++){
                //Добавляем координаты для следующей точки отрисовки путевой линии
                path_points.push(new L.latLng(car.path_points[i].lat, car.path_points[i].lon));
            };

            //Если путь уже отрисован, то удаляем его
            if(this.ghost_path){
                map_instance.removeLayer(this.ghost_path);
            };

            //Рисуем путь
            if(path_points && path_points.length > 0){
                console.log('DRAWE')

                this.ghost_path = L.polyline(path_points, {
                    color           : this.ghost_path_color,
                    smoothFactor    : 2,
                    weight          : 5,
                    opacity         : 0.3
                    //dashArray       : '1, 8'
                });

                if(this.ghost_path){
                    this.ghost_path.addTo(map_instance);
                };
            };
        };

        //Ставим флаг, чтобы фокусировка роизошла только
        // при смене авто, а не каждое обновление пути
        if(this.first_loaded_car_id != car_id){
            this.focus(map_instance);
            this.first_loaded_car_id = car_id;
        };

        this.focusToPath(map_instance, this.ghost_path);
    },

    drawAllThePath: function(map_instance, car_id, limit_point_id){
        var path_points     = [],
            car             = map.cars_list[map.getCarIndexById(car_id)];

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

        if(car && car.path_points && car.path_points.length > 1){
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
                            //stop_markers.push(marker);
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

                if(limit_point_id && limit_point_id == car.path_points[i].id){
                    break;
                };
            };

            if(!car.max_speed_marker){
                car.max_speed_marker = max_speed_marker;
            }else{
                if(max_speed_marker){
                    car.max_speed_marker.options.point_data = max_speed_marker.options.point_data;
                    car.max_speed_marker.setLatLng(max_speed_marker.getLatLng());
                    car.max_speed = max_speed_marker.options.point_data.speed;

                    if(car.max_speed_marker._popup){
                        car.max_speed_marker._popup.setContent(
                            '<div class="tooltip-content">' +
                                '<h3>Максимальная скорость &mdash; ' + core.utilities.convertKnotsToKms(max_speed_marker.options.point_data.speed) + ' км/ч</h3>'+
                                core.utilities.humanizeDate(max_speed_marker.options.point_data.date, 'MYSQLTIME') +
                            '</div>'
                        );
                    };
                }else{
                    car.max_speed_marker.closePopup();
                };
            };

            car.max_speed = max_speed;

            this.drawMaxSpeedMarker(map_instance, car);

            if(car.path_points[0]){
                var start_marker = this.createPathMarker(map_instance, car, car.path_points[0], 'start');
                this.start_markers_group = L.layerGroup([start_marker]).addTo(map_instance);
            };

            if(car.path_points[car.path_points.length - 1]){
                var finish_marker = this.createPathMarker(map_instance, car, car.path_points[car.path_points.length - 1], 'finish');
                this.finish_markers_group = L.layerGroup([finish_marker]).addTo(map_instance);
            };

            /*if(stop_markers.length > 0){
                this.stop_markers_group = L.layerGroup(stop_markers).addTo(map_instance);
            };

            if(run_markers.length > 0){
                this.run_markers_group = L.layerGroup(run_markers).addTo(map_instance);
            };*/

            //Если путь уже отрисован, то удаляем его
            if(this.path){
                map_instance.removeLayer(this.path);
            };

            //Рисуем путь
            if(path_points && path_points.length > 0){
                this.path = L.polyline(path_points, {
                    color           : this.path_color,
                    smoothFactor    : 2,
                    weight          : 5,
                    opacity         : 0.5
                    //dashArray     : '1, 5'
                });

                if(this.path){
                    this.path.addTo(map_instance)
                };

                car.path_length = Math.ceil(this.path.length_in_meters() / 1000);
            };
        };

        //Ставим флаг, чтобы фокусировка роизошла только
        // при смене авто, а не каждое обновление пути
        if(this.first_loaded_car_id != car_id){
            this.focus(map_instance);
            this.first_loaded_car_id = car_id;
        };
    },

    removeGhostPath: function(map_instance){
        if(this.ghost_path){
            map_instance.removeLayer(this.ghost_path);
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

        /*if(this.stop_markers_group){
            this.stop_markers_group.clearLayers();
        };*/

        if(this.start_markers_group){
            this.start_markers_group.clearLayers();
        };

        if(this.finish_markers_group){
            this.finish_markers_group.clearLayers();
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

            if(this.path._originalPoints && this.path._latlngs.length > 1){
                map_instance.fitBounds(this.path.getBounds());
            }else{
                map_instance.panTo(this.path._latlngs[0]);
            };

        }else if(map.current_car && map.current_car.cp_marker && !map.show_car_path){
            map_instance.panTo(map.current_car.cp_marker.getLatLng());
        }else{
            if(this.current_position_markers_group){
                var bounds      = [],
                    last_marker = null;

                this.current_position_markers_group.eachLayer(function(marker){
                    bounds.push(marker.getLatLng());
                    last_marker = marker;
                });

                if(bounds.length > 1){
                    map_instance.fitBounds(bounds);
                }else if(bounds.length == 1 && last_marker !== null){
                    map_instance.panTo(last_marker.getLatLng());
                };
            };
        };
    },

    focusToPath: function(map_instance, path){
        if(path._originalPoints && path._latlngs.length > 1){
            map_instance.fitBounds(path.getBounds());
        }else{
            map_instance.panTo(path._latlngs[0]);
        };
    },

    focusToMarker: function(map_instance, marker){
        //TODO: Исчезают слои!!!
        map_instance.panTo(marker.getLatLng());
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
        if(!this.max_speed_marker && car.max_speed_marker){
            this.removeMaxSpeedMarker();
            this.max_markers_group = L.layerGroup([car.max_speed_marker]).addTo(map_instance);
            this.max_speed_marker = true;

        }else if(car.max_speed_marker){
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
            //map.map.setZoom(13);
        };
    }
};

var data_ctrl = {
    error: function(){
        /*$.meow({
            title   : 'Ошибка',
            message : 'Внутренняя ошибка сервиса',
            duration: 12000
        });*/
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
                data_ctrl.error();
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
                data_ctrl.error();
            }
        });
    },

    //Загружаем динамические данные тачек (координаты, скорость, HDOP и пр.)
    getDynamicCarsData: function(cars, options, callback){
        var h = core.ui.getHashData(),
            tm_flag = '0';

        if(h && h.timemachine){
            tm_flag = '1';
        };

        this.loading_process = $.ajax({
            url         : '/control/map/?ajax&action=getDynamicDevicesData&date='+map.date,
            data        : {
                cars    : JSON.stringify(cars),
                tm_flag : tm_flag
            },
            dataType    : 'json',
            type        : 'post',
            beforeSend  : function(){
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
                if(!options.renew && $.cookie('auto-renew') != '0' && !map.checkTimemachineMode()){
                    map.auto_renew = true;
                };

                if(!options.renew){
                    core.loading.unsetGlobalLoading();
                };

                callback(data);
            },
            error: function(){
                if(!options.renew && $.cookie('auto-renew') != '0' && !map.checkTimemachineMode()){
                    map.auto_renew = true;
                };

                if(!options.renew){
                    core.loading.unsetGlobalLoading();
                };

                data_ctrl.error();
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
        $('#map, .map-container').css({
            height: $('body').height() - $('.top-panel').height() - $('footer').height(),
            width: $('body').width() - $('.map-bottom-panel').width()
        });

        this.m_ctrl = leaflet_ctrl;
        this.m_ctrl.createMap(this.m_options, callback);

        /*
        $('.map-container').resizable({
            handles: 's',
            minHeight: this.m_options.minHeight + 1,
            resize: function(event, ui){
                $('#map').css({
                    height: ui.size.height + 2,
                    width:  $('.map-container').width() - 2
                });

                var player_height = 0;

                if($('#player').is(':visible')){
                    player_height = $('#player').height() + 20;
                };

                $('.map-bottom-panel').css({
                    minHeight: ui.size.height + 14 + player_height
                });

                if(map.map){
                    map.map.invalidateSize();
                };

                $.cookie('map-height', ui.size.height, core.options.cookie_options);
            }
        });

        */

        $(window).on('resize', function(){
            $('#map, .map-container').css({
                height: $('body').height() - $('.top-panel').height() - $('footer').height(),
                width: $('body').width() - $('.map-bottom-panel').width()
            });

            $('.map-bottom-panel').css({
                minHeight: $('.map-container').height() + 14 + player_height
            });

            if(map.map){
                map.map.invalidateSize();
            };
        });


        var player_height = 0;

        if($('#player').is(':visible')){
            player_height = $('#player').height() + 20;
        };

        $('.map-bottom-panel').css({
            minHeight: $('.map-container').height() + 14 + player_height
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

                if(map.checkTimemachineMode()){
                    tm_hash = '&timemachine=' + core.ui.getHashData().timemachine;
                };

                document.location.hash = '#fleet=' + fleet_id + '&car=' + val + tm_hash;
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

                if(map.checkTimemachineMode()){
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
        var html = '',
            hash = core.ui.getHashData();

        if(hash && hash.timemachine){
            html += '<span class="header-timemeachine"> / ' + core.utilities.humanizeDate(core.utilities.parseDateStrToDateOdject(hash.timemachine)) + '</span>';
        };

        if(this.current_fleet){
            html += ' / ' + this.current_fleet.name;
        };

        if(this.current_car){
            html += ' / ' + this.current_car.name + ' ' + core.utilities.drawGId(this.current_car.g_id, 'small');
            html += '<span class="g_id-spacer"></span>';
        }else{
            html += ' <span class="badge">'+this.cars_in_fleet+' ' + core.utilities.plural(this.cars_in_fleet, 'машина', 'машины', 'машин') + '</span>';
        };

        $('#current-fleet-and-car').html(html);
    },

    renewOptions: function(){
        if(this.current_car && (this.current_car.stop_points || this.current_car.max_speed)){
            this.current_car.stop_points = null;
            this.current_car.max_speed = null;
        };

        this.player.close();

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
                fleet       : 'all',
                car         : 'all',
                timemachine : this.date
            };
        };

        this.drawButtons();
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
                car.online    = data[i].online;
                car.speed     = data[i].speed;
                car.params    = $.parseJSON(data[i].params);
                car.sat_count = data[i].sat_count;
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
                var hash = '',
                    h = core.ui.getHashData();

                if(h && h.fleet){
                    hash += 'fleet='+h.fleet;
                };

                if(h && h.car && h.fleet){
                    hash += '&car='+h.car;
                }else if(h && h.car && !h.fleet){
                    hash += 'car='+h.car;
                };

                hash = '#' + hash;

                var hs = '';

                if(hash != '#'){
                    hs = hs+'&';
                };

                var d = this.current_car.last_point_date.split(/[- :]/);

                hash = hash + hs + 'timemachine=' + d[2] + '-' + parseInt(d[1]) + '-' + d[0];

                message =   '<p>На&nbsp;<b>'+core.utilities.humanizeDate(this.date, 'COMMON')+'</b> ' +
                            'не&nbsp;зарегистрированно ни&nbsp;одной отметки для&nbsp;машины <b>&laquo;'+this.current_car.name+'&raquo;</b>.</p>' +
                            '<p>Последняя отметка была зарегистрированна&nbsp;<b><a href="'+hash+'">'+core.utilities.humanizeDate(this.current_car.last_point_date, 'MYSQL')+'</a></b>.</p>';
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

        $('#focus-block').fadeOut(150);
    },

    unsetNoPointsInfo: function(){
        $('#focus-block').fadeIn(150);

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

            this.m_ctrl.removeAllThePath(this.map);
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
        var auto_renew,
            show_car_path;

        if(map.checkTimemachineMode()){
            auto_renew = false;
            show_car_path = false;
            this.auto_renew = false;
            this.show_car_path = false;
        }else{
            this.readOptionsFromCookies();
            auto_renew = true;
            show_car_path = true;
        };


        if(auto_renew === false){
            $('#auto-renew').parent().addClass('unactive').removeClass('active');
        }else{
            $('#auto-renew').parent().addClass('active').removeClass('unactive');
        };

        if(this.auto_renew === true){
            $('#auto-renew').slickswitch('tOn');
        }else{
            $('#auto-renew').slickswitch('tOff');
        };


        if(show_car_path === false){
            $('#show-path').parent().addClass('unactive').removeClass('active');
        }else{
            $('#show-path').parent().addClass('active').removeClass('unactive');
        };

        if(this.show_car_path === true){
            $('#show-path').slickswitch('tOn');
        }else{
            $('#show-path').slickswitch('tOff');
        };


        if(this.auto_focus === true){
            $('#auto-focus').slickswitch('tOn');
        }else{
            $('#auto-focus').slickswitch('tOff');
        };
    },

    checkTimemachineMode: function(){
        var h = core.ui.getHashData();

        if(h && h.timemachine){
            return true;
        };
    },

    createTimeMachine: function(){
        var hash    = '',
            date    = new Date(),
            h       = core.ui.getHashData(),
            hs      = '';

        if(h && h.fleet){
            hash += 'fleet='+h.fleet;
        };

        if(h && h.car && h.fleet){
            hash += '&car='+h.car;
        }else if(h && h.car && !h.fleet){
            hash += 'car='+h.car;
        };

        hash = '#' + hash;

        if(hash != '#'){
            hs = hs+'&';
        };

        if(h && h.timemachine){
            $('#time-machine .days').datepicker('destroy');

            $('#time-machine .days').datepicker({
                dateFormat      : "d-m-yy",
                minDate         : '-30d',
                maxDate         : 0,
                firstDay        : 1,
                prevText        : "Назад",
                nextText        : "Вперед",
                monthNames      : [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ],
                monthNamesShort : [ "Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек" ],
                dayNames        : [ "Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота" ],
                dayNamesMin     : [ "Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб" ],
                dayNamesShort   : [ "Вос", "Пон", "Вто", "Сре", "Чет", "Пят", "Суб" ],
                onSelect        : function(date){
                    document.location.href = hash + hs + 'timemachine=' + date
                }
            });

            if(h && h.timemachine){
                $('#time-machine .days').datepicker('setDate', h.timemachine);
            };

            $('#timemachine-button').data('url', hash).attr('checked', 'checked');
            $('#time-machine .days').slideDown(300);

            $('#timemachine-button').slickswitch('tOn');

        }else{
            $('#timemachine-button').data('url', hash + hs + 'timemachine='+date.getDate() + '-' + (date.getMonth() + 1)  + '-' + date.getFullYear()).removeAttr('checked');
            $('#time-machine .days').slideUp(300, function(){
                $('#time-machine .days').datepicker('destroy');
            });
        };
    },

    drawCarPath: function(forced){
        map.m_ctrl.removeGhostPath(map.map);

        var h = core.ui.getHashData();

        if(this.current_car && this.current_car.cp_marker && (this.show_car_path || (h && h.timemachine))){
            if(!this.current_car.path_points || forced === true){
                data_ctrl.getCarPath(this.current_car.id, false, function(data){
                    map.current_car.path_points = [];
                    map.current_car.path_points = data;

                    if(
                        map.current_car.path_points &&
                        map.current_car.path_points[map.current_car.path_points.length - 1] &&
                        map.current_car.path_points[map.current_car.path_points.length - 1].point_id != data.point_id
                    ){
                        map.current_car.path_points.push(map.current_car.last_point);
                    };

                    map.m_ctrl.removeGhostPath(map.map);

                    if(h && h.timemachine){
                        map.m_ctrl.drawTimeMachineGhostPath(map.map, map.current_car.id);
                        map.player.init();

                    }else{
                        map.m_ctrl.drawAllThePath(map.map, map.current_car.id);
                        map.player.close();
                    };

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

    player: {
        interval        : null,
        frame           : 0,
        waypoints       : null,
        playing         : false,
        speed           : 1000,
        first_wp_time   : null,
        last_wp_time    : null,
        curr_time       : null,
        time_factor     : 1,
        curr_second     : 0,
        path_layers     : {},

        init: function(){
            $('#player').slideDown(250);

            this.getCarWayPoints();

            if(this.waypoints && this.waypoints.length > 0){
                $('#player').removeClass('disabled');

                if(this.waypoints[0] && this.waypoints[0].date){
                    var d = this.waypoints[0].date.split(/[- :]/);
                    this.first_wp_time = new Date(d[0], d[1]-1, d[2], d[3], d[4], d[5]);

                    this.curr_time = new Date(this.first_wp_time);
                    this.curr_second = (this.curr_time.getHours() * 60 * 60) + (this.curr_time.getMinutes() * 60) + this.curr_time.getSeconds();

                    this.renewTimeMonitor();
                };

                if(this.waypoints[this.waypoints.length - 1] && this.waypoints[this.waypoints.length - 1].date){
                    var d = this.waypoints[this.waypoints.length - 1].date.split(/[- :]/);
                    this.last_wp_time = new Date(d[0], d[1]-1, d[2], d[3], d[4], d[5]);
                };

                $('#player-timeline-slider').slider({
                    animate: 'fast',
                    range: 'min',
                    min: 0,
                    max: this.waypoints.length - 1,
                    slide: function(event, ui){
                        map.player.pause();

                        /*
                        map.player.curr_second = parseInt(ui.value);

                        map.player.curr_time.setHours(0);
                        map.player.curr_time.setMinutes(0);
                        map.player.curr_time.setSeconds(0);

                        map.player.curr_time.setSeconds(ui.value);
                        */

                        map.player.frame = ui.value;
                        map.player.renewTimeByFrame(ui.value);
                        map.player.checkFrameByTime(true);
                        //map.player.moveMarker(ui.value, true);
                    },
                    stop: function(){
                        if(map.auto_focus){
                            map.m_ctrl.focusToMarker(map.map, map.current_car.cp_marker);
                        };
                    }
                });

                $('#day-time-slider .slider .slider-instance').slider({
                    animate: 'fast',
                    range: 'min',
                    min: 0,
                    max: 86399,
                    slide: function(event, ui){
                        map.player.curr_second = parseInt(ui.value);

                        map.player.curr_time.setHours(0);
                        map.player.curr_time.setMinutes(0);
                        map.player.curr_time.setSeconds(0);
                        map.player.curr_time.setSeconds(ui.value);

                        //map.player.checkFrameByTime();
                        map.player.renewTimeMonitor();
                    }
                });

                $('.player-timeline .time-line-monitor').remove();
                $('.player-timeline').append('<div class="time-line-monitor"></div>');

                this.reset();
            }else{
                $('#player').addClass('disabled');
            };
        },

        renewTimeByFrame: function(frame){
            var d = this.waypoints[frame].date.split(/[- :]/);
            this.curr_time = new Date(d[0], d[1]-1, d[2], d[3], d[4], d[5]);
            this.curr_second = (this.curr_time.getHours() * 60 * 60) + (this.curr_time.getMinutes() * 60) + this.curr_time.getSeconds();

            this.renewTimeMonitor();
        },

        setTimeFactor: function(dir){
            if(dir == 'up'){
                this.time_factor = this.time_factor * 2;

                if(this.time_factor > 256){
                    this.time_factor = 256;

                    $('#player-time-factor').stop(true).animate({
                        color: "#FF0000"
                    }, 50, function(){
                        $( "#player-time-factor" ).stop(true).animate({
                            color: "#45d1ec"
                        }, 150 );
                    });

                }else{
                    $('#player-time-factor').stop(true).effect('bounce');
                };
            }else{
                this.time_factor = this.time_factor / 2;

                if(this.time_factor < 1){
                    this.time_factor = 1;

                    $('#player-time-factor').stop(true).animate({
                        color: "#FF0000"
                    }, 50, function(){
                        $( "#player-time-factor" ).stop(true).animate({
                            color: "#45d1ec"
                        }, 150 );
                    });
                }else{
                    $('#player-time-factor').stop(true).effect('bounce');
                };
            };

            clearInterval(this.interval);

            if(this.playing){
                this.interval = setInterval(function(){
                    map.player.tick();
                }, this.speed / this.time_factor);
            };

            $('#player-time-factor').text('x'+this.time_factor);
        },

        close: function(){
            $('#player').slideUp(250);
        },

        play: function(){
            this.interval = setInterval(function(){
                map.player.tick();
            }, this.speed / this.time_factor);

            $('#player #player-play-pause').html('&#9646;&#9646;').addClass('pause-button-text').attr('title', 'Приостановка проигрывателя');
            $('#player #player-status').html('&#9654;').css({fontSize: '22px', textIndent: '0', letterSpacing: '0'});

            this.playing = true;
        },

        pause: function(){
            clearInterval(this.interval);

            $('#player #player-play-pause').html('&#9654;').removeClass('pause-button-text').attr('title', 'Запуск проигрывателя');
            $('#player #player-status').html('&#9646;&#9646;').css({fontSize: '22px', textIndent: '-0.4ex', letterSpacing: '-0.2ex'});

            this.playing = false;
        },

        rev: function(){
            this.frame--;

            if(!this.waypoints){
                this.init();
            };

            if(this.frame >= 0 && this.waypoints[this.frame]){
                this.moveMarker(this.frame);
                this.renewTimeByFrame(this.frame);
            }else{
                this.frame++;
            };
        },

        ff: function(){
            this.frame++;

            if(!this.waypoints){
                this.init();
            };

            if(this.waypoints[this.frame]){
                this.moveMarker(this.frame);
                this.renewTimeByFrame(this.frame);
            }else{
                this.frame--;

                if(this.frame < 0){
                    this.frame = 0;
                };
            };
        },

        reset: function(){
            this.pause();
            this.frame = 0;
            this.moveMarker(this.frame);

            this.curr_time.setHours(0);
            this.curr_time.setMinutes(0);
            this.curr_time.setSeconds(0);

            this.curr_second = 0;

            this.renewTimeMonitor();

            $('#player #player-status').html('&#9724;').css({fontSize: '22px', textIndent: '0', letterSpacing: '0'});
        },

        renewTimeMonitor: function(){
            $('#player-current-time').text(core.utilities.leadingZero(this.curr_time.getHours(), 2) + ':' + core.utilities.leadingZero(this.curr_time.getMinutes(), 2) + ':' + core.utilities.leadingZero(this.curr_time.getSeconds(), 2));

            if($('#day-time-slider .slider .slider-instance').data('slider')){
                $('#day-time-slider .slider .slider-instance').slider('value', (this.curr_time.getHours() * 60 * 60 + this.curr_time.getMinutes() * 60 + this.curr_time.getSeconds()));
            };
        },

        tick: function(){
            this.curr_second = this.curr_second + 1;

            this.curr_time.setHours(0);
            this.curr_time.setMinutes(0);
            this.curr_time.setSeconds(0);

            this.curr_time.setSeconds(this.curr_second);

            this.renewTimeMonitor();
            this.checkFrameByTime();
        },

        checkFrameByTime: function(no_focus){
            if(!this.waypoints){
                this.init();
            };

            if(this.waypoints[(this.frame + 1)] && this.waypoints[(this.frame + 1)].date){
                var cd =    this.curr_time.getFullYear() + '-' +
                            core.utilities.leadingZero(this.curr_time.getMonth() + 1, 2)    + '-' +
                            core.utilities.leadingZero(this.curr_time.getDate(), 2)         + ' ' +
                            core.utilities.leadingZero(this.curr_time.getHours(), 2)        + ':' +
                            core.utilities.leadingZero(this.curr_time.getMinutes(), 2)      + ':' +
                            core.utilities.leadingZero(this.curr_time.getSeconds(), 2);

                $.grep(this.waypoints, function(a, i){
                    if(a.date == cd){
                        $('#player-timeline-slider').slider('value', i);
                        map.player.moveMarker(i, no_focus);
                        map.player.frame = i;
                    };
                });
            };
        },

        moveMarker: function(index, no_focus){
            if(this.waypoints && this.waypoints[index]){
                var p = this.waypoints[index],
                    data = {};

                data.id                  = map.current_car.id;
                data.last_point          = p;
                data.last_point_date     = p.date;
                data.speed               = p.speed;
                data.last_point_id       = p.id;
                data.altitude            = p.altitude;
                data.heading             = p.heading;
                data.point_id            = p.id;
                data.lat                 = p.lat;
                data.lon                 = p.lon;

                map.current_car.last_point = p;

                map.m_ctrl.updateCurrentPositionMarker(map.current_car.cp_marker, data);

                if(map.auto_focus && no_focus !== true){
                    map.m_ctrl.focusToMarker(map.map, map.current_car.cp_marker);
                };

                $('#player-timeline-slider').slider('value', index);

                map.m_ctrl.drawAllThePath(map.map, map.current_car.id, p.id);
            };
        },

        getCarWayPoints: function(){
            if(map.current_car){
                this.waypoints = map.current_car.path_points;
            };
        }
    },

    drawBottomPanels: function(){
        var panel1_html = '',
            panel2_html = '',
            panel3_html = '',
            panel4_html = '';

        if(this.current_car){
            if((this.current_car.hdop || this.current_car.csq) && !map.checkTimemachineMode()){
                var status = '';

                if(this.current_car.online == 1){
                    status = '<span class="success">Онлайн</span>';
                }else{
                    status = '<span class="gray">Офлайн</span>';
                };

                panel1_html +=  '<h3>Статус терминала</h3>' +
                                '<div class="row">' +
                                    '<div class="half"><strong>Соединение</strong></div>' +
                                    '<div class="half">'+status+'</div>' +
                                '</div>';

                if(this.current_car.online == 1){
                    panel1_html +=  '<div class="row">' +
                                        '<div class="half"><strong>Сигнал GPS</strong></div>' +
                                        '<div class="half">'+core.utilities.getHDOPIndicator(this.current_car.hdop, this.current_car.sat_count)+'</div>' +
                                    '</div>' +
                                    '<div class="row">' +
                                        '<div class="half"><strong>Сигнал GSM</strong></div>' +
                                        '<div class="half">'+core.utilities.getCSQIndicator(this.current_car.csq)+'</div>' +
                                    '</div>';
                };
            };

            if(this.current_car.stop_points || this.current_car.max_speed){
                panel2_html +=  '<h3>Метрика</h3>' +
                                '<div class="row">' +
                                    '<div class="half"><strong>Макс. скорость</strong></div>' +
                                    '<div class="half"><a id="max-speed-marker" class="badge" href="javascript:void(0)" title="Показать точку максимальной скорости">'+core.utilities.convertKnotsToKms(this.current_car.max_speed) + ' км/ч</a></div>' +
                                '</div>' +
                                '<div class="row">' +
                                    '<div class="half"><strong>Пройдено пути</strong></div>' +
                                    '<div class="half"><span>~</span>'+ this.current_car.path_length + ' км</div>' +
                                '</div>';
            };

            if(this.current_car.params && !map.checkTimemachineMode() && this.current_car.online == 1){
                panel3_html +=  '<h3>Дополнительно</h3>' +
                                '<div class="row">' +
                                    '<div class="half"><strong>Внеш. питание</strong></div>' +
                                    '<div class="half">' + core.utilities.getVoltsIndicator(this.current_car.params.power_inp) + '</div>' +
                                '</div>';

                                if(this.current_car.params.power_bat){
                                    panel3_html += '<div class="row">' +
                                                        '<div class="half"><strong>Батарея</strong></div>' +
                                                        '<div class="half">' + core.utilities.getVoltsIndicator(this.current_car.params.power_bat) + '</div>' +
                                                    '</div>';
                                };

                                if(this.current_car.params.dev_temp){
                                    panel3_html += '<div class="row">' +
                                                        '<div class="half"><strong>Темп. терминала</strong></div>' +
                                                        '<div class="half">' + this.current_car.params.dev_temp + '&deg; C</div>' +
                                                    '</div>';
                                };
            };

            if(!map.checkTimemachineMode()){
                panel4_html +=  '<h3>Обновление данных</h3>' +
                                '<div class="row">' +
                                    '<div class="half"><strong>Координаты</strong></div>' +
                                    '<div class="half" title="'+core.utilities.humanizeDate(this.current_car.last_point_date, 'MYSQLTIME')+'">' + core.utilities.dateRange(this.current_car.last_point_date, new Date())   + '</div>' +
                                '</div>' +
                                '<div class="row">' +
                                    '<div class="half"><strong>Статус</strong></div>' +
                                    '<div class="half" title="'+core.utilities.humanizeDate(this.current_car.last_update, 'MYSQLTIME')+'">' + core.utilities.dateRange(this.current_car.last_update, new Date()) + '</div>' +
                                '</div>';
            };
        };


        if(panel1_html && !map.checkTimemachineMode()){
            $('#bottom-panel-1').show()
            $('#bottom-panel-1 .panel-content').html(panel1_html);
        }else{
            $('#bottom-panel-1').hide();
        };

        if(panel2_html){
            $('#bottom-panel-2').show()
            $('#bottom-panel-2 .panel-content').html(panel2_html);
        }else{
            $('#bottom-panel-2').hide();
        };

        if(panel3_html && !map.checkTimemachineMode()){
            $('#bottom-panel-3').show()
            $('#bottom-panel-3 .panel-content').html(panel3_html);
        }else{
            $('#bottom-panel-3').hide();
        };

        if(panel4_html && !map.checkTimemachineMode()){
            $('#bottom-panel-4').show()
            $('#bottom-panel-4 .panel-content').html(panel4_html);
        }else{
            $('#bottom-panel-4').hide();
        };
    },

    setDate: function(date){
        this.date = core.utilities.pad(date.getDate(), 2)       + '-' +
                    core.utilities.pad(date.getMonth() + 1, 2)  + '-' +
                    date.getFullYear();
    },

    updateAllCarsData: function(){
        // this.m_ctrl.removeAllThePath(this.map);

        if(this.current_car){
            if(this.current_car.cp_marker){
                this.m_ctrl.removeMarker(this.map, this.current_car.cp_marker);
            };

            this.current_car.cp_marker = null;
            this.current_car.path_points = null;
            this.current_car.last_point_id = null;
        };

        if(this.cars_list){
            for(var i = 0, l = this.cars_list; i < l; i++){
                if(this.cars_list[i].cp_marker){
                    this.m_ctrl.removeMarker(this.map, this.cars_list[i].cp_marker);
                };

                this.cars_list[i].cp_marker = null;
                this.cars_list[i].path_points = null;
                this.cars_list[i].last_point_id = null;
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
            this.changeDate(core.utilities.timestampToDateYearLast(hash.timemachine));
        }else{
            this.changeDate(new Date());
        };
    },

    bindControls: function(){
        // Отлеживаем событие изменения хеша
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

        $('#auto-renew').slickswitch({
            toggled: function(){
                map.toggleAutoRenew();
            }
        });

        $('#show-path').slickswitch({
            toggled: function(){
                map.toggleCarPath();
            }
        });

        $('#auto-focus').slickswitch({
            toggled: function(){
                map.toggleAutoFocus();
            }
        });

        $('#timemachine-button').slickswitch({
            toggled: function(){
                document.location.href = $('#timemachine-button').data('url');
            }
        });

        $('#max-speed-marker').live('click', function(){
            map.m_ctrl.topSpeedMarker();
        });

        $('#player-play-pause').live('click', function(){
            if(map.player.playing === true){
                map.player.pause();
            }else{
                map.player.play();
            };
        });

        $('#player-reset').live('click', function(){
            map.player.reset();
        });

        $('#player-rev').live('click', function(){
            map.player.rev();
        });

        $('#player-ff').live('click', function(){
            map.player.ff();
        });

        $('#player-time-factor-up').live('click', function(){
            map.player.setTimeFactor('up');
        });

        $('#player-time-factor-down').live('click', function(){
            map.player.setTimeFactor('down');
        });
    },

    readOptionsFromCookies: function(){
        // Проверяем на наличие отключенного автообновления в куках
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
        core.ticker.delay = 1000;

        this.setDateByHash();
        this.readOptionsFromCookies();
        this.drawButtons();

        // Готовим карту (контроллер карт может иметь синхронный вызов,
        // поэтому, дальнейшие действия вызываются через коллбэк)
        this.prepareMap(function(map_instance){
            map.map = map_instance;
            map.prepareDFandControls();
        });
    }
};