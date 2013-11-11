<div class="global-menu">
    <a href="/control" {if $core->module.name == 'main'}class="active"{/if}>
        <i class="icon-64 house"></i>
        Домой
    </a>

    <a href="/control/map" {if $core->module.name == 'map'}class="active"{/if}>
        <i class="icon-64 compass"></i>
        Наблюдение
    </a>

    <a href="/control/dispatcher" {if $core->module.name == 'dispatcher'}class="active"{/if}>
        <i class="icon-64 gauge"></i>
        Диспетчер
    </a>

    <a href="/control/statistics" {if $core->module.name == 'statistics'}class="active"{/if}>
        <i class="icon-64 statistics"></i>
        Статистика
    </a>

    <a href="/control/user/geozones" {if $core->module.name == 'geozones'}class="active"{/if}>
        <i class="icon-64 bullseye"></i>
        Геозоны
    </a>

    <a href="/control/user/fleet" {if $core->module.name == 'user.fleet'}class="active"{/if}>
        <i class="icon-64 truck"></i>
        Машины
    </a>

    {*<a href="/control/user/groups/">
        <i class="icon-64 truck"></i>
        Группы
    </a>*}

    <a href="/control/user/drivers" {if $core->module.name == 'user.drivers'}class="active"{/if}>
        <i class="icon-64 dude"></i>
        Водители
    </a>
</div>