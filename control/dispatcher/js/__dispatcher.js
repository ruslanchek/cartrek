core.dispatcher = {
    maps: [],

    getAddresses: function () {
        /*$('.address_item').each(function(){
         var o = $(this);
         core.utilities.getAddressByLatLng(
         $(this).data('lat'),
         $(this).data('lng'),
         function(address){
         var result;

         if(address){
         result = address[0].formatted_address;
         }else{
         result = '&mdash;';
         };

         o.html(result);
         }
         );
         });*/
    },

    getParams: function () {
        $('.dispatcher_devices .item').each(function () {
            $(this).find('.device_hdop_indicator').html(core.utilities.getHDOPIndicator($(this).find('.device_hdop_indicator').data('hdop')));
            $(this).find('.device_csq_indicator').html(core.utilities.getCSQIndicator($(this).find('.device_csq_indicator').data('csq')));
        });
    },

    getMetrics: function () {
        $('.velocity').each(function () {
            var html = core.utilities.convertKnotsToKms($(this).data('velocity')) + ' км/ч';

            $(this).html(html);
        });

        $('.heading').each(function () {
            var heading = core.utilities.humanizeHeadingDegrees($(this).data('heading')),
                html = '<i class="heading_icon hi_' + heading.code + '" title="' + $(this).data('heading') + '&deg;"></i><span>' + heading.name + '</span>&nbsp;';

            $(this).html(html);
        });
    },

    getHeadingIcon: function (heading) {
        var degrees_zone = Math.round(parseInt(heading) / 15) * 15;

        if (isNaN(degrees_zone)) {
            degrees_zone = 0; //TODO Сделать иконку без хеадинга для NaN
        }
        ;

        if (degrees_zone == 360) {
            degrees_zone = 0;
        }
        ;

        var image = new google.maps.MarkerImage(
            '/control/map/img/markers/heading/' + degrees_zone + '.png',
            new google.maps.Size(16, 16),
            new google.maps.Point(0, 0),
            new google.maps.Point(8, 8)
        );

        var shadow = new google.maps.MarkerImage(
            '/control/map/img/markers/heading/flat_shadow.png',
            new google.maps.Size(30, 30),
            new google.maps.Point(0, 0),
            new google.maps.Point(15, 12)
        );

        var shape = {
            coord: [11, 0, 13, 1, 14, 2, 14, 3, 15, 4, 15, 5, 15, 6, 15, 7, 15, 8, 15, 9, 15, 10, 15, 11, 14, 12, 14, 13, 13, 14, 11, 15, 4, 15, 2, 14, 1, 13, 1, 12, 0, 11, 0, 10, 0, 9, 0, 8, 0, 7, 0, 6, 0, 5, 0, 4, 1, 3, 1, 2, 2, 1, 4, 0, 11, 0],
            type: 'poly'
        };

        return {
            image: image,
            shadow: shadow,
            shape: shape
        };
    },

    createMap: function (options) {
        var latlng = new google.maps.LatLng(options.lat, options.lng),
            map_options = {
                zoom: 10,
                center: latlng,
                scrollwheel: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                id: options.id,
                streetViewControl: false
            },
            map = new google.maps.Map(document.getElementById('map_' + options.id), map_options);

        return map;
    },

    createCurrentPositionMarker: function (options) {
        var icon = this.getHeadingIcon(options.heading);
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(
                options.lat,
                options.lng
            ),
            icon: icon.image,
            shadow: icon.shadow,
            shape: icon.shape,
            map: options.map,
            id: options.id
        });

        google.maps.event.addListener(marker, 'click', function () {
            options.map.panTo(marker.getPosition());
        });

        return marker;
    },

    renewItemAdditionalParams: function (data) {
        var item = $('.dispatcher_devices #item_' + data.id),
            trip_status = '',
            battery_status = '';

        //Trip status
        if (data.last_registered_point && data.last_registered_point.velocity > 0) {
            trip_status = '<span class="positive">Движется</span>';
        } else {
            trip_status = '<span class="negative">Остановка</span>';
        }
        ;

        item.find('.device_trip_status').html(trip_status);

        if (data.battery > 0) {
            battery_status = '<span>' + core.utilities.convertInputToVolts(data.battery) + ' В</span>';
        } else {
            battery_status = '<span class="negative">0.00 В</span>';
        }
        ;

        item.find('.device_battery_status').html(battery_status);

        //Params
        if (data.last_registered_point) {
            item.find('.velocity').data('velocity', data.last_registered_point.velocity);
            item.find('.heading').data('heading', data.last_registered_point.bb);
        }
        ;

        item.find('.parameters').data('csq', data.csq).data('hdop', data.hdop);

        this.getParams();
        this.getMetrics();
    },

    renewData: function () {
        this.get_renew_info = $.ajax({
            url: '/control/dispatcher/?ajax',
            data: {
                action: 'getDivicesPositions'
            },
            dataType: 'json',
            type: 'get',
            beforeSend: function () {
                if (this.get_renew_info) {
                    this.get_renew_info.abort();
                }

                core.loading.showTopIndicator();
            },
            success: function (data) {
                core.loading.hideTopIndicator();

                for (var i = 0, l = data.length; i < l; i++) {
                    for (var i1 = 0, l1 = core.dispatcher.maps.length; i1 < l1; i1++) {
                        if (data[i].id == core.dispatcher.maps[i1].map.id) {

                            if (data[i].last_registered_point) {
                                var map = core.dispatcher.maps[i1],
                                    lat = data[i].last_registered_point.lat,
                                    lng = data[i].last_registered_point.lng,
                                    address_block = $('.dispatcher_devices #item_' + map.map.id + ' .address_item');

                                if (
                                    lat != address_block.data('lat') &&
                                        lng != address_block.data('lng')
                                    ) {
                                    var new_position = new google.maps.LatLng(
                                        lat,
                                        lng
                                    );

                                    address_block.data('lat', lat);
                                    address_block.data('lng', lng);

                                    map.marker.setPosition(new_position);
                                    map.marker.setIcon(core.dispatcher.getHeadingIcon(data[i].last_registered_point.bb).image);
                                    map.map.panTo(new_position);

                                    core.dispatcher.getAddresses();
                                }
                            }

                            core.dispatcher.renewItemAdditionalParams(data[i]);
                        }
                    }
                }
            },
            error: function () {
                core.loading.hideTopIndicator();
                core.ajax.errorHandler();
            }
        });
    },

    createMaps: function () {
        $('.dispatcher_devices .item .map').each(function () {
            var item = $(this),
                map = core.dispatcher.createMap({
                    lat: item.data('lat'),
                    lng: item.data('lng'),
                    id: item.data('device_id')
                }),
                marker = core.dispatcher.createCurrentPositionMarker({
                    lat: item.data('lat'),
                    lng: item.data('lng'),
                    id: item.data('device_id'),
                    map: map,
                    heading: item.data('heading')
                });

            core.dispatcher.maps.push({
                map: map,
                marker: marker
            });
        });

        core.ticker.addIntervalMethod(function () {
            core.dispatcher.renewData();
        });
    },

    createSortable: function () {
        $('.dispatcher_devices').sortable({
            items: '.item',
            handle: '.item_head',
            cursor: 'move',
            opacity: 0.6,
            stop: function (e, ui) {
                var i = 0,
                    sorting_result = [];

                $('.dispatcher_devices .item').each(function () {
                    i++;
                    sorting_result.push({
                        id: $(this).data('id'),
                        sort: i
                    });
                });

                $.ajax({
                    url: '/control/dispatcher/?ajax&action=setDivicesSorting',
                    data: {
                        sorting_result: sorting_result
                    },
                    dataType: 'json',
                    type: 'post',
                    error: function(){
                        core.ajax.errorHandler();
                    }
                });
            }
        });
    },

    init: function () {
        this.getAddresses();
        this.getParams();
        this.getMetrics();
        this.createMaps();
        this.createSortable();

        core.ticker.delay = 100000;
        core.utilities.transformToGID($('.g_id'), 'small');
    }
};