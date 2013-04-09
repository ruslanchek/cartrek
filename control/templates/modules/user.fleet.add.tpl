<div class="threequarter">
    <div class="new-car-container">

        <form class="card" id="car-code-form">
            <div class="card-inner">
                <h2>Введите код активации<br> вашего устройства</h2>

                <input id="car-code" class="input-number" width="12" max="12" maxlength="12" />

                <input class="btn blue" type="submit" value="Далее" />
            </div>

            <div class="form_message"></div>
        </form>

        <script type="text/javascript">
            $(function(){
                fleet_add.car_code_form();
            });
        </script>
    </div>
</div>

<div class="quarter">
    {include file="modules/user.menu.tpl"}
</div>