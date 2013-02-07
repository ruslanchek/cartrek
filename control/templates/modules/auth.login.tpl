<div class="hero-login">
    <h1>{$core->module.title}</h1>

    <div class="nav nav-tabs">
        <a href="/control/auth/login">Войти</a>
        <a href="/control/auth/register">Зарегистрироваться</a>
        <a href="/control/auth/remember_pass">Напомнить пароль</a>
    </div>

    {if !$core->auth->user.status}


    <form id="login_form" class="form-horizontal" action="" method="POST">
        <div class="auth-block-padding">
            <input type="hidden" name="action" value="login">
            {if $core->module.form.message}
                <div class="alert {if $core->module.form.status}alert-success{else}alert-error{/if}">
                    <a class="close" data-dismiss="alert" href="javascript:void(0)">×</a>
                    {$core->module.form.message}
                </div>
            {/if}

            <div class="control-group">
                <label class="control-label" for="login">Логин или e-mail</label>
                <div class="controls">
                    <input type="text" id="login" name="login" value="{if isset($smarty.post.login)}{$smarty.post.login}{/if}">
                </div>
            </div>

            <div class="control-group">
                <label class="control-label" for="password">Пароль</label>
                <div class="controls">
                    <input type="password" id="password" name="password">
                </div>
            </div>

            <div class="form-actions">
                <button id="submit" type="submit" class="btn btn-primary" autocomplete="off">Войти</button>
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

    {else}
    <div class="alert alert-info">
        Вы уже авторизованы
    </div>
    {/if}
</div>