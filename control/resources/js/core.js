'use strict';

var core = {
    options: {
        cookie_options: {
            path: '/',
            expires: 365
        }
    }
};

core.ajax = {
    errorHandler: function(){
        $.ajax({
            url: '/control/meta/?json',
            type: 'get',
            dataType: 'json',
            success: function(data){
                if(data.user_logged_in !== true){
                    var html =  'Вы не авторизованы, <a href="javascript:void(0)" onclick="document.location.reload()">войдите в систему</a> заново!<br><hr>' +
                                '<em>Это могло произойти, если закончилось время сессии. Или если кто-то авторизовался в Картреке под вашем логином в другом браузере или на другом компьютере.</em>';

                    core.warning_modal.createModal(
                        'Сбой авторизации',
                        html,
                        400
                    );

                    clearInterval(core.ticker.interval);
                }
            },
            error: function(){
                core.modal.destroyModal();
            }
        })
    }
};

core.loading = {
    gl_ns_pool: {},

    showTopIndicator: function () {
        var $li = $('#loading_indicator');

        if ($li.is(':visible')) {
            $li.hide();
            $li.show();
        } else {
            $li.show();
        }
    },

    hideTopIndicator: function () {
        var $li = $('#loading_indicator');

        if ($li.is(':visible')) {
            $li.hide();
        }
    },

    unsetLoading: function (name, micro) {
        if (core.notify && $('.notify .loading_area').html() != '') {
            core.notify.hideNotify();
        }

        var $loading = $('i.loading[name="' + name + '"]');

        if (!micro) {
            this.stopAnimation(name);
        }

        this.stopAnimation(name);

        $loading.remove();
    },

    animationIteration: function (name) {
        var $loading = $('i.loading[name="' + name + '"]'),
            pos = $loading.data('pos');

        if ((pos + 42) < (42 * 12)) {
            pos += 42;
        } else {
            pos = 0;
        }

        $loading.data('pos', pos).css({
            backgroundPosition: '0 -' + pos + 'px'
        });
    },

    stopAnimation: function (name) {
        var $loading = $('i.loading[name="' + name + '"]');

        $loading.data('pos', 0);

        if ($loading.data('animation_interval') != null) {
            clearInterval($loading.data('animation_interval'));
        }
    },

    startAnimation: function (name) {
        var $loading = $('i.loading[name="' + name + '"]');
        this.stopAnimation(name);

        if (!$loading.data('animation_interval')) {
            $loading.data(
                'animation_interval',
                setInterval(function () {
                    core.loading.animationIteration(name)
                }, 70)
            );
        }
    },

    setLoadingToElementPos: function (name, obj, top, left, zIndex, micro) {
        var micro_class = new String();

        if (micro) {
            micro_class += ' micro'
        }

        if (!zIndex) {
            zIndex = 100;
        }

        var obj_offset = obj.offset();

        var $loading = $('<i name="' + name + '" class="loading' + micro_class + '"></i>').css({
            top: obj_offset.top + $loading.height() / 2 + top,
            left: obj_offset.left + $loading.width() / 2 + left,
            zIndex: zIndex
        });

        $('body').prepend($loading);

        if (!micro) {
            this.startAnimation(name);
        }

        return $loading;
    },

    setLoadingToElementCenter: function (name, obj, zIndex, micro, set_relative) {
        var micro_class = new String();

        if (micro) {
            micro_class += ' micro'
        }

        var obj_offset = obj.offset();

        if (!zIndex) {
            zIndex = 100;
        }

        var $loading = $('<i name="' + name + '" class="loading' + micro_class + '"></i>').css({
            top: obj_offset.top + obj.height() / 2,
            left: obj_offset.left + obj.width() / 2,
            zIndex: zIndex
        });

        if (set_relative) {
            obj.css({position: 'relative'});
            $loading.css({
                top: '50%',
                left: '50%',
                marginLeft: -21,
                marginTop: -21
            });
            obj.prepend($loading);
        } else {
            $('body').prepend($loading);
        }

        if (!set_relative) {
            $(window).unbind('resize').bind('resize', function () {
                var obj_offset = obj.offset();
                $loading.css({
                    top: obj_offset.top + obj.height() / 2,
                    left: obj_offset.left + obj.width() / 2
                });
            });
        }

        if (!micro) {
            this.startAnimation(name);
        }

        return $loading;
    },

    setLoadingToElementByAppend: function (name, obj, micro) {
        var micro_class = new String();

        if (micro) {
            micro_class += ' micro'
        }

        var $loading = $('<i name="' + name + '" class="loading' + micro_class + '"></i>').css({
            margin: '0'
        });

        obj.append($loading);

        if (!micro) {
            this.startAnimation(name);
        }

        return $loading;
    },

    setLoadingWithNotify: function (name, micro, text) {
        core.notify.showNotify('<h2>' + text + '</h2><div class="loading_area"></div>');
        this.setLoadingToElementByAppend(name, $('.notify .loading_area'), micro);
    },

    unsetGlobalLoading: function (ns) {
        setTimeout(function () {
            if (ns && core.loading.gl_ns_pool[ns]) {
                delete(core.loading.gl_ns_pool[ns]);
            }

            var ns_c = 0;

            $.each(core.loading.gl_ns_pool, function () {
                ns_c++;
            });

            if (ns_c > 0) {
                return;
            }

            $('div.global-loading-bar').animate({
                height: 0,
                opacity: 0
            }, 200, 'easeOutQuad', function () {
                core.loading.c = 0;

                if (core.loading.global_loading_interval) {
                    clearInterval(core.loading.global_loading_interval);
                }
            });
        }, 650);
    },

    setGlobalLoading: function (ns) {
        if (ns) {
            this.gl_ns_pool[ns] = true;
        }

        this.c = 0;

        if (this.global_loading_interval) {
            clearInterval(this.global_loading_interval);
        }

        this.global_loading_interval = setInterval(function () {
            core.loading.c += 2;
            $('div.global-loading-bar').css("backgroundPosition", "0 " + core.loading.c + "px");
        }, 8);

        $('div.global-loading-bar').animate({
            height: 5,
            opacity: 1
        }, 200, 'easeInQuad');
    }
};

