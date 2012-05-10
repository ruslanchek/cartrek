'use strict';

core.login = {
    do: function(){
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

                $('#submit').button('loading');
            },
            success: function(data){
                $('#submit').button('reset');

                var message_class = '';

                if(data.status === true){
                    message_class = 'alert-success';
                }else{
                    message_class = 'alert-error';
                };

                $('#form_message').html('<div class="alert '+message_class+'"><a class="close" data-dismiss="alert" href="javascript:void(0)">×</a>'+data.message+'</div>');
            }
        })
    },

    binds: function(){
        $('#login_form').on('submit', function(){
            core.login.do();
        });
    },

    init: function(){
        this.binds();
    }
};