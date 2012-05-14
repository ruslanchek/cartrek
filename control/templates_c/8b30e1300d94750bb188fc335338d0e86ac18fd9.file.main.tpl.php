<?php /* Smarty version Smarty-3.1.7, created on 2012-05-11 17:34:52
         compiled from "Z:/home/loc/gps/control/templates\modules\main.tpl" */ ?>
<?php /*%%SmartyHeaderCode:321324f71f561680239-59287901%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '8b30e1300d94750bb188fc335338d0e86ac18fd9' => 
    array (
      0 => 'Z:/home/loc/gps/control/templates\\modules\\main.tpl',
      1 => 1336740155,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '321324f71f561680239-59287901',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.7',
  'unifunc' => 'content_4f71f56168119',
  'variables' => 
  array (
    'core' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_4f71f56168119')) {function content_4f71f56168119($_smarty_tpl) {?><div class="page-header">
    <h1>Добро пожаловать, <?php echo $_smarty_tpl->tpl_vars['core']->value->auth->user_status['userdata']['name'];?>
</h1>
</div>

<div class="row-fluid">
    <div class="span9">

    </div>

    <div class="span3">
        <div class="tabbable tabs-right">
            <ul class="nav nav-tabs">

            </ul>
            <div class="tab-content">

            </div>
        </div>
    </div>
</div><?php }} ?>