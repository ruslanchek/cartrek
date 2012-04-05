<?php /* Smarty version Smarty-3.1.7, created on 2012-04-05 16:01:05
         compiled from "Z:/home/loc/gps/control/templates\modules\map.tpl" */ ?>
<?php /*%%SmartyHeaderCode:65384f71f59ece95a1-43800246%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'e7d6e5ad53b2d63c410701e0b7e609558e886f25' => 
    array (
      0 => 'Z:/home/loc/gps/control/templates\\modules\\map.tpl',
      1 => 1333627264,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '65384f71f59ece95a1-43800246',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.7',
  'unifunc' => 'content_4f71f59ed263e',
  'variables' => 
  array (
    'options' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_4f71f59ed263e')) {function content_4f71f59ed263e($_smarty_tpl) {?><div class="page-header">
    <div class="pull-left">
        <h1>GPS-мониторинг <small>Volvo S40</small></h1>
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

            <div id="registered_data">
                <table class="table table-bordered table-condensed">
                    <tr>
                        <td>Максимальная скорость</td>
                        <td><a id="max_speed" class="label label-info" href="javascript:void(0)">&mdash;</a></td>
                    </tr>
                    <tr>
                        <td>Средняя скорость</td>
                        <td><span id="average_speed" class="label">&mdash;</span></td>
                    </tr>
                    <tr>
                        <td>Пройдено пути</td>
                        <td><span id="distance_driven" class="label">&mdash;</span></td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</div>

<script>core.map.init('<?php echo $_smarty_tpl->tpl_vars['options']->value;?>
');</script><?php }} ?>