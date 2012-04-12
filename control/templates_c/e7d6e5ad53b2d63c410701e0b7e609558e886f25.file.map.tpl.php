<?php /* Smarty version Smarty-3.1.7, created on 2012-04-12 20:54:00
         compiled from "Z:/home/loc/gps/control/templates\modules\map.tpl" */ ?>
<?php /*%%SmartyHeaderCode:65384f71f59ece95a1-43800246%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'e7d6e5ad53b2d63c410701e0b7e609558e886f25' => 
    array (
      0 => 'Z:/home/loc/gps/control/templates\\modules\\map.tpl',
      1 => 1334220902,
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
<?php if ($_valid && !is_callable('content_4f71f59ed263e')) {function content_4f71f59ed263e($_smarty_tpl) {?><div class="page-header">
    <div class="pull-left">
        <h1>
            GPS-мониторинг <small class="current_date">29 марта, 2011</small>
        </h1>
    </div>

    <div class="clear"></div>

    <div class="header_tools">
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