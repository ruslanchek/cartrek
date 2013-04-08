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
        /*$('.activity-toggler').tzCheckbox({
            onChange: function(item, checked){
                fleet.toggleDevice(item.data('id'), checked);
            }
        });*/

        $('.activity-toggler').slickswitch({
            toggled: function(item){
                if(item[0].checked === false && confirm('Внимание! Картрек перестанет принимать какие-либо данные от этой машины, если ее отключить!')){
                    fleet.toggleDevice(item.data('id'), item[0].checked);
                }else if(item[0].checked === true){
                    fleet.toggleDevice(item.data('id'), item[0].checked);
                }else{
                    item[0].checked = true;

                    item.slickswitch('tOn');

                    return false;
                };
            }
        });
    },

    init: function(){
        this.binds();
        core.utilities.transformToGID($('.g_id'), 'small');
    }
};