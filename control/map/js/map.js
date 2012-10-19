var map_box_ctrl = {
    createMap: function(m_options){
        var map = mapbox.map(m_options.container);

        map.addLayer(mapbox.layer().id('ruslanchek.map-5sa7s6em'));
        map.centerzoom(m_options.coordinates, m_options.zoom);
        map.smooth(true);

        return map;
    },

    drawCurrentPositionMarker: function(options){
        // Create and add marker layer
        var markerLayer = mapbox.markers.layer().features([{
            "geometry": {
                "type": "Point",
                "coordinates": [options.lat, options.lon]
            },
            "properties": {
                "image": core.map_tools.getHeadingIcon(options.heading)
            }
        }]).factory(function(f) {
            var img = document.createElement('img');
            img.className = 'marker-image';
            img.setAttribute('src', f.properties.image);
            return img;
        });

        options.map.addLayer(markerLayer).setExtent(markerLayer.extent());
    }
};

var data_ctrl = {
    error: function(){
        console.log('error')
    },

    //Загружаем данные о группах и тачках с сервера
    getUserFleetsAndDevices: function(callback){
        this.options_loading_process = $.ajax({
            url : '/control/map/?ajax',
            data : {
                action  : 'getUserFleetsAndDevices'
            },
            dataType : 'json',
            type : 'get',
            beforeSend: function(){
                if(this.options_loading_process){
                    this.options_loading_process.abort();
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
    }
};

var map = {
    m_ctrl: null,
    map: null,

    current_fleet: null,
    current_car: null,

    fleets_list: [],
    cars_list: [],

    m_options: {
        container: 'map',
        zoom: 8,
        coordinates: {
            lat: 55,
            lon: 35
        }
    },

    hash: {},

    prepareMap: function(){
        this.m_ctrl = map_box_ctrl;
        this.map = this.m_ctrl.createMap(this.m_options);
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
                document.location.hash = '#fleet='+fleet_id+'&car='+val;
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
                document.location.hash = '#fleet='+val;
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
            html += ' / ' + this.current_car.name;
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

        //Ставим хедер
        this.setHeaderTexts();

        //Рисуем тачки на карте
        this.drawCars();
    },

    drawCars: function(){
        //Находим все тачки, соответствующие выбранным опциям (группа/тачка)
        if(this.current_car && this.current_car.id > 0){
            var cars = $.grep(this.cars_list, function(e){return e.id == map.current_car.id;});
        }else if(this.current_fleet && this.current_fleet.id > 0){
            var cars = $.grep(this.cars_list, function(e){return e.fleet_id == map.current_fleet.id;});
        }else{
            var cars = this.cars_list;
        };

        //Рисуем тачки на карте из полученного массива (последняя точка за сегодня)
        for(var i = 0, l = cars.length; i < l; i++){
            if(cars[i].last_point && cars[i].last_point.lat && cars[i].last_point.lng){
                this.m_ctrl.drawCurrentPositionMarker({
                    map     : this.map,
                    lat     : cars[i].last_point_today.lng,
                    lon     : cars[i].last_point_today.lat,
                    heading : cars[i].last_point_today.heading
                });
            };
        };
    },

    bindControls: function(){
        //Отлеживаем событие изменения хеша
        $(window).on('hashchange', function() {
            map.renewOptions();
        });
    },

    prepareDFandControls: function(){
        //Грузим группы и тачки
        data_ctrl.getUserFleetsAndDevices(function(data){
            //Сохраняем принятые данные
            map.fleets_list = data.fleets;
            map.cars_list   = data.devices;

            map.renewOptions();
            map.bindControls();
        });
    },

    init: function(){
        this.prepareMap();
        this.prepareDFandControls();
    }
};
