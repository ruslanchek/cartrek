var user_groups = {
    addGroup: function () {
        var name = $('#new_fleet_name').val();

        if (!name) {
            core.modal.setMessage({
                status: false,
                message: 'Введите название новой группы'
            });

            return false;
        }

        core.modal.loading_process = $.ajax({
            url: '/control/user/groups/?ajax&action=addNewFleet',
            data: {
                name: name
            },
            type: 'post',
            dataType: 'json',
            beforeSend: function () {
                core.modal.unSetMessage();
                core.modal.setLoading();
            },
            success: function (data) {
                core.modal.unSetLoading();

                if (data.status === true) {
                    core.modal.setMessage(data);
                    core.modal.destroyModal();

                    var html = '<tr>' +
                                    '<td>'+data.data.name+'</td>' +
                                    '<td>0</td>' +
                                    '<td>' +
                                        '<a href="javascript:void(0)" class="red delete-btn delete-group" data-count="0" data-id="'+data.data.id+'" data-name="'+data.data.name+'">Удалить</a>' +
                                    '</td>' +
                                '</tr>';

                    $('#groups-table tbody').prepend(html);

                    user_groups.binds();

                } else {
                    core.modal.setMessage(data);
                }
            },
            error: function () {
                core.modal.unSetLoading();
                core.modal.setMessage({
                    status: false,
                    message: 'Ошибка связи с срвером, повторите попытку'
                });
            }
        });
    },

    addGroupModal: function () {
        var html = '<form id="add-group-form" class="forms columnar white" method="POST">' +
            '<div class="form_message"></div>' +

            '<ul>' +

            '<li class="form-item">' +
            '<label for="new_fleet_name" class="bold">Название <span class="error"></span></label>' +
            '<input class="text width-50" style="width: 50%" type="text" name="new_fleet_name" id="new_fleet_name" value="" />' +
            '</li>' +

            '<hr>' +

            '<li class="push">' +
            '<input type="submit" name="send" class="btn blue float-left" value="Добавить" />' +
            '</li>' +

            '</ul>' +

            '<div class="clear"></div>' +
            '</form>';

        core.modal.createModal(
            'Новая группа',
            html,
            550
        );

        $('#add-group-form').on('submit', function (e) {
            e.preventDefault();

            user_groups.addGroup();
        });

        $('#new_fleet_name').focus();
    },

    binds: function () {
        $('#additional-button').off('click').on('click', function (e) {
            user_groups.addGroupModal();
            e.preventDefault();
        });

        $('.delete-group').off('click').on('click', function (e) {
            if ($(this).data('count') > 0) {
                alert('Невозможно удалить группу, пока в ней состоит хотя бы одна машина!');
            } else {
                if (confirm('Удалить группу «' + $(this).data('name') + '»?')) {
                    document.location.href = '/control/user/groups?action=delete&id=' + $(this).data('id');
                }
            }

            e.preventDefault();
        });
    },

    init: function () {
        this.binds();
    }
};

$(function () {
    user_groups.init();
});