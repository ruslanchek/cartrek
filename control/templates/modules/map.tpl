{*if $core->devices->devices_present}
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
            {assign var="fleets_list" value=$core->devices->getFleetsList()}

            {if $fleets_list}
            <div class="btn-group select_fleet pull-right">
                <a class="btn dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">
                    <span id="fleet_name_info"></span>
                    <span class="caret"></span>
                </a>
                <ul class="dropdown-menu" id="fleets_menu">
                    <li {if !isset($smarty.get.fleet)}class="active"{/if}><a href="javascript:void(0)" fleet_id="all">Все</a></li>
                    {foreach $fleets_list as $fleet}
                    <li {if isset($smarty.get.fleet) && $smarty.get.fleet == $fleet.id}class="active"{/if}><a href="javascript:void(0)" fleet_id="{$fleet.id}">{$fleet.name}</a></li>
                    {/foreach}
                </ul>
            </div>
            {/if}

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
{else}
    <div class="page-header">
        <h1>
            Карта
        </h1>
    </div>

    <div class="alert alert-block">
        <h4 class="alert-heading">Внимание!</h4>
        У вас нет активных устройств для отслеживания, необходимо <a href="/control/fleet/add">добавить</a> или активировать устройство в разделе <a href="/control/fleet">автопарк</a>.
    </div>
{/if*}



<div class="quarter">
    {assign var="fleets_list" value=$core->devices->getFleetsList()}

    {if $fleets_list}
    <label class="select-label">
        <strong>Группа</strong>
        <select class="core-ui-select" id="fleets_menu">
            <option {if !isset($smarty.cookies.fleet_id)}selected{/if} value="all">Все группы</option>
            {foreach $fleets_list as $fleet}
            <option {if isset($smarty.cookies.fleet_id) && $smarty.cookies.fleet_id == $fleet.id}selected{/if} value="{$fleet.id}">{$fleet.name}</option></li>
            {/foreach}
        </select>
    </label>
    {/if}

    <div id="cars_menu_holder">
        <ul id="cars_menu" class="left-nav"></ul>
    </div>

    <div id="registered_info" class="side_block"></div>
    <div id="registered_data" class="side_block"></div>
</div>

<div class="threequarter">
    <div id="map"></div>
</div>

<script>core.map.init();</script>