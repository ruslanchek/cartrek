<?php /* Smarty version Smarty-3.1.7, created on 2012-05-14 22:49:21
         compiled from "/Users/ruslan/Documents/sites/gps/control/templates/common/head.tpl" */ ?>
<?php /*%%SmartyHeaderCode:4085301004f800a68e96fd2-77204142%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '6374aa5b6026bc95d74cb4097c8f19d5c54098bd' => 
    array (
      0 => '/Users/ruslan/Documents/sites/gps/control/templates/common/head.tpl',
      1 => 1337021306,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '4085301004f800a68e96fd2-77204142',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.7',
  'unifunc' => 'content_4f800a68eb3e2',
  'variables' => 
  array (
    'core' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_4f800a68eb3e2')) {function content_4f800a68eb3e2($_smarty_tpl) {?><title><?php echo $_smarty_tpl->tpl_vars['core']->value->module['title'];?>
</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<link rel="stylesheet" href="/control/resources/bootsrtap/css/bootstrap.css" type="text/css" media="all" />
<link rel="stylesheet" href="/control/resources/css/style.css" type="text/css" media="all" />
<link rel="stylesheet" href="/control/resources/plugins/jquery_ui/ui-lightness/jquery-ui-1.8.20.custom.css" />

<script src="https://maps.google.com/maps/api/js?sensor=false"></script>
<script src="/control/resources/js/jquery-1.7.2.min.js"></script>
<script src="/control/resources/js/jquery.cookie.js"></script>
<script src="/control/resources/bootsrtap/js/bootstrap.min.js"></script>
<script src="/control/resources/plugins/jquery_ui/jquery-ui-1.8.20.custom.min.js"></script>
<script src="/control/resources/js/core.js"></script>
<script src="<?php echo $_smarty_tpl->tpl_vars['core']->value->module['dir'];?>
/js/<?php echo $_smarty_tpl->tpl_vars['core']->value->module['name'];?>
.js"></script><?php }} ?>