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

<script src="/control/resources/mapping-tools/raphael-layer/dist/rlayer.js"></script>

<link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/dist/leaflet.css" />
<!--[if lte IE 8]>
    <link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/dist/leaflet.ie.css" />
<![endif]-->

<script src="/control/resources/mapping-tools/leaflet/dist/leaflet-src.js"></script>
<script src="/control/resources/mapping-tools/mapbox-wax/dist/wax.leaf.min.js"></script>

<script>map.init();</script>
