<div class="threequarter">
    <div class="table-wrapper">
        <div class="geozones">
            <div class="geozones-left">
                <div class="map-container map-geozones">
                    <div id="map"></div>
                </div>
            </div>

            <div class="geozones-right">
                <div class="geozones-menu">

                </div>
            </div>

            <div class="clear"></div>
        </div>
    </div>
</div>

<link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/dist/leaflet.css" />
<link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/plugins/draw/dist/leaflet.draw.css" />

<!--[if lte IE 8]>
<link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/dist/leaflet.ie.css" />
<![endif]-->

<script src="/control/resources/mapping-tools/leaflet/dist/leaflet.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/proto/proto.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/leaflet-fullscreen/Control.FullScreen.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/html-icon/Html.icon.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/draw/dist/leaflet.draw-src.js"></script>

<script src="http://maps.google.com/maps/api/js?v=3.2&sensor=false"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/tiles/Google.js"></script>

<script>
    $(function(){
        geozones.init();
    })
</script>

<div class="quarter">
    {include file="modules/user.menu.tpl"}
</div>