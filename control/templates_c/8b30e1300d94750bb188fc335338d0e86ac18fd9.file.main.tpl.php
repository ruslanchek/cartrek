<?php /* Smarty version Smarty-3.1.7, created on 2012-05-10 14:44:28
         compiled from "Z:/home/loc/gps/control/templates\modules\main.tpl" */ ?>
<?php /*%%SmartyHeaderCode:321324f71f561680239-59287901%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '8b30e1300d94750bb188fc335338d0e86ac18fd9' => 
    array (
      0 => 'Z:/home/loc/gps/control/templates\\modules\\main.tpl',
      1 => 1336646667,
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
    'item' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_4f71f56168119')) {function content_4f71f56168119($_smarty_tpl) {?><div class="page-header">
    <h1>Добро пожаловать, <?php echo $_smarty_tpl->tpl_vars['core']->value->auth->user_status['userdata']['name'];?>
</h1>
</div>

<table class="table table-striped table-bordered table-condensed">
    <tr>
        <th width="59%">Название</th>
        <th width="30%">Марка</th>
        <th width="10%">Госномер</th>
        <th width="1%">Идентификатор</th>
    </tr>
    <?php  $_smarty_tpl->tpl_vars['item'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['item']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['core']->value->getUserDevices(); if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['item']->key => $_smarty_tpl->tpl_vars['item']->value){
$_smarty_tpl->tpl_vars['item']->_loop = true;
?>
    <tr>
        <td><a href="#"><?php echo $_smarty_tpl->tpl_vars['item']->value['name'];?>
</a></td>
        <td><?php echo $_smarty_tpl->tpl_vars['item']->value['make'];?>
 <?php echo $_smarty_tpl->tpl_vars['item']->value['model'];?>
</td>
        <td><span class="g_id"><?php echo $_smarty_tpl->tpl_vars['item']->value['g_id'];?>
</span></td>
        <td><?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
<?php echo $_smarty_tpl->tpl_vars['item']->value['secret'];?>
</td>
    </tr>
    <?php } ?>
</table><?php }} ?>