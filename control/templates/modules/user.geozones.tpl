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

    <div class="clearfix"></div>
</div>



<link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/dist/leaflet.css" />
<link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/dist/leaflet.draw.css" />
<link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/plugins/leaflet-locatecontrol-gh-pages/src/L.Control.Locate.css" />

<!--[if lte IE 8]>
<link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/dist/leaflet.ie.css" />
<link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/dist/leaflet.draw.ie.css" />
<link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/plugins/leaflet-locatecontrol-gh-pages/src/L.Control.Locate.ie.css" />
<![endif]-->

<script src="/control/resources/mapping-tools/leaflet/dist/leaflet.js"></script>

<script src="/control/resources/mapping-tools/leaflet/plugins/leaflet-locatecontrol-gh-pages/src/L.Control.Locate.js"></script>

<script src="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/src/Leaflet.draw.js"></script>

<script src="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/src/edit/handler/Edit.Poly.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/src/edit/handler/Edit.SimpleShape.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/src/edit/handler/Edit.Circle.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/src/edit/handler/Edit.Rectangle.js"></script>

<script src="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/src/draw/handler/Draw.Feature.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/src/draw/handler/Draw.Polyline.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/src/draw/handler/Draw.Polygon.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/src/draw/handler/Draw.SimpleShape.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/src/draw/handler/Draw.Rectangle.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/src/draw/handler/Draw.Circle.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/src/draw/handler/Draw.Marker.js"></script>

<script src="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/src/ext/LatLngUtil.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/src/ext/LineUtil.Intersect.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/src/ext/Polygon.Intersect.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/src/ext/Polyline.Intersect.js"></script>

<script src="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/src/Control.Draw.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/src/Tooltip.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/src/Toolbar.js"></script>

<script src="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/src/draw/DrawToolbar.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/src/edit/EditToolbar.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/src/edit/handler/EditToolbar.Edit.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/Leaflet.draw/src/edit/handler/EditToolbar.Delete.js"></script>

<script src="/control/resources/mapping-tools/leaflet/plugins/proto/proto.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/leaflet-fullscreen/Control.FullScreen.js"></script>

<script src="http://maps.google.com/maps/api/js?v=3.2&sensor=false"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/tiles/Google.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/tiles/Bing.js"></script>

<script>
    $(function(){
        geozones.init();
    })
</script>