core.utilities = {
    hexDec: function (hex_string) {
        hex_string = (hex_string + '').replace(/[^a-f0-9]/gi, '');
        return parseInt(hex_string, 16);
    },

    formatPhoneStr: function (str, code) {
        str = str.toString();

        var C = str.replace(/[^0-9xX]/g, ""),
            B = "";

        C = C.replace(/[xX]/g, "x");

        if (C.indexOf("x") > -1) {
            B = " " + C.substr(C.indexOf("x"));
            C = C.substr(0, C.indexOf("x"))
        }

        switch (C.length) {
            case (10):
                str = C.replace(/(...)(...)(..)(..)/g, "($1) $2-$3-$4") + B;
            case (11):
                if (C.substr(0, 1) == "1") {
                    str = C.substr(1).replace(/(...)(...)(..){..}/g, "($1) $2-$3-$4") + B
                }
                break;
        }

        if (code) {
            code = '+' + code + ' ';
        } else {
            code = '';
        }

        return code + str;
    },

    getColorChooser: function (default_color) {
        var colors_html = '',
            colors = [
                'b81616',
                '4496de',
                '9d1b1b',
                '496b33',
                '181917',
                'df4f00',
                '195b5f',
                '2c349d',
                '7a3185',
                '228867'
            ],
            classname;

        for (var i = 0, l = colors.length; i < l; i++) {
            if (colors[i] == default_color.toLowerCase()) {
                classname = 'active';
            } else {
                classname = '';
            }

            colors_html += '<li><a href="#" class="' + classname + '" data-color="' + colors[i] + '" style="background-color: #' + colors[i] + '"></a></li>';
        }

        var html = '<div class="color-chooser"><ul>' + colors_html + '</ul><div class="clear"></div></div>';

        return html;
    },

    convertToQWERTY: function (str, reverse) {
        var out = '',
            i,
            k,
            ok = true,
            rus = new Array('й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', 'Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ', 'Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', ',', 'ё', 'Ё'),
            eng = new Array('q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', '`', '~');

        for (i = 0; i < str.length; i++) {
            ok = true;

            for (k = 0; k < rus.length; k++) {
                if (str.charAt(i) == rus[k]) {
                    ok = false;
                    out = out + eng[k];
                    break;
                }
                else if (str.charAt(i) == eng[k] && reverse === true) {
                    ok = false;
                    out = out + rus[k];
                    break;
                }
            }

            if (ok == true) out = out + str.charAt(i);
        }

        return out;
    },

    numberFormat: function (str) {
        return str;
    },

    checkString: function (type, str, method) {
        var pattern;

        switch (type) {
            case 'number' :
            {
                pattern = new RegExp("[^0-9]");
            }
                break;

            case 'combined' :
            {
                pattern = new RegExp("[^0-9]|[A-Z]");
            }
                break;
        }

        if (method == 'replace') {
            str = str.replace(pattern, '');
        } else {
            str = pattern.test(str);
        }

        return str;
    },

    pad: function (number, length) {
        var str = '' + number;

        while (str.length < length) {
            str = '0' + str;
        }

        return str;
    },

    plural: function (i, str1, str3, str5) {
        function plural(a) {
            if (a % 10 == 1 && a % 100 != 11) return 0
            else if (a % 10 >= 2 && a % 10 <= 4 && ( a % 100 < 10 || a % 100 >= 20)) return 1
            else return 2;
        };

        switch (plural(i)) {
            case 0:
                return str1;
            case 1:
                return str3;
            default:
                return str5;
        }
    },

    explode: function (delimiter, string, limit) {
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

    jsonNullToEmptyString: function (str) {
        if (str === null) {
            return '';
        } else {
            return str;
        }
    },

// TODO: Попробовать заменить везде core.utilities.pad() вместо этого метода (или наоборот лучше даже)
    leadingZero: function (value, length) {
        var s = value + "";
        while (s.length < length) s = "0" + s;
        return s;
    },

    parseHDOP: function (hdop) {
        hdop = parseFloat(hdop);

        if (hdop > 0) {
            if (hdop <= 1 && hdop > 0) {
                return {percentage: 100, level_name: 'идеально', level_class: 'info'};
            }

            if (hdop > 1 && hdop <= 3) {
                return {percentage: 83.3, level_name: 'отлично', level_class: 'success'};
            }

            if (hdop > 3 && hdop <= 6) {
                return {percentage: 66.64, level_name: 'хорошо', level_class: 'success'};
            }

            if (hdop > 6 && hdop <= 8) {
                return {percentage: 49.98, level_name: 'средне', level_class: 'warning'};
            }

            if (hdop > 8 && hdop < 20) {
                return {percentage: 33.32, level_name: 'ниже среднего', level_class: 'warning'};
            }

            if (hdop >= 20) {
                return {percentage: 16.66, level_name: 'плохо', level_class: 'danger'};
            }
        } else {
            return {percentage: 0, level_name: 'нет сигнала', level_class: 'danger'};
        }
    },

    parseCSQ: function (csq) {
        if (csq) {
            csq = parseInt(csq);

            var dbm = (-113) + (csq * 2);

            if (dbm >= -77) {
                return {percentage: 100, level_name: 'идеально', level_class: 'info', dbm: dbm};
            }

            if (dbm >= -86 && dbm <= -78) {
                return {percentage: 80, level_name: 'отлично', level_class: 'success', dbm: dbm};
            }

            if (dbm >= -92 && dbm <= -87) {
                return {percentage: 60, level_name: 'хорошо', level_class: 'success', dbm: dbm};
            }

            if (dbm >= -101 && dbm <= -93) {
                return {percentage: 40, level_name: 'средне', level_class: 'warning', dbm: dbm};
            }

            if (dbm <= -102 && dbm > -113) {
                return {percentage: 20, level_name: 'ниже среднего', level_class: 'danger', dbm: dbm};
            }

            if (dbm <= -113) {
                return {percentage: 0, level_name: 'нет сигнала', level_class: 'danger', dbm: dbm};
            }

            return {percentage: 0, level_name: 'нет сигнала', level_class: 'danger', dbm: '&mdash;'};
        } else {
            return {percentage: 0, level_name: 'нет сигнала', level_class: 'danger', dbm: '&mdash;'};
        }
    },

    convertNMEAtoWGS84: function (value) {
        var nTemp = value / 100.0;
        nTemp = nTemp - (nTemp % 1);
        var flMin = value - 100.0 * nTemp;
        var result = nTemp + flMin / 60.0;
        return result.toFixed(6);
    },

    convertKnotsToKms: function (value) {
        if (value > 0) {
            return (value * 1.852).toFixed(1);
        } else {
            return 0;
        }
    },

    convertDateNMEAtoCOMMON: function (value) {
        var d = value.substring(0, 2),
            m = value.substring(2, 4),
            y = value.substring(4, 6);

        return d + '-' + m + '-' + y;
    },

    convertDateMYSQLtoCOMMON: function (value) {
        var d = value.substring(8, 10),
            m = value.substring(5, 7),
            y = value.substring(2, 4);

        return d + '-' + m + '-' + y;
    },

    tmToDate: function (date) {
        return  core.utilities.pad(date.getDate(), 2) + '-' +
            core.utilities.pad(date.getMonth() + 1, 2) + '-' +
            date.getFullYear();
    },

    humanizeHeadingDegrees: function (degree) {
        if ((degree >= 338 && degree <= 360) || (degree >= 0 && degree <= 25)) {
            return {name: 'север', code: 'n'};
        }

        if (degree >= 26 && degree <= 67) {
            return {name: 'северо-восток', code: 'ne'};
        }

        if (degree >= 68 && degree <= 112) {
            return {name: 'восток', code: 'e'};
        }

        if (degree >= 113 && degree <= 157) {
            return {name: 'юго-восток', code: 'se'};
        }

        if (degree >= 156 && degree <= 202) {
            return {name: 'юг', code: 's'};
        }

        if (degree >= 203 && degree <= 247) {
            return {name: 'юго-запад', code: 'sw'};
        }

        if (degree >= 248 && degree <= 292) {
            return {name: 'запад', code: 'w'};
        }

        if (degree >= 293 && degree <= 337) {
            return {name: 'северо-запад', code: 'nw'};
        }
    },

//2012-11-18 16:05:49 => Date() // TODO: Deprecated
    parseDateMysqlStrToDateOdject: function (str) {
        var d_str = str.substring(0, 10).split('-'),
            d = new Date();

        d.setDate(d_str[2]);
        d.setMonth(d_str[1] - 1);
        d.setFullYear(d_str[0]);

        return d;
    },

//22-11-2011 => Date()
    parseDateStrToDateOdject: function (str) {
        var d_str = str.split('-'),
            d = new Date();

        d.setDate(d_str[0] * 1);
        d.setMonth(d_str[1] - 1);
        d.setFullYear(d_str[2] * 1);

        return d;
    },

    humanizeDate: function (value, type) {
        if (!value) {
            return '&mdash;';
        }

        var d, m, y, month_names = [
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

        switch (type) {
            //TODO Check this type
            case 'NMEA' :
            {
                d = parseInt(value.substring(0, 2) * 1),
                    m = value.substring(2, 4),
                    y = value.substring(4, 6);

                return d + '&nbsp;' + month_names[parseInt(m - 1)] + ',&nbsp;20' + y;
            }
                break;

            case 'COMMON' :
            {
                value = this.explode('-', value);

                d = parseInt(value[0], 10),
                    m = parseInt(value[1], 10),
                    y = parseInt(value[2], 10);

                return d + '&nbsp;' + month_names[parseInt(m - 1)] + ',&nbsp;' + y;
            }
                break;


            //TODO Check this type
            case 'MYSQL' :
            {
                d = parseInt(value.substring(8, 10) * 1),
                    m = value.substring(5, 7),
                    y = value.substring(0, 4);

                return d + '&nbsp;' + month_names[parseInt(m - 1)] + ',&nbsp;' + y;
            }
                break;

            //TODO Check this type
            case 'MYSQLTIME' :
            {
                d = parseInt(value.substring(8, 10) * 1),
                    m = value.substring(5, 7),
                    y = value.substring(0, 4);

                return d + '&nbsp;' + month_names[parseInt(m - 1)] + ',&nbsp;' + y + ', в ' + value.substring(10);
            }
                break;

            default :
            {

                d = value.getDate(),
                    m = value.getMonth(),
                    y = value.getFullYear();

                return d + ' ' + month_names[m] + ', ' + y;
            }
        }
    },

    humanizeTime: function (value) {
        if (!value) {
            return '&mdash;';
        }

        var h = value.substring(11, 13),
            m = value.substring(14, 16),
            s = value.substring(17, 19);

        return h + ':' + m + ':' + s;
    },

    humanizeDateTime: function (date, show_time) {
        var month_names = [
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
            ],
            d = date.getDate(),
            m = date.getMonth(),
            y = date.getFullYear(),
            hou = core.utilities.pad(date.getHours(), 2),
            min = core.utilities.pad(date.getMinutes(), 2),
            sec = core.utilities.pad(date.getSeconds(), 2),
            time = '';

        if (show_time === true) {
            time = ', в ' + hou + ':' + min + ':' + sec;
        }

        return d + ' ' + month_names[m] + ',&nbsp;' + y + time;
    },

    timestampToDate: function (str) {
        if (str) {
            var t = str.split(/[- :]/);
            return new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);
        }
    },

    timestampToDateYearLast: function (str) {
        if (str) {
            var t = str.split(/[- :]/);
            return new Date(t[2], t[1] - 1, t[0], t[3] || 0, t[4] || 0, t[5] || 0);
        }
    },

    convertInputToVolts: function (val) {
        return ((val * 4.6 * 11) / 4096).toFixed(2);
    },

    getCSQIndicator: function (csq, width) {
        var csq = this.parseCSQ(csq),
            dbm = (csq.dbm < 0) ? ' (' + csq.dbm + ' dBm)' : '',
            style = '';

        if (width === true) {
            style = 'width: 100%';
        } else if (width && width !== true) {
            style = 'width: ' + width;
        }

        return '<span class="signal-indicator" style="' + style + '" title="GSM: ' + csq.level_name + dbm + '"><span class="' + csq.level_class + '" style="width: ' + csq.percentage + '%"></span></span>';
    },

    getHDOPIndicator: function (hdop, sat_count, width) {
        var hdop = this.parseHDOP(hdop),
            sats = '',
            style = '';

        if (sat_count > 0) {
            sats = ' (' + sat_count + ' ' + core.utilities.plural(sat_count, 'спутник', 'спутника', 'спутников') + ')';
        }

        if (width === true) {
            style = 'width: 100%';
        } else if (width && width !== true) {
            style = 'width: ' + width;
        }

        return '<span class="signal-indicator" style="' + style + '" title="GPS: ' + hdop.level_name + sats + '"><span class="' + hdop.level_class + '" style="width: ' + hdop.percentage + '%"></span></span>';
    },

    calculateFLSLevel: function (volts, capacity, type) {
        return volts;
    },

    getFuelIndicator: function (current_percent, total_liters, width) {
        current_percent = 29;

        var level_class = '',
            style = '';

        if (current_percent > 0) {
            if (current_percent > 99) {
                level_class = 'info';
            }

            if (current_percent > 75 && current_percent <= 99) {
                level_class = 'success';
            }

            if (current_percent > 50 && current_percent <= 75) {
                level_class = 'success';
            }

            if (current_percent > 25 && current_percent <= 50) {
                level_class = 'warning';
            }

            if (current_percent > 15 && current_percent <= 25) {
                level_class = 'warning';
            }

            if (current_percent >= 0 && current_percent <= 15) {
                level_class = 'danger';
            }
        } else {
            level_class = 'danger';
        }

        if (width === true) {
            style = 'width: 100%';
        } else if (width && width !== true) {
            style = 'width: ' + width;
        }

        return '<span class="signal-indicator" style="' + style + '" title="~' + current_percent + '% (' + Math.round(((total_liters / 100) * current_percent)) + ' из ' + total_liters + ' л)"><span class="' + level_class + '" style="width: ' + current_percent + '%"></span></span>';
    },

    getVoltsIndicator: function (v, warning_value) {
        if (v || parseFloat(v) === 0) {
            var t = v.toFixed(2) + ' В',
                html = '';

            if (!warning_value) {
                warning_value = v + 1;
            }

            if (v > 0 && v >= warning_value) {
                html = '<div class="success">' + t + '</div>';
            } else if (v < warning_value && v > 0) {
                html = '<div class="yellow">' + t + '</div>';
            } else {
                html = '<div class="error">0 В</div>';
            }

            return html;
        } else {
            return '<div class="gray">&mdash;</div>';
        }
    },

    //Google maps utils
    getAddressByLatLng: function (lat, lng, fn) {
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({
            latLng: new google.maps.LatLng(
                core.utilities.convertNMEAtoWGS84(lat),
                core.utilities.convertNMEAtoWGS84(lng)
            )
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                fn(results);
            } else {
                fn(false);
            }
        });
    },

    getGidParams: function () {
        var number = new Array();

        number[0] = new Array();
        number[0]['expr'] = /^([авекмнорстух][0-9]{3}[авекмнорстух]{2})([0-9]{2,3})$/i;
        number[0]['type'] = "Регистрационные знаки транспортных средств";
        number[0]['type_code'] = "standart";

        number[1] = new Array();
        number[1]['expr'] = /^([авекмнорстух]{2}[0-9]{3})([0-9]{2,3})$/i;
        number[1]['type'] = "Регистрационные знаки транспортных средств, используемых для коммерческой перевозки пассажиров";
        number[1]['type_code'] = "commercial";

        number[2] = new Array();
        number[2]['expr'] = /^([авекмнорстух]{1}[0-9]{4})([0-9]{2,3})$/i;
        number[2]['type'] = "Регистрационные знаки транспортных средств МВД России";
        number[2]['type_code'] = "police";

        number[3] = new Array();
        number[3]['expr'] = /^([0-9]{4}[авекмнорстух]{2})([0-9]{2,3})$/i;
        number[3]['type'] = "Регистрационные знаки транспортных средств, числящихся за воинскими формированиями федеральных органов исполнительной власти России";
        number[3]['type_code'] = "military";

        number[4] = new Array();
        number[4]['expr'] = /^([0-9]{3}cd[0-9])([0-9]{2,3})$/i;
        number[4]['type'] = "Регистрационные знаки транспортных средств дипломатических представительств и торговых представительств иностранных компаний. CD -  автомобиль с данным регистрационным знаком зарегистрирован на посла или иное лицо в ранге главы дипломатического представительства.";
        number[4]['type_code'] = "diplomacy";

        number[5] = new Array();
        number[5]['expr'] = /^([0-9]{3}cc[0-9]{1})([0-9]{2,3})$/i;
        number[5]['type'] = "Регистрационные знаки транспортных средств дипломатических представительств и торговых представительств иностранных компаний. CC — автомобиль с данным регистрационным знаком зарегистрирован на консула или иное лицо в ранге главы консульского представительства.";
        number[5]['type_code'] = "diplomacy";

        number[6] = new Array();
        number[6]['expr'] = /^([0-9]{3}t[0-9]{3})([0-9]{2,3})$/i;
        number[6]['type'] = "Регистрационные знаки транспортных средств дипломатических представительств и торговых представительств иностранных компаний. T — регистрационный знак выдан на автомобиль сотрудника дипломатического представительства, консульского учреждения, международной организации, не обладающего дипломатическим статусом (административно-технический персонал).";
        number[6]['type_code'] = "diplomacy";

        number[7] = new Array();
        number[7]['expr'] = /^([0-9]{3}d[0-9]{3})([0-9]{2,3})$/i;
        number[7]['type'] = "Регистрационные знаки транспортных средств дипломатических представительств и торговых представительств иностранных компаний. D — регистрационный знак выдан на автомобиль, принадлежащий дипломатическому представительству, консульскому учреждению, международной организации или сотруднику такого представительства (учреждения, организации), обладающего дипломатическим статусом.";
        number[7]['type_code'] = "diplomacy";

        number[8] = new Array();
        number[8]['expr'] = /^(т[авекмнорстух]{2}[0-9]{3})([0-9]{2,3})$/i;
        number[8]['type'] = "Тип № 19 Номерной знак транспортных средств,окончательно выезжающих за пределы Российской Федерации.";
        number[8]['type_code'] = "export";

        number[9] = new Array();
        number[9]['expr'] = /^([авекмнорстух]{2}[0-9]{4})([0-9]{2,3})$/i;
        number[9]['type'] = "Регистрационные знаки, устанавливаемые на прицепы.";
        number[9]['type_code'] = "trailer";

        number[10] = new Array();
        number[10]['expr'] = /^([авекмнорстух]{2}[0-9]{3}[авекмнорстух])([0-9]{2,3})$/i;
        number[10]['type'] = "Транзитные номерные знаки.";
        number[10]['type_code'] = "tranzit";

        number[11] = new Array();
        number[11]['expr'] = /^([авекмнорстух][0-9]{3}[авекмнорстух]{2})$/i;
        number[11]['type'] = "Федеральные номерные знаки.";
        number[11]['type_code'] = "federal";

        return number;
    },

    parseGId: function (str) {
        var number = this.getGidParams();

        for (var n in number) {
            var result = number[n]['expr'].test(str);

            if (result) {
                var arr = str.match(number[n]['expr']);
                return {
                    status: true,
                    id: arr[1],
                    region: arr[2],
                    type_code: number[n]['type_code'],
                    type_name: number[n]['type'],
                    country: 'ru',
                    original: str
                };
            }
        }

        return {
            status: false,
            original: str
        };
    },

    drawGId: function (val, size) {
        if(!val){
            return false;
        }

        val = val.toLowerCase();
        val = this.filterGidStr(val);

        var data = this.parseGId(val);

        var size_class = '', html = '';

        if (size == 'big') {
            size_class = 'big';
        } else {
            size_class = 'small';
        }

        if (data.status) {
            var region = '';

            if (data.region) {
                region = data.region;
            }

            html = '<span class="g_id ' + data.type_code + ' ' + size_class + '" title="' + data.type_name + '"><i class="shade"></i>' +
                '<span class="id">' + data.id + '</span>' +
                '<span class="region"><b>' + region + '</b><i><label></label><em>RUS</em></i></span>' +
                '</span>';
        } else {
            html = '<span class="g_id ' + size_class + ' default"><i class="shade"></i><span class="id">' + data.original + '</span></span>';
        }

        return html;
    },

    filterGidStr: function (str) {
        var r = /[^0-9авекмнорстухcdt]/;

        return str.replace(r, '');
    },

    transformToGID: function (o, size) {
        o.each(function () {
            $(this).after(core.utilities.drawGId($(this).text(), size));
            $(this).remove();
        });
    },

    dateObjToMYSQL: function (date) {
        return date.getFullYear() + '-' + core.utilities.leadingZero(date.getMonth(), 2) + '-' + core.utilities.leadingZero(date.getDate(), 2) + ' ' + core.utilities.leadingZero(date.getHours(), 2) + ':' + core.utilities.leadingZero(date.getMinutes(), 2) + ':' + core.utilities.leadingZero(date.getSeconds(), 2);
    },

    convertGMTDateTimes: function (date, gmt_offset) {
        var gmtDate = new Date(date);
        var date = new Date(gmtDate.getFullYear(), gmtDate.getMonth(), gmtDate.getDate(), gmtDate.getHours(), gmtDate.getMinutes(), gmtDate.getSeconds() + parseInt(gmt_offset), 0);

        return  date.getFullYear() + '-' +
            core.utilities.leadingZero(date.getMonth() + 1, 2) + '-' +
            core.utilities.leadingZero(date.getDate(), 2) + ' ' +
            core.utilities.leadingZero(date.getHours(), 2) + ':' +
            core.utilities.leadingZero(date.getMinutes(), 2) + ':' +
            core.utilities.leadingZero(date.getSeconds(), 2);
    },

    dateRange: function (startDate, currDate) {
        if (!startDate) {
            return '&mdash;';
        }

        if (!currDate) {
            currDate = new Date();
        }

        if (!(Object.prototype.toString.call(startDate) === "[object Date]")) {
            startDate = this.timestampToDate(startDate);
        }

        if (!(Object.prototype.toString.call(currDate) === "[object Date]")) {
            currDate = this.timestampToDate(currDate);
        }

        var d = new Date();
        currDate.setMinutes(currDate.getMinutes() + d.getTimezoneOffset() + global_params.timezone.offset)

        var duration = new Date(currDate - startDate),
            s = (duration.getTime() - duration.getMilliseconds()) / 1000;

        if (s < 1) {
            return 'только что';
        }

        var d = {
            days: Math.floor(s / 60 / 60 / 24),
            hours: Math.floor(s / 60 / 60),
            minutes: Math.floor(s / 60),
            seconds: s
        };

        var dc = {
            days: Math.floor(s / 60 / 60 / 24),
            hours: Math.floor(s / 60 / 60),
            minutes: Math.floor(s / 60),
            seconds: s
        };

        if (d.days > 0) {
            return dc.days + ' ' + this.plural(dc.days, 'день', 'дня', 'дней') + ' назад';
        }

        if (d.hours < 24 && d.hours > 0) {
            return dc.hours + ' ' + this.plural(dc.hours, 'час', 'часа', 'часов') + ' назад';
        }

        if (d.minutes < 60 && d.minutes > 0 && d.hours === 0 && d.days === 0) {
            return dc.minutes + ' ' + this.plural(dc.minutes, 'минуту', 'минуты', 'минут') + ' назад';
        }

        if (d.seconds < 60 && d.minutes === 0 && d.hours === 0 && d.days === 0) {
            return dc.seconds + ' ' + this.plural(dc.seconds, 'секунду', 'секунды', 'секунд') + ' назад';
        }
    }
}

