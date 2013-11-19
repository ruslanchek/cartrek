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
                    core.modal.destroyModal(false, 500);

                    var html = '<tr class="group-row" rel="' + data.data.id + '">' +
                        '<td><strong><a rel="' + data.data.id + '" class="group-edit" href="#" data-id="' + data.data.id + '" data-name="' + data.data.name + '">' + data.data.name + '</a></strong></td>' +
                        '<td>0</td>' +
                        '<td>' +
                        '<a href="javascript:void(0)" class="btn red delete-btn group-delete" data-count="0" data-id="' + data.data.id + '" data-name="' + data.data.name + '">Удалить</a>' +
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

                core.ajax.errorHandler();
            }
        });
    },

    editGroup: function (id) {
        var name = $('#name').val();

        if (!name) {
            core.modal.setMessage({
                status: false,
                message: 'Введите название группы'
            });

            return false;
        }

        core.modal.loading_process = $.ajax({
            url: '/control/user/groups/?ajax&action=editFleet',
            data: {
                name: name,
                id: id
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

                    $('#groups-table a.group-edit[rel="' + id + '"]').html(name);

                } else {
                    core.modal.setMessage(data);
                }

                core.ajax.errorHandler();
            },
            error: function () {
                core.modal.unSetLoading();
                core.modal.setMessage({
                    status: false,
                    message: 'Ошибка связи с срвером, повторите попытку'
                });

                core.ajax.errorHandler();
            }
        });
    },

    addGroupModal: function () {
        var html = '<form id="add-group-form" class="forms columnar white" method="POST">' +
            '<div class="form_message"></div>' +

            '<ul>' +

            '<li class="form-item">' +
            '<label for="new_fleet_name" class="bold">Название <span class="error"></span></label>' +
            '<input class="text width-50" style="width: 50%" type="text" name="new_fleet_name" id="new_fleet_name" value="Новая группа" />' +
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

    editGroupModal: function (data) {
        var html = '<form id="edit-group-form" class="forms columnar white" method="POST">' +
            '<div class="form_message"></div>' +

            '<ul>' +

            '<li class="form-item">' +
            '<label for="new_fleet_name" class="bold">Название <span class="error"></span></label>' +
            '<input class="text width-50" style="width: 50%" type="text" name="name" id="name" value="' + data.name + '" />' +
            '</li>' +

            '<hr>' +

            '<li class="push">' +
            '<input type="submit" name="send" class="btn blue float-left" value="Сохранить" />' +
            '</li>' +

            '</ul>' +

            '<div class="clear"></div>' +
            '</form>';

        core.modal.createModal(
            'Редактирование группы',
            html,
            550
        );

        $('#edit-group-form').on('submit', function (e) {
            e.preventDefault();

            user_groups.editGroup(data.id);
        });

        $('#name').focus();
    },

    editByHash: function () {
        if (core.ui.getHashData() && core.ui.getHashData().fleet > 0) {
            var edit_id = core.ui.getHashData().fleet;

            if ($('.group-edit[rel="' + edit_id + '"]').length > 0) {
                user_groups.editGroupModal($('.group-edit[rel="' + edit_id + '"]').data());
            }
        }
    },

    binds: function () {
        if (core.ui.getHashData() && core.ui.getHashData().fleet > 0) {
            this.editByHash();
        }

        $(window).on('hashchange', function () {
            user_groups.editByHash();
        });

        $('#additional-button').off('click').on('click', function (e) {
            user_groups.addGroupModal();
            e.preventDefault();
        });

        $('.group-delete').off('click').on('click', function (e) {
            if ($(this).data('count') > 0) {
                alert('Невозможно удалить группу, пока в ней состоит хотя бы один автомобиль!');
            } else {
                if (confirm('Удалить группу «' + $(this).data('name') + '»?')) {
                    var id = $(this).data('id');

                    user_groups.loading_process = $.ajax({
                        url: '/control/user/groups?ajax&action=deleteFleet',
                        data: {
                            id: id
                        },
                        dataType: 'json',
                        type: 'get',
                        beforeSend: function () {
                            if (user_groups.loading_process) {
                                user_groups.loading_process.abort();
                                core.loading.unsetGlobalLoading();
                            }

                            core.loading.setGlobalLoading();
                        },
                        success: function (data) {
                            core.loading.unsetGlobalLoading();
                            $('.group-row[rel="' + data.id + '"]').remove();
                        },
                        error: function () {
                            core.loading.unsetGlobalLoading();
                            core.ajax.errorHandler();
                        }
                    });
                }
            }

            e.preventDefault();
        });

        $('.group-edit').off('click').on('click', function (e) {
            user_groups.editGroupModal($(this).data());

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