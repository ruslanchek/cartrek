<?php /* Smarty version Smarty-3.1.7, created on 2012-05-18 16:44:35
         compiled from "Z:/home/loc/gps/control/templates\main.tpl" */ ?>
<?php /*%%SmartyHeaderCode:224234f71f561606444-69367567%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'feae8dc55bf9a13d191bcfe7fe9b1fff9dae3a65' => 
    array (
      0 => 'Z:/home/loc/gps/control/templates\\main.tpl',
      1 => 1337345074,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '224234f71f561606444-69367567',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.7',
  'unifunc' => 'content_4f71f561660dd',
  'variables' => 
  array (
    'core' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_4f71f561660dd')) {function content_4f71f561660dd($_smarty_tpl) {?><!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <?php echo $_smarty_tpl->getSubTemplate ("common/head.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

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

                    <?php if ($_smarty_tpl->tpl_vars['core']->value->module['name']=='main'){?>
                        <span class="brand">Cartrek</span>
                    <?php }else{ ?>
                        <a class="brand" href="/control">Cartrek</a>
                    <?php }?>

                    <div class="nav-collapse">
                        <ul class="nav">
                            <?php if ($_smarty_tpl->tpl_vars['core']->value->auth->user_status['status']){?>
                                <li<?php if ($_smarty_tpl->tpl_vars['core']->value->module['name']=='map'){?> class="active"<?php }?>><a href="/control/map/">GPS-мониторинг</a></li>
                                <li<?php if ($_smarty_tpl->tpl_vars['core']->value->module['name']=='system'){?> class="active"<?php }?>><a href="/control/system/">Бортовой компьютер</a></li>
                                <li<?php if ($_smarty_tpl->tpl_vars['core']->value->module['name']=='fleet'){?> class="active"<?php }?>><a href="/control/fleet/">Автопарк</a></li>
                                <li class="divider-vertical"></li>
                                <li><a href="/control/help/"><i class="icon-question-sign icon-white"></i> Помощь</a></li>
                            <?php }?>
                        </ul>
                        <ul class="nav pull-right">
                            <?php if ($_smarty_tpl->tpl_vars['core']->value->auth->user_status['status']){?>
                                <li><a href="/control/help/"><span class="badge badge-warning">4</span> Уведомления</a></li>
                            <?php }?>

                            <li class="divider-vertical"></li>
                            <li class="dropdown">
                                <?php if ($_smarty_tpl->tpl_vars['core']->value->auth->user_status['status']){?>
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-user icon-white"></i> <?php echo $_smarty_tpl->tpl_vars['core']->value->auth->user_status['userdata']['login'];?>
 <b class="caret"></b></a>
                                    <ul class="dropdown-menu">
                                        <li><a href="/control/user"><i class="icon-wrench"></i> Настройка</a></li>
                                        <li><a href="/control/user/change_password"><i class="icon-pencil"></i> Сменить пароль</a></li>
                                        <li class="divider"></li>
                                        <li><a href="javascript:void(0)" onclick="core.exitUser()"><i class="icon-share"></i> Выйти</a></li>
                                    </ul>
                                <?php }else{ ?>
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-user icon-white"></i> Авторизация <b class="caret"></b></a>
                                    <ul class="dropdown-menu">
                                        <li><a href="/control/auth/login"><i class="icon-share-alt"></i> Вход</a></li>
                                        <li><a href="/control/auth/register"><i class="icon-file"></i> Регистрация</a></li>
                                        <li class="divider"></li>
                                        <li><a href="/control/auth/remember_pass"><i class="icon-question-sign"></i> Напомнить пароль</a></li>
                                    </ul>
                                <?php }?>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="container-fluid main_content">
            <?php echo $_smarty_tpl->getSubTemplate ("modules/".($_smarty_tpl->tpl_vars['core']->value->module['name']).".tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

            <div class="clear"></div>
            <hr>
            <?php echo $_smarty_tpl->getSubTemplate ("common/footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

        </div>
    </body>
</html><?php }} ?>