<div class="top-panel">
    <div class="container">
        <ul class="top-menu">
            <li>{if $core->module.name == 'map'}<b>Наблюдение</b>{else}<a href="/control/map">Наблюдение</a>{/if}</li>
            <li>{if $core->module.name == 'dispatcher'}<b>Диспетчер</b>{else}<a href="/control/dispatcher">Диспетчер</a>{/if}</li>

            <li>
                {if $core->module.name == 'events'}<b class="events-link"><span>События</span>{else}<a class="events-link" href="/control/events"><span>События</span>{/if}<sup id="global_events_counter" {if $core->auth->user.data.new_events_count <= 0}style="display: none"{/if}>{$core->auth->user.data.new_events_count}</sup>

                {if $core->module.name == 'events'}
                    </b>
                {else}
                    </a>
                {/if}
            </li>
        </ul>

        {if $core->module.name == 'main'}
            <span title="Картрек" class="logo">Картрек</span>
        {else}
            <a title="Картрек" class="logo" href="/control">Картрек</a>
        {/if}

        <span class="loading-ball" title="Загрузка данных"></span>

        <div class="top-user-menu">
            <a class="menu-exit" href="javascript:void(0)" onclick="core.exitUser()" title="Выход"></a>
            <a class="menu-button" href="/control/user" title="Настройка"><i class="r"></i><i class="icon icon-gear"></i> Настройка</a>

            <div class="user-info"><a href="/control/user/billing" class="balance" title="Состояние счета: 829.07 руб. - хватит еще на 24 дня">{$core->auth->user.data.balance|price} руб.</a></div>
        </div>
    </div>

    <div class="global-loading-bar"></div>
</div>

{*<i id="loading_indicator"><i></i></i>*}