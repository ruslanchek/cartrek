var geozones = {
    map: null,
    zones_layers: null,
    geozones: {
        raw: [],
        polygons: []
    },

    m_options: {
        zoom: 4,
        coordinates: {
            lat: 55,
            lon: 35
        },
        minHeight: 250,
        height: 400
    },

    addGeozone: function (points, callback) {
        var edges = [];

        for (var i = 0, l = points.length; i < l; i++) {
            var e = [];

            if (!points[i].lat && !points[i].lng) {
                e = [points[i][0], points[i][1]];
            } else {
                e = [points[i].lat, points[i].lng];
            }

            edges.push(e);
        }

        if (edges.length > 0) {
            this.loading_process = $.ajax({
                url: '/control/user/geozones/?ajax&action=addGeozone',
                data: {
                    points: JSON.stringify(edges)
                },
                dataType: 'json',
                type: 'post',
                beforeSend: function () {
                    if (this.loading_process) {
                        this.loading_process.abort();
                        core.loading.unsetGlobalLoading();
                    }

                    core.loading.setGlobalLoading();
                },
                success: function (data) {
                    core.loading.unsetGlobalLoading();
                    data.edges = edges;
                    callback(data);
                },
                error: function () {
                    core.loading.unsetGlobalLoading();
                }
            });
        }
    },

    getGeozones: function (callback) {
        this.loading_process = $.ajax({
            url: '/control/user/geozones/?ajax',
            data: {
                action: 'getGeozones'
            },
            dataType: 'json',
            type: 'get',
            beforeSend: function () {
                if (this.loading_process) {
                    this.loading_process.abort();
                    core.loading.unsetGlobalLoading();
                }

                core.loading.setGlobalLoading();
            },
            success: function (data) {
                core.loading.unsetGlobalLoading();
                callback(data);
            },
            error: function () {
                core.loading.unsetGlobalLoading();
            }
        });
    },

    createMap: function (callback) {
        var map = new L.Map('map', {
            layers: core.map_tools.getLayers(),
            center: new L.LatLng(geozones.m_options.coordinates.lat, geozones.m_options.coordinates.lon),
            zoom: geozones.m_options.zoom
        });

        map.addControl(new L.Control.Draw({
            position: 'topright',
            polyline: false,
            circle: false,
            marker: false,
            rectangle: false,
            polygon: {
                allowIntersection: false,
                drawError: {
                    color: '#e1e100',
                    message: 'Линии зоны не могут пересекаться!'
                },
                shapeOptions: {
                    color: '#bada55'
                }
            }
        }));

        map.on('draw:poly-created', function (e) {
            geozones.addGeozone(e.poly.getLatLngs(), function (data) {
                geozones.addShape(e.poly.getLatLngs(), data);

                geozones.drawData(function () {
                    geozones.editGeozone(data.id);
                });

                /*core.events_api.pushEvent({
                 status: 4,
                 type: 1,
                 message: 'Геозона «' + data.name + '» добавлена'
                 });*/
            });
        });

        map.addControl(new L.Control.FullScreen());

        $('.leaflet-control-attribution').html('О наших <a href="/control/about#maps">картах</a>');

        setTimeout(function () {
            $('.leaflet-control-attribution').fadeOut(3000);
        }, 10000);

        callback(map);
    },

    addShape: function (lat_lngs, data) {
        var edges = [],
            opacity,
            color,
            dashArray,
            fillOpacity;

        //bounds = new L.Bounds();

        if (lat_lngs) {
            for (var i = 0, l = lat_lngs.length; i < l; i++) {
                var e = [];

                if (!lat_lngs[i].lat && !lat_lngs[i].lng) {
                    e = [lat_lngs[i][0], lat_lngs[i][1]];
                } else {
                    e = [lat_lngs[i].lat, lat_lngs[i].lng];
                }

                edges.push(e);
                //bounds.extend(new L.Point(e));
            }
        }

        if (data.active == '1') {
            opacity = 0.7;
            color = '#' + data.color;
            dashArray = null;
            fillOpacity = 0.2;
        } else {
            opacity = 0.2;
            color = '#' + data.color;
            dashArray = '5, 10';
            fillOpacity = 0.1;
        }

        //geozones.zones_layers.addLayer(e.poly);
        var polygon = L.polygon(edges, {
            color: color,
            opacity: opacity,
            id: data.id,
            weight: 3,
            dashArray: dashArray,
            fillOpacity: fillOpacity
        });

        polygon.on('click', function () {
            geozones.editGeozone(this.options.id);
        });

        var layer = geozones.zones_layers.addLayer(polygon),
            zone = this.getGeozoneRaw(data.id);

        if (zone) {
            zone.layer = layer;
            zone.edges = edges;
        }
    },

    getGeozoneRaw: function (id) {
        return $.grep(this.geozones.raw, function (n, i) {
            return (n.id == id);
        })[0];
    },

    focusToGeozone: function (id) {
        var gz = this.getGeozoneRaw(id);

        this.map.fitBounds(gz.edges);
    },

    saveGeozoneData: function (gz) {
        var name = $('#name').val(),
            active = $('#active').attr('checked'),
            sms = $('#sms').attr('checked'),
            email = $('#email').attr('checked'),
            notify = '0',
            color = $('#color').val();

        if (active == 'checked') {
            active = '1';
        } else {
            active = '0';
        }


        /**
         * 0 - no sms, no email
         * 1 - sms only
         * 2 - email only
         * 3 - both
         */

        if (sms != 'checked' && email != 'checked') {
            notify = '0';
        } else if (sms == 'checked' && email != 'checked') {
            notify = '1';
        } else if (sms != 'checked' && email == 'checked') {
            notify = '2';
        } else if (sms == 'checked' && email == 'checked') {
            notify = '3';
        }


        if (!name) {
            core.modal.setMessage({
                status: false,
                message: 'Введите название геозоны'
            });

            return false;
        }

        core.modal.loading_process = $.ajax({
            url: '/control/user/geozones/?ajax&action=editGeozone',
            data: {
                id: gz.id,
                active: active,
                notify: notify,
                name: name,
                color: color
            },
            type: 'post',
            dataType: 'json',
            beforeSend: function () {
                core.modal.unSetMessage();
                core.modal.setLoading();
            },
            success: function (data) {
                core.modal.unSetLoading();

                if (data.status === true) {
                    core.modal.setMessage(data);
                    geozones.drawData();

                } else {
                    core.modal.setMessage(data);
                }
            },
            error: function () {
                core.modal.unSetLoading();
                core.modal.setMessage({
                    status: false,
                    message: 'Ошибка связи с срвером, повторите попытку'
                });
            }
        });
    },

    editGeozone: function (id) {
        var gz = this.getGeozoneRaw(id);

        this.focusToGeozone(id);

        var active = '',
            sms,
            email;

        if (gz.active == '1') {
            active = 'checked';
        }

        switch (gz.notify) {
            case '0':
            {
                sms = '';
                email = '';
            }
                break;

            case '1':
            {
                sms = 'checked';
                email = '';
            }
                break;

            case '2':
            {
                sms = '';
                email = 'checked';
            }
                break;

            case '3':
            {
                sms = 'checked';
                email = 'checked';
            }
                break;
        }

        var html = '<form id="edit-geozone-form" class="forms columnar white" method="POST">' +
            '<div class="form_message"></div>' +

            '<ul>' +

            '<li>' +
            '<fieldset>' +
            '<section class="bold"><label for="active">Активность</label></section>' +
            '<input id="active" name="active" type="checkbox" ' + active + ' value="1" />' +
            '</fieldset>' +
            '</li>' +

            '<li>' +
            '<label for="name" class="bold">Название <span class="error"></span></label>' +
            '<input class="text width-50" style="width: 50%" type="text" name="name" id="name" value="' + gz.name + '" />' +
            '</li>' +

            '<li>' +
            '<label for="color" class="bold">Цвет <span class="error"></span></label>' +
            '<input type="hidden" name="color" id="color" value="' + gz.color + '" />' +
            core.utilities.getColorChooser(gz.color) +
            '</li>' +

            '<li>' +
            '<fieldset>' +
            '<section class="bold">Уведомления</section>' +
            '<label style="display: inline; margin: 0 15px 0 0"><input id="sms" type="checkbox" ' + sms + ' value="1" /> СМС</label>' +
            '<label style="display: inline;"><input id="email" type="checkbox" ' + email + ' value="1" /> Электронная почта</label>' +
            '</fieldset>' +
            '</li>' +

            '<hr>' +

            '<li class="push">' +
            '<input type="submit" name="send" class="btn blue float-left" value="Сохранить" />' +
            '<input type="button" id="delete-geozone" class="btn red float-left" value="Удалить" />' +
            '</li>' +

            '</ul>' +

            '<div class="clear"></div>' +
            '</form>';

        core.modal.createModal(
            'Редактирование геозоны',
            html,
            550
        );

        $('.color-chooser a').on('click', function () {
            $('.color-chooser a').removeClass('active');
            $('#color').val($(this).data('color'));
            $(this).addClass('active');
        });

        $('#edit-geozone-form').on('submit', function (e) {
            e.preventDefault();

            geozones.saveGeozoneData(gz);
        });

        $('#delete-geozone').on('click', function () {
            geozones.delete(gz.id, gz.name);
        });

        $('#name').focus();
    },

    delete: function (id, name) {
        if (confirm('Удалить геозону «' + name + '»?')) {
            core.modal.loading_process = $.ajax({
                url: '/control/user/geozones/?ajax&action=deleteGeozone',
                data: {
                    id: id
                },
                type: 'get',
                beforeSend: function () {
                    core.modal.unSetMessage();
                    core.modal.setLoading();
                },
                success: function () {
                    core.modal.unSetLoading();
                    core.modal.destroyModal();

                    geozones.drawData();
                },
                error: function () {
                    core.modal.unSetLoading();
                    core.modal.setMessage({
                        status: false,
                        message: 'Ошибка связи с срвером, повторите попытку'
                    });
                }
            });
        }
    },

    drawMenu: function (data) {
        console.log(data)

        var html = '<ul>';

        for (var i = 0, l = data.length; i < l; i++) {
            var classname;

            if (data[i].active == '1') {
                classname = '';
            } else {
                classname = 'unactive';
            }

            html += '<li class="' + classname + '"><a id="gz-item-' + data[i].id + '" data-id="' + data[i].id + '" href="#"><i data-id="' + data[i].id + '"></i><span>' + data[i].name + '</span></a></li>';
        }

        html += '</ul>';

        $('.geozones-menu').html(html);

        $('.geozones .geozones-menu ul li a i').on('click', function (e) {
            geozones.focusToGeozone($(this).data('id'));

            e.stopPropagation();
        });

        $('.geozones .geozones-menu ul li a').on('click', function (e) {
            geozones.editGeozone($(this).data('id'));

            e.preventDefault();
        });
    },

    drawData: function (callback) {
        if (this.zones_layers) {
            this.map.removeLayer(this.zones_layers);
            this.zones_layers = new L.LayerGroup();
        }

        geozones.getGeozones(function (data) {
            geozones.geozones.raw = data;

            if (data) {
                geozones.drawMenu(data);

                for (var i = 0, l = data.length; i < l; i++) {
                    geozones.addShape(JSON.parse(data[i].points), {
                        name: data[i].name,
                        id: data[i].id,
                        active: data[i].active,
                        color: data[i].color
                    });
                }

                geozones.map.addLayer(geozones.zones_layers);

                if (callback) {
                    callback();
                }

                //geozones.map.fitBounds(geozones.zones_layers.getBounds());
            }
        });
    },

    init: function () {
        this.zones_layers = new L.LayerGroup();

        this.createMap(function (map) {
            geozones.map = map;

            core.map_tools.getGeoposition(function (position) {
                geozones.map.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));
                geozones.map.setZoom(11);
            });

            if ($.cookie('map-gz-height') && $.cookie('map-gz-height') > geozones.m_options.minHeight) {
                $('#map, .map-container').css({
                    height: parseInt($.cookie('map-gz-height'))
                });

                $('.geozones-menu').css({
                    height: parseInt($.cookie('map-gz-height')) + 15
                });
            } else {
                $('#map, .map-container').css({
                    height: geozones.m_options.height
                });

                $('.geozones-menu').css({
                    height: geozones.m_options.height + 15
                });
            }

            geozones.map.invalidateSize();

            $('.map-container').resizable({
                handles: 's',
                minHeight: geozones.m_options.minHeight,
                resize: function (event, ui) {
                    $('#map').css({
                        height: ui.size.height,
                        width: $('.map-container').width() - 1
                    });

                    $('.geozones-menu').css({
                        height: 0
                    });

                    $('.geozones-menu').css({
                        height: ui.size.height + 15
                    });

                    if (geozones.map) {
                        geozones.map.invalidateSize();
                    }

                    $.cookie('map-gz-height', ui.size.height, core.options.cookie_options);
                }
            });

            $(window).on('resize', function () {
                $('#map').css({
                    width: $('.map-container').width() - 1
                });

                if (geozones.map) {
                    geozones.map.invalidateSize();
                }
            });

            geozones.drawData();
        });
    }
};