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
            },
            success: function(data){
                core.loading.unsetGlobalLoading();

                if(data.result === true){

                };
            },
            error: function(){
                core.loading.unsetGlobalLoading();
                data_ctrl.error();
            }
        });
    },

    binds: function(){
        $('#user-form').on('submit', function(e){
            e.preventDefault();

            user.processForm();
        });
    },

    init: function(){
        this.binds();
    }
};

$(function(){
    user.init();
});