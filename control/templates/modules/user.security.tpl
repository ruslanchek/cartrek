<div class="threequarter">
    <div class="row">
        <div class="half">


            <div class="forms" style="min-height: 306px">
                <h2>Социальные сети</h2>
                <table class="socials-table">
                    <tr>
                        <td>{if !$core->auth->user.data.fb_id}<a href="/control/user/security/?action=bind_oauth&step=auth&provider=fb">{/if}<img src="/control/resources/img/login/facebook.png" alt="Facebook">{if !$core->auth->user.data.fb_id}</a>{/if}</td>
                        <td>{if $core->auth->user.data.fb_id > 0}<span class="green">Аккаунт привязан</span>{else}<span class="gray">Аккаунт не привязан</span>{/if}</td>
                        <td>{if !$core->auth->user.data.vk_id}<a href="/control/user/security/?action=bind_oauth&step=auth&provider=vk">{/if}<img src="/control/resources/img/login/vkontakte.png" alt="Vkontakte">{if !$core->auth->user.data.vk_id}</a>{/if}</td>
                        <td>{if $core->auth->user.data.vk_id > 0}<span class="green">Аккаунт привязан</span>{else}<span class="gray">Аккаунт не привязан</span>{/if}</td>
                    </tr>
                </table>

                <hr>

                <h4>Привязка социальных сетей к вашему аккаунту</h4>
                <p>
                    Чтобы привязать сциальную сеть, кликните на&nbsp;соответствующую иконку, подтвердите запрос сервиса в&nbsp;открывшимся окне.
                    После прохождения процедуры привязки, вы&nbsp;сможете авторизоваться на&nbsp;Картреке с&nbsp;помощью социальных сетей.
                </p>
            </div>
        </div>

        <div class="half">
            <form id="password-change-form" class="forms" action="/control/user/security/" method="POST">
                <h2>Изменение пароля</h2>

                <div class="form_message"></div>
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
                    <label for="new_password_again" class="bold">Новый пароль еще раз <span class="error"></span></label>
                    <input
                            class="text width-100"
                            type="password"
                            name="new_password_again"
                            id="new_password_again"
                            value=""
                    />
                </div>

                <input type="submit" name="send" class="btn blue" value="Сменить пароль" />
            </form>
        </div>
    </div>
</div>

<div class="quarter">
    {include file="modules/user.menu.tpl"}
</div>