<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml" class="auth_body">
    <head>
        {include file="common/head.tpl"}

        <script>
            $(function(){
                $('.socials a').hover(function(){
                     $(this).find('img').stop().animate({
                         left: 28
                     }, 120);

                    $(this).find('.label').show();

                    if($(this).hasClass('part_l')){
                        $('.socials a.part_l').stop().animate({
                            width: '70%'
                         }, 160);

                        $('.socials a.part_r').stop().animate({
                          width: '30%'
                       }, 160);
                    };

                    if($(this).hasClass('part_r')){
                      $('.socials a.part_l').stop().animate({
                          width: '30%'
                       }, 160);

                      $('.socials a.part_r').stop().animate({
                        width: '70%'
                     }, 160);
                  };

                }, function(){
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
            });
        </script>
    </head>

    <body class="login-body">
        <div class="login-content">
            <a href="http://cartrek.ru" class="auth-logo">Картрек</a>
            {include file="modules/`$core->module.name`.tpl"}
        </div>
    </body>
</html>