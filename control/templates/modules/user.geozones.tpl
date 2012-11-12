<div class="threequarter">
    <div class="map-instruments">
        <a href="javascript:void(0)" class="btn btn-icon active"><i class="icon-16x16 cursor"></i></a>
        <a href="javascript:void(0)" class="btn btn-icon"><i class="icon-16x16 shape"></i></a>
        <a href="javascript:void(0)" class="btn pull-right">Геозоны</a>
    </div>

    <div class="map-container">
        <div class="shadow-top"></div>
        <div class="shadow-bottom"></div>
        <div id="map"></div>
    </div>
</div>

<link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/dist/leaflet.css" />

<!--[if lte IE 8]>
<link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/dist/leaflet.ie.css" />
<![endif]-->

<script src="/control/resources/mapping-tools/leaflet/dist/leaflet.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/proto/proto.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/leaflet-fullscreen/Control.FullScreen.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/html-icon/Html.icon.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/draw/dist/leaflet.draw-src.js"></script>

<script>geozones.init();</script>

<div class="quarter">
    {include file="modules/user.menu.tpl"}
</div>