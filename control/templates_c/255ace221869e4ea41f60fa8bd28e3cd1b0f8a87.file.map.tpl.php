<?php /* Smarty version Smarty-3.1.7, created on 2012-07-19 00:32:58
         compiled from "/Users/ruslan/Documents/sites/gps/control/templates/modules/map.tpl" */ ?>
<?php /*%%SmartyHeaderCode:2831870014fc681072117f1-42090688%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '255ace221869e4ea41f60fa8bd28e3cd1b0f8a87' => 
    array (
      0 => '/Users/ruslan/Documents/sites/gps/control/templates/modules/map.tpl',
      1 => 1342643576,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '2831870014fc681072117f1-42090688',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.7',
  'unifunc' => 'content_4fc68107299fb',
  'variables' => 
  array (
    'core' => 0,
    'fleets_list' => 0,
    'fleet' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_4fc68107299fb')) {function content_4fc68107299fb($_smarty_tpl) {?><?php if ($_smarty_tpl->tpl_vars['core']->value->devices->devices_present){?>
    <div class="calendar_place closed">
        <div class="datepicker">
            <div id="datepicker"></div>
        </div>
        <a href="javascript:void(0)" class="opener"><span class="current_date"></span> <b class="caret"></b></a>
    </div>

    <div class="page-header">
        <h1 class="pull-left">
            Карта
        </h1>

        <div class="header_tools pull-right">
            <?php $_smarty_tpl->tpl_vars["fleets_list"] = new Smarty_variable($_smarty_tpl->tpl_vars['core']->value->devices->getFleetsList(), null, 0);?>

            <?php if ($_smarty_tpl->tpl_vars['fleets_list']->value){?>
            <div class="btn-group select_fleet pull-right">
                <a class="btn dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">
                    <span id="fleet_name_info"></span>
                    <span class="caret"></span>
                </a>
                <ul class="dropdown-menu" id="fleets_menu">
                    <li <?php if (!isset($_GET['fleet'])){?>class="active"<?php }?>><a href="javascript:void(0)" fleet_id="all">Все группы</a></li>
                    <?php  $_smarty_tpl->tpl_vars['fleet'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['fleet']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['fleets_list']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['fleet']->key => $_smarty_tpl->tpl_vars['fleet']->value){
$_smarty_tpl->tpl_vars['fleet']->_loop = true;
?>
                    <li <?php if (isset($_GET['fleet'])&&$_GET['fleet']==$_smarty_tpl->tpl_vars['fleet']->value['id']){?>class="active"<?php }?>><a href="javascript:void(0)" fleet_id="<?php echo $_smarty_tpl->tpl_vars['fleet']->value['id'];?>
"><?php echo $_smarty_tpl->tpl_vars['fleet']->value['name'];?>
</a></li>
                    <?php } ?>
                </ul>
            </div>
            <?php }?>

            <div class="btn-group select_car pull-right">
                <a class="btn dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">
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

    <div class="row-fluid map_container">
        <div id="map"></div>

        <div id="registered_info" class="side_block"></div>
        <div id="registered_data" class="side_block"></div>
    </div>

    <script>core.map.init();</script>
<?php }else{ ?>
    <div class="page-header">
        <h1>
            Карта
        </h1>
    </div>

    <div class="alert alert-block">
        <h4 class="alert-heading">Внимание!</h4>
        У вас нет активных устройств для отслеживания, необходимо <a href="/control/fleet/add">добавить</a> или активировать устройство в разделе <a href="/control/fleet">автопарк</a>.
    </div>
<?php }?><?php }} ?>