<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        {include file="common/head.tpl"}
    </head>
    <body>
        <div class="navbar navbar-fixed-top">
            <div class="navbar-inner">
                <div class="container-fluid">
                    <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </a>

                    {if $core->module.name == 'main'}
                        <span class="brand">Автоконтроль</span>
                    {else}
                        <a class="brand" href="/control">Автоконтроль</a>
                    {/if}

                    <div class="nav-collapse">
                        <ul class="nav">
                            {if $core->auth->user_status.status}
                                <li{if $core->module.name == 'map'} class="active"{/if}><a href="/control/map/">GPS-мониторинг</a></li>
                                <li{if $core->module.name == 'system'} class="active"{/if}><a href="/control/system/">Бортовой компьютер</a></li>
                                <li{if $core->module.name == 'fleet'} class="active"{/if}><a href="/control/fleet/">Автопарк</a></li>
                                <li class="divider-vertical"></li>
                                <li><a href="/control/help/"><i class="icon-question-sign icon-white"></i> Помощь</a></li>
                            {/if}
                        </ul>
                        <ul class="nav pull-right">
                            {if $core->auth->user_status.status}
                                <li><a href="/control/help/"><span class="badge badge-warning">4</span> Уведомления</a></li>
                            {/if}

                            <li class="divider-vertical"></li>
                            <li class="dropdown">
                                {if $core->auth->user_status.status}
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-user icon-white"></i> {$core->auth->user_status.userdata.login} <b class="caret"></b></a>
                                    <ul class="dropdown-menu">
                                        <li><a href="/control/user"><i class="icon-wrench"></i> Настройка</a></li>
                                        <li><a href="/control/user/change_password"><i class="icon-pencil"></i> Сменить пароль</a></li>
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

        <div class="container-fluid main_content">
            {include file="modules/`$core->module.name`.tpl"}
            <div class="clear"></div>
            <hr>
            {include file="common/footer.tpl"}
        </div>
    </body>
</html>