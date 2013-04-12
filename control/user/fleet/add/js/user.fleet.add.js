var fleet_add = {
    makes: [
        'Любая марка',
        'AC',
        'Acura',
        'Alfa Romeo',
        'Aro',
        'Asia',
        'Aston Martin',
        'Audi',
        'Bentley',
        'BMW',
        'BMW Alpina',
        'Brilliance',
        'Bugatti',
        'Buick',
        'BYD',
        'Cadillac',
        'ChangFeng',
        'Chery',
        'Chevrolet',
        'Chrysler',
        'Citroen',
        'Dacia',
        'Dadi',
        'Daewoo',
        'Daihatsu',
        'Daimler',
        'De Tomaso',
        'Derways',
        'Dodge',
        'DongFeng',
        'Doninvest',
        'Eagle',
        'FAW',
        'Ferrari',
        'Fiat',
        'Ford',
        'Geely',
        'GMC',
        'Great Wall',
        'Hafei',
        'Haima',
        'Honda',
        'HuangHai',
        'Hummer',
        'Hurtan',
        'Hyundai',
        'Infiniti',
        'Iran Khodro',
        'Isuzu',
        'JAC',
        'Jaguar',
        'Jeep',
        'Kia',
        'Koenigsegg',
        'Lamborghini',
        'Lancia',
        'Land Rover',
        'Landwind',
        'Lexus',
        'Liebao Motor',
        'Lifan',
        'Lincoln',
        'Lotus',
        'Mahindra',
        'Maserati',
        'Maybach',
        'Mazda',
        'Mercedes-Benz',
        'Mercury',
        'Metrocab',
        'MG',
        'Mini',
        'Mitsubishi',
        'Mitsuoka',
        'Morgan',
        'Nissan',
        'Noble',
        'Oldsmobile',
        'Opel',
        'Peugeot',
        'Plymouth',
        'Pontiac',
        'Porsche',
        'Proton',
        'PUCH',
        'Renault',
        'Renault Samsung',
        'Rolls-Royce',
        'Rover',
        'Saab',
        'Saleen',
        'Saturn',
        'Scion',
        'SEAT',
        'ShuangHuan',
        'Skoda',
        'SMA',
        'Smart',
        'Spyker',
        'Ssang Yong',
        'Subaru',
        'Suzuki',
        'Talbot',
        'TATA',
        'Tatra',
        'Tazzari',
        'Tesla',
        'Tianma',
        'Tianye',
        'Toyota',
        'Trabant',
        'Triumph',
        'Volkswagen',
        'Volvo',
        'Vortex',
        'Wartburg',
        'Wiesmann',
        'Xin Kai',
        'Zastava',
        'ZX',
        'ВАЗ',
        'ГАЗ',
        'ЗАЗ',
        'ЗИЛ',
        'ИЖ',
        'КамАЗ',
        'ЛУАЗ',
        'МАЗ',
        'Москвич (АЗЛК)',
        'СеАЗ',
        'СМЗ',
        'ТагАЗ',
        'УАЗ',
        'Эксклюзив'
    ],

    car_code_form: function(){
        $('#code').on('keyup', function(e){
            var str = $(this).val();

            str = str.replace(' ', '');
            str = str.toUpperCase();

            $(this).val(core.utilities.numberFormat(str));
        });

        $('#car-code-form').on('submit', function(e){
            e.preventDefault();

            fleet_add.loading_process = $.ajax({
                url : '/control/user/fleet/add?ajax&action=check_device_by_sn',
                data : {
                    code: $('#code').val()
                },
                dataType : 'json',
                type : 'get',
                beforeSend: function(){
                    if(fleet_add.loading_process){
                        fleet_add.loading_process.abort();
                        core.loading.unsetGlobalLoading();
                    };

                    core.loading.setGlobalLoading();

                    $('.form_message').hide().html('');
                    $('#code').removeClass('input-error').prev().find('.error').html('');
                },
                success: function(data){
                    core.loading.unsetGlobalLoading();

                    if(data.result === true){
                        document.location.href = '/control/user/fleet/add/?action=set_device';

                    }else{
                        if(data.form_errors.code){
                            $('#code').addClass('input-error').prev().find('.error').text(data.form_errors.code);
                        };
                    };

                    $('.form_message').slideDown(150);
                },
                error: function(){
                    core.loading.unsetGlobalLoading();
                }
            });
        });
    },

    set_device_form: function(){
        $('#g_id_preview').html(core.utilities.drawGId('а777аа77', 'big'));

        $('#g_id').on('keyup', function(){
            $(this).val(core.utilities.filterGidStr($(this).val()));
            var html = core.utilities.drawGId($(this).val(), 'big');

            $('#g_id_preview').html('');
            $('#g_id_preview').html(html);
        });

        var html = '<option value="">&nbsp;</option>';

        for (var i = 0, l = this.makes.length; i < l; i++) {
            html += '<option value="'+this.makes[i]+'">'+this.makes[i]+'</option>';
        }

        $('#make').html(html);

        $('#make').coreUISelect({
            jScrollPane: true
        });
    },

    init: function(){
        /*$('#make').typeahead({
            source: this.makes
        });*/


    }
};