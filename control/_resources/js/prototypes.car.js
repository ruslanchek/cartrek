var CarInfo = function(){
    this.scene = null;

    this.show = function(){
        var view_3d_html = '<div class="bar-3d">' +
                                '<div class="tridiv">' +
                                    '<div class="scene">' +
                                        '<div class="shape cuboid-1 cub-1">' +
                                            '<div class="face ft">' +
                                                '<div class="photon-shader" style="background-color: rgba(255, 255, 255, 0.0862745);"></div>' +
                                            '</div>' +
                                            '<div class="face bk">' +
                                                '<div class="photon-shader" style="background-color: rgba(0, 0, 0, 0.729412);"></div>' +
                                            '</div>' +
                                            '<div class="face rt">' +
                                                '<div class="photon-shader" style="background-color: rgba(0, 0, 0, 0.607843);"></div>' +
                                            '</div>' +
                                            '<div class="face lt">' +
                                                '<div class="photon-shader" style="background-color: rgba(0, 0, 0, 0.0313726);"></div>' +
                                            '</div>' +
                                            '<div class="face bm">' +
                                                '<div class="photon-shader" style="background-color: rgba(0, 0, 0, 0.423529);"></div>' +
                                            '</div>' +
                                            '<div class="face tp">' +
                                                '<div class="photon-shader" style="background-color: rgba(0, 0, 0, 0.215686);"></div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>';


        var html = '<div class="car-info">' + view_3d_html + '</div>';

        $('body').prepend(html);

        this.scene = $('.bar-3d .scene');

        this.rotateScene(0, 0, 0);
    };

    this.rotateScene = function(x, y, z){
        var transform = 'rotateX(' + x + 'deg) rotateY(' + y + 'deg) rotateZ(' + z + 'deg)';

        $('.bar-3d .cub-1').css({
            '-webkit-transform' : transform,
            '-moz-transform'    : transform,
            '-ms-transform'     : transform,
            'transform'         : transform
        });
    };
};