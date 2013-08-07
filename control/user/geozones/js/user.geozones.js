var geozones = {
    map: null,
    edit_trigger: false,
    create_trigger: false,
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

                    if (data.status === false) {
                        core.events_api.showEventsMeow({
                            message: data.message
                        }, true);
                    } else {
                        data.edges = edges;
                        callback(data);
                    }
                },
                error: function () {
                    core.loading.unsetGlobalLoading();
                    core.ajax.errorHandler();
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
                core.ajax.errorHandler();
            }
        });
    },

    initMapControls: function () {
        if (!this.map) {
            return false;
        }

        if (this.controls && this.controls.length > 0) {
            for (var i = 0, l = this.controls.length; i < l; i++) {
                this.map.removeControl(this.controls[i]);
            }
        }

        this.controls = [];

        this.controls.push(new L.Control.Draw({
            draw: {
                polyline: false,
                marker: false,
                rectangle: false,
                circle: false,
                position: 'topleft',
                polygon: {
                    title: 'Нарисовать геозону',
                    allowIntersection: false,
                    drawError: {
                        color: '#e1e100',
                        message: 'Линии зоны не могут пересекаться!',
                        timeout: 2500
                    },
                    shapeOptions: {
                        color: '#bada55'
                    }
                }
            },
            edit: {
                featureGroup: this.zones_layers,
                remove: false
            }
        }));

        // this.controls.push(new L.Control.FullScreen());
        this.controls.push(new L.Control.Locate());
        this.controls.push(new L.Control.Scale({
            imperial: false,
            maxWidth: 150
        }));

        for (var i = 0, l = this.controls.length; i < l; i++) {
            this.map.addControl(this.controls[i]);
        }

        this.map.on('draw:created', function (e) {
            if (geozones.create_trigger === true) {
                return false;
            }

            geozones.create_trigger = true;

            geozones.addGeozone(e.layer.getLatLngs(), function (data) {
                geozones.addShape(e.layer.getLatLngs(), data);

                geozones.drawData(function () {
                    geozones.editGeozone(data.id);
                    geozones.create_trigger = false;
                });

                /*core.events_api.pushEvent({
                 status: 4,
                 type: 1,
                 message: 'Геозона «' + data.name + '» добавлена'
                 });*/
            });
        });

        this.map.on('draw:drawstart', function (e) {
            geozones.edit_trigger = true;
        });

        this.map.on('draw:drawstop', function (e) {
            geozones.edit_trigger = false;
        });

        this.map.on('draw:edited', function (e) {
            geozones.saveShapes(e.layers);
            geozones.setResizer();
        });
    },

    saveShapes: function (layers) {
        var data = [];

        layers.eachLayer(function (layer) {
            var edges = [];

            for (var i = 0, l = layer._latlngs.length; i < l; i++) {
                edges.push([
                    layer._latlngs[i].lat,
                    layer._latlngs[i].lng
                ]);
            }

            geozones.getGeozoneRaw(layer.options.id).edges = edges;
            geozones.getGeozoneRaw(layer.options.id).points = JSON.stringify(edges);

            data.push({
                id: layer.options.id,
                points: geozones.getGeozoneRaw(layer.options.id).points
            });
        });

        this.loading_process = $.ajax({
            url: '/control/user/geozones/?ajax&action=saveShapes',
            data: {shapes: data},
            dataType: 'json',
            type: 'post',
            beforeSend: function () {
                if (this.loading_process) {
                    this.loading_process.abort();
                    core.loading.unsetGlobalLoading();
                }

                core.loading.setGlobalLoading();
            },
            success: function () {
                core.loading.unsetGlobalLoading();
                geozones.drawData();
            },
            error: function () {
                core.loading.unsetGlobalLoading();
                core.ajax.errorHandler();
            }
        });
    },

    createMap: function (callback) {
        this.map = new L.Map('map', {
            layers: core.map_tools.getLayers(),
            center: new L.LatLng(geozones.m_options.coordinates.lat, geozones.m_options.coordinates.lon),
            zoom: geozones.m_options.zoom
        });

        $('.leaflet-control-attribution').html('О наших <a href="/control/about#maps">картах</a>');

        setTimeout(function () {
            $('.leaflet-control-attribution').fadeOut(3000);
        }, 10000);

        callback();
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
            active = $('#active').prop('checked'),
            sms = $('#sms').prop('checked'),
            email = $('#email').prop('checked'),
            notify = '0',
            color = $('#color').val();

        if (active === true) {
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

        if (sms !== true && email !== true) {
            notify = '0';
        } else if (sms === true && email !== true) {
            notify = '1';
        } else if (sms !== true && email === true) {
            notify = '2';
        } else if (sms === true && email === true) {
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
                core.modal.setMessage(data);

                if (data.status === true) {
                    geozones.drawData();
                }
            },
            error: function () {
                core.modal.unSetLoading();
                core.modal.setMessage({
                    status: false,
                    message: 'Ошибка связи с срвером, повторите попытку'
                });
                core.ajax.errorHandler();
            }
        });
    },

    editGeozone: function (id) {
        if (this.edit_trigger === true) {
            return false;
        }

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

        var html = '<form id="edit-geozone-form" class="form-vertical" method="POST">' +
            '<div class="form_message"></div>' +

            '<div class="control-group">' +
                '<label class="checkbox">' +
                    '<input id="active" name="active" type="checkbox" ' + active + ' value="1" /> Активность' +
                '</label>' +
            '</div>' +

            '<div class="control-group">' +
            '<label for="new_fleet_name" class="control-label">Название <span class="error"></span></label>' +
            '<div class="controls">' +
            '<input type="text" name="name" id="name" value="' + gz.name + '" />' +
            '</div>' +
            '</div>' +

            '<div class="control-group">' +
                '<label for="new_fleet_name" class="control-label">Цвет <span class="error"></span></label>' +
                '<input type="hidden" name="color" id="color" value="' + gz.color + '" />' +
                '<div class="controls">' +
                    core.utilities.getColorChooser(gz.color) +
                '</div>' +
            '</div>' +

            '<div class="control-group">' +
            '<label class="control-label">Уведомления</label>' +
            '<label class="checkbox"><input id="sms" type="checkbox" checked data-toggle="switch" ' + sms + ' value="1" /> СМС</label>' +
            '<label class="checkbox"><input id="email" type="checkbox" checked data-toggle="switch" ' + email + ' value="1" /> Электронная почта</label>' +
            '</div>' +



            '<hr>' +

            '<div class="control-group">' +
            '<input type="submit" name="send" class="btn btn-embossed btn-primary btn-info" value="Сохранить" />' +
            '<input type="button" id="delete-geozone" class="btn btn-embossed btn-danger btn-info" value="Удалить" />' +
            '</div>' +

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
                    core.ajax.errorHandler();
                }
            });
        }
    },

    drawMenu: function () {
        var html = '<ul>';

        for (var i = 0, l = this.geozones.raw.length; i < l; i++) {
            var classname;

            if (this.geozones.raw[i].active == '1') {
                classname = '';
            } else {
                classname = 'unactive';
            }

            html += '<li class="' + classname + '">' +
                '<a id="gz-item-' + this.geozones.raw[i].id + '" data-id="' + this.geozones.raw[i].id + '" href="#">' +
                '<i class="fui-eye" title="Показать на карте" data-id="' + this.geozones.raw[i].id + '"></i>' +
                '<span title="Редактировать">' + this.geozones.raw[i].name + '</span>' +
                '</a>' +
                '</li>';
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
            this.zones_layers = new L.FeatureGroup();
        }

        geozones.getGeozones(function (data) {
            geozones.geozones.raw = data;

            if (data) {
                geozones.drawMenu();

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

                // geozones.map.fitBounds(geozones.zones_layers.getBounds());

                geozones.initMapControls();

                geozones.map.fitBounds(geozones.zones_layers.getBounds());
            }
        });
    },

    setResizer: function () {
        $(window).off('resize.geozones-map').on('resize.geozones-map', function () {
            $('#map').css({
                width: 0
            });

            $('#map').css({
                width: $('.map-container').width()
            });

            if (geozones.map) {
                geozones.map.invalidateSize();
            }
        });
    },

    editByHash: function () {
        if (core.ui.getHashData() && core.ui.getHashData().geozone > 0) {
            var edit_id = core.ui.getHashData().geozone;

            if (this.getGeozoneRaw(edit_id)) {
                this.editGeozone(edit_id);
            }
        }
    },

    init: function () {
        this.zones_layers = new L.FeatureGroup();

        this.createMap(function () {
            var height = 0;

            if ($.cookie('map-gz-height') > 0) {
                height = $.cookie('map-gz-height');
            } else {
                height = geozones.m_options.height;
            }

            $('#map, .map-container').css({
                height: height
            });

            $('.geozones-menu').css({
                height: height
            });

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

            geozones.setResizer();

            geozones.drawData(function(){
                if (core.ui.getHashData() && core.ui.getHashData().geozone > 0) {
                    geozones.editByHash();
                }

                $(window).on('hashchange', function () {
                    geozones.editByHash();
                });
            });
        });
    }
};