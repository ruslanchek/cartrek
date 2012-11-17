<div class="map-instruments">
    <div class="map-top-panel">
        <div class="half">
            <div id="fleets-menu"></div>
            <div id="cars-menu"></div>
        </div>

        <div class="half push-right" id="togglers">
            <button id="auto-renew" class="btn" title="Автообновление"></button>

            <button id="show-path" class="btn" title="Показать путь"></button>

            <div class="btn-parts push-right">
                <button id="auto-focus" class="btn-part-left" title="Автоматическое перемещение карты при обновлении данных"></button>
                <button id="focus" class="btn-part-right" title="Показать текущее положение">Фокус</button>
            </div>

            <a href="" id="timemachine-button">
                <i></i>
                <span>Машина времени</span>
            </a>
        </div>

        <div class="clear"></div>
    </div>

    <div id="time-machine">
        <div class="days"></div>
    </div>
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
<script src="/control/resources/mapping-tools/leaflet/plugins/proto/proto.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/leaflet-fullscreen/Control.FullScreen.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/html-icon/Html.icon.js"></script>

<script>map.init();</script>