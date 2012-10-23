var leaflet_ctrl = {
    cp_group: null,
    path: null,
    first_loaded_car_id: false,

    icons: {
        headingIcon: function(heading){
            return L.icon({
                iconUrl     : core.map_tools.getHeadingIcon(heading),
                shadowUrl   : '/control/map/img/markers/heading/flat_shadow.png',

                iconSize    : [16, 16], // size of the icon
                shadowSize  : [30, 30], // size of the shadow
                iconAnchor  : [8, 8], // point of the icon which will correspond to marker's location
                shadowAnchor: [15, 12],  // the same for the shadow
                popupAnchor : [0, -8] // point from which the popup should open relative to the iconAnchor
            });
        }
    },

    createMap: function(m_options, callback){
        wax.tilejson('http://a.tiles.mapbox.com/v3/ruslanchek.map-5sa7s6em.jsonp',
            function(tilejson){
                var map_instance = new L.Map('map');
                map_instance.addLayer(new wax.leaf.connector(tilejson));
                map_instance.setView(new L.LatLng(m_options.coordinates.lat, m_options.coordinates.lon), m_options.zoom);

                var interaction = wax.leaf.interaction(map_instance, tilejson);

                callback(map_instance);
            }
        );
    },

    createCurrentPositionMarker: function(map_instance, data){
        var car = map.cars_list[map.getCarIndexById(data.id)];
        var marker = L.marker(
            [data.lat, data.lon], {
                icon: this.icons.headingIcon(data.heading),
                id: data.id
            }
        );

        /*var m = new R.Marker(new L.LatLng(data.lat, data.lon), {'fill': '#fff', 'stroke': '#000'});
        map_instance.addLayer(m);*/

        marker.on('click', function(){
            this.bindPopup(map.getCurrentPositionPopupHtml(this.options.id));
            this.openPopup();
        });

        car.cp_marker       = marker;
        car.last_point_id   = data.point_id;
        car.last_point_date = data.last_point_date;

        return marker;
    },

    drawCurrentPositionMarkersGroup: function(map_instance, data){
        if(this.cp_group){
            this.cp_group.clearLayers();
        };

        if(this.path){
            this.removeAllThePath(map_instance);
        };

        if(data){
            var markers = [];

            for(var i = 0, l = data.length; i < l; i++){
                if(data[i].lat && data[i].lon){
                    markers.push(this.createCurrentPositionMarker(map_instance, data[i]));
                };
            };

            if(markers.length > 0){
                this.cp_group = L.layerGroup(markers).addTo(map_instance);
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
        car.last_point_id = data.point_id;

        marker.setLatLng(new L.LatLng(data.lat, data.lon));
        marker.setIcon(this.icons.headingIcon(data.heading));
        marker.update();

        if(map.current_car && map.show_car_path){
            if(!map.current_car.path_points){
                map.current_car.path_points = [];
            };

            map.current_car.path_points.push(data);
            this.drawAllThePath(map.map, data.id);
        };
    },

    changeCurrentPositionMarkersData: function(map_instance, data){
        for(var i = 0, l = data.length; i < l; i++){
            if(data[i].lat && data[i].lon){
                var car = map.cars_list[map.getCarIndexById(data[i].id)];

                if(car && car.cp_marker){
                    this.updateCurrentPositionMarker(car.cp_marker, data[i]);
                }else{
                    this.createCurrentPositionMarker(map_instance, data[i]);
                };
            };
        };
    },

    drawAllThePath: function(map_instance, car_id){
        var latlngs = [],
            car = map.cars_list[map.getCarIndexById(car_id)];

        if(car.path_points){
            for(var i = 0, l = car.path_points.length; i < l; i++){
                latlngs.push(new L.latLng(car.path_points[i].lat, car.path_points[i].lon));
            };
        };

        if(this.path){
            map_instance.removeLayer(this.path);
        };

        this.path = L.polyline(latlngs, {color: car.color}).addTo(map_instance);

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
            if(this.cp_group){
                var bounds = [];

                this.cp_group.eachLayer(function(marker){
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
        console.log(map.date)

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
        console.log(map.date)
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
        console.log(map.date)
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
    m_ctrl: null,
    map: null,
    date: null,

    initialized: false,

    current_fleet: null,
    current_car: null,

    fleets_list: [],
    cars_list: [],
    cars_in_fleet: 0,

    auto_renew: true,
    show_car_path: false,

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

        $('.map-container').resizable({
            handles: 's',
            minHeight: this.m_options.minHeight + 1,
            resize: function(event, ui){
                $('#map').css({
                    height: ui.size.height + 2
                });

                $.cookie('map-height', ui.size.height, core.options.cookie_options);
            }
        });

        this.m_ctrl = leaflet_ctrl;
        this.m_ctrl.createMap(this.m_options, callback);
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
                var tm_hash;

                if(map.hash && map.hash.timemachine && map.hash.timemachine != ''){
                    tm_hash = '&timemachine='+map.hash.timemachine;
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
                var tm_hash;

                if(map.hash && map.hash.timemachine && map.hash.timemachine != ''){
                    tm_hash = '&timemachine='+map.hash.timemachine;
                };

                document.location.hash = '#fleet='+val+tm_hash;
                map.createCarsSelect(val);
            }
        });
    },

    setCurrentFleetAndCar: function(){
        var fleet = $.grep(this.fleets_list, function(e){return e.id == map.hash.fleet;}),
            car   = $.grep(this.cars_list, function(e){return e.id == map.hash.car;});

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
                new_hash.timemachine = this.date.getDate() + '-' + (this.date.getMonth() + 1) + '-' + this.date.getFullYear();
            }else{
                if(new_hash.timemachine != this.hash.timemachine){
                    this.changeDate(core.utilities.timestampToDateYearLast(new_hash.timemachine));
                };
            };

            $.extend(this.hash, new_hash);
        }else{
            this.hash = {
                fleet: 'all',
                car: 'all'
            };
        };

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

        //Рисуем тачки на карте
        this.drawCars({renew: false});
    },

    drawDynamicCarsData: function(data, options){
        //Рисуем тачки на карте из полученного массива (последняя точка за сегодня)
        if(data.length > 0){
            if(options.renew === true){
                this.m_ctrl.changeCurrentPositionMarkersData(this.map, data);
            }else{
                this.m_ctrl.drawCurrentPositionMarkersGroup(this.map, data);
            };

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
                map.initialized = true;
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
            html = '';

        html += 'g_id: '+ car.g_id + '<br>';
        html += 'date: '+ car.last_point_date + '<br>';
        html += 'date: '+ car.last_point_id + '<br>';

        return html;
    },

    setNoPointsInfo: function(){
        $('.map-container .map-notice').remove();

        var message;

        if(this.current_car){
            if(this.current_car.last_point_date != null){
                message =   '<p>На&nbsp;<b>'+this.date+'</b> ' +
                            'не&nbsp;зарегистрированно ни&nbsp;одной отметки для&nbsp;машины <b>&laquo;'+this.current_car.name+'&raquo;</b>.</p>' +
                            '<p>Последняя отметка была зарегистрированна&nbsp;<b>'+this.current_car.last_point_date+'</b>.</p>';
            }else{
                message =  '<p>Для&nbsp;машины&nbsp;<b>&laquo;'+this.current_car.name+'&raquo;</b> нет ни одной отметки.</p>';
            };
        }else if(!this.current_car && this.current_fleet){
            message =  '<p>На&nbsp;<b>'+this.date+'</b> ' +
                       'не&nbsp;зарегистрированно ни&nbsp;одной отметки, ни&nbsp;для&nbsp;одной&nbsp;машины в группе &laquo;'+this.current_fleet.name+'&raquo;.</p>';
        }else{
            message =  '<p>На&nbsp;<b>'+this.date+'</b> ' +
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

            this.m_ctrl.removeAllThePath(this.map);
            //this.m_ctrl.focus(this.map);
        };

        this.setButtons();
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

        this.setButtons();
    },

    setButtons: function(){
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
    },

    drawCarPath: function(forced){
        if(this.current_car && this.current_car.cp_marker && this.show_car_path){
            if(!this.current_car.path_points || forced === true){
                data_ctrl.getCarPath(this.current_car.id, false, function(data){
                    map.current_car.path_points = data;
                    map.m_ctrl.drawAllThePath(map.map, map.current_car.id);
                });
            };
        };
    },

    setDate: function(date){
        this.date = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    },

    updateAllCarsData: function(){
        this.m_ctrl.removeAllCurrentPositionMarkers(this.map);
        this.m_ctrl.removeAllThePath(this.map);

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
    },

    init: function(){
        this.setDateByHash();

        //Проверяем на наличие отключенного автообновления в куках
        if($.cookie('auto-renew') == '0'){
            this.auto_renew = false;
        };

        if($.cookie('car-path') == '1'){
            this.show_car_path = true;
        };

        this.setButtons();

        //Готовим карту (контроллер карт может иметь синхронный вызов,
        // поэтому, дальнейшие действия вызываются через коллбэк)
        this.prepareMap(function(map_instance){
            map.map = map_instance;
            map.prepareDFandControls();
        });
    }
};
