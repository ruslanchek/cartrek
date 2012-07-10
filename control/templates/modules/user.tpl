<div class="page-header">
    <h1>Настройка кабинета</h1>
</div>

<ul class="nav nav-tabs" id="fleets">
    <li class="active"><a href="/control/user/">Учетные данные</a></li>
    <li><a href="/control/user/groups">Группы</a></li>
    <li><a href="/control/user/system">Система</a></li>
    <li><a href="/control/user/notifications">Уведомления</a></li>
    <li><a href="/control/user/tariff">Финансы и тарифы</a></li>
    <li><a href="/control/user/password_change">Изменить пароль</a></li>
</ul>

    <form id="add_car_form" class="form-horizontal" action="" method="POST">
        {if isset($core->module.form.message)}
            <div class="alert {if $core->module.form.status}alert-success{else}alert-error{/if}">
                <a class="close" data-dismiss="alert" href="javascript:void(0)">×</a>
                {$core->module.form.message}
            </div>
        {/if}

        <fieldset>
            <div class="control-group">
                <label class="control-label" for="login">Логин</label>
                <div class="controls">
                    <input type="text" class="input-xlarge" id="login" name="login" value="{$core->auth->user.data.login}">
                </div>
            </div>

            <div class="control-group">
                <label class="control-label" for="name">Электонная почта</label>
                <div class="controls">
                    <input type="text" class="input-xlarge" id="email" name="email" value="{$core->auth->user.data.email}">
                </div>
            </div>

            <div class="control-group">
                <label class="control-label" for="name">Имя</label>
                <div class="controls">
                    <input type="text" class="input-xlarge" id="name" name="name" value="{$core->auth->user.data.name}">
                </div>
            </div>
        </fieldset>

        <div class="form-actions">
            <button id="submit" type="submit" class="btn btn-primary" autocomplete="off">Сохранить</button>
        </div>
    </form>