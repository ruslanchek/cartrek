var core = {
    options: {
        cookie_options: { path: '/', expires: 365 }
    }
};

core.forms = {
    redaDataFormSettingsTable: function(id){
        var result = {};

        $('.settings_table#'+id).find('input').each(function(){
            result[$(this).attr('id')] = $(this).val();
        });

        return result;
    },

    drawSettingsTable: function(id, options){
        var options_html = new String(),
            on, off;

        for(var i = 0, l = options.length; i < l; i++){
            if(options[i].value >= 1){
                on = 'active';
                off = '';
            }else{
                on = '';
                off = 'active';
            };

            options_html += '<tr>' +
                                '<th>'+options[i].label+'</th>' +
                                '<td>' +
                                    '<div class="btn-group" data-toggle="buttons-radio">' +
                                        '<button data-value="1" class="btn '+on+'">Вкл</button>' +
                                        '<button data-value="0" class="btn '+off+'">Выкл</button>' +
                                    '</div>' +
                                    '<input type="hidden" id="'+options[i].id+'" value="'+options[i].value+'" />' +
                                '</td>' +
                            '</tr>';

        };

        var $html = $('<table id="'+id+'" class="settings_table">'+options_html+'</table>');

        $html.find('.btn').on('click', function(){
            $(this).parent().next('input').val($(this).data('value'));
        });

        return $html;
    }
};

core.modal = {
    modal: null,

    hide: function(){
        this.modal.remove();
    },

    unSetLoading: function(){
        this.modal.find('.save_modal').button('reset');
    },

    setLoading: function(){
        this.modal.find('.save_modal').button('loading');
    },

    show: function(options){
        var $modal_html = $('<div class="modal_overlay"></div>' +
                            '<div class="modal">' +
                                '<div class="modal-header">' +
                                    '<a class="close" data-dismiss="modal">×</a>' +
                                    '<h3>' + options.header + '</h3>' +
                                '</div>' +
                                '<div class="modal-body"></div>' +
                                '<div class="modal-footer">' +
                                    '<a href="javascript:void(0)" class="btn close_modal">Закрыть</a>' +
                                    '<a href="javascript:void(0)" class="btn btn-primary save_modal" autocomplete="off">Сохранить</a>' +
                                '</div>' +
                            '</div>');

        $modal_html.hide();
        $modal_html.find('.modal-body').html(options.content);
        $modal_html.find('a.close, a.close_modal').on('click', function(){
            core.modal.hide();
        });

        $modal_html.find('a.close, a.save_modal')
            .on('click', function(){
                options.action();
            })
            .data('loading-text', 'Сохранение...');


        $('body').prepend($modal_html);

        $modal_html.fadeIn(100);

        this.modal = $modal_html;
    }
};

core.notify = {
    showNotify: function(content){
        $('.notify').remove();
        var html = '<div class="notify">'+content+'</div>';
        $('body').prepend(html);

        var $notify = $('.notify');
        $notify.css({
            marginTop: -$notify.height()/2
        });
    },

    hideNotify: function(){
        var $notify = $('.notify');
        $notify.fadeOut(100, function(){
            $notify.remove();
        });
    }
};