core.map_tools = {
    layersList: function () {
        return {
            osm: [
                new L.TileLayer('http://{s}.tile.osmosnimki.ru/kosmo/{z}/{x}/{y}.png', {attribution: '', maxZoom: 17})
            ],

            mpn: [
                new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '', maxZoom: 17})
            ],

            qst: [
                new L.TileLayer('http://otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">', maxZoom: 17})
            ],

            hyb: [
                new L.TileLayer('http://tile.osmosnimki.ru/basesat/{z}/{x}/{y}.jpg', {attribution: '', maxZoom: 16}),
                new L.TileLayer('http://{s}.tile.osmosnimki.ru/hyb/{z}/{x}/{y}.png', {attribution: '', maxZoom: 16})
            ],

            clm: [
                new L.TileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {attribution: '', maxZoom: 18})
            ],

            mbx1: [
                new L.TileLayer('http://{s}.tiles.mapbox.com/v3/ruslanchek.map-8k9drgq5/{z}/{x}/{y}.png', {attribution: '', maxZoom: 17})
            ],

            mbx2: [
                new L.TileLayer('http://{s}.tiles.mapbox.com/v3/ruslanchek.map-e89iu6uu/{z}/{x}/{y}.png', {attribution: '', maxZoom: 17})
            ],

            mbx3: [
                new L.TileLayer('http://{s}.tiles.mapbox.com/v3/ruslanchek.map-jgqvxlts/{z}/{x}/{y}.png', {attribution: '', maxZoom: 17})
            ],

            mbx4: [
                new L.TileLayer('http://{s}.tiles.mapbox.com/v3/ruslanchek.map-z4iy8go9/{z}/{x}/{y}.png', {attribution: '', maxZoom: 17})
            ],

            wms: [
                new L.TileLayer.WMS('http://wms.latlon.org/', {layers: 'irs', crs: L.CRS.EPSG4326})
            ],

            wmsb: [
                new L.TileLayer('http://tile.osmosnimki.ru/basesat/{z}/{x}/{y}.jpg', {attribution: '', maxZoom: 17}),
                new L.TileLayer.WMS('http://wms.latlon.org/', {layers: 'bing', crs: L.CRS.EPSG4326})
            ],

            ba: [
                new L.BingLayer("An3NTLOxxMQMjGKpIUPmOblfFuGHLrw7l1HH8kwQkaSj2_6j46iCS8rSOu_0fmrK", {type: "Aerial", maxZoom: 21, minZoom: 1, errorTileUrl: "http://www.mapsmarker.com/wp-content/plugins/leaflet-maps-marker/inc/img/error-tile-image.png", detectRetina: true})
                // new L.TileLayer('http://{s}.tile.osmosnimki.ru/hyb/{z}/{x}/{y}.png', {attribution: '', maxZoom: 16})
            ],

            bal: [
                new L.BingLayer("An3NTLOxxMQMjGKpIUPmOblfFuGHLrw7l1HH8kwQkaSj2_6j46iCS8rSOu_0fmrK", {type: "AerialWithLabels", maxZoom: 21, minZoom: 1, errorTileUrl: "http://www.mapsmarker.com/wp-content/plugins/leaflet-maps-marker/inc/img/error-tile-image.png", detectRetina: true})
            ],

            br: [
                new L.BingLayer("An3NTLOxxMQMjGKpIUPmOblfFuGHLrw7l1HH8kwQkaSj2_6j46iCS8rSOu_0fmrK", {type: "Road", maxZoom: 21, minZoom: 1, errorTileUrl: "http://www.mapsmarker.com/wp-content/plugins/leaflet-maps-marker/inc/img/error-tile-image.png", detectRetina: true})
            ],

            gglsat: [
                new L.Google('SATELLITE')
            ],

            gglroad: [
                new L.Google('ROADMAP')
            ],

            gglterr: [
                new L.Google('TERRAIN')
            ],

            gglhyb: [
                new L.Google('HYBRID')
            ]
        }
    },

    getLayers: function () {
        var layer,
            map_layer = $.cookie('map-layer'),
            layers_list = this.layersList();

        if (map_layer && map_layer != '') {
            layer = layers_list[map_layer];
        } else {
            layer = layers_list.mbx1;
        }

        return layer;
    },

    getHeadingIcon: function (heading) {
        var degrees_zone = Math.round(parseInt(heading) / 15) * 15;

        if (isNaN(degrees_zone)) {
            degrees_zone = 0; //TODO Сделать иконку без хеадинга для NaN
        }

        if (degrees_zone == 360) {
            degrees_zone = 0;
        }

        return '/control/map/img/markers/heading/' + degrees_zone + '.png';
    },

    getHeadingIconSpriteOffset: function (heading) {
        var degrees_zone = Math.round(parseInt(heading) / 15) * 1;

        if (isNaN(degrees_zone)) {
            degrees_zone = 0;
        }

        if (degrees_zone == 360) {
            degrees_zone = 0;
        }

        return degrees_zone * 40;
    },

    getGeoposition: function (callback) {
        if (!callback) {
            return false;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                    callback(position, false);
                },
                function (error) {
                    switch (error.code) {
                        case error.TIMEOUT:
                            callback(false, error);
                            break;
                        case error.POSITION_UNAVAILABLE:
                            callback(false, error);
                            break;
                        case error.PERMISSION_DENIED:
                            callback(false, error);
                            break;
                        case error.UNKNOWN_ERROR:
                            callback(false, error);
                            break;
                    }
                });
        } else {
            callback(false, 'NOT_SUPPORTED');
        }
    },

    geocodingRequest: function (lat, lng, callback) {
        var url = 'http://api.tiles.mapbox.com/v3/ruslanchek.map-e89iu6uu/geocode/' + lat + ',' + lng + '.json';

        if (callback) {
            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    callback(data);
                },
                error: function () {
                    callback(false);
                }
            });
        }
    }
};

