<div class="threequarter">
    {if isset($smarty.get.action) && $smarty.get.action == 'set_device'}
        <div class="row">
            <div class="half">
                <form id="set-device-form" class="forms" method="POST">
                    <div class="form_message"></div>

                    <div class="form-item">
                        <label for="name" class="bold">Название <span class="error"></span></label>
                        <input class="text width-100" type="text" name="name" id="name" {*autofocus="autofocus"*}
                               value=""/>
                    </div>

                    <div class="form-item">
                        <label for="make" class="bold">Марка <span class="error"></span></label>
                        <select class="" name="make" id="make"></select>
                    </div>

                    <div class="form-item">
                        <label for="model" class="bold">Модель <span class="error"></span></label>
                        <input class="text width-100" type="text" name="model" id="model" {*autofocus="autofocus"*}
                               value=""/>
                    </div>

                    <div class="form-item">
                        <label for="g_id" class="bold">Госномер <span class="error"></span></label>
                        <input class="text width-100" maxlength="10" max="10" type="text"
                               name="g_id" id="g_id" {*autofocus="autofocus"*} value=""/>
                    </div>
                    <div style="position: relative;">
                        <span id="g_id_preview" style="position: absolute; bottom: 21px">
                            <span class="g_id small default">
                                <i class="shade"></i>
                                <span class="id"></span>
                            </span>
                        </span>
                    </div>

                    <input type="submit" name="send" class="btn blue" value="Далее"/>
                </form>
            </div>

            <div class="half">

            </div>
        </div>
        <script>
            fleet_add.set_device_form();
        </script>
    {else}
        <div class="new-car-container">
            <form class="card" id="car-code-form">
                <div class="card-inner">
                    <h2>Введите код активации<br> вашего устройства</h2>

                    <input id="car-code" class="input-number" width="12" max="12" maxlength="12"/>

                    <input class="btn blue" type="submit" value="Далее"/>
                </div>

                <div class="form_message"></div>
            </form>

            <script type="text/javascript">
                $(function () {
                    fleet_add.car_code_form();
                });
            </script>
        </div>
    {/if}
</div>

<div class="quarter">
    {include file="modules/user.menu.tpl"}
</div>