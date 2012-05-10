<div class="page-header">
    <h1>Регистрация</h1>
</div>

{if !$core->auth->user_status.status}
<div id="register_form_message"></div>

<form id="register_form" class="form-horizontal" action="javascript:void(0)" method="POST">
    <fieldset>
        <div class="control-group cg_soc">
            <label class="control-label">Регистрация через соцсети</label>
            <div class="controls">
                <div class="socials">
                    <a href="/control/auth/login?oauth&step=auth&provider=vk" class="vk" title="Вконтакте"></a>
                    <a href="/control/auth/login?oauth&step=auth&provider=fb" class="fb" title="Фейсбук"></a>

                    <div class="clear"></div>
                </div>
            </div>
        </div>

        <div class="control-group">
            <label class="control-label" for="email">Email</label>
            <div class="controls">
                <input type="text" class="input-xlarge" id="email" name="email">
            </div>
        </div>

        <div class="form-actions">
            <button id="register_submit" type="submit" class="btn btn-primary" data-loading-text="Регистрируемся..." autocomplete="off">Зарегистрироваться</button>
            <a class="btn" href="/control/auth/login">Войти</a>
            <a class="btn" href="/control/auth/remember_pass">Напомнить пароль</a>
        </div>
    </fieldset>
</form>

<script>core.register.init();</script>
{else}
<div class="alert alert-info">
    Вы уже авторизованы
</div>
{/if}