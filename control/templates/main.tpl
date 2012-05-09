<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        {include file="common/head.tpl"}
    </head>
    <body>
        <div class="navbar navbar-fixed-top">
            <div class="navbar-inner">
                <div class="container-fluid">
                    <!-- .btn-navbar is used as the toggle for collapsed navbar content -->
                    <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </a>

                    <!-- Be sure to leave the brand out there if you want it shown -->
                    <span class="brand">Автоконтроль</span>

                    <!-- Everything you want hidden at 940px or less, place within here -->
                    <div class="nav-collapse">
                        <ul class="nav">
                            <li class="active"><a href="/control/map/">GPS-мониторинг</a></li>
                            <li><a href="/control/system/">Бортовой компьютер</a></li>
                            <li><a href="/control/guestbook/">Настройка</a></li>
                            <li class="divider-vertical"></li>
                            <li><a href="/control/help/"><i class="icon-question-sign icon-white"></i> Помощь</a></li>
                        </ul>
                        <ul class="nav pull-right">
                            <li class="divider-vertical"></li>
                            <li class="dropdown">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-user icon-white"></i> Авторизация <b class="caret"></b></a>
                                <ul class="dropdown-menu">
                                    <li><a href="/control/auth/register"><i class="icon-share-alt"></i> Вход</a></li>
                                    <li><a href="/control/auth/register/register"><i class="icon-file"></i> Регистрация</a></li>
                                    <li class="divider"></li>
                                    <li><a href="/control/auth/register/remember_pass"><i class="icon-question-sign"></i> Напомнить пароль</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="container-fluid main_content">
            {include file="modules/`$core->module.name`.tpl"}

            <hr>

            {include file="common/footer.tpl"}
        </div>
     </body>
</html>