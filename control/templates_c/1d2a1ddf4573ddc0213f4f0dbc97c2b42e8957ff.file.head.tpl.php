<?php /* Smarty version Smarty-3.1.7, created on 2012-05-10 13:57:22
         compiled from "Z:/home/loc/gps/control/templates\common\head.tpl" */ ?>
<?php /*%%SmartyHeaderCode:105654f72e3fd140033-76492709%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '1d2a1ddf4573ddc0213f4f0dbc97c2b42e8957ff' => 
    array (
      0 => 'Z:/home/loc/gps/control/templates\\common\\head.tpl',
      1 => 1336643797,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '105654f72e3fd140033-76492709',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.7',
  'unifunc' => 'content_4f72e3fd1e584',
  'variables' => 
  array (
    'core' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_4f72e3fd1e584')) {function content_4f72e3fd1e584($_smarty_tpl) {?><title><?php echo $_smarty_tpl->tpl_vars['core']->value->module['title'];?>
</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<link rel="stylesheet" href="/control/resources/bootsrtap/css/bootstrap.css" type="text/css" media="all" />
<link rel="stylesheet" href="/control/resources/css/style.css" type="text/css" media="all" />
<link rel="stylesheet" href="/control/resources/plugins/datepicker/kube.datepicker.css" type="text/css" media="all" />

<script src="https://maps.google.com/maps/api/js?sensor=false"></script>
<script src="/control/resources/js/jquery-1.7.2.min.js"></script>
<script src="/control/resources/js/jquery.cookie.js"></script>
<script src="/control/resources/bootsrtap/js/bootstrap.min.js"></script>
<script src="/control/resources/plugins/datepicker/kube.datepicker.min.js"></script>
<script src="/control/resources/js/core.js"></script>
<script src="<?php echo $_smarty_tpl->tpl_vars['core']->value->module['dir'];?>
/js/<?php echo $_smarty_tpl->tpl_vars['core']->value->module['name'];?>
.js"></script><?php }} ?>