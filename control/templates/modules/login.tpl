<div class="hero-unit hero_login">
    <h1>{$core->module.title}</h1>

    <ul class="nav nav-tabs">
        <li class="active"><a href="/control/auth/login">Войти</a></li>
        <li><a href="/control/auth/register">Зарегистрироваться</a></li>
        <li><a href="/control/auth/remember_pass">Напомнить пароль</a></li>
    </ul>

    {if !$core->auth->user.status}
    <form id="login_form" class="form-horizontal" action="" method="POST">
        <input type="hidden" name="action" value="login">
        <fieldset>
            <div class="control-group cg_soc">
                <label class="control-label">Авторизация через соцсети</label>
                <div class="controls">
                    <div class="socials">
                        <a href="/control/auth/login?oauth&step=auth&provider=vk" class="vk" title="Вконтакте"></a>
                        <a href="/control/auth/login?oauth&step=auth&provider=fb" class="fb" title="Фейсбук"></a>
                        <a href="/control/auth/login?oauth&step=auth&provider=tw" class="tw" title="Твиттер"></a>

                        <div class="clear"></div>
                    </div>
                </div>
            </div>

            {if $core->module.form.message}
                <div class="alert {if $core->module.form.status}alert-success{else}alert-error{/if}">
                    <a class="close" data-dismiss="alert" href="javascript:void(0)">×</a>
                    {$core->module.form.message}
                </div>
            {/if}

            <div class="control-group">
                <label class="control-label" for="login">Логин или e-mail</label>
                <div class="controls">
                    <input type="text" class="input-xlarge" id="login" name="login" value="{if isset($smarty.post.login)}{$smarty.post.login}{/if}">
                </div>
            </div>

            <div class="control-group">
                <label class="control-label" for="password">Пароль</label>
                <div class="controls">
                    <input type="password" class="input-xlarge" id="password" name="password">
                </div>
            </div>

            <div class="form-actions">
                <button id="submit" type="submit" class="btn btn-primary" autocomplete="off">Войти</button>
            </div>
        </fieldset>
    </form>

    {else}
    <div class="alert alert-info">
        Вы уже авторизованы
    </div>
    {/if}
</div>