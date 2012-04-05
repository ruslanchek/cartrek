<div class="page-header">
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

<script>core.map.init('{$options}');</script>