core.ui = {
    window_focus: true,

    windowFocus: function () {
        $(window).on('focus', function () {
            core.ui.window_focus = true;
        })
            .on('blur', function () {
                core.ui.window_focus = false;
            });
    },

    //Common functions
    exitUser: function () {
        if (confirm('Выйти?')) {
            $.get(
                '/control/user?exit',
                function () {
                    window.location.reload();
                }
            );
        }
    },

    // TODO: What is it???
    getRawTitle: function () {
        this.page_title_raw = $('title').html();
    },

    webkitNotificationsRequest: function () {
        if (window.webkitNotifications) {
            var havePermission = window.webkitNotifications.checkPermission();
        } else {
            return;
        }

        if (havePermission != 0) {
            window.webkitNotifications.requestPermission();
        }
    },

    getHashData: function () {
        var h = document.location.hash;

        if (h != '') {
            h = h.substr(1, h.length);
            h = h.split('&');

            var result = {};

            for (var i = 0, l = h.length; i < l; i++) {
                var part = h[i].split('=', 2);
                result[part[0]] = part[1];
            }

            return result;
        }
    },

    createSelect: function (selector, opts) {
        var options = {
            id: null,
            items: [],
            key_name: 'id',
            inner_object: false,
            value_name: 'name',
            default_opt: false,
            default: null,
            exclude: null,
            onChange: function (val) {

            }
        };

        $.extend(options, opts);

        var html = '<select id="' + options.id + '">';

        if (options.default_opt) {
            html += '<option ' + ((options.default == options.default_opt.val) ? 'selected="selected"' : '') + ' value="' + options.default_opt.val + '">' + options.default_opt.name + '</option>';
        }

        if (options.items) {
            for (var i = 0, l = options.items.length; i < l; i++) {
                // TODO: Сделать проверку на exclude
                if (
                    !(
                        options.exclude &&
                            (
                                options.items[i][options.inner_object][options.exclude.key_name] != options.exclude.value_name
                                )
                        )
                    ) {
                    if (options.inner_object) {
                        html += '<option ' + ((options.default == options.items[i][options.inner_object][options.key_name]) ? 'selected="selected"' : '') + ' value="' + options.items[i][options.inner_object][options.key_name] + '">' + options.items[i][options.inner_object][options.value_name] + '</option>';
                    } else {
                        html += '<option ' + ((options.default == options.items[i][options.key_name]) ? 'selected="selected"' : '') + ' value="' + options.items[i][options.key_name] + '">' + options.items[i][options.value_name] + '</option>';
                    }
                }
            }
        }

        html += '</select>';

        $(selector).html(html);

        $('select#' + options.id).coreUISelect({
            jScrollPane: true,
            onChange: function (e) {
                options.onChange($(e[0]).val());
            }
        });
    },

    init: function () {
        this.webkitNotificationsRequest();
        this.getRawTitle();
        this.windowFocus();

        $('.core-ui-select').coreUISelect({
            jScrollPane: true
        });

        $('.form_message').on('click', '.close', function () {
            $('.form_message').slideUp(150, function () {
                $('.form_message').html('');
            });
        });
    }
};

