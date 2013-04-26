<ul class="left-nav">
    <li{if $core->module.name == 'user.fleet' || $core->module.name == 'user.fleet.add'} class="active"{/if}><a href="/control/user/fleet">Автопарк</a></li>
    <li{if $core->module.name == 'user.groups'} class="active"{/if}><a href="/control/user/groups">Группы</a></li>
    <li{if $core->module.name == 'user.geozones'} class="active"{/if}><a href="/control/user/geozones">Геозоны</a></li>
</ul>

<ul class="left-nav">
    <li{if $core->module.name == 'user'} class="active"{/if}><a href="/control/user">Настройка аккаунта</a></li>
    <li{if $core->module.name == 'user.security'} class="active"{/if}><a href="/control/user/security">Пароль и авторизация</a></li>
    <li{if $core->module.name == 'user.system'} class="active"{/if}><a href="/control/user/system">Настройка системы</a></li>
    <li{if $core->module.name == 'user.notifications'} class="active"{/if}><a href="/control/user/notifications">Уведомления</a></li>
    <li{if $core->module.name == 'user.billing' || $core->module.name == 'user.billing.pay'} class="active"{/if}><a href="/control/user/billing">Баланс и тарифы</a></li>
</ul>