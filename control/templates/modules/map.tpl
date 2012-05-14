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
            <ul class="dropdown-menu" id="cars_menu">

            </ul>
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
            <div class="datepicker">
                <div id="datepicker"></div>
            </div>

            <div id="registered_data"></div>
        </div>
    </div>
</div>

<script>core.map.init();</script>