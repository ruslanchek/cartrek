{*<div class="h-panel" style="margin: 0; width: auto">
    <div class="row container">
        <div class="half" data-step='1' data-intro='Автоматы'>
            <div id="togglers">
                <label title="Автообновление данных">
                    <input type="checkbox" class="slickswitch" id="auto-renew" />
                    Авто
                </label>

                <label>
                    <input type="checkbox" class="slickswitch" id="auto-focus" title="Автоматическое перемещение карты при обновлении данных" />
                    <a href="javascript:void(0)" id="focus-toggler" title="Показать текущее положение">Фокус</a>
                </label>

                <label title="Показывать пройденный путь">
                    <input type="checkbox" class="slickswitch" id="show-path" />
                    <a href="javascript:void(0)" id="path-toggler" title="Показать текущий путь">Путь</a>
                </label>

                <div class="clear"></div>
            </div>
        </div>

        <div class="half">
            <div class="row">
                <div class="third">
                    <input type="text" id="datepicker" />
                </div>
                <div class="third">
                    <div id="fleets-menu"></div>
                </div>
                <div class="third">
                    <div id="cars-menu"></div>
                </div>
            </div>
        </div>
    </div>
</div>*}

<span id="current-fleet-and-car"></span>

<div class="map-container map-observer" data-step='2' data-intro='Карта'>
    <div class="map-tools-top-right slide-animation init">
        <div id="cars-menu"></div>

        <i class="arrow-separator"></i>
        <div id="fleets-menu"></div>

        <i class="arrow-separator"></i>

        <div id="date-menu">
            <i class="icon calendar" title="Открыть календарь"></i>
            <div id="current-date"></div>

            <div class="datepicker">
                <i class="dp-top-arrow"></i>
                <div class="datepicker-content">
                    <div class="widget"></div>

                    <div class="clear"></div>

                    <div class="datepicker-actions" style="display: none">
                        {*<a id="trigger-datepicker" class="close" href="#" title="Закрыть календарь">Закрыть</a>*}
                        <a id="trigger-today" class="btn" href="#" title="Перейти к сегодняшней дате и времени">Отключить машину времени</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="map-tools-info-block">
            <div id="togglers">
                <label style="width: 40px;" title="Автообновление данных">
                    <input type="checkbox" class="slickswitch" id="auto-renew" />
                    Авто
                </label>

                <label style="width: 49px;">
                    <input type="checkbox" class="slickswitch" id="auto-focus" title="Автоматическое перемещение карты при обновлении данных" />
                    <a href="javascript:void(0)" id="focus-toggler" title="Показать текущее положение">Фокус</a>
                </label>

                <label style="width: 40px;" title="Показывать пройденный путь">
                    <input type="checkbox" class="slickswitch" id="show-path" />
                    <a href="javascript:void(0)" id="path-toggler" title="Показать текущий путь">Путь</a>
                </label>

                <div class="clear"></div>
            </div>

            <div class="block-separator"></div>

            <div class="scroll-block">
                <div id="current-info"></div>
            </div>
        </div>
    </div>

    <div id="map"></div>

    <div id="player">
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
</div>

{*<div class="map-side-panel">
    <div class="side-panel">
        <div class="panel-content" data-step='1' data-intro='xxx'>

        </div>
    </div>
</div>*}