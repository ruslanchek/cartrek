<div class="row sections">
    <div class="seventh item">
        <a href="/control/map/" class="inner">
            <i class="icon map"></i>
            Наблюдение
        </a>
    </div>

    <div class="seventh item">
        <a href="/control/dispatcher/" class="inner">
            <i class="icon browser"></i>
            Диспетчер
        </a>
    </div>

    <div class="seventh item">
        <a href="/control/statistics/" class="inner">
            <i class="icon statistics"></i>
            Статистика
        </a>
    </div>

    <div class="seventh item">
        <a href="/control/events/" class="inner">
            <i id="icon-events-main" class="icon {if $core->auth->user.data.new_events_count <= 0}events-unactive{else}events-active{/if}"></i>
            События
            <span class="count" {if $core->auth->user.data.new_events_count <= 0}style="display: none"{/if} id="icon-events-main-counter-bubble">{$core->auth->user.data.new_events_count}</span>
        </a>
    </div>

    <div class="seventh item">
        <a href="/control/user/fleet/" class="inner">
            <i class="icon truck"></i>
            Автопарк
        </a>
    </div>

    <div class="seventh item">
        <a href="/control/user/groups/" class="inner">
            <i class="icon trucks"></i>
            Группы
        </a>
    </div>

    <div class="seventh item">
        <a href="/control/user/geozones/" class="inner">
            <i class="icon bullseye"></i>
            Геозоны
        </a>
    </div>
</div>
<hr>
<div class="row sections">
    <div class="seventh item">
        <a href="/control/user/system/" class="inner">
            <i class="icon spanner-screwdriver"></i>
            Настройка системы
        </a>
    </div>

    <div class="seventh item">
        <a href="/control/user/" class="inner">
            <i class="icon dude"></i>
            Настройка аккаунта
        </a>
    </div>

    <div class="seventh item">
        <a href="/control/user/security/" class="inner">
            <i class="icon key"></i>
            Настройка аторизации
        </a>
    </div>

    <div class="seventh item">
        <a href="/control/user/notifications/" class="inner">
            <i class="icon chat"></i>
            Настройка уведомлений
        </a>
    </div>

    <div class="seventh item">
        <a href="/control/user/billing/" class="inner">
            <i class="icon money"></i>
            Баланс и&nbsp;тарифы
        </a>
    </div>
</div>