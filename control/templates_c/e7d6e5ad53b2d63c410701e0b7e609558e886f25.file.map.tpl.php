<?php /* Smarty version Smarty-3.1.7, created on 2012-05-23 19:20:28
         compiled from "Z:/home/loc/gps/control/templates\modules\map.tpl" */ ?>
<?php /*%%SmartyHeaderCode:65384f71f59ece95a1-43800246%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'e7d6e5ad53b2d63c410701e0b7e609558e886f25' => 
    array (
      0 => 'Z:/home/loc/gps/control/templates\\modules\\map.tpl',
      1 => 1337786427,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '65384f71f59ece95a1-43800246',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.7',
  'unifunc' => 'content_4f71f59ed263e',
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_4f71f59ed263e')) {function content_4f71f59ed263e($_smarty_tpl) {?><div class="calendar_place">
    <div class="datepicker">
        <div id="datepicker"></div>
    </div>
    <a href="javascript:void(0)" class="opener">25 сентября, 2012 <b class="caret"></b></a>
</div>

<div class="page-header">
    <h1 class="pull-left">
        GPS-мониторинг <small class="current_date"></small>
    </h1>

    <div class="header_tools pull-right">
        <div class="btn-group select_car pull-right">
            <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
                <span id="car_name_info"></span>
                <span class="caret"></span>
            </a>
            <ul class="dropdown-menu" id="cars_menu"></ul>
        </div>

        <div class="pull-right">
            <button id="refresh_data" class="btn" title="Обновить данные"><i class="icon-refresh"></i></button>
        </div>

        <div class="pull-right">
            <button id="where_is_my_car" class="btn btn-info" title="Показать машины/путь"><i class="icon-screenshot icon-white"></i></button>
        </div>

        <div class="clear"></div>
    </div>

    <div class="clear"></div>
</div>

<div class="row-fluid">
    <div class="span9">
        <div id="map"></div>
    </div>
    <div class="span3">
        <div id="right_side">
            <div id="registered_info"></div>
            <div id="registered_data"></div>
        </div>
    </div>
</div>

<script>core.map.init();</script><?php }} ?>