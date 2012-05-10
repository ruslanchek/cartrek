<div class="page-header">
    <h1>Вход</h1>
</div>

<div id="login_form_message"></div>

<form id="login_form" class="form-horizontal" action="javascript:void(0)" method="POST">
    <fieldset>
        <div class="control-group cg_soc">
            <label class="control-label">Авторизация через соцсети</label>
            <div class="controls">
                <div class="socials">
                    <a href="/control/auth/login?oauth&step=auth&provider=vk" class="vk" title="Вконтакте"></a>
                    <a href="/control/auth/login?oauth&step=auth&provider=fb" class="fb" title="Фейсбук"></a>

                    <div class="clear"></div>
                </div>
            </div>
        </div>

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
            <button id="login_submit" type="submit" class="btn btn-primary" data-loading-text="Входим..." autocomplete="off">Войти</button>
            <a class="btn" href="/control/auth/register">Зарегистрироваться</a>
            <a class="btn" href="/control/auth/remember_pass">Напомнить пароль</a>
        </div>
    </fieldset>
</form>

<script>core.login.init();</script>