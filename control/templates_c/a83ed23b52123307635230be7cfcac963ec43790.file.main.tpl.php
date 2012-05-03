<?php /* Smarty version Smarty-3.1.7, created on 2012-04-04 00:24:18
         compiled from "/var/www/fortyfour/data/www/gps.fortyfour.ru/control/templates/main.tpl" */ ?>
<?php /*%%SmartyHeaderCode:7944240564f7b5c72405599-93294184%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'a83ed23b52123307635230be7cfcac963ec43790' => 
    array (
      0 => '/var/www/fortyfour/data/www/gps.fortyfour.ru/control/templates/main.tpl',
      1 => 1333385541,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '7944240564f7b5c72405599-93294184',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'core' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.7',
  'unifunc' => 'content_4f7b5c724436a',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_4f7b5c724436a')) {function content_4f7b5c724436a($_smarty_tpl) {?><!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <?php echo $_smarty_tpl->getSubTemplate ("common/head.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

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
                    <span class="brand">Car</span>

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
                                    <li><a href="/control/auth"><i class="icon-share-alt"></i> Вход</a></li>
                                    <li><a href="/control/auth/register"><i class="icon-file"></i> Регистрация</a></li>
                                    <li class="divider"></li>
                                    <li><a href="/control/auth/remember_pass"><i class="icon-question-sign"></i> Напомнить пароль</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="container-fluid main_content">
            <?php echo $_smarty_tpl->getSubTemplate ("modules/".($_smarty_tpl->tpl_vars['core']->value->module['name']).".tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


            <hr>

            <?php echo $_smarty_tpl->getSubTemplate ("common/footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

        </div>
     </body>
</html><?php }} ?>