var security = {
    processForm: function(){
        var form_data = {
            old_password       : $('#old_password').val(),
            new_password       : $('#new_password').val(),
            new_password_again : $('#new_password_again').val()
        };

        this.loading_process = $.ajax({
            url : '/control/user/password_change/?ajax&action=process_form',
            data : form_data,
            dataType : 'json',
            type : 'post',
            beforeSend: function(){
                if(security.loading_process){
                    security.loading_process.abort();
                    core.loading.unsetGlobalLoading();
                };

                core.loading.setGlobalLoading();

                $('.form_message').hide().html('');
            },
            success: function(data){
                core.loading.unsetGlobalLoading();

                if(data.result === true){
                    $('.form_message').html('<div id="ok_message">Пароль изменен, на ваш адрес выслан ваш новый пароль <a class="close" href="javascript:void(0)">X</a></div>');
                }else{
                    if(data.form_errors.old_password){
                        $('#old_password').addClass('input-error').prev().find('.error').text(data.form_errors.old_password);
                    };

                    if(data.form_errors.new_password){
                        $('#new_password').addClass('input-error').prev().find('.error').text(data.form_errors.new_password);
                    };

                    if(data.form_errors.new_password_again){
                        $('#new_password_again').addClass('input-error').prev().find('.error').text(data.form_errors.new_password_again);
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
            security.processForm();
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
    security.init();
});