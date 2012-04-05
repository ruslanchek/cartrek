<?php /* Smarty version Smarty-3.1.7, created on 2012-03-29 00:36:42
         compiled from "/Users/ruslan/Documents/sites/gps/control/templates/main.tpl" */ ?>
<?php /*%%SmartyHeaderCode:4398940494f735fcf8cfe72-79141026%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '820f25f63b8cdf8afafd084f38a2bf0c57742ce0' => 
    array (
      0 => '/Users/ruslan/Documents/sites/gps/control/templates/main.tpl',
      1 => 1332966998,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '4398940494f735fcf8cfe72-79141026',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.7',
  'unifunc' => 'content_4f735fcf91e21',
  'variables' => 
  array (
    'core' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_4f735fcf91e21')) {function content_4f735fcf91e21($_smarty_tpl) {?><!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <?php echo $_smarty_tpl->getSubTemplate ("common/head.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

    </head>
    <body>
        <?php echo $_smarty_tpl->getSubTemplate ("modules/".($_smarty_tpl->tpl_vars['core']->value->module['name']).".tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

        <?php echo $_smarty_tpl->getSubTemplate ("common/footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

    </body>
</html><?php }} ?>