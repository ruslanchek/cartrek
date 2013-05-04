<div class="map-full-sized-frame">
    <div class="h1">
        <div class="container-padding">
            <h1>{$core->module.title}<span id="current-fleet-and-car"></span></h1>
        </div>
    </div>

    <div class="map-container map-observer">
        <div id="map"></div>
    </div>

    <div class="map-side-panel">
         {* Map data triggers block *}
        <div class="side-panel">
            <div class="panel-content">
                <div id="togglers">
                    <label class="third" title="Автообновление данных">
                        <input type="checkbox" class="slickswitch" id="auto-renew" />
                        Авто
                    </label>

                    <label class="third">
                        <input type="checkbox" class="slickswitch" id="auto-focus" title="Автоматическое перемещение карты при обновлении данных" />
                        <a href="javascript:void(0)" id="focus" title="Показать текущее положение">Фокус</a>
                    </label>

                    <label class="third" title="Показывать пройденный путь">
                        <input type="checkbox" class="slickswitch" id="show-path" />
                        Путь
                    </label>

                    <div class="clear"></div>
                </div>
            </div>
        </div>

        {* Fleet and car selection block *}
        <div class="side-panel">
            <div class="panel-content">
                <div id="fleets-menu"></div>
                <div class="clear"></div>
                <div id="cars-menu"></div>
            </div>
        </div>
    </div>
</div>

<link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/dist/leaflet.css" />
<link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/plugins/leaflet-locatecontrol-gh-pages/src/L.Control.Locate.css" />

<!--[if lte IE 8]>
<link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/dist/leaflet.ie.css" />
<link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/plugins/leaflet-locatecontrol-gh-pages/src/L.Control.Locate.ie.css" />
<![endif]-->

<script src="/control/resources/mapping-tools/leaflet/dist/leaflet.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/leaflet-locatecontrol-gh-pages/src/L.Control.Locate.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/proto/proto.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/leaflet-fullscreen/Control.FullScreen.js"></script>

<script src="http://maps.google.com/maps/api/js?v=3.2&sensor=false"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/tiles/Google.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/tiles/Bing.js"></script>

<script>
    $(function(){
        MC.init();
    });
</script>