<nav class="nav-main">
    <a {if $core->module.name == 'map'}class="active"{/if} href="/control/map"><i class="f-icon icon-globe-1"></i>Наблюдение</a>
    <a {if $core->module.name == 'dispatcher'}class="active"{/if} href="/control/dispatcher"><i class="f-icon icon-desktop"></i>Диспетчер<span class="arrow-active"></span></a>
    <a {if $core->module.name == 'statistics'}class="active"{/if} href="/control/statistics"><i class="f-icon icon-chart-bar"></i>Статистика</a>
    <a {if $core->module.name == 'user.geozones'}class="active"{/if} href="/control/user/geozones"><i class="f-icon icon-target-4"></i>Геозоны</a>
    <a {if $core->module.name == 'fleet.groups'}class="active"{/if} href="/control/user/groups"><i class="f-icon icon-th-large-1"></i>Группы</a>
    <a {if $core->module.name == 'fleet'}class="active"{/if} href="/control/user/fleet"><i class="f-icon icon-truck"></i>Машины</a>
    <a {if $core->module.name == 'drivers'}class="active"{/if} href="/control/user/drivers"><i class="f-icon icon-steering-wheel"></i>Водители</a>
</nav>