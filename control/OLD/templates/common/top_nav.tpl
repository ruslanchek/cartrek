<i id="loading_indicator"><i></i></i>

<div class="navbar navbar-fixed-top">
    <div class="navbar-inner">
        <div class="container-fluid">
            <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </a>

            {if $core->module.name == 'main'}
                <span class="brand logo" title="Картек"></span>
            {else}
                <a class="brand logo" href="/control" title="Картек"></a>
            {/if}

            <div class="nav-collapse">
                <ul class="nav">
                    {if $core->auth->user.status}
                        <li{if $core->module.name == 'map'} class="active"{/if}><a href="/control/map">Карта</a></li>
                        <li{if $core->module.name == 'dispatcher'} class="active"{/if}><a href="/control/dispatcher">Диспетчер</a></li>
                        <li class="divider-vertical"></li>
                        <li><a href="/control/help"><i class="icon-question-sign icon-white"></i> Помощь</a></li>
                    {/if}
                </ul>
                <ul class="nav pull-right">
                    {if $core->auth->user.status}
                        <li{if $core->module.name == 'events'} class="active"{/if}><a href="/control/events"><span id="global_events_counter" class="badge badge-warning" {if $core->auth->user.data.new_events_count <= 0}style="display: none"{/if}>{$core->auth->user.data.new_events_count}</span> Уведомления</a></li>
                        <li class="divider-vertical"></li>
                        <li{if $core->module.name == 'billing'} class="active"{/if}><a href="/control/user/billing">{$core->auth->user.data.balance|price} руб.</a></li>
                    {/if}

                    <li class="divider-vertical"></li>
                    <li class="dropdown">
                        {if $core->auth->user.status}
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-user icon-white"></i> {$core->auth->user.data.login} <b class="caret"></b></a>
                            <ul class="dropdown-menu">
                                <li><a href="/control/user/"><i class="icon-user"></i> Учетные данные</a></li>
                                <li><a href="/control/user/fleet"><i class="icon-list"></i> Автопарк</a></li>
                                <li><a href="/control/user/groups"><i class="icon-list"></i> Группы</a></li>
                                <li><a href="/control/user/system"><i class="icon-cog"></i> Система</a></li>
                                <li><a href="/control/user/notifications"><i class="icon-exclamation-sign"></i> Уведомления</a></li>
                                <li><a href="/control/user/billing"><i class="icon-briefcase"></i> Баланс и тарифы</a></li>
                                <li><a href="/control/user/password_change"><i class="icon-lock"></i> Изменить пароль</a></li>

                                <li class="divider"></li>
                                <li><a href="javascript:void(0)" onclick="core.exitUser()"><i class="icon-share"></i> Выйти</a></li>
                            </ul>
                        {else}
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-user icon-white"></i> Авторизация <b class="caret"></b></a>
                            <ul class="dropdown-menu">
                                <li><a href="/control/auth/login"><i class="icon-share-alt"></i> Вход</a></li>
                                <li><a href="/control/auth/register"><i class="icon-file"></i> Регистрация</a></li>
                                <li class="divider"></li>
                                <li><a href="/control/auth/remember_pass"><i class="icon-question-sign"></i> Напомнить пароль</a></li>
                            </ul>
                        {/if}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>