<div class="threequarter">
    {if isset($smarty.get.action) && $smarty.get.action == 'set_device' && $core->checkDeviceBySN($smarty.session.code_approved)->result == true}
        <div class="row">
            <div class="half">
                <form id="set-device-form" class="forms" method="POST">
                    <h2>Шаг 2 из 3</h2>

                    <div class="form_message"></div>

                    <div class="form-item">
                        <label for="name" class="bold">Название <span class="error"></span></label>
                        <input class="text width-100" type="text" name="name" id="name" {*autofocus="autofocus"*}
                               value=""/>
                    </div>

                    <div class="form-item">
                        <label for="make" class="bold">Марка <span class="error"></span></label>

                        <p><select name="make" id="make"></select></p>
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

                    <input type="button" onclick="document.location.href='/control/user/fleet/add/'" name="send"
                           class="btn gray float-left" value="Назад"/>
                    <input type="submit" name="send" class="btn blue float-left" value="Далее"/>

                    <div class="clear"></div>
                </form>
            </div>

            <div class="half">
                <div class="forms">
                    <h2>Заполните данные о машине</h2>

                    <p>Это нужно, чтобы вам было легче находить ваши машины на карте.
                        Эта информация будет выводиться в сокращенном виде на табличках, рядом с маркерами.</p>

                    <p>Вводите госномер посимвольно, он автоматически будет сконвертирован и отображен в графическом
                        виде.</p>

                    <div style="position: relative;">
                        <span id="g_id_preview">
                            <span class="g_id big default">
                                <i class="shade"></i>
                                <span class="id"></span>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <script>
            $(function () {
                fleet_add.set_device_form();
            });
        </script>
    {else}
        <div class="row">
            <div class="half">
                <form id="car-code-form" class="forms" method="POST">
                    <h2>Шаг 1 из 3</h2>

                    <div class="form_message"></div>

                    <div class="form-item">
                        <label for="code" class="bold">Код активации <span class="error"></span></label>
                        <input class="text width-100" max="12" maxlength="12" type="text" name="code" id="code"
                               value="{if isset($smarty.session.code_approved)}{$smarty.session.code_approved|escape}{/if}"/>
                    </div>

                    <input type="submit" name="send" class="btn blue" value="Далее"/>
                </form>
            </div>

            <div class="half">

            </div>
        </div>
        <script type="text/javascript">
            $(function () {
                fleet_add.car_code_form();
            });
        </script>
    {/if}
</div>

<div class="quarter">
    {include file="modules/user.menu.tpl"}
</div>