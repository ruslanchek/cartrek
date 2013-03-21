<div class="hero-login">
    <h1>{$core->module.title}</h1>

    {if !$core->auth->user.status && !isset($smarty.get.action)}
        <form id="remember_pass_form" class="form-horizontal" action="" method="POST">
            <input type="hidden" name="action" value="remember_pass">

            <div class="auth-block-padding">
                {if $core->module.form.message}
                    <div class="form_message{if $core->module.form.status} ok_message{else} error_message{/if}">
                        {$core->module.form.message}
                    </div>
                {/if}

                <div class="control-group">
                    <div class="controls">
                        <input type="text" placeholder="Логин или e-mail" class="input-xlarge" id="login" name="login"
                               value="{if isset($smarty.post.login)}{$smarty.post.login}{/if}">
                    </div>
                </div>

                <div class="form-actions">
                    <button id="submit" type="submit" class="btn blue" autocomplete="off">Напомнить пароль</button>
                </div>

                <div class="nav">
                    <a href="/control/auth/login">Войти</a>
                    <a href="/control/auth/register">Зарегистрироваться</a>
                </div>
            </div>
        </form>
        <div class="auth-block-padding black-bg">
            <h3>Авторизация через соцсети</h3>

            <div class="socials">
                <a href="/control/auth/login?oauth&step=auth&provider=fb" class="part_l facebook">
                        <span class="inner">
                            <img src="/control/resources/img/login/facebook.png" alt="Facebook">
                            <span class="label">Авторизация с&nbsp;помощью&nbsp;Фейсбука</span>
                        </span>
                </a>
                <a href="/control/auth/login?oauth&step=auth&provider=vk" class="part_r vkontakte">
                        <span class="inner">
                            <img src="/control/resources/img/login/vkontakte.png" alt="Vkontakte">
                            <span class="label">Авторизация с&nbsp;помощью&nbsp;Вконтакте</span>
                        </span>
                </a>

                <div class="clear"></div>
            </div>
        </div>
    {elseif isset($smarty.get.action) && $smarty.get.action == 'password_recover'}
        <div class="auth-block-padding">
            {if $core->module.form.message}
                <div class="form_message{if $core->module.form.status} ok_message{else} error_message{/if}">
                    {$core->module.form.message}
                </div>
            {/if}

            <div class="nav">
                <a href="/control/auth/login">Войти</a>
                <a href="/control/auth/register">Зарегистрироваться</a>
            </div>
        </div>
    {else}
        <div class="auth-block-padding">
            Вы уже авторизованы. <a href="/control">Вернуться в панель управления</a>.
        </div>
    {/if}
</div>