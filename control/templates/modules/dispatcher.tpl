<div class="content-padding">
    <nav class="nav-controls">
        <div class="left">
            <a class="marked" href="#"><i class="f-icon icon-plus"></i> Создать</a>
            <a href="#"><i class="f-icon icon-plus"></i> Создать</a>
            <a href="#"><i class="f-icon icon-plus"></i> Создать</a>
        </div>

        <div class="right">
        </div>
    </nav>

    {if $core->devices->devices_present}
        <div class="h-panel" id="fleets"></div>

        <div class="dispatcher"></div>
    {else}
        <div class="alert alert-block">
            <h4 class="alert-heading">Внимание!</h4>
            У вас нет активных устройств для отслеживания, необходимо <a href="/control/user/fleet/add">добавить</a> или активировать устройство.
        </div>
    {/if}
</div>