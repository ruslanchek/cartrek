<div class="page-header">
    <h2 class="text-centered">Добро пожаловать, {$core->auth->user.data.name}</h2>
</div>

<div class="row sections">
    <div class="fifth item">
        <a href="/control/map/" class="inner">
            <i class="icon watch"></i>
            Наблюдение
        </a>
    </div>

    <div class="fifth item">
        <a href="/control/dispatcher/" class="inner">
            <i class="icon dispatcher"></i>
            Диспетчер
        </a>
    </div>

    <div class="fifth item">
        <a href="/control/events/" class="inner">
            <i id="icon-events-main" class="icon {if $core->auth->user.data.new_events_count <= 0}events-unactive{else}events-active{/if}"></i>
            События
            <span class="count" {if $core->auth->user.data.new_events_count <= 0}style="display: none"{/if} id="icon-events-main-counter-bubble">{$core->auth->user.data.new_events_count}</span>
        </a>
    </div>

    <div class="fifth item">
        <a href="/control/user/geozones/" class="inner">
            <i class="icon geozones"></i>
            Геозоны
        </a>
    </div>

    <div class="fifth item">
        <a href="/control/user/" class="inner">
            <i class="icon config"></i>
            Настройка
        </a>
    </div>
</div>