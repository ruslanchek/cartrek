<div class="threequarter">
    <form id="password-change-form" class="forms" action="/control/user/password_change/" method="POST">
        <div class="form_message">

        </div>

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
            </div>
        </div>

        <input type="submit" name="send" class="btn" value="Сохранить" />
    </form>
</div>

<div class="quarter">
    {include file="modules/user.menu.tpl"}
</div>