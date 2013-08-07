<div class="form_message"></div>

<div class="row-fluid">
    <div class="span6">
        <div class="alert alert-info shared-height" row="1">
            <form class="forms" id="user-form" action="/control/user/" method="POST">

                <div class="control-group">
                    <label for="user_timezone">Часовой пояс</label>
                    <select name="user_timezone" id="user_timezone">
                        {foreach $core->utils->generateTimeZonesList() as $key => $val}
                            <option value="{$key}"
                                    {if $key == $core->auth->user.data.user_timezone}selected{/if}>{$val}</option>
                        {/foreach}
                    </select>
                </div>

                <hr>

                <div class="control-group">
                    <label for="name" class="bold">Имя <span class="error"></span></label>
                    <input
                            class="text width-100"
                            type="text"
                            name="name"
                            id="name"
                            value="{$core->auth->user.data.name|escape}"
                            />
                </div>

                <div class="control-group">
                    <label for="login" class="bold">Логин <span class="error"></span></label>
                    <input
                            class="text width-100"
                            type="text"
                            name="login"
                            id="login"
                            {*autofocus="autofocus"*}
                            value="{$core->auth->user.data.login|escape}"/>
                </div>

                <div class="control-group">
                    <label for="email" class="bold">Электонная почта <span class="error"></span></label>
                    <input
                            class="text width-100"
                            type="email"
                            name="email"
                            id="email"
                            value="{$core->auth->user.data.email|escape}"
                            />
                </div>

                <div class="control-group">
                    <input type="submit" name="send" class="btn btn-embossed btn-primary btn-info" value="Сохранить"/>
                </div>
            </form>
        </div>
    </div>

    <div class="span6">
        <div class="alert alert-info shared-height" row="1">
            <div class="forms">
                <div class="form-item">
                    <label class="bold">Телефоны <span class="error"></span></label>

                    <div id="phones-table"></div>

                    <br>
                    <hr>

                    <em>
                        Внимание, подключение телефонных номеров увеличивает абонентскую плату, согласно вашему тарифу.
                    </em>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">
$(function () {
    user.init('{$core->auth->user.data.phones}');
});
</script>