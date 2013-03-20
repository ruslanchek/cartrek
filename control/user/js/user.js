var user = {
    processForm: function(){
        var form_data = {
            login           : $('#login').val(),
            email           : $('#email').val(),
            name            : $('#name').val(),
            user_timezone   : $('#user_timezone').val()
        };

        this.loading_process = $.ajax({
            url : '/control/user/?ajax&action=process_form',
            data : form_data,
            dataType : 'json',
            type : 'post',
            beforeSend: function(){
                if(user.loading_process){
                    user.loading_process.abort();
                    core.loading.unsetGlobalLoading();
                };

                core.loading.setGlobalLoading();

                $('.form_message').hide().html('');
            },
            success: function(data){
                core.loading.unsetGlobalLoading();

                if(data.result === true){
                    $('.form_message').html('<div id="ok_message">Данные сохранены <a class="close" href="javascript:void(0)">X</a></div>');

                    $('#login-display').html(data.form_data.login);
                }else{
                    if(data.form_errors.login){
                        $('#login').addClass('input-error').prev().find('.error').text(data.form_errors.login);
                    };

                    if(data.form_errors.email){
                        $('#email').addClass('input-error').prev().find('.error').text(data.form_errors.email);
                    };

                    if(data.form_errors.name){
                        $('#name').addClass('input-error').prev().find('.error').text(data.form_errors.name);
                    };
                };

                $('.form_message').slideDown(150);
            },
            error: function(){
                core.loading.unsetGlobalLoading();
            }
        });
    },

    binds: function(){
        $('#password-change-form').on('submit', function(e){
            e.preventDefault();
            user.processForm();
        });

        $('.form_message .close').live('click', function(){
            $('.form_message').slideUp(150, function(){
                $('.form_message').html('');
            });
        });
    },

    init: function(){
        this.binds();
    }
};

$(function(){
    user.init();
});