<div class="hero-login">
    <h1>{$core->module.title}</h1>

    <ul class="nav nav-tabs">
        <li><a href="/control/auth/login">Войти</a></li>
        <li class="active"><a href="/control/auth/register">Зарегистрироваться</a></li>
        <li><a href="/control/auth/remember_pass">Напомнить пароль</a></li>
    </ul>

    {if !$core->auth->user.status}
    <form id="register_form" class="form-horizontal" action="" method="POST">
        <input type="hidden" name="action" value="register">
        <fieldset>
            <div class="control-group cg_soc">
                <label class="control-label">Регистрация через соцсети</label>
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
                <label class="control-label" for="email">Email</label>
                <div class="controls">
                    <input type="text" class="input-xlarge" id="email" name="email" value="{if isset($smarty.post.email)}{$smarty.post.email}{/if}">
                </div>
            </div>

            <div class="form-actions">
                <button id="submit" type="submit" class="btn btn-primary" autocomplete="off">Зарегистрироваться</button>
            </div>
        </fieldset>
    </form>

    {else}
    <div class="alert alert-info">
        Вы уже авторизованы
    </div>
    {/if}
</div>