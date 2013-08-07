
<div class="row-fluid">
    <div class="span6">
        <div class="alert alert-info shared-height" row="1">
            <h3>Привязка социальных сетей к вашему аккаунту</h3>

            <br>

            <p>
                Чтобы привязать сциальную сеть, кликните на&nbsp;соответствующую иконку, подтвердите запрос сервиса в&nbsp;открывшимся окне.
                После прохождения процедуры привязки, вы&nbsp;сможете авторизоваться на&nbsp;Картреке с&nbsp;помощью социальных сетей.
            </p>

            {if $core->auth->user.data.fb_id}
            <span class="btn">
                <i class="fui-facebook"></i>
                Фейсбук привязан
            </span>
            {else}
            <a href="/control/user/security/?action=bind_oauth&step=auth&provider=fb" class="btn btn-embossed btn-social-facebook">
                <i class="fui-facebook"></i>
                Авторизоваться через Фейсбук
            </a>
            {/if}
        </div>
    </div>

    <div class="span6">
        <div class="alert alert-info shared-height" row="1">
            <h3>Изменение пароля</h3>

            <br>

            <div class="form_message"></div>

            <form id="password-change-form" class="forms" action="/control/user/security/" method="POST">
                <div class="form-item">
                    <label for="old_password" class="bold">Старый пароль <span class="error"></span></label>
                    <input
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
                        type="password"
                        name="new_password"
                        id="new_password"
                        value=""
                            />
                </div>

                <div class="form-item">
                    <label for="new_password_again" class="bold">Новый пароль еще раз <span class="error"></span></label>
                    <input
                            type="password"
                            name="new_password_again"
                            id="new_password_again"
                            value=""
                            />
                </div>

                <input type="submit" name="send" class="btn btn-embossed btn-primary btn-info" value="Сменить пароль" />
            </form>
        </div>
    </div>
</div>
