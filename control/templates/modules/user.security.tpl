<div class="threequarter">
    <form id="password-change-form" class="forms" action="/control/user/security/" method="POST">
        <div class="form_message"></div>
        <div class="row">
            <div class="half">
                <div class="form-item">
                    <label for="old_password" class="bold">Старый пароль <span class="error"></span></label>
                    <input
                            class="text width-100"
                            type="password"
                            name="old_password"
                            id="old_password"
                            {*autofocus="autofocus"*}
                            value=""
                    />
                </div>

                <hr>

                <div class="form-item">
                    <label for="new_password" class="bold">Новый пароль <span class="error"></span></label>
                    <input
                            class="text width-100"
                            type="password"
                            name="new_password"
                            id="new_password"
                            value=""
                    />
                </div>

                <div class="form-item">
                    <label for="new_password_again" class="bold">Повторите новый пароль <span class="error"></span></label>
                    <input
                            class="text width-100"
                            type="password"
                            name="new_password_again"
                            id="new_password_again"
                            value=""
                    />
                </div>

                <input type="submit" name="send" class="btn" value="Сменить пароль" />
            </div>

            <div class="third">
                <div class="form-item">
                    <label class="bold">Социальные сети</label>

                    <table class="socials-table">
                        <tr>
                            <td>{if !$core->auth->user.data.fb_id}<a href="#">{/if}<img src="/control/resources/img/login/facebook.png" alt="Facebook">{if !$core->auth->user.data.fb_id}</a>{/if}</td>
                            <td>{if $core->auth->user.data.fb_id > 0}<span class="green">Аккаунт привязан</span>{else}<span class="gray">Аккаунт не привязан</span>{/if}</td>
                        </tr>
                        <tr>
                            <td>{if !$core->auth->user.data.vk_id}<a href="#">{/if}<img src="/control/resources/img/login/vkontakte.png" alt="Vkontakte">{if !$core->auth->user.data.vk_id}</a>{/if}</td>
                            <td>{if $core->auth->user.data.vk_id > 0}<span class="green">Аккаунт привязан</span>{else}<span class="gray">Аккаунт не привязан</span>{/if}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </form>
</div>

<div class="quarter">
    {include file="modules/user.menu.tpl"}
</div>