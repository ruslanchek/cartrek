'use strict';

core.remember_pass = {
    do: function(){
        this.remember_pass_loading_process = $.ajax({
            url: '/control/auth/remember_pass/?ajax&action=remember_pass',
            type: 'post',
            data: {
                login: $('#login').val()
            },
            dataType: 'json',
            beforeSend: function(){
                if(this.remember_pass_loading_process){
                    this.remember_pass_loading_process.abort();
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
        $('#remember_pass_form').on('submit', function(){
            core.remember_pass.do();
        });
    },

    init: function(){
        this.binds();
    }
};