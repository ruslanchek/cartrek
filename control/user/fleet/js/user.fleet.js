var fleet = {
    toggleDevice: function(id, checked){
        this.toggle_device = $.ajax({
            url : '/control/user/fleet/?ajax',
            data : {
                action      : 'toggleDevice',
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
                core.ajax.errorHandler();
            }
        });
    },

    editCar: function(id){
        var html = '<form id="edit-geozone-form" class="forms columnar white" method="POST">' +
            '<div class="form_message"></div>' +

            '<ul>' +

            '<hr>' +

            '<li class="push">' +
            '<input type="submit" name="send" class="btn blue float-left" value="Сохранить" />' +
            '</li>' +

            '</ul>' +

            '<div class="clear"></div>' +
            '</form>';

        core.modal.createModal(
            'Редактирование машины',
            html,
            750
        );
    },

    editByHash: function () {
        if (core.ui.getHashData() && core.ui.getHashData().car > 0) {
            var edit_id = core.ui.getHashData().car;

            fleet.editCar(edit_id);
        }
    },

    binds: function(){
        if (core.ui.getHashData() && core.ui.getHashData().car > 0) {
            this.editByHash();
        }

        $(window).on('hashchange', function () {
            fleet.editByHash();
        });

        /*$('.activity-toggler').slickswitch({
            toggled: function(item){
                if($(item[0]).prop('checked') === false && confirm('Внимание! Картрек перестанет принимать какие-либо данные от этой машины, если ее отключить!')){
                    fleet.toggleDevice(item.data('id'), false);

                    var $item = $('#fleet-table tr[rel="'+item.data('id')+'"]');

                    $item
                        .addClass('unactive_row')
                        .find('.activity-icon')
                        .removeClass('active')
                        .addClass('unactive');

                }else if($(item[0]).prop('checked') === true){
                    fleet.toggleDevice(item.data('id'), true);

                    var $item = $('#fleet-table tr[rel="'+item.data('id')+'"]'),
                        $item_activity_icon = $item.find('.activity-icon');

                    $item.removeClass('unactive_row');

                    if($item.data('online') === true){
                        $item_activity_icon.removeClass('unactive').addClass('active');
                    }else{
                        $item_activity_icon.removeClass('active').addClass('unactive');
                    }

                }else{
                    item.slickswitch('tOn');

                    var $item = $('#fleet-table tr[rel="'+item.data('id')+'"]'),
                        $item_activity_icon = $item.find('.activity-icon');

                    $item.removeClass('unactive_row');

                    if($item.data('online') === true){
                        $item_activity_icon.removeClass('unactive').addClass('active');
                    }else{
                        $item_activity_icon.removeClass('active').addClass('unactive');
                    }

                    return false;
                };
            }
        });*/
    },

    init: function(){
        this.binds();
        core.utilities.transformToGID($('.g_id'), 'small');
    }
};