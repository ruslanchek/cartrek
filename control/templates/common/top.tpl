<div class="global-loading-bar"></div>

<div class="top-container">
    <div class="container">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="container">
                    {if $core->module.name == 'main'}
                        <span class="brand cartrek-logo"></span>
                    {else}
                        <a title="Картрек" class="brand cartrek-logo" href="/control"></a>
                    {/if}

                    <ul class="nav">
                        <li {if $core->module.name == 'map'}class="active"{/if}>
                            <a href="/control/map">Наблюдение</a>
                            <ul>
                                <li><a href="/control/map">Наблюдение</a></li>
                                <li><a href="/control/user/geozones">Геозоны</a></li>
                            </ul>
                        </li>
                        <li {if $core->module.name == 'dispatcher'}class="active"{/if}><a href="/control/dispatcher">Диспетчер</a></li>
                        <li {if $core->module.name == 'statistics'}class="active"{/if}><a href="/control/statistics">Статистика</a></li>
                        <li {if $core->module.name == 'user.fleet'}class="active"{/if}>
                            <a href="/control/user/fleet">Автопарк</a>
                            <ul>
                                <li><a href="/control/user/fleet">Автомобили</a></li>
                                <li><a href="/control/user/groups">Группы</a></li>
                                <li><a href="/control/user/drivers">Водители</a></li>
                            </ul>
                        </li>
                        <li {if $core->module.name == 'user.diagnostics'}class="active"{/if}><a href="/control/user/diagnostics">Диагностика</a></li>
                    </ul>

                    <ul class="nav pull-right">
                        <li {if $core->module.name == 'events'}class="active"{/if}>
                            <a href="/control/events" title="События">
                                <span class="fui-mail"></span>
                                <span class="hidden-desktop">События</span>
                                <span class="navbar-new" {if $core->auth->user.data.new_events_count <= 0}style="display: none"{/if}>{$core->auth->user.data.new_events_count}</span>
                            </a>
                        </li>

                        <li {if $core->module.name == 'events'}class="active"{/if}>
                            <a href="/control/user" title="Аккаунт">
                                <span class="fui-user"></span>
                                <span class="hidden-desktop">Аккаунт</span>
                            </a>

                            <ul>
                                <li><a href="/control/user/notifications">Уведомления</a></li>
                                <li><a href="/control/user/billing">Баланс и тарифы</a></li>
                                <li><a href="/control/user/security">Пароль и авторизация</a></li>
                                <li><a onclick="core.ui.exitUser()" href="javascript:void(0)">Выход</a></li>
                            </ul>
                        </li>

                        <li {if $core->module.name == 'events'}class="active"{/if}>
                            <a href="/control/user/system" title="Настройка">
                                <span class="fui-gear"></span>
                                <span class="hidden-desktop">Настройка</span>
                            </a>
                        </li>




                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>