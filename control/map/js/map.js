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
                    core.loading.setGlobalLoading();
                };
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

    bindControls: function(){

    },

    prepareMap: function(){
        this.m_ctrl = map_box_ctrl;
        this.map = this.m_ctrl.createMap(this.m_options);
    },

    init: function(){
        this.prepareMap();
    }
};