var user = {
    processForm: function () {
        var form_data = {
            login: $('#login').val(),
            email: $('#email').val(),
            name: $('#name').val(),
            user_timezone: $('#user_timezone').val()
        };

        this.loading_process = $.ajax({
            url: '/control/user/?ajax&action=processForm',
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

                    $('.control-group').removeClass('error').find('.error').remove();
                } else {
                    if (data.form_errors.login) {
                        $('#login').parent('.control-group').addClass('error').find('.error').text(data.form_errors.login);
                    }

                    if (data.form_errors.email) {
                        $('#email').parent('.control-group').addClass('error').find('.error').text(data.form_errors.email);
                    }

                    if (data.form_errors.name) {
                        $('#name').parent('.control-group').addClass('error').find('.error').text(data.form_errors.name);
                    }

                    $('#login').val(data.form_data.login);
                }

                $('.form_message').slideDown(150);
            },
            error: function () {
                core.loading.unsetGlobalLoading();
                core.ajax.errorHandler();
            }
        });
    },

    phones: {
        json_string: '',
        phones: null,
        phones_limit: 5,

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

        phoneAdder: function () {
            var html = '<form id="add-phone-form" class="forms columnar white" method="POST">' +
                '<div class="form_message"></div>' +

                '<ul>' +

                '<li>' +
                '<fieldset>' +
                '<section class="bold"><label for="active">Активность</label></section>' +
                '<input id="active" name="active" type="checkbox" value="1" />' +
                '</fieldset>' +
                '</li>' +


                '<li>' +
                '<label for="phone" class="bold">Номер <span class="error"></span></label>' +
                '<span class="input-prepend">+7</span>' +
                '<input class="text" style="width: 25%" type="text" name="phone" id="phone" value="" maxlength="15" />' +
                '&nbsp;<span class="descr gray">В любом формате</span>' +
                '</li>' +

                '<div id="code-place"></div>' +

                '<hr>' +

                '<li class="push" id="submit-block">' +
                '<input type="submit" name="send" class="btn blue float-left" value="Далее" />' +
                '</li>' +

                '</ul>' +

                '<div class="clear"></div>' +
                '</form>';

            core.modal.createModal(
                'Добавление телефонного номера',
                html,
                550
            );

            this.phone_add_init = '1';

            $('#add-phone-form').on('submit', function (e) {
                core.modal.loading_process = $.ajax({
                    url: '/control/user/?ajax&action=phoneAdd',
                    data: {
                        active: $('#active').prop('checked'),
                        phone: $('#phone').val(),
                        init: user.phones.phone_add_init,
                        code: $('#code').val()
                    },
                    type: 'post',
                    dataType: 'json',
                    beforeSend: function () {
                        core.modal.unSetMessage();
                        core.modal.setLoading();
                    },
                    success: function (data) {
                        core.modal.unSetLoading();
                        core.modal.setMessage(data);

                        if (data.status === true) {
                            if(data.action == 'request'){
                                user.phones.phone_add_init = '0';
                                $('#phone').attr('disabled', 'disabled').prop('disabled', true).val(data.phone);
                                $('#active').attr('disabled', 'disabled').prop('disabled', true);

                                $('#code-place').html(
                                    '<hr>' +
                                    '<li>' +
                                    '<label for="phone" class="bold">Код подтверждения <span class="error"></span></label>' +
                                    '<input class="text" style="width: 10%" type="text" name="code" id="code" value="" maxlength="4" />' +
                                    '</li>'
                                );

                                $('#code').focus();
                                $('#submit-block').val('Подтвердить');

                            }else if(data.action == 'added'){
                                user.phones.phone_add_init = '0';
                                user.phones.phones = data.phones;

                                if (user.phones.phones.length >= user.phones.phones_limit) {
                                    $('#add-phone').hide();
                                }

                                $('#submit-block').hide(150);

                                user.phones.draw();

                                setTimeout(function(){core.modal.destroyModal();}, 650);
                            }
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

                e.preventDefault();
            });
        },

        toggle: function (index, active, phone) {
            core.modal.loading_process = $.ajax({
                url: '/control/user/?ajax&action=phoneEdit',
                data: {
                    index: index,
                    active: active,
                    phone: phone
                },
                type: 'post',
                dataType: 'json',
                beforeSend: function () {
                    core.loading.setGlobalLoading();
                },
                success: function (data) {
                    core.loading.unsetGlobalLoading();

                    if (data && data.status === true) {
                        user.phones.phones = data.phones;
                    }
                },
                error: function () {
                    core.loading.unsetGlobalLoading();
                    core.ajax.errorHandler();
                }
            });
        },

        delete: function (index, phone) {
            core.modal.loading_process = $.ajax({
                url: '/control/user/?ajax&action=phoneDelete',
                data: {
                    index: index,
                    phone: phone
                },
                type: 'post',
                dataType: 'json',
                beforeSend: function () {
                    core.modal.unSetMessage();
                    core.loading.setGlobalLoading();
                },
                success: function (data) {
                    core.loading.unsetGlobalLoading();

                    if (data && data.status === true) {
                        user.phones.phones = data.phones;

                        if (user.phones.phones.length < user.phones.phones_limit) {
                            $('#add-phone').show();
                        }

                        user.phones.draw();
                    }
                },
                error: function () {
                    core.loading.unsetGlobalLoading();
                    core.ajax.errorHandler();
                }
            });
        },

        draw: function () {
            var html = '';

            if (this.phones && this.phones.length > 0) {
                html += '<div class="table-wrapper"><table class="hovered">';

                for (var i = 0, l = this.phones.length; i < l; i++) {
                    if (this.phones[i].phone) {
                        html += '<tr rel="' + i + '" class="item ' + ((this.phones[i].active === true) ? '' : 'unactive_row') + '" data-index="' + i + '" data-phone="' + this.phones[i].phone + '" data-active="' + this.phones[i].active + '">' +
                            '<th class="activity-cell" width="1%"><input class="phone-activity-toggler slickswitch" type="checkbox" ' + ((this.phones[i].active === true) ? 'checked' : '') + ' /></th>' +
                            '<td>' + core.utilities.formatPhoneStr(this.phones[i].phone, 7) + '</td>' +
                            '<td width="1%"><a class="phone-delete-link btn red delete-btn" href="#">Удалить</a></td>' +
                            '</tr>';
                    }
                }

                html += '</table></div>';
            }

            html += '<input type="button" id="add-phone" href="javascript:void(0)" class="btn gray" value="Добавить номер">';

            $('#phones-table').html(html);

            if (this.phones.length >= this.phones_limit) {
                $('#add-phone').hide();
            }

            $('#add-phone').on('click', function () {
                user.phones.phoneAdder();
            });

            $('.phone-delete-link').on('click', function () {
                var $p = $(this).parent().parent(),
                    index = $p.data('index'),
                    phone = $p.data('phone');

                if (confirm('Удалить телефонный номер ' + core.utilities.formatPhoneStr(phone, 7) + '?')) {
                    user.phones.delete(index, phone);
                }
            });

            /*$('.phone-activity-toggler').slickswitch({
                toggled: function (item) {
                    var $p = item.parent().parent(),
                        index = $p.data('index'),
                        phone = $p.data('phone'),
                        active = $(item[0]).prop('checked');

                    $p.attr('class', ((active === true) ? 'item' : 'item unactive_row'));

                    user.phones.toggle(index, active, phone);
                }
            });*/
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