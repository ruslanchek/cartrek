<div class="hero-unit hero_login">
    <h1>{$core->module.title}</h1>

    {if !$core->auth->user_status.status}
    <form id="remember_pass_form" class="form-horizontal" action="javascript:void(0)" method="POST">
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

            <div id="form_message"></div>

            <div class="control-group">
                <label class="control-label" for="login">Логин или e-mail</label>
                <div class="controls">
                    <input type="text" class="input-xlarge" id="login" name="login">
                </div>
            </div>

            <div class="form-actions">
                <button id="submit" type="submit" class="btn btn-primary" data-loading-text="Восстанавливаем пароль..." autocomplete="off">Восстановить пароль</button>
                &nbsp;&nbsp;&nbsp;<a href="/control/auth/register">Зарегистрироваться</a>
                &nbsp;&nbsp;&nbsp;<a href="/control/auth/login">Войти</a>
            </div>
        </fieldset>
    </form>

    <script>core.remember_pass.init();</script>
    {else}
    <div class="alert alert-info">
        Вы уже авторизованы
    </div>
    {/if}
</div>