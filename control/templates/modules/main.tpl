<div class="row sections">
    <div class="seventh item" data-step='1' data-intro='Раздел &laquo;Наблюдение&raquo; представляет из себя карту, на которой отображены все ваши машины, с возможностью просматривать их местонахождение в реальном времени, просматривать трек по выбранной дате, а так же текущие параметры, такие, как скорость, пройденный путь, состояние, уровень топлива и т. д.'>
        <a href="/control/map-old/" class="inner">
            <i class="icon-64 map"></i>
            Наблюдение
        </a>
    </div>

    <div class="seventh item"  data-step='2' data-intro='Раздел &laquo;Диспетчер&raquo; позволяет оперативно отслеживать состояние всего автопарка или выбранной группы машин, в удобном виде.'>
        <a href="/control/dispatcher/" class="inner">
            <i class="icon-64 browser"></i>
            Диспетчер
        </a>
    </div>

    <div class="seventh item" data-step='3' data-intro='Раздел &laquo;Статистика&raquo; является центром получения всех необходимых статистических данных по каждой машине в виде таблиц и графиков, с возможностью экспорта данных в MS Excel, CSV, XML или JSON-формат.'>
        <a href="/control/statistics/" class="inner">
            <i class="icon-64 statistics"></i>
            Статистика
        </a>
    </div>

    <div class="seventh item" data-step='4' data-intro='Раздел &laquo;События&raquo; &mdash; это встроенная в Картрек система уведомлений, позволяющая получать сообщения по всем происходящим событиям, таким, как: взаимодействие машин с геозонами (вхождение-выхождение), онлайн-офлайн статусы машин, системные события и т. д. Вы так же можете настроить отправку уведомлений по СМС или электронной почте.'>
        <a href="/control/events/" class="inner">
            <i id="icon-events-main" class="icon-64 {if $core->auth->user.data.new_events_count <= 0}events-unactive{else}events-active{/if}"></i>
            События
            <span class="count" {if $core->auth->user.data.new_events_count <= 0}style="display: none"{/if} id="icon-events-main-counter-bubble">{$core->auth->user.data.new_events_count}</span>
        </a>
    </div>

    <div class="seventh item" data-step='5' data-intro='В разделе &laquo;Автопарк&raquo; вы можете добавлять новые машины в свой парк, включать или отключать наблюдение за машинами, настраивать их параметры, присваивать им водителей и многое другое.'>
        <a href="/control/user/fleet/" class="inner">
            <i class="icon-64 truck"></i>
            Автопарк
        </a>
    </div>

    <div class="seventh item" data-step='6' data-intro='В разделе &laquo;Группы&raquo; можно объединять машины в отдельные группы, с целью отделения, скажем грузовых авто от пассажирских, наземных ТС от водных...'>
        <a href="/control/user/groups/" class="inner">
            <i class="icon-64 trucks"></i>
            Группы
        </a>
    </div>

    <div class="seventh item" data-step='7' data-intro='В Картреке есть возможность определять границы территорий, и ставить их &laquo;под наблюдение&raquo;, так называемые &laquo;<em>геозоны</em>&raquo;, при вхождении или выхождении машины из границ которых, будет регистрироваться событие и отправляться вам по СМС, электронной почте или просто, в интерфейсе Картрека.'>
        <a href="/control/user/geozones/" class="inner">
            <i class="icon-64 bullseye"></i>
            Геозоны
        </a>
    </div>
</div>

<hr style="margin: 20px 0 10px">

<div class="row sections">
    <div class="seventh item">
        <a href="/control/user/system/" class="inner">
            <i class="icon-64 spanner-screwdriver"></i>
            Настройка системы
        </a>
    </div>

    <div class="seventh item">
        <a href="/control/user/" class="inner">
            <i class="icon-64 dude"></i>
            Настройка аккаунта
        </a>
    </div>

    <div class="seventh item">
        <a href="/control/user/security/" class="inner">
            <i class="icon-64 key"></i>
            Настройка аторизации
        </a>
    </div>

    <div class="seventh item">
        <a href="/control/user/notifications/" class="inner">
            <i class="icon-64 chat"></i>
            Настройка уведомлений
        </a>
    </div>

    <div class="seventh item">
        <a href="/control/user/billing/" class="inner">
            <i class="icon-64 money"></i>
            Баланс и&nbsp;тарифы
        </a>
    </div>
</div>