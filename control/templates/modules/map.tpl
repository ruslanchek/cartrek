<div class="map-top-panel">
    <div class="fifth" id="fleets-menu"></div>

    <div class="fifth" id="cars-menu"></div>

    <div class="fifth">
        <button id="refresh_data" class="btn" title="Обновить данные">Обновить</button>
        <button id="focus" class="btn" title="Показать машины/путь">Фокус</button>
    </div>

    <div class="clear"></div>
</div>

<div class="map-container">
    <div id="map"></div>
</div>

<link rel="stylesheet" href="/control/resources/leaflet/dist/leaflet.css" />
<!--[if lte IE 8]>
    <link rel="stylesheet" href="/control/resources/leaflet/dist/leaflet.ie.css" />
<![endif]-->

<script src="/control/resources/leaflet/dist/leaflet.js"></script>
<script src="/control/resources/mapbox-wax/dist/wax.leaf.js"></script>

<script>map.init();</script>