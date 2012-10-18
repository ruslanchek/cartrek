var map_box_ctrl = {
    createMap: function(m_options){
        var map = mapbox.map(
            m_options.container,
            mapbox.layer().id('ruslanchek.map-5sa7s6em')
        );

        map.centerzoom(m_options.coordinates, m_options.zoom);
        map.smooth(true);

        return map;
    }
};

var data_ctrl = {
    error: function(){
        console.log('error')
    },

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

    m_options: {
        container: 'map',
        zoom: 8,
        coordinates: {
            lat: 55,
            lon: 35
        }
    },

    u_options: {
        hash: {
            fleet   : 'all',
            car     : 'all'
        }
    },

    bindControls: function(){

    },

    prepareMap: function(){
        //this.m_ctrl = map_box_ctrl;
        //this.map = this.m_ctrl.createMap(this.m_options);
    },

    createCarsSelect: function(data, fleet_id){
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
            default     : this.u_options.hash.car,
            key_name    : 'id',
            value_name  : 'name',
            exclude     : exclude,
            items       : data.devices,
            onChange    : function(val){
                document.location.hash = '#fleet='+fleet_id+'&car='+val;
            }
        });
    },

    createFleetsSelect: function(data){
        //Создаем селект групп
        core.ui.createSelect('#fleets-menu', {
            id          : 'fleets-menu-select',
            default_opt : {val: 'all', name: 'Все группы'},
            default     : this.u_options.hash.fleet,
            key_name    : 'id',
            value_name  : 'name',
            items       : data.fleets,
            onChange    : function(val){
                document.location.hash = '#fleet='+val;
                map.createCarsSelect(data, val);
            }
        });
    },

    prepareDFandControls: function(){
        //Читаем параметры из адресной строки (хеш)
        $.extend(this.u_options.hash, core.ui.getHashData());

        //Грузим группы и тачки
        data_ctrl.getUserFleetsAndDevices(function(data){
            map.createFleetsSelect(data);
            map.createCarsSelect(data, map.u_options.hash.fleet);
        });
    },

    init: function(){
        this.prepareMap();
        this.prepareDFandControls();
    }
};