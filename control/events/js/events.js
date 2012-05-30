core.events = {
    step: 0,

    drawItems: function(data){
        var html = '';

        if(!data.more_items && this.step == 0 && data.items.length < 1){
            $('#events_load_area').html('<div class="no_items">Нет уведомлений.</div>');
        }else{
            for(var i = 0, l = data.items.length; i < l; i++){
                var timestamp = core.utilities.humanizeDate(data.items[i].datetime, 'MYSQL')+', в '+core.utilities.humanizeTime(data.items[i].datetime),
                    item_class = '';

                switch(data.items[i].status){
                    case '1' : {
                        item_class = 'alert-error';
                    }; break;

                    case '2' : {
                        item_class = '';
                    }; break;

                    case '3' : {
                        item_class = 'alert-info';
                    }; break;

                    case '4' : {
                        item_class = 'alert-success';
                    }; break;
                };

                html += '<div class="alert '+item_class+' event_item"><b>'+ timestamp + '</b> &nbsp;&nbsp;&nbsp;' + data.items[i].message+'<a class="icon-eye-open" href="javascript:void(0)" title="Отметить как просмотренное"></a><a class="close" data-dismiss="alert" href="javascript:void(0)" title="Удалить">×</a></div>';
            };
        };

        if(data.more_items){
            $('#load_more').show();
        }else{
            $('#load_more').hide();
        };

        $('#events_load_area').append(html);
    },

    getItems: function(){
        core.events.events_loading_process = $.ajax({
            url: '/control/events/?ajax',
            type: 'get',
            dataType: 'json',
            data: {
                action: 'getItems',
                step: core.events.step
            },
            beforeSend: function(){
                core.loading.unsetLoading('global', false);
                core.loading.setLoadingWithNotify('global', false, 'Загрузка данных');
            },
            success: function(data){
                core.loading.unsetLoading('global', false);

                core.events.drawItems(data);
                core.events.step++;
            }
        });
    },

    binds: function(){
        $('#load_more').on('click', function(){
            core.events.getItems();
        });
    },

    init: function(){
        this.getItems();
        this.binds();
    }
};