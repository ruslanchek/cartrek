core.dispatcher = {
    getAddresses: function(){
        $('.address_item').each(function(){
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
        });
    },

    getParams: function(){
        $('.parameters').each(function(){
            var html = core.utilities.getCSQIndicator($(this).data('csq')) + core.utilities.getHDOPIndicator($(this).data('hdop'));

            $(this).html(html)
        });
    },

    getMetrics: function(){
        $('.velocity').each(function(){
            var html    = core.utilities.convertKnotsToKms($(this).data('velocity'))+' км/ч';

            $(this).html(html);
        });

        $('.heading').each(function(){
            var heading = core.utilities.humanizeHeadingDegrees($(this).data('heading')),
                html    = '<i class="heading_icon hi_'+heading.code+'" title="'+$(this).data('heading')+'&deg;"></i><span>'+heading.name+'</span>&nbsp;';

            $(this).html(html);
        });
    },

    init: function(){
        this.getAddresses();
        this.getParams();
        this.getMetrics();

        core.utilities.transformToGID($('.g_id'), 'small');
    }
};