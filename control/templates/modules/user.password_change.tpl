<div class="threequarter">
    <form class="forms" action="/control/user/" method="POST">
        <div class="row">
            <div class="half">
                <div class="form-item">
                    <label for="login" class="bold">Логин{if $form_errors->login} <span class="error">{$form_errors->login}</span>{/if}</label>
                    <input
                            class="{if $form_errors->login}input-error {/if}text width-100"
                            type="text"
                            name="login"
                            id="login"
                            {*autofocus="autofocus"*}
                            value="{$form_data->login}"
                    />
                </div>

                <div class="form-item">
                    <label for="email" class="bold">Электонная почта{if $form_errors->email} <span class="error">{$form_errors->email}</span>{/if}</label>
                    <input
                            class="{if $form_errors->email}input-error {/if}text width-100"
                            type="email"
                            name="email"
                            id="email"
                            value="{$form_data->email}"
                    />
                </div>

                <div class="form-item">
                    <label for="name" class="bold">Имя{if $form_errors->name} <span class="error">{$form_errors->name}</span>{/if}</label>
                    <input
                            class="{if $form_errors->name}input-error {/if}text width-100"
                            type="text"
                            name="name"
                            id="name"
                            value="{$form_data->name}"
                    />
                </div>
            </div>

            <div class="half">
                <div class="form-item">
                    <label for="user_timezone" class="bold">Часовой пояс</label>
                    <select class="core-ui-select" name="user_timezone" id="user_timezone">
                    {foreach $core->utils->generateTimeZonesList() as $key => $val}
                        <option value="{$key}" {if $key == $core->auth->user.data.user_timezone}selected{/if}>{$val}</option>
                    {/foreach}
                    </select>
                </div>
            </div>
        </div>

        <input type="submit" name="send" class="btn" value="Сохранить" />
    </form>
</div>

<div class="quarter">
    {include file="modules/user.menu.tpl"}
</div>