<?php /* Smarty version Smarty-3.1.7, created on 2012-04-07 13:35:36
         compiled from "/Users/ruslan/Documents/sites/gps/control/templates/modules/map.tpl" */ ?>
<?php /*%%SmartyHeaderCode:731321044f800a68eb8241-73154553%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '255ace221869e4ea41f60fa8bd28e3cd1b0f8a87' => 
    array (
      0 => '/Users/ruslan/Documents/sites/gps/control/templates/modules/map.tpl',
      1 => 1333734584,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '731321044f800a68eb8241-73154553',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.7',
  'unifunc' => 'content_4f800a68ebdc8',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_4f800a68ebdc8')) {function content_4f800a68ebdc8($_smarty_tpl) {?><div class="page-header">
    <div class="pull-left">
        <h1>GPS-мониторинг <small id="car_name_info"></small></h1>
    </div>

    <div class="pull-right">
        <div id="tools_menu">
            <a href="javascript:void(0)" id="where_is_my_car" class="btn"><i class="icon-flag"></i> Моя машина</a>
            <a href="javascript:void(0)" id="view_settings" class="btn btn-info"><i class="icon-cog icon-white"></i> Настройка вида</a>
        </div>
    </div>

    <div class="clear"></div>
</div>

<div class="row-fluid">
    <div class="span9">
        <div id="map"></div>
    </div>
    <div class="span3">
        <div id="right_side">
            <div class="datepicker">
                <div id="datepicker"></div>
            </div>

            <div id="registered_data"></div>
        </div>
    </div>
</div>

<script>core.map.init();</script><?php }} ?>