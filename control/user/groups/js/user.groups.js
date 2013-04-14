var user_groups = {
    addGroup: function(){
        var name = $('#new_fleet_name').val();

        if(!name){
            core.modal.setMessage({
                status: false,
                message: 'Введите название новой группы'
            });

            return false;
        };

        $.ajax({
            url: '/control/user/groups/?ajax&action=addNewFleet',
            data: {
                name    : name
            },
            type: 'post',
            dataType: 'json',
            beforeSend: function(){
                core.modal.setLoading();
            },
            success: function(data){
                core.modal.unSetLoading();

                if(!data.status){
                    core.modal.setMessage(data);
                }else{
                    document.location.reload();
                };
            },
            error: function(){
                core.modal.unSetLoading();
                core.modal.setMessage({
                    status: false,
                    message: 'Ошибка связи с срвером, повторите попытку'
                });
            }
        });
    },

    addGroupModal: function(){
        var html =  '<input type="text" placeholder="Название группы" id="new_fleet_name">';

        core.modal.createModal(
            'Создание группы',
            html,
            450
        );

        $('#new_fleet_name').focus();
    },

    binds: function(){
        $('#additional-button').on('click', function(e){
            user_groups.addGroupModal();
            e.preventDefault();
        });

        $('.delete-group').on('click', function(e){
            if($(this).data('count') > 0){
                alert('Невозможно удалить группу, пока в ней состоит хотя бы одна машина!');
            }else{
                if(confirm('Удалить группу «'+$(this).data('name')+'»?')){
                    document.location.href = '/control/user/groups?action=delete&id='+$(this).data('id');
                };
            };

            e.preventDefault();
        });
    },

    init: function(){
        this.binds();
    }
};

$(function(){
    user_groups.init();
});