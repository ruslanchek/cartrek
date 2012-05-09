<div id="register_form_message"></div>

<form id="register_form" class="form-horizontal" action="javascript:void(0)" method="POST">
    <fieldset>
        <div class="control-group">
            <label class="control-label" for="email">Email</label>
            <div class="controls">
                <input type="text" class="input-xlarge" id="email" name="email">
            </div>
        </div>

        <div class="form-actions">
            <button id="register_submit" type="submit" class="btn btn-primary" data-loading-text="Регистрируемся..." autocomplete="off">Зарегистрироваться</button>
            &nbsp;&nbsp;&nbsp;<a href="/control/auth/">Авторизация</a>
            &nbsp;&nbsp;&nbsp;<a href="/control/auth/remember_pass/">Напомнить пароль</a>
        </div>
    </fieldset>
</form>

<script>core.register.init();</script>