core.loading = {
    unsetLoading: function(name, micro){
        if($('.notify .loading_area').html() != ''){
            core.notify.hideNotify();
        };

        var $loading = $('i.loading[name="'+name+'"]');

        if(!micro){
            this.stopAnimation(name);
        };

        this.stopAnimation(name);

        $loading.remove();
    },

    animationIteration: function(name){
        var $loading = $('i.loading[name="'+name+'"]'),
            pos = $loading.data('pos');

        if((pos + 42) < (42*12)){
            pos += 42;
        }else{
            pos = 0;
        };

        $loading.data('pos', pos).css({
            backgroundPosition: '0 -' + pos + 'px'
        });
    },

    stopAnimation: function(name){
        var $loading = $('i.loading[name="'+name+'"]');

        $loading.data('pos', 0);

        if($loading.data('animation_interval') != null){
            clearInterval($loading.data('animation_interval'));
        };
    },

    startAnimation: function(name){
        var $loading = $('i.loading[name="'+name+'"]');
        this.stopAnimation(name);

        if(!$loading.data('animation_interval')){
            $loading.data(
                'animation_interval',
                setInterval(function(){core.loading.animationIteration(name)}, 70)
            );
        };
    },

    setLoadingToElementPos: function(name, obj, top, left, zIndex, micro){
        var micro_class = new String();

        if(micro){
            micro_class += ' micro'
        };

        if(!zIndex){
            zIndex = 100;
        };

        var obj_offset = obj.offset();

        var $loading = $('<i name="'+name+'" class="loading'+micro_class+'"></i>').css({
            top     : obj_offset.top + $loading.height()/2 + top,
            left    : obj_offset.left + $loading.width()/2 + left,
            zIndex  : zIndex
        });

        $('body').prepend($loading);

        if(!micro){
            this.startAnimation(name);
        };

        return $loading;
    },

    setLoadingToElementCenter: function(name, obj, zIndex, micro){
        var micro_class = new String();

        if(micro){
            micro_class += ' micro'
        };

        var obj_offset = obj.offset();

        if(!zIndex){
            zIndex = 100;
        };

        var $loading = $('<i name="'+name+'" class="loading'+micro_class+'"></i>').css({
            top     : obj_offset.top + obj.height()/2,
            left    : obj_offset.left + obj.width()/2,
            zIndex  : zIndex
        });

        $('body').prepend($loading);

        $(window).unbind('resize').bind('resize', function(){
            var obj_offset = obj.offset();
            $loading.css({
                top     : obj_offset.top + obj.height()/2,
                left    : obj_offset.left + obj.width()/2
            });
        });

        if(!micro){
            this.startAnimation(name);
        };

        return $loading;
    },

    setLoadingToElementByAppend: function(name, obj, micro){
        var micro_class = new String();

        if(micro){
            micro_class += ' micro'
        };

        var $loading = $('<i name="'+name+'" class="loading'+micro_class+'"></i>').css({
            margin  : '0'
        });

        obj.append($loading);

        if(!micro){
            this.startAnimation(name);
        };

        return $loading;
    },

    setLoadingWithNotify: function(name, micro, text){
        core.notify.showNotify('<h2>'+text+'</h2><div class="loading_area"></div>');
        this.setLoadingToElementByAppend(name, $('.notify .loading_area'), micro);
    }
};

core.utilities = {
    plural: function(i, str1, str3, str5){
        function plural (a){
            if ( a % 10 == 1 && a % 100 != 11 ) return 0
            else if ( a % 10 >= 2 && a % 10 <= 4 && ( a % 100 < 10 || a % 100 >= 20)) return 1
            else return 2;
        };

        switch (plural(i)) {
            case 0: return str1;
            case 1: return str3;
            default: return str5;
        };
    },

    explode: function(delimiter, string, limit) {
        var emptyArray = {
            0: ''
        };

        // third argument is not required
        if (arguments.length < 2 || typeof arguments[0] == 'undefined' || typeof arguments[1] == 'undefined') {
            return null;
        }

        if (delimiter === '' || delimiter === false || delimiter === null) {
            return false;
        }

        if (typeof delimiter == 'function' || typeof delimiter == 'object' || typeof string == 'function' || typeof string == 'object') {
            return emptyArray;
        }

        if (delimiter === true) {
            delimiter = '1';
        }

        if (!limit) {
            return string.toString().split(delimiter.toString());
        }
        // support for limit argument
        var splitted = string.toString().split(delimiter.toString());
        var partA = splitted.splice(0, limit - 1);
        var partB = splitted.join(delimiter.toString());
        partA.push(partB);
        return partA;
    },

    jsonNullToEmptyString: function(str){
        if(str === null){
            return '';
        }else{
            return str;
        };
    }
};