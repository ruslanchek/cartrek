{*<div class="map-instruments">
    <div class="map-top-panel">
        <div class="half push-right">
            <button id="auto-renew" class="btn" title="Автообновление"></button>

            <button id="show-path" class="btn" title="Показать путь"></button>

            <div class="btn-parts push-right" id="focus-block">
                <button id="auto-focus" class="btn btn-part-left" title="Автоматическое перемещение карты при обновлении данных"></button>
                <button id="focus" class="btn btn-part-right" title="Показать текущее положение">Фокус</button>
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
</div>*}

<div class="row">
    <div class="threequarter">
        <div class="map-container">
            <div class="shadow-top"></div>
            <div class="shadow-bottom"></div>
            <div id="map"></div>
        </div>
    </div>
    <div class="quarter">
        <div class="map-bottom-panel">
            <div class="bottom-panel">
                <div class="panel-content">
                    <div id="togglers">
                        <label class="third" title="Автообновление данных">
                            <input type="checkbox" class="slickswitch" id="auto-renew" />
                            Авто
                        </label>

                        <label class="third">
                            <input type="checkbox" class="slickswitch" id="auto-focus" title="Автоматическое перемещение карты при обновлении данных" />
                            <a href="javascript:void(0)" id="focus" class="black-link" title="Показать текущее положение">Фокус</a>
                        </label>

                        <label class="third" title="Показывать пройденный путь">
                            <input type="checkbox" class="slickswitch" id="show-path" />
                            Путь
                        </label>

                        <div class="clear"></div>
                    </div>
                </div>
            </div>

            <div class="bottom-panel">
                <div class="panel-content">
                    <div id="fleets-menu"></div>
                    <div class="clear"></div>
                    <div id="cars-menu"></div>
                </div>
            </div>

            <div class="bottom-panel" id="bottom-panel-1">
                <div class="panel-content"></div>
            </div>

            <div class="bottom-panel" id="bottom-panel-2">
                <div class="panel-content"></div>
            </div>

            <div class="bottom-panel" id="bottom-panel-3">
                <div class="panel-content"></div>
            </div>

            <div class="bottom-panel" id="bottom-panel-4">
                <div class="panel-content"></div>
            </div>
        </div>
    </div>
</div>

<link rel="stylesheet" href="/control/resources/plugins/slickswitch/css/slickswitch.css" type="text/css" />
<script src="/control/resources/plugins/slickswitch/js/jquery.slickswitch.js" type="text/javascript"></script>

<link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/dist/leaflet.css" />
<!--[if lte IE 8]>
<link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/dist/leaflet.ie.css" />
<![endif]-->

<script src="http://maps.google.com/maps/api/js?v=3.2&sensor=false"></script>
<script src="/control/resources/mapping-tools/leaflet/dist/leaflet-src.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/proto/proto.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/leaflet-fullscreen/Control.FullScreen.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/html-icon/Html.icon.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/tiles/google-maps-layer.js"></script>

<script>map.init();</script>