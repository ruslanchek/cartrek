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
                "coordinates": [options.lon, options.lat]
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
        this.loading_process = $.ajax({
            url : '/control/map/?ajax',
            data : {
                action  : 'getUserFleetsAndDevices'
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
    getDynamicCarsData: function(cars, callback){
        this.loading_process = $.ajax({
            url : '/control/map/?ajax&action=getDynamicDevicesData',
            data : {
                cars    : JSON.stringify(cars),
                date    : new Date()
            },
            dataType : 'json',
            type : 'post',
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
    }
};

var map = {
    m_ctrl: null,
    map: null,

    current_fleet: null,
    current_car: null,

    fleets_list: [],
    cars_list: [],
    cars_in_fleet: 0,

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
        $('#'+this.m_options.container).resizable();
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
        this.drawCars();
    },

    drawDynamicCarsData: function(data){
        //Рисуем тачки на карте из полученного массива (последняя точка за сегодня)
        if(data.length > 0){
            for(var i = 0, l = data.length; i < l; i++){
                if(data[i].lat && data[i].lon){
                    this.m_ctrl.drawCurrentPositionMarker({
                        map     : this.map,
                        lat     : data[i].lat,
                        lon     : data[i].lon,
                        heading : data[i].heading
                    });
                };
            };
        };
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

        //Готовим массив с ID тачек
        var cars_ids = [];

        for(var i = 0, l = cars.length; i < l; i++){
            cars_ids.push(cars[i].id);
        };

        //Если набралась хотябы одна тачка - грузим динамические данные
        if(cars_ids.length > 0){
            data_ctrl.getDynamicCarsData(cars_ids, function(data){
                //Запускаем функцию отрисовки динамических данных о тачке или группе тачек
                map.drawDynamicCarsData(data);
            });
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
