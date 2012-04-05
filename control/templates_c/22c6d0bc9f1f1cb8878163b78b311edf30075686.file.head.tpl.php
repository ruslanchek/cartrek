<?php /* Smarty version Smarty-3.1.7, created on 2012-04-04 00:52:50
         compiled from "/var/www/fortyfour/data/www/gps.fortyfour.ru/control/templates/common/head.tpl" */ ?>
<?php /*%%SmartyHeaderCode:5674839614f7b5c72451ad1-85147202%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '22c6d0bc9f1f1cb8878163b78b311edf30075686' => 
    array (
      0 => '/var/www/fortyfour/data/www/gps.fortyfour.ru/control/templates/common/head.tpl',
      1 => 1333471955,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '5674839614f7b5c72451ad1-85147202',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.7',
  'unifunc' => 'content_4f7b5c7247e0b',
  'variables' => 
  array (
    'core' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_4f7b5c7247e0b')) {function content_4f7b5c7247e0b($_smarty_tpl) {?><title><?php echo $_smarty_tpl->tpl_vars['core']->value->module['title'];?>
</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<link rel="stylesheet" href="/control/resources/bootsrtap/css/bootstrap.css" type="text/css" media="all" />
<link rel="stylesheet" href="/control/resources/css/style.css" type="text/css" media="all" />
<link rel="stylesheet" href="/control/resources/plugins/datepicker/kube.datepicker.css" type="text/css" media="all" />

<script src="http://api-maps.yandex.ru/1.1/index.xml?key=<?php echo $_smarty_tpl->tpl_vars['core']->value->config->yandex_maps_api_key;?>
"></script>
<script src="/control/resources/js/jquery-1.7.2.min.js"></script>
<script src="/control/resources/js/jquery.cookie.js"></script>
<script src="/control/resources/bootsrtap/js/bootstrap.min.js"></script>
<script src="/control/resources/plugins/datepicker/kube.datepicker.min.js"></script>
<script src="/control/resources/js/core.js"></script>
<script src="/control/<?php echo $_smarty_tpl->tpl_vars['core']->value->module['name'];?>
/js/<?php echo $_smarty_tpl->tpl_vars['core']->value->module['name'];?>
.js"></script><?php }} ?>