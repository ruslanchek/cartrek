<div class="map-top-panel">
    <div class="twothird">
        <div id="fleets-menu"></div>

        <div id="cars-menu"></div>

        <button id="focus" class="btn" title="Показать машины">Фокус</button>
    </div>

    <div class="third push-right" id="togglers">
        <button id="auto-renew" class="btn" title="Автообновление"></button>
        <button id="show-path" class="btn" title="Показать путь"></button>
    </div>

    <div class="clear"></div>
</div>

<div id="time-machine">
    <div class="days"></div>
</div>

<div class="map-container">
    <div class="shadow-top"></div>
    <div class="shadow-bottom"></div>
    <div id="map"></div>
</div>

<div class="map-bottom-panel">
    <div class="quarter bottom-panel" id="bottom-panel-1"><div class="panel-content"></div></div>
    <div class="quarter bottom-panel" id="bottom-panel-2"><div class="panel-content"></div></div>
    <div class="quarter bottom-panel" id="bottom-panel-3"><div class="panel-content"></div></div>

    <div class="clear"></div>
</div>

<link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/dist/leaflet.css" />
<!--[if lte IE 8]>
    <link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/dist/leaflet.ie.css" />
<![endif]-->

<script src="/control/resources/mapping-tools/leaflet/dist/leaflet-src.js"></script>
<script src="/control/resources/mapping-tools/raphael-layer/debug/libs/raphael/raphael-min.js"></script>
<script src="/control/resources/mapping-tools/raphael-layer/dist/rlayer.js"></script>
<script src="/control/resources/mapping-tools/mapbox-wax/dist/wax.leaf.min.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/leaflet-fullscreen/Control.FullScreen.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/html-icon/Html.icon.js"></script>

<script>map.init();</script>
