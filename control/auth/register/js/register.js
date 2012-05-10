'use strict';

core.register = {
    doRegister: function(){
        this.register_loading_process = $.ajax({
            url: '/control/auth/register/?ajax&action=register',
            type: 'post',
            data: {
                email: $('#email').val()
            },
            dataType: 'json',
            beforeSend: function(){
                if(this.register_loading_process){
                    this.register_loading_process.abort();
                };

                $('#register_submit').button('loading');
            },
            success: function(data){
                $('#register_submit').button('reset');

                var message_class = '';

                if(data.status === true){
                    message_class = 'alert-success';
                    setTimeout('document.location.href="/control"', 2000);
                }else{
                    message_class = 'alert-error';
                };

                $('#register_form_message').html('<div class="alert '+message_class+'"><a class="close" data-dismiss="alert" href="javascript:void(0)">×</a>'+data.message+'</div>');
            }
        })
    },

    binds: function(){
        $('#register_form').on('submit', function(){core.register.doRegister()});
    },

    init: function(){
        this.binds();
    }
};