<div class="quarter">
    {include file="modules/user.menu.tpl"}
</div>

<div class="threequarter">
    <div class="map-instruments">
        <a href="javascript:void(0)" class="btn active"><i class="icon-16x16 cursor"></i></a>
        <a href="javascript:void(0)" class="btn"><i class="icon-16x16 shape"></i></a>
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

<script src="/control/resources/mapping-tools/leaflet/dist/leaflet-src.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/raphael-layer/debug/libs/raphael/raphael-min.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/raphael-layer/dist/rlayer.js"></script>
<script src="/control/resources/mapping-tools/mapbox-wax/dist/wax.leaf.min.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/proto/proto.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/leaflet-fullscreen/Control.FullScreen.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/html-icon/Html.icon.js"></script>

<script>geozones.init();</script>