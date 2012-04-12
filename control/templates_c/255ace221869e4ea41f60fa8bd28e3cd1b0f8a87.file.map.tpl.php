<?php /* Smarty version Smarty-3.1.7, created on 2012-04-12 00:36:20
         compiled from "/Users/ruslan/Documents/sites/gps/control/templates/modules/map.tpl" */ ?>
<?php /*%%SmartyHeaderCode:731321044f800a68eb8241-73154553%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '255ace221869e4ea41f60fa8bd28e3cd1b0f8a87' => 
    array (
      0 => '/Users/ruslan/Documents/sites/gps/control/templates/modules/map.tpl',
      1 => 1334176578,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '731321044f800a68eb8241-73154553',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.7',
  'unifunc' => 'content_4f800a68ebdc8',
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_4f800a68ebdc8')) {function content_4f800a68ebdc8($_smarty_tpl) {?><div class="page-header">
    <div class="pull-left">
        <h1>
            GPS-мониторинг
        </h1>
    </div>

    <div class="pull-left header_tools">
        <div class="pull-left">
            <div class="btn-group select_car">
                <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
                    <span id="car_name_info">Выбрать машину</span>
                    <span class="caret"></span>
                </a>
                <ul class="dropdown-menu">

                </ul>
            </div>
        </div>

        <div class="pull-left">
            <div href="javascript:void(0)" id="where_is_my_car" class="btn btn-info"><i class="icon-flag icon-white"></i> Показать</div>
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