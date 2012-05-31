core.events = {
    step: 0,

    drawItems: function(data){
        var html = '',
            active_count = 0,
            new_count = parseInt($('#global_events_counter').html());

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

                html += '<div rel="' + data.items[i].id + '" class="alert '+item_class+' event_item">' +
                            '<b>'+ timestamp + '</b> &nbsp;&nbsp;&nbsp;' +
                            data.items[i].message +
                            '<a class="icon-eye-open" href="javascript:void(0)" title="Отметить как просмотренное"></a>' +
                            '<a class="close" href="javascript:void(0)" title="Удалить">×</a>' +
                        '</div>';

                if(data.items[i].active == '1'){
                    active_count++;
                };
            };
        };

        if(new_count - active_count > 0){
            $('#global_events_counter').html(new_count - active_count);
        }else{
            $('#global_events_counter').hide();
        };

        if(data.more_items){
            $('#load_more').show();
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
                $('#load_more').hide();

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

    hideEvent: function(o){
        core.events.events_loading_process = $.ajax({
            url: '/control/events/?ajax',
            type: 'get',
            data: {
                action  : 'delItem',
                id      : o.parent().attr('rel')
            },
            beforeSend: function(){
                o.html('&nbsp;');
                core.loading.unsetLoading('event', false);
                core.loading.setLoadingToElementCenter('event', o, 2, false);
            },
            success: function(count){
                o.html();
                core.loading.unsetLoading('event', false);
                o.parent().slideUp(120);

                if(count > 0){
                    $('#global_events_counter').html(count)
                }else{
                    $('#global_events_counter').hide();
                };
            }
        });
    },

    delEvent: function(o){

    },

    binds: function(){
        $('#load_more').on('click', function(){
            core.events.getItems();
        });

        $('.event_item .icon-eye-open').live('click', function(){
            core.events.hideEvent($(this));
        });

        $('.event_item .close').live('click', function(){
            core.events.delEvent($(this));
        });
    },

    init: function(){
        this.getItems();
        this.binds();
    }
};