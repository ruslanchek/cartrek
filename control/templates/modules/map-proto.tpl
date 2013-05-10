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
                        <a href="javascript:void(0)" id="focus-toggler" title="Показать текущее положение">Фокус</a>
                    </label>

                    <label class="third" title="Показывать пройденный путь">
                        <input type="checkbox" class="slickswitch" id="show-path" />
                        <a href="javascript:void(0)" id="path-toggler" title="Показать текущий путь">Путь</a>
                    </label>

                    <div class="clear"></div>
                </div>
            </div>
        </div>

        {* Fleet and car selection block *}
        <div class="side-panel">
            <div class="panel-content" id="fleets-and-cars-menu-block">
                <div id="fleets-menu"></div>
                <div class="clear"></div>
                <div id="cars-menu"></div>
            </div>
        </div>
    </div>
</div>