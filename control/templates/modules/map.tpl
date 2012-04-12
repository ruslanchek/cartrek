<div class="page-header">
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

<script>core.map.init();</script>