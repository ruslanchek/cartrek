var remember_pass = {
    focus: function () {
        $('#login').focus();
    },

    buttons: function () {
        $('.socials a').hover(function () {
            $(this).find('img').stop().animate({
                left: 28
            }, 120);

            $(this).find('.label').show();

            if ($(this).hasClass('part_l')) {
                $('.socials a.part_l').stop().animate({
                    width: '70%'
                }, 160);

                $('.socials a.part_r').stop().animate({
                    width: '30%'
                }, 160);
            }

            if ($(this).hasClass('part_r')) {
                $('.socials a.part_l').stop().animate({
                    width: '30%'
                }, 160);

                $('.socials a.part_r').stop().animate({
                    width: '70%'
                }, 160);
            }

        }, function () {
            $(this).find('img').stop().animate({
                left: '50%'
            }, 120);

            $(this).find('.label').hide();

            $('.socials a.part_l').stop().animate({
                width: '50%'
            }, 160);

            $('.socials a.part_r').stop().animate({
                width: '50%'
            }, 160);
        });
    },

    init: function () {
        this.focus();
        this.buttons();
    }
};

$(function () {
    remember_pass.init();
});