//Modal window class
core.modal = {
    loading_process: null,
    modal_created: false,

    prepareCode: function (header, html) {
        var code = '<div class="window modal" id="modal_window">' +
            '<a href="javascript:void(0)" id="modal_closer"></a>' +
            '<h1>' + header + '</h1>' +
            '<div class="message" title="Клик закроет это сообщение"></div>' +
            '<div class="window_content">' + html + '</div>' +
            '</div>';

        return code;
    },

    setModalDimensions: function () {
        var that = this;
        $('#modal_window.modal').css({
            width: that.width,
            marginLeft: -that.width / 2
        });
    },

    setModalPosition: function () {
        $('#modal_window.modal').css({
            marginTop: -$('#modal_window.modal').height() / 2
        });
    },

    unSetMessage: function () {
        $('#modal_window.modal .message').removeClass('ok').removeClass('error').html('').hide();
    },

    setMessage: function (data) {
        this.unSetMessage();

        var classname;

        if (data.status === true) {
            classname = 'ok';
        } else {
            classname = 'error';
        }

        $('#modal_window.modal .message').addClass(classname).html(data.message).slideDown(100);
    },

    setLoading: function () {
        this.unSetLoading();
        $('#modal_window.modal').addClass('loading-bar');
    },

    unSetLoading: function () {
        $('#modal_window.modal').removeClass('loading-bar');
    },

    createOverlay: function () {
        $('body').prepend('<div id="fs_overlay" class="modal"></div>');
        $('#fs_overlay.modal').css('background', 'black').show();
    },

    createModal: function (header, html, width) {
        this.destroyModal(true);

        var that = this;

        $('#modal_window.modal, #fs_overlay.modal').remove();
        this.width = width;

        $('body').prepend(this.prepareCode(header, html));

        $('#modal_window.modal .message').on('click', function () {
            that.unSetMessage();
        });

        this.setModalDimensions();
        this.setModalPosition();
        this.createOverlay();

        $(window).on('resize', function () {
            that.setModalPosition();
        });

        $(document).on('scroll', function () {
            that.setModalPosition();
        });

        $('body').on('scroll', function () {
            that.setModalPosition();
        });

        $('#modal_closer').on('click', function () {
            that.destroyModal();
        });

        $('body').on('keyup', function (e) {
            if (e.keyCode == 27) {
                that.destroyModal();
            }
        });

        this.modal_created = true;
    },

    destroyModal: function (instant) {
        if (this.modal_created === true) {
            $(window).off('resize');
            $(document).off('scroll');

            $('#modal_closer').off('click');
            $('body').off('scroll');
            $('body').off('keyup');

            var s = 200;

            if(instant === true){
                s = 0;
            }

            $('#modal_window.modal, #fs_overlay.modal').fadeOut(s, function () {
                $('#modal_window.modal, #fs_overlay.modal').remove();
                core.warning_modal.modal_created = false;
            });

            if (this.loading_process) {
                this.loading_process.abort();
            }

            this.modal_created = false;
        }
    }
};

