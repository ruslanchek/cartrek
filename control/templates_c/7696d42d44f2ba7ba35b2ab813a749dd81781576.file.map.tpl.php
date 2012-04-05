<?php /* Smarty version Smarty-3.1.7, created on 2012-04-04 00:56:59
         compiled from "/var/www/fortyfour/data/www/gps.fortyfour.ru/control/templates/modules/map.tpl" */ ?>
<?php /*%%SmartyHeaderCode:8406008474f7b5c72488100-32105750%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '7696d42d44f2ba7ba35b2ab813a749dd81781576' => 
    array (
      0 => '/var/www/fortyfour/data/www/gps.fortyfour.ru/control/templates/modules/map.tpl',
      1 => 1333472216,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '8406008474f7b5c72488100-32105750',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.7',
  'unifunc' => 'content_4f7b5c724a517',
  'variables' => 
  array (
    'core' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_4f7b5c724a517')) {function content_4f7b5c724a517($_smarty_tpl) {?><div class="page-header">
    <div class="pull-left">
        <h1>GPS-мониторинг <small>Volvo S40</small></h1>

        <table class="forms">
        	<tr class="labels">
        		<td>Day</td>
        		<td>Month</td>
        		<td>Year</td>
        		<td></td>
        	</tr>
        	<tr>
        		<td><input size="2" id="day" /> <span class="small descr">dd</span></td>
        		<td>
        			<select id="month">
        				<option value="0">--</option>
        				<option value="1">Января</option>
        				<option value="2">Февраля</option>
        				<option value="3">Марта</option>
        				<option value="4">April</option>
        				<option value="5">May</option>
        				<option value="6">June</option>
        				<option value="7">July</option>
        				<option value="8">August</option>
        				<option value="9">September</option>
        				<option value="10">October</option>
        				<option value="11">November</option>
        				<option value="12">December</option>
        			</select>
        		</td>
        		<td><input id="year" size="6" /> <span class="small descr">yyyy</span></td>
        		<td><a href="" id="test_trigger4" class="ico ico_cal">&nbsp;</a></td>
        	</tr>
        </table>

        <script type="text/javascript">
        $(function()
        { 	$('#test_trigger4').datepicker({ setDate: getSplitDate, onlytrigger: true, callback: splitCallback, theme: 'simple' });
        });

        function getSplitDate()
        {
        	if ($('#day').val() != '' && $('#month').val() != '0' && $('#year').val() != '')
        	{
        		return $('#day').val() + '.' + $('#month').val() + '.' + $('#year').val();
        	}
        	else return false;
        }

        function splitCallback(e, date, year, month, day)
        {
        	$('#year').val(year);
        	$('#month').val(new Number(month).toString());
        	$('#day').val(day);
        }
        </script>
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
        <script>core.map.init('<?php echo $_smarty_tpl->tpl_vars['core']->value->module['start_point']['lat'];?>
', '<?php echo $_smarty_tpl->tpl_vars['core']->value->module['start_point']['lng'];?>
');</script>
    </div>
    <div class="span3">
        <div id="right_side">
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
</div><?php }} ?>