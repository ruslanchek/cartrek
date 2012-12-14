var user_system = {
    init: function(){
        if(!$.cookie('map-layer')){
            $('.map-types .item[rel="mbx"]').addClass('active');
        }else{
            $('.map-types .item[rel="'+$.cookie('map-layer')+'"]').addClass('active');
        };

        $('.map-types .item').on('click', function(e){
            $.cookie('map-layer', $(this).attr('rel'), core.options.cookie_options);

            $('.map-types .item').removeClass('active');
            $(this).addClass('active');

            e.preventDefault();
        });
    }
};

$(function(){
    user_system.init();
});