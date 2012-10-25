core.events = {
    step: 0,
    offset: 0,
    more_items: false,
    cond: 'unreaded',

    drawItems: function(data, adding_method){
        var html = '',
            active_count = 0;

        if(!data.more_items && this.step == 0 && data.items.length < 1){
            $('#events_load_area').html('<div class="alert no-items">Нет cобытий</div>');
        }else{
            for(var i = 0, l = data.items.length; i < l; i++){
                var timestamp = core.utilities.humanizeTime(data.items[i].datetime)+ ', ' + core.utilities.humanizeDate(data.items[i].datetime, 'MYSQL'),
                    item_class = '',
                    hide_button_html = '';

                switch(data.items[i].status){
                    case '1' : {
                        item_class = 'alert-error';
                    }; break;

                    case '2' : {
                        item_class = 'alert-attention';
                    }; break;

                    case '3' : {
                        item_class = 'alert-notify';
                    }; break;

                    case '4' : {
                        item_class = 'alert-success';
                    }; break;

                    default : {
                        item_class = 'alert';
                    }; break;
                };

                if(data.items[i].active == '1'){
                    hide_button_html = '<a class="hide" href="javascript:void(0)" title="Отметить как просмотренное">−</a>';
                };

                html += '<div rel="' + data.items[i].id + '" class="event-item alert '+item_class+'">' +
                            '<span class="date">'+ timestamp + '</span>' +
                            data.items[i].message +
                            hide_button_html +
                            '<a class="close" href="javascript:void(0)" title="Удалить">&times;</a>' +
                        '</div>';

                if(data.items[i].active == '1'){
                    active_count++;
                };
            };

            if(i > 0){
                $('#events_load_area .no-items').remove();
            };
        };

        this.more_items = data.more_items;

        if(data.more_items){
            //$('#load_more').show();
        };

        if(adding_method == 'prepend'){
            $('#events_load_area').prepend(html);
        }else{
            $('#events_load_area').append(html);
        };
    },

    getItems: function(silent_loading){
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
                //$('#load_more').hide();

                if(core.events.events_loading_process){
                    core.events.events_loading_process.abort();
                    core.loading.unsetGlobalLoading();
                };

                if(silent_loading){
                    core.loading.showTopIndicator();
                }else{
                    core.loading.setGlobalLoading();
                };
            },
            success: function(data){
                core.loading.unsetGlobalLoading();

                if(silent_loading){
                    core.loading.hideTopIndicator();
                };

                core.events.drawItems(data, 'append');
                core.events.step++;
            },
            error: function(){
                core.loading.unsetGlobalLoading();
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

                if(core.events.events_loading_process){
                    core.events.events_loading_process.abort();
                    core.loading.unsetGlobalLoading();
                };

                core.loading.setGlobalLoading();
            },
            success: function(count){
                o.html();
                core.loading.unsetGlobalLoading();

                core.events.offset++;

                if(count > 0){
                    $('#global_events_counter').html(count)
                }else{
                    $('#global_events_counter').hide();
                };

                o.parent().slideUp(120, function(){
                    if(!core.events.more_items && $('.event-item:visible').length <= 0){
                        $('#events_load_area').html('<div class="alert no-items">Нет cобытий</div>');
                    };
                });
            },
            error: function(){
                core.loading.unsetGlobalLoading();
            }
        });
    },

    delEvent: function(o){
        if(confirm('Удалить событие?')){
            core.events.events_loading_process = $.ajax({
                url: '/control/events/?ajax',
                type: 'get',
                data: {
                    action  : 'delItem',
                    id      : o.parent().attr('rel'),
                    cond    : this.cond
                },
                beforeSend: function(){
                    if(core.events.events_loading_process){
                        core.events.events_loading_process.abort();
                        core.loading.unsetGlobalLoading();
                    };

                    core.loading.setGlobalLoading();
                },
                success: function(count){
                    core.loading.unsetGlobalLoading();
                    core.events.offset++;

                    //todo сделать маркер reader/unreaded для того чтобы если был удален непрочитанный эвент - то в верхнем счетчике -1 если нет - то ничего

                    if(count > 0){
                        $('#global_events_counter').html(count)
                    }else{
                        $('#global_events_counter').hide();
                    };

                    o.parent().slideUp(120, function(){
                        if(!core.events.more_items && $('.event-item:visible').length <= 0){
                            $('#events_load_area').html('<div class="alert no-items">Нет cобытий</div>');
                        };
                    });
                },
                error: function(){
                    core.loading.unsetGlobalLoading();
                }
            });
        };
    },

    delAllEvents: function(){
        core.events.events_loading_process = $.ajax({
            url: '/control/events/?ajax',
            type: 'get',
            data: {
                action  : 'delAllItems'
            },
            beforeSend: function(){
                if(core.events.events_loading_process){
                    core.events.events_loading_process.abort();
                    core.loading.unsetGlobalLoading();
                };

                core.loading.setGlobalLoading();
            },
            success: function(){
                core.loading.unsetGlobalLoading();
                $('#events_load_area').html('<div class="alert no-items">Нет cобытий</div>');
                $('#global_events_counter').hide();
                //$('#load_more').hide();
            },
            error: function(){
                core.loading.unsetGlobalLoading();
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
                if(core.events.events_loading_process){
                    core.events.events_loading_process.abort();
                    core.loading.unsetGlobalLoading();
                };

                core.loading.setGlobalLoading();
            },
            success: function(){
                core.loading.unsetGlobalLoading();
                $('#global_events_counter').hide();

                if(core.events.cond == 'unreaded'){
                    $('#events_load_area').html('<div class="alert no-items">Нет cобытий</div>');
                    //$('#load_more').hide();
                };
            },
            error: function(){
                core.loading.unsetGlobalLoading();
            }
        });
    },

    triggerAction: function(action){
        switch(action){
            case 'read_all' : {
                if(confirm('Отметить все cобытия как прочитанные?')){
                    this.hideAllEvents();
                };
            }; break;

            case 'delete_all' : {
                if(confirm('Удалить все cобытия?')){
                    this.delAllEvents();
                };
            }; break;

            case 'unreaded' :
            case 'readed' :
            case 'all' : {
                this.cond = action;
                $('#events_load_area').html('');
                core.events.step = 0;
                core.events.offset = 0;

                this.getItems();
            }; break;
        };
    },

    binds: function(){
        $('#load_more').on('click', function(){
            core.events.getItems();
        });

        $('.event-item .hide').live('click', function(){
            core.events.hideEvent($(this));
        });

        $('.event-item .close').live('click', function(){
            core.events.delEvent($(this));
        });

        $('.action_menu_item').on('click', function(){
            if(!$(this).parent().hasClass('red-button') && !$(this).parent().hasClass('gray-button')){
                $('.left-nav li').removeClass('active');
                $(this).parent().addClass('active');

                $('#events_type_header_suffix').html(' / '+$(this).html());
            };

            core.events.triggerAction($(this).data('action'));
        });
    },

    init: function(){
        this.getItems();
        this.binds();
    }
};