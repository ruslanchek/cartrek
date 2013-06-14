<a href="http://cartrek.ru" class="auth-logo">Картрек</a>

<div class="hero-login">
    <h1>{$core->module.title}</h1>

    {if !$core->auth->user.status}
        <form id="register_form" class="form-horizontal" action="" method="POST">
            <div class="auth-block-padding">
                <input type="hidden" name="action" value="register">

                {if $core->module.form.message}
                    <div class="form_message{if $core->module.form.status} ok_message{else} error_message{/if}">
                        {$core->module.form.message}
                    </div>
                {/if}

                <div class="control-group">
                    <div class="controls">
                        <input placeholder="Электронная почта" type="text" class="input-xlarge" id="email" name="email"
                               value="{if isset($smarty.post.email)}{$smarty.post.email}{/if}">
                    </div>
                </div>

                <div class="form-actions">
                    <button id="submit" type="submit" class="btn blue" autocomplete="off">Зарегистрироваться</button>
                </div>

                <nav class="nav">
                    <a href="/control/auth/login">Войти</a>
                    <a href="/control/auth/remember_pass">Напомнить пароль</a>
                </nav>
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
        <div class="auth-block-padding">
            Вы уже авторизованы.<br>
            <a href="/control">Вернуться в панель управления</a>.
        </div>
    {/if}
</div>