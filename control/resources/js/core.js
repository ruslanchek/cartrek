var core = {
    options: {
        cookie_options: { path: '/', expires: 365 }
    }
};

core.forms = {
    readDataFormSettingsTable: function(id){
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
                                    '<a href="javascript:void(0)" class="btn btn-primary save_modal pull-left" autocomplete="off">Сохранить</a>' +
                                    '<a href="javascript:void(0)" class="btn close_modal pull-left">Закрыть</a>' +
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

        if(options.width){
            var w, m;

            if(typeof options.width == 'number'){
                w = options.width;
                m = -options.width/2;
            }else{
                w = options.width;
                m = -options.width.substring(0, options.width.length - 1) / 2+'%';
            };

            $('.modal').css({
                width: w,
                marginLeft: m
            });
        };
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
    },

    leadingZero: function(value, length){
        var s = value+"";
        while (s.length < length) s = "0" + s;
        return s;
    },

    parseHDOP: function(hdop){
        hdop = parseFloat(hdop);

        if(hdop > 0){
            if(hdop <= 1 && hdop > 0){
                return {percentage: 100, level_name: 'идеально', level_class: 'info'};
            };

            if(hdop > 1 && hdop <= 3){
                return {percentage: 83.3, level_name: 'отлично', level_class: 'success'};
            };

            if(hdop > 3 && hdop <= 6){
                return {percentage: 66.64, level_name: 'хорошо', level_class: 'success'};
            };

            if(hdop > 6 && hdop <= 8){
                return {percentage: 49.98, level_name: 'средне', level_class: 'warning'};
            };

            if(hdop > 8 && hdop <= 20){
                return {percentage: 33.32, level_name: 'ниже среднего', level_class: 'warning'};
            };

            if(hdop > 20){
                return {percentage: 16.66, level_name: 'плохо', level_class: 'danger'};
            };
        }else{
            return {percentage: 0, level_name: 'нет сигнала', level_class: 'danger'};
        };
    },

    parseCSQ: function(csq){
        if(csq){
            var dbm = (-113) + (csq * 2);

            if(dbm >= -77){
                return {percentage: 100, level_name: 'идеально', level_class: 'info', dbm: dbm};
            };

            if(dbm >= -86 && dbm < -78){
                return {percentage: 80, level_name: 'отлично', level_class: 'success', dbm: dbm};
            };

            if(dbm >= -92 && dbm < -87){
                return {percentage: 60, level_name: 'хорошо', level_class: 'success', dbm: dbm};
            };

            if(dbm >= -101 && dbm < -93){
                return {percentage: 40, level_name: 'средне', level_class: 'warning', dbm: dbm};
            };

            if(dbm <= -102 && dbm > -113){
                return {percentage: 20, level_name: 'ниже среднего', level_class: 'danger', dbm: dbm};
            };

            if(dbm <= -113){
                return {percentage: 0, level_name: 'нет сигнала', level_class: 'danger', dbm: dbm};
            };
        }else{
            return {percentage: 0, level_name: 'нет сигнала', level_class: 'danger', dbm: dbm};
        };
    },

    convertNMEAtoWGS84: function(value){
        var nTemp = value / 100.0;
        nTemp = nTemp - (nTemp%1);
        var flMin = value - 100.0 * nTemp;
        var result = nTemp + flMin / 60.0;
        return result.toFixed(6);
    },

    convertKnotsToKms: function(value){
        return (value * 1.852).toFixed(1);
    },

    convertDateNMEAtoCOMMON: function(value){
        var d = value.substring(0, 2),
            m = value.substring(2, 4),
            y = value.substring(4, 6);

        return d+'-'+m+'-'+y;
    },

    convertDateMYSQLtoCOMMON: function(value){
        var d = value.substring(8, 10),
            m = value.substring(5, 7),
            y = value.substring(2, 4);

        return d+'-'+m+'-'+y;
    },

    humanizeHeadingDegrees: function(degree){
        if((degree >= 338 && degree <= 360) || (degree >= 0 && degree <= 25)){
            return {name:'север', code: 'n'};
        };

        if(degree >= 26 && degree <= 67){
            return {name:'северо-восток', code: 'ne'};
        };

        if(degree >= 68 && degree <= 112){
            return {name:'восток', code: 'e'};
        };

        if(degree >= 113 && degree <= 157){
            return {name:'юго-восток', code: 'se'};
        };

        if(degree >= 156 && degree <= 202){
            return {name:'юг', code: 's'};
        };

        if(degree >= 203 && degree <= 247){
            return {name:'юго-запад', code: 'sw'};
        };

        if(degree >= 248 && degree <= 292){
            return {name:'запад', code: 'w'};
        };

        if(degree >= 293 && degree <= 337){
            return {name:'северо-запад', code: 'nw'};
        };
    },

    humanizeDate: function(value, type){
        if(!type){
            type = 'NMEA';
        };

        var d, m, y, m_humanized, month_names = [
            'января',
            'февраля',
            'марта',
            'апреля',
            'мая',
            'июня',
            'июля',
            'августа',
            'сентября',
            'октября',
            'ноября',
            'декабря'
        ];

        switch(type){
            case 'NMEA' : {
                d = value.substring(0, 2),
                m = value.substring(2, 4),
                y = value.substring(4, 6);

                return d+' '+month_names[parseInt(m) - 1]+', 20'+y;
            }; break;

            case 'COMMON' : {
                d = value.substring(0, 2),
                m = value.substring(3, 5),
                y = value.substring(6, 11);

                return d+' '+month_names[parseInt(m) - 1]+', '+y;
            }; break;

            case 'MYSQL' : {
                d = value.substring(8, 10),
                m = value.substring(5, 7),
                y = value.substring(0, 4);

                return d+' '+month_names[parseInt(m) - 1]+', '+y;
            }; break;
        };
    },

    humanizeTime: function(value){
        var h = value.substring(11, 13),
            m = value.substring(14, 16),
            s = value.substring(17, 19);

        return h + ':' + m + ':' + s;
    },

    getCSQIndicator: function(csq){
        var csq = this.parseCSQ(csq);
        return '<div title="GSM: '+csq.level_name+' ('+csq.dbm+' dBm)" class="indicator csq_indicator progress progress-'+csq.level_class+'" style="margin-bottom: 0; height: 16px;"><div class="bar" style="width: '+csq.percentage+'%;"></div></div>';
    },

    getHDOPIndicator: function(hdop){
        var hdop = this.parseHDOP(hdop);
        return '<div title="GPS: '+hdop.level_name+'" class="indicator hdop_indicator progress progress-'+hdop.level_class+'" style="margin-bottom: 0; height: 16px;"><div class="bar" style="width: '+hdop.percentage+'%;"></div></div>';
    },

    //Google maps utils
    getAddressByLatLng: function(lat, lng, fn){
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({
            latLng: new google.maps.LatLng(
                core.utilities.convertNMEAtoWGS84(lat),
                core.utilities.convertNMEAtoWGS84(lng)
            )
        }, function(results, status){
            if(status == google.maps.GeocoderStatus.OK){
                fn(results);
            }else{
                fn(false);
            };
        });
    }
};

core.timer = {
    interval: null,
    delay: 1000,

    processSystemInterval: function(){
        console.log('GLOBAL SYSTEM INTERVAL: TICK...');
    },

    startSystemInterval: function(){
        this.interval = setInterval('core.timer.processSystemInterval()', this.delay);
    },

    stopSystemInterval: function(){
        clearInterval(this.interval);
    },

    restartSystemInterval: function(){
        this.stopSystemInterval();
        this.startSystemInterval();
    }
};


//Common functions
core.exitUser = function(){
    if(confirm('Выйти?')){
        $.get(
            '/control/user?exit',
            function(){
                window.location.reload();
            }
        );
    };
};

$(function(){
    core.timer.startSystemInterval();
});