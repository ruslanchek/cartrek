var fleet = {
    toggleDevice: function(id, checked){
        this.toggle_device = $.ajax({
            url : '/control/user/fleet/?ajax',
            data : {
                action      : 'toggle_device',
                id          : id,
                activity    : (checked === true) ? '1' : '0'
            },
            dataType : 'json',
            type : 'get',
            beforeSend: function(){
                if(this.toggle_device){
                    this.toggle_device.abort();
                };

                core.loading.showTopIndicator();
            },
            success: function(data){
                core.loading.hideTopIndicator();
            },
            error: function(){
                core.loading.hideTopIndicator();
            }
        });
    },

    binds: function(){
        $('.activity-toggler').tzCheckbox({
            onChange: function(item, checked){
                fleet.toggleDevice(item.data('id'), checked);
            }
        });
    },

    init: function(){
        this.binds();
        core.utilities.transformToGID($('.g_id'), 'small');
    }
};