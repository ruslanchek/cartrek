<div class="threequarter">
    <form class="forms" action="/control/user/password_change/" method="POST">
        <div class="row">
            <div class="twothird">
                <div class="form-item">
                    <label for="old_password" class="bold">Старый пароль{if $form_errors->old_password} <span class="error">{$form_errors->old_password}</span>{/if}</label>
                    <input
                            class="{if $form_errors->old_password}input-error {/if}text width-100"
                            type="password"
                            name="old_password"
                            id="old_password"
                            {*autofocus="autofocus"*}
                            value=""
                    />
                </div>

                <hr>

                <div class="form-item">
                    <label for="new_password" class="bold">Новый пароль{if $form_errors->new_password} <span class="error">{$form_errors->new_password}</span>{/if}</label>
                    <input
                            class="{if $form_errors->new_password}input-error {/if}text width-100"
                            type="password"
                            name="new_password"
                            id="new_password"
                            value=""
                    />
                </div>

                <div class="form-item">
                    <label for="new_password_again" class="bold">Повторите новый пароль{if $form_errors->new_password_again} <span class="error">{$form_errors->new_password_again}</span>{/if}</label>
                    <input
                            class="{if $form_errors->new_password_again}input-error {/if}text width-100"
                            type="password"
                            name="new_password_again"
                            id="name"
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