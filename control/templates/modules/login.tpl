<div id="login_form_message"></div>

<form id="login_form" class="form-horizontal" action="javascript:void(0)" method="POST">
    <fieldset>
        <div class="control-group">
            <label class="control-label" for="login">Логин или e-mail</label>
            <div class="controls">
                <input type="text" class="input-xlarge" id="login" name="login">
            </div>
        </div>

        <div class="control-group">
            <label class="control-label" for="password">Пароль</label>
            <div class="controls">
                <input type="password" class="input-xlarge" id="password" name="password">
            </div>
        </div>

        <div class="form-actions">
            <button id="login_submit" type="submit" class="btn btn-primary" data-loading-text="Авторизуемся..." autocomplete="off">Авторизоваться</button>
            &nbsp;&nbsp;&nbsp;<a href="/control/auth/">Авторизация</a>
            &nbsp;&nbsp;&nbsp;<a href="/control/auth/remember_pass/">Напомнить пароль</a>
        </div>
    </fieldset>
</form>

<script>core.login.init();</script>