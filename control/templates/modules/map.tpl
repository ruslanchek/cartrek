<div class="map-top-panel">
    {assign var="fleets_list" value=$core->devices->getFleetsList()}

    {if $fleets_list}
    <div class="fifth">
        <select class="core-ui-select" id="fleets_menu">
            <option {if !isset($smarty.cookies.fleet_id)}selected{/if} value="all">Все группы</option>
            {foreach $fleets_list as $fleet}
            <option {if isset($smarty.cookies.fleet_id) && $smarty.cookies.fleet_id == $fleet.id}selected{/if} value="{$fleet.id}">{$fleet.name}</option></li>
            {/foreach}
        </select>
    </div>
    {/if}

    <div class="fifth">
        <select id="cars_menu"></select>
    </div>

    <div class="fifth">
        <button id="refresh_data" class="btn" title="Обновить данные">Обновить</button>
        <button id="where_is_my_car" class="btn" title="Показать машины/путь">Фокус</button>
    </div>

    <div class="clear"></div>
</div>

<div id="map"></div>

<script src='http://api.tiles.mapbox.com/mapbox.js/v0.6.6/mapbox.js'></script>
<link href='http://api.tiles.mapbox.com/mapbox.js/v0.6.6/mapbox.css' rel='stylesheet' />

<script>map.init();</script>