//Warning window class
core.warning_modal = {
    modal_created: false,

    prepareCode: function (header, html) {
        var code = '<div class="window w_modal" id="modal_window">' +
            '<h1>' + header + '</h1>' +
            '<div class="window_content">' + html + '</div>' +
            '</div>';

        return code;
    },

    setModalDimensions: function () {
        var that = this;
        $('#modal_window.w_modal').css({
            width: that.width,
            marginLeft: -that.width / 2
        });
    },

    setModalPosition: function () {
        $('#modal_window.w_modal').css({
            marginTop: -$('#modal_window.w_modal').height() / 2
        });
    },

    createOverlay: function () {
        $('body').prepend('<div id="fs_overlay" class="w_modal"></div>');
        $('#fs_overlay.w_modal').css({
            background: 'black',
            opacity: 0.8
        }).show();
    },

    createModal: function (header, html, width) {
        this.destroyModal(true);

        var that = this;

        $('#modal_window.w_modal, #fs_overlay.w_modal').remove();
        this.width = width;

        $('body').prepend(this.prepareCode(header, html));

        $('#modal_window.w_modal .message').on('click', function () {
            that.unSetMessage();
        });

        this.setModalDimensions();
        this.setModalPosition();
        this.createOverlay();

        $(window).on('resize', function () {
            that.setModalPosition();
        });

        $(document).on('scroll', function () {
            that.setModalPosition();
        });

        $('body').on('scroll', function () {
            that.setModalPosition();
        });

        this.modal_created = true;
    },

    destroyModal: function (instant) {
        if (this.modal_created === true) {
            $(window).off('resize');
            $(document).off('scroll');

            $('body').off('scroll');
            $('body').off('keyup');

            var s = 200;

            if(instant === true){
                s = 0;
            }

            $('#modal_window.w_modal, #fs_overlay.w_modal').fadeOut(s, function () {
                $('#modal_window.w_modal, #fs_overlay.w_modal').remove();
                core.warning_modal.modal_created = false;
            });

            if (this.loading_process) {
                this.loading_process.abort();
            }
        }
    }
};

