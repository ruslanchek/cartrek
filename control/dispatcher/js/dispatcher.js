"use strict";

/**
 *  Car implementation
 **/
var DCar = function (id) {
    /* Instances */
    this.instance_map = null;
    this.instance_pos_marker = null;

    this.params = {
        id: id
    };

    /* Class constructor */
    this.__construct = function () {
        this.createMap();
    };

    /* Methods */
    this.createMap = function () {
        this.instance_map = new Map({
            map_container_id: 'car-map-' + this.params.id,
            scroll: false,
            controls: {
                fullscreen: false,
                locate: false,
                scale: false
            }
        });
    };

    /* Init actions */
    this.__construct();
};

/**
 *  View implementation
 **/
var View = function () {
    /* Class constructor */
    this.__construct = function () {
        this.gridInit();
        this.createSortable();
    };

    /* Methods */
    this.gridInit = function(){
        core.utilities.transformToGID($('.g_id'), 'small');

        $('.dispatcher .item .map').hover(function(){
            $(this).find('.leaflet-control-container').show();
        }, function(){
            $(this).find('.leaflet-control-container').fadeOut(150);
        });
    };

    this.createSortable = function () {
        $('.dispatcher').sortable({
            items: '.brick',
            handle: '.head',
            cursor: 'move',
            opacity: 0.75,
            stop: function (e, ui) {
                var i = 0,
                    sorting_result = [];

                $('.dispatcher .item').each(function () {
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
                    beforeSend: function(){
                        core.loading.setGlobalLoading('dispatcher.sorting');
                    },
                    success: function(){
                        core.loading.unsetGlobalLoading('dispatcher.sorting');
                    },
                    error: function(){
                        core.loading.unsetGlobalLoading('dispatcher.sorting');
                    }
                });
            }
        });
    };

    /* Init actions */
    this.__construct();
};

/**
 *  Data implementation
 **/
var Data = function () {
    this.cars = [];

    /* Class constructor */
    this.__construct = function () {
        this.gridInit();
    };

    /* Methods */
    this.gridInit = function () {
        var t = this;

        $('.dispatcher .item').each(function () {
            t.cars.push(new DCar($(this).data('id')));
        });
    };

    /* Init actions */
    this.__construct();
};

var MC = {
    init: function () {
        this.View = new View();
        this.Data = new Data();
        //this.Data.__construct();
    }
}

$(function () {
    MC.init();
});