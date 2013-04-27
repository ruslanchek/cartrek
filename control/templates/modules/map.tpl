<div class="map-full-sized-frame">
    <div class="h1">
        <div class="container-padding">
            <h1>{$core->module.title}<span id="current-fleet-and-car"></span></h1>
        </div>
    </div>

    <div class="map-container map-observer">
        <div id="map"></div>
    </div>

    <div id="player" style="display: none">
        <div class="player-control-row row">
            <div class="quarter">
                <div class="player-controls-block">
                    <div class="btn-group">
                        <a title="Следующая точка" class="btn" id="player-rev" href="javascript:void(0)">&#9664;&#9664;</a>
                        <a title="Запуск проигрывателя" class="btn" id="player-play-pause" href="javascript:void(0)">&#9654;</a>
                        <a title="Следующая точка" class="btn" id="player-ff" href="javascript:void(0)">&#9654;&#9654;</a>
                    </div>

                    <a title="Сброс" class="btn reset-button-text" id="player-reset" href="javascript:void(0)">?</a>
                </div>
            </div>

            <div class="half">
                <div class="time-display">
                    <div class="info-block info-block-left">
                        <span class="ib-header">Текущее время</span>
                        <span class="ib-content">
                            <span id="player-current-time">00:00:00</span>
                        </span>
                    </div>

                    <div class="info-block info-block-right">
                        <span class="ib-header">Ускорение времени</span>
                        <span class="ib-content">
                            <span id="player-time-factor">x1</span>
                        </span>
                    </div>

                    <div class="info-block ib-status">
                          <span class="ib-content">
                            <span id="player-status">&#9646;&#9646;</span>
                        </span>
                    </div>

                    <div class="clear"></div>

                    <div id="day-time-slider">
                        <div class="slider">
                            <div class="slider-instance"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="quarter">
                <div class="player-time-factor-block">
                    <div class="btn-group">
                        <a title="Уменьшить фактор ускорения времени" class="btn" id="player-time-factor-down" href="javascript:void(0)">&minus;</a>
                        <a title="Увеличить фактор ускорения времени" class="btn" id="player-time-factor-up" href="javascript:void(0)">&plus;</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="player-timeline">
            <div id="player-timeline-slider"></div>
        </div>
    </div>

    <div class="map-bottom-panel">
        {* Map data triggers block *}
        <div class="bottom-panel">
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
        <div class="bottom-panel">
            <div class="panel-content">
                <div id="fleets-menu"></div>
                <div class="clear"></div>
                <div id="cars-menu"></div>
            </div>
        </div>

        {* Time machine block *}
        <div class="bottom-panel">
            <div class="panel-content time-machine">
                <div class="row">
                    <div class="twothird">
                        <h3>Машина времени</h3>
                    </div>

                    <div class="third">
                        <input type="checkbox" class="slickswitch" id="timemachine-button" />
                    </div>
                </div>

                {*<h3>Машина времени</h3>
                <a class="time-machine-button" id="timemachine-button" href="#"><i></i>Машина времени</a>*}

                <div id="time-machine">
                    <div class="days"></div>
                </div>
            </div>
        </div>

        {* Other data panel blocks *}
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

<link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/dist/leaflet.css" />
<!--[if lte IE 8]>
<link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/dist/leaflet.ie.css" />
<![endif]-->

<script src="/control/resources/mapping-tools/leaflet/dist/leaflet-src.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/proto/proto.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/leaflet-fullscreen/Control.FullScreen.js"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/html-icon/Html.icon.js"></script>

<script src="http://maps.google.com/maps/api/js?v=3.2&sensor=false"></script>
<script src="/control/resources/mapping-tools/leaflet/plugins/tiles/Google.js"></script>

<script>
    $(function(){
        map.init();
    });
</script>