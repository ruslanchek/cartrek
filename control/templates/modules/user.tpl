<div class="threequarter">
    <form class="forms" action="" method="POST">
        {if isset($core->module.form.message)}
            <div class="alert {if $core->module.form.status}alert-success{else}alert-error{/if}">
                <a class="close" data-dismiss="alert" href="javascript:void(0)">×</a>
                {$core->module.form.message}
            </div>
        {/if}

        <div class="form-item">
            <label for="login" class="bold">Логин</label>
            <input class="text" type="text" name="login" id="login" {*autofocus="autofocus"*} value="{$core->auth->user.data.login}" />
        </div>

        <div class="form-item">
            <label for="email" class="bold">Электонная почта</label>
            <input class="text" type="email" name="email" id="email" value="{$core->auth->user.data.email}" />
        </div>

        <div class="form-item">
            <label for="name" class="bold">Имя</label>
            <input class="text" type="text" name="name" id="name" value="{$core->auth->user.data.name}" />
        </div>

        <input type="submit" name="send" class="btn" value="Сохранить" />
    </form>
</div>

<div class="quarter">
    {include file="modules/user.menu.tpl"}
</div>