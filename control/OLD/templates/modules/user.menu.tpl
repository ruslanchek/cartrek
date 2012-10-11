<ul class="nav nav-tabs" id="fleets">
    <li{if $core->module.name == 'user'} class="active"{/if}><a href="/control/user">Учетные данные</a></li>
    <li{if $core->module.name == 'user.fleet' || $core->module.name == 'user.fleet.add'} class="active"{/if}><a href="/control/user/fleet">Автопарк</a></li>
    <li{if $core->module.name == 'user.groups'} class="active"{/if}><a href="/control/user/groups">Группы</a></li>
    <li{if $core->module.name == 'user.system'} class="active"{/if}><a href="/control/user/system">Система</a></li>
    <li{if $core->module.name == 'user.notifications'} class="active"{/if}><a href="/control/user/notifications">Уведомления</a></li>
    <li{if $core->module.name == 'user.billing' || $core->module.name == 'user.billing.pay'} class="active"{/if}><a href="/control/user/billing">Баланс и тарифы</a></li>
    <li{if $core->module.name == 'user.change_password'} class="active"{/if}><a href="/control/user/password_change">Изменить пароль</a></li>
</ul>

