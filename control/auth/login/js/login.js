'use strict';

core.login = {
    doLogin: function(){
        this.login_loading_process = $.ajax({
            url: '/control/auth/login/?ajax&action=login',
            type: 'post',
            data: {
                login: $('#login').val(),
                password: $('#password').val()
            },
            dataType: 'json',
            beforeSend: function(){
                if(this.login_loading_process){
                    this.login_loading_process.abort();
                };

                $('#login_submit').button('loading');
            },
            success: function(data){
                $('#login_submit').button('reset');

                var message_class = '';

                if(data.status === true){
                    message_class = 'alert-success';
                }else{
                    message_class = 'alert-error';
                };

                $('#login_form_message').html('<div class="alert '+message_class+'"><a class="close" data-dismiss="alert" href="javascript:void(0)">×</a>'+data.message+'</div>');
            }
        })
    },

    binds: function(){
        $('#login_form').on('submit', function(){core.login.doLogin()});
    },

    init: function(){
        this.binds();
    }
};