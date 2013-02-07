<div class="hero-login">
    <h1>{$core->module.title}</h1>

    <div class="nav nav-tabs">
        <a href="/control/auth/login">Войти</a>
        <a href="/control/auth/register">Зарегистрироваться</a>
        <a href="/control/auth/remember_pass">Напомнить пароль</a>
    </div>

    {if !$core->auth->user.status}

    <form method="post" action="" class="forms columnar">
        <fieldset>
            <ul>
                <li>
                    <label for="user_email" class="bold">Email</label>
                    <input type="email" name="user_email" id="user_email" size="40" />
                </li>
                <li>
                    <label for="user_name" class="bold">Name</label>
                    <input type="text" name="user_name" id="user_name" size="40" />
                </li>
                <li>
                    <fieldset>
                        <section>
                            <label class="bold">Width 100</label>
                        </section>
                        <input type="text" class="width-100" />
                    </fieldset>
                </li>
                <li>
                    <fieldset>
                        <section>
                            <label class="bold">Textarea</label>
                        </section>
                        <textarea class="width-100" style="height: 100px;"></textarea>
                    </fieldset>
                </li>
                <li class="push">
                    <input type="submit" name="send" class="btn" value="Submit" />
                </li>
            </ul>
        </fieldset>
    </form>

    <form id="login_form" class="form-horizontal" action="" method="POST">
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


        <h3>Авторизация через соцсети</h3>
        <div class="controls">
            <div class="socials">
                <a href="/control/auth/login?oauth&step=auth&provider=vk" class="vk" title="Вконтакте"></a>
                <a href="/control/auth/login?oauth&step=auth&provider=fb" class="fb" title="Фейсбук"></a>
                <a href="/control/auth/login?oauth&step=auth&provider=tw" class="tw" title="Твиттер"></a>

                <div class="clear"></div>
            </div>
        </div>
    </form>

    {else}
    <div class="alert alert-info">
        Вы уже авторизованы
    </div>
    {/if}
</div>