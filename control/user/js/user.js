var user = {
    processForm: function () {
        var form_data = {
            login: $('#login').val(),
            email: $('#email').val(),
            name: $('#name').val(),
            user_timezone: $('#user_timezone').val()
        };

        this.loading_process = $.ajax({
            url: '/control/user/?ajax&action=process_form',
            data: form_data,
            dataType: 'json',
            type: 'post',
            beforeSend: function () {
                if (user.loading_process) {
                    user.loading_process.abort();
                    core.loading.unsetGlobalLoading();
                }

                core.loading.setGlobalLoading();

                $('.form_message').hide().html('');

                $('#login, #email, #name').removeClass('input-error').prev().find('.error').html('');
            },
            success: function (data) {
                core.loading.unsetGlobalLoading();

                if (data.result === true) {
                    $('.form_message').html('<div id="ok_message">Данные сохранены <a class="close" href="javascript:void(0)">×</a></div>');

                    $('#login-display').html(data.form_data.login);
                    $('#login').val(data.form_data.login);
                } else {
                    if (data.form_errors.login) {
                        $('#login').addClass('input-error').prev().find('.error').text(data.form_errors.login);
                    }

                    if (data.form_errors.email) {
                        $('#email').addClass('input-error').prev().find('.error').text(data.form_errors.email);
                    }

                    if (data.form_errors.name) {
                        $('#name').addClass('input-error').prev().find('.error').text(data.form_errors.name);
                    }

                    $('#login').val(data.form_data.login);
                }

                $('.form_message').slideDown(150);
            },
            error: function () {
                core.loading.unsetGlobalLoading();
            }
        });
    },

    phones: {
        json_string: '',
        phones: null,

        convertToJSON: function () {
            this.json_string = JSON.stringify(this.phones);
        },

        init: function (phones) {
            if (phones != '') {
                try {
                    this.phones = JSON.parse(phones);
                    this.json_string = phones;
                } catch (e) {
                    this.phones = [];
                    this.json_string = '[]';
                }
            } else {
                this.phones = [];
                this.json_string = '[]';
            }

            this.draw();
        },

        phoneEditor: function(){
            var html = '<form id="edit-geozone-form" class="forms columnar white" method="POST">' +
                        '<div class="form_message"></div>' +

                        '<ul>' +

                        '<li>' +
                        '<fieldset>' +
                        '<section class="bold"><label for="active">Активность</label></section>' +
                        '<input id="active" name="active" type="checkbox" checked value="1" />' +
                        '</fieldset>' +
                        '</li>' +

                        '<li>' +
                        '<label for="phone" class="bold">Номер <span class="error"></span></label>' +
                        '<input class="text width-50" style="width: 50%" type="text" name="phone" id="phone" value="" />' +
                        '</li>' +

                        '<hr>' +

                        '<li class="push">' +
                        '<input type="submit" name="send" class="btn blue float-left" value="Сохранить" />' +
                        '<input type="button" id="delete-phone" class="btn red float-left" value="Удалить" />' +
                        '</li>' +

                        '</ul>' +

                        '<div class="clear"></div>' +
                        '</form>';

            core.modal.createModal(
                'Добавление телефонного номера',
                html,
                550
            );
        },

        draw: function () {
            var html = '';

            if (this.phones && this.phones.length > 0) {
                for (var i = 0, l = this.phones.length; i < l; i++) {
                    if (this.phones[i].phone) {
                        html = '<div class="item">' + core.utilities.formatPhoneStr(this.phones[i].phone, 7) + '</div>';
                    }
                }
            }

            html += '<a id="add-phone" href="javascript:void(0)" class="btn gray">+ Добавить номер</a>';

            $('#phones-table').html(html);

            $('#add-phone').on('click', function(){
                user.phones.phoneEditor();
            });
        }
    },

    binds: function () {
        $('#user-form').on('submit', function (e) {
            e.preventDefault();
            user.processForm();
        });
    },

    init: function (phones) {
        this.binds();
        this.phones.init(phones);
    }
};