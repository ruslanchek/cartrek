core.events = {
    step: 0,
    offset: 0,
    more_items: false,
    cond: 'unreaded',

    drawItems: function(data){
        var html = '',
            active_count = 0;

        if(!data.more_items && this.step == 0 && data.items.length < 1){
            $('#events_load_area').html('<div class="no_items">Нет уведомлений.</div>');
        }else{
            for(var i = 0, l = data.items.length; i < l; i++){
                var timestamp = core.utilities.humanizeDate(data.items[i].datetime, 'MYSQL')+', в '+core.utilities.humanizeTime(data.items[i].datetime),
                    item_class = '',
                    hide_button_html = '';

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

                if(data.items[i].active == '1'){
                    hide_button_html = '<a class="icon-eye-open" href="javascript:void(0)" title="Отметить как просмотренное"></a>';
                };

                html += '<div rel="' + data.items[i].id + '" class="alert '+item_class+' event_item">' +
                            '<b>'+ timestamp + '</b> &nbsp;&nbsp;&nbsp;' +
                            data.items[i].message +
                            hide_button_html +
                            '<a class="close" href="javascript:void(0)" title="Удалить">×</a>' +
                        '</div>';

                if(data.items[i].active == '1'){
                    active_count++;
                };
            };
        };

        this.more_items = data.more_items;

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
                action  : 'getItems',
                step    : core.events.step,
                offset  : core.events.offset,
                cond    : core.events.cond
            },
            beforeSend: function(){
                $('#load_more').hide();

                core.loading.unsetLoading('global', false);
                core.loading.setLoadingWithNotify('global', false, 'Загрузка');
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
                action  : 'hideItem',
                id      : o.parent().attr('rel'),
                cond    : this.cond
            },
            beforeSend: function(){
                o.html('&nbsp;');
                core.events.events_loading_process.abort();
                core.loading.unsetLoading('event', false);
                core.loading.setLoadingToElementCenter('event', o, 2, false);
            },
            success: function(count){
                o.html();
                core.loading.unsetLoading('event', false);

                core.events.offset++;

                if(count > 0){
                    $('#global_events_counter').html(count)
                }else{
                    $('#global_events_counter').hide();
                };

                o.parent().slideUp(120, function(){
                    if(!core.events.more_items && $('.event_item:visible').length <= 0){
                        $('#events_load_area').html('<div class="no_items">Нет уведомлений.</div>');
                    };
                });
            }
        });
    },

    delEvent: function(o){
        core.events.events_loading_process = $.ajax({
            url: '/control/events/?ajax',
            type: 'get',
            data: {
                action  : 'delItem',
                id      : o.parent().attr('rel'),
                cond    : this.cond
            },
            beforeSend: function(){
                core.events.events_loading_process.abort();
                core.loading.unsetLoading('event', false);
                core.loading.setLoadingToElementCenter('event', o, 2, false);
            },
            success: function(count){
                core.loading.unsetLoading('event', false);
                core.events.offset++;

                //todo сделать маркер reader/unreaded для того чтобы если был удален непрочитанный эвент - то в верхнем счетчике -1 если нет - то ничего

                if(count > 0){
                    $('#global_events_counter').html(count)
                }else{
                    $('#global_events_counter').hide();
                };

                o.parent().slideUp(120, function(){
                    if(!core.events.more_items && $('.event_item:visible').length <= 0){
                        $('#events_load_area').html('<div class="no_items">Нет уведомлений.</div>');
                    };
                });
            }
        });
    },

    delAllEvents: function(){
        core.events.events_loading_process = $.ajax({
            url: '/control/events/?ajax',
            type: 'get',
            data: {
                action  : 'delAllItems'
            },
            beforeSend: function(){
                core.events.events_loading_process.abort();
                core.loading.unsetLoading('global', false);
                core.loading.setLoadingWithNotify('global', false, 'Удаляем');
            },
            success: function(){
                core.loading.unsetLoading('global', false);
                $('#events_load_area').html('<div class="no_items">Нет уведомлений.</div>');
                $('#global_events_counter').hide();
                $('#load_more').hide();
            }
        });
    },

    hideAllEvents: function(){
        core.events.events_loading_process = $.ajax({
            url: '/control/events/?ajax',
            type: 'get',
            data: {
                action  : 'hideAllItems'
            },
            beforeSend: function(){
                core.events.events_loading_process.abort();
                core.loading.unsetLoading('global', false);
                core.loading.setLoadingWithNotify('global', false, 'Отмечаем');
            },
            success: function(){
                core.loading.unsetLoading('global', false);
                $('#global_events_counter').hide();

                if(core.events.cond == 'unreaded'){
                    $('#events_load_area').html('<div class="no_items">Нет уведомлений.</div>');
                    $('#load_more').hide();
                };
            }
        });
    },

    triggerAction: function(action){
        switch(action){
            case 'read_all' : {
                if(confirm('Отметить все уведомления как прочитанные?')){
                    this.hideAllEvents();
                };
            }; break;

            case 'delete_all' : {
                if(confirm('Удалить все уведомления?')){
                    this.delAllEvents();
                };
            }; break;

            case 'unreaded' :
            case 'readed' :
            case 'all' : {
                this.cond = action;
                $('#events_load_area').html('');
                core.events.step = 0;

                this.getItems();
            }; break;
        };
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

        $('.action_menu_item').on('click', function(){
            core.events.triggerAction($(this).data('action'));
        });
    },

    init: function(){
        this.getItems();
        this.binds();
    }
};