core.effects = {
    breathe: function (obj, speed_factor) {
        if (obj.is(':visible')) {
            obj.delay(800 / speed_factor).fadeTo(2000 / speed_factor, 0.3);
            obj.fadeTo(1000 / speed_factor, 1.0, function () {
                core.effects.breathe(obj, speed_factor);
            });
        }
    }
};

core.ticker = {
    interval: null,
    delay: 1000,
    interval_methods: [],

    processSystemInterval: function () {
        //console.log('GLOBAL SYSTEM INTERVAL: TICK...');
        this.callIntervalMethods();
    },

    startSystemInterval: function () {
        this.interval = setInterval('core.ticker.processSystemInterval()', this.delay);
    },

    stopSystemInterval: function () {
        clearInterval(this.interval);
    },

    callIntervalMethods: function () {
        for (var i = 0, l = this.interval_methods.length; i < l; i++) {
            this.interval_methods[i].call();
        }
    },

    addIntervalMethod: function (fn) {
        this.interval_methods.push(fn);
    },

    restartSystemInterval: function () {
        this.stopSystemInterval();
        this.startSystemInterval();
    }
};

core.events_api = {
    events_meow_duration: 10000,

    webkitNotification: function (message) {
        if (window.webkitNotifications) {
            var havePermission = window.webkitNotifications.checkPermission();

            if (havePermission == 0 && core.ui.window_focus !== true) {
                // 0 is PERMISSION_ALLOWED

                var notification = window.webkitNotifications.createNotification(
                    'http://dev.cartrek.ru/control/resources/img/big-logo-icon.png',
                    'Картрек',
                    message
                );

                notification.onclick = function () {
                    window.focus();
                    document.location.href = '/control/events/';
                    notification.close();
                };

                notification.show();
            } else {
                window.webkitNotifications.requestPermission();
            }
        }
    },

    showEventsMeow: function (data, no_wk_notify) {
        $.meow({
            title: '',
            message: data.message,
            duration: this.events_meow_duration
        });

        if (no_wk_notify !== true) {
            this.webkitNotification(data.message);
        }
    },

    pushEvent: function (data) {
        core.events_api.showEventsMeow(data);

        $.ajax({
            url: '/control/events/?ajax&action=pushEvent',
            type: 'post',
            dataType: 'json',
            data: {
                status: data.status,
                type: data.type,
                message: data.message,
                showed: 1
            }
        });
    },

    checkNewEvents: function () {
        $.ajax({
            url: '/control/events/?ajax',
            type: 'get',
            dataType: 'json',
            data: {
                action: 'checkForNewEvents'
            },
            beforeSend: function () {
                core.loading.showTopIndicator();
            },
            success: function (data) {
                core.loading.hideTopIndicator();

                if (data && data.items) {
                    if (data.items.length > 3) {
                        core.events_api.showEventsMeow({
                            message: 'У вас ' + data.items.length + ' новых ' + core.utilities.plural(data.items.length, 'уведомление', 'уведомления', 'уведомлений')
                        });
                    } else {
                        for (var i = 0, l = data.items.length; i < l; i++) {
                            core.events_api.showEventsMeow(data.items[i]);
                        }
                    }
                }

                if (data.total > 0) {
                    $('#global_events_counter, #icon-events-main-counter-bubble').show().html(data.total);
                    $('title').html(core.ui.page_title_raw + ' (' + data.total + ')');
                    $('#icon-events-main').addClass('events-active').removeClass('events-unactive');
                } else {
                    $('#global_events_counter, #icon-events-main-counter-bubble').hide().html('');
                    $('title').html(core.ui.page_title_raw);
                    $('#icon-events-main').addClass('events-unactive').removeClass('events-active');
                }

                if (core.events && data && data.items && data.items.length > 0) {
                    core.events.drawItems(data, 'prepend');
                }
            },
            error: function () {
                core.loading.hideTopIndicator();
                core.ajax.errorHandler();
            }
        });
    }
};

core.afk = {
    interval: null,
    delay: 1000,
    margin: 5000,
    startDate: null,

    startInterval: function(){
        this.startDate = new Date();

        this.interval = setInterval(function(){
            core.afk.check();
        }, this.delay);
    },

    stopInterval: function(){
        clearInterval(this.interval);
    },

    resetInterval: function(){
        this.stopInterval();
        this.startInterval();
    },

    check: function(){
        var now = new Date(),
            dif = this.startDate.getTime() - now.getTime(),
            seconds = dif / 1000,
            result = Math.abs(seconds);

        console.log(result);
    },

    init: function(){
        core.afk.startInterval();

        $('body').on('click.afk mousemove.afk keydown.afk', function(){
            core.afk.resetInterval();
        });
    }
};

core.init = function () {
    core.afk.init();

    core.ui.init();

    core.ticker.startSystemInterval();

    core.ticker.addIntervalMethod(function () {
        core.events_api.checkNewEvents();
    });

    //core.effects.breathe($('#global_events_counter'));
}

if(global_params && global_params.user_logged_in === true){
    //Object starter
    $(function () {
        core.init();
    });
};