{if $core->devices->devices_present}
    <div class="h-panel" id="fleets"></div>

    <div class="dispatcher"></div>
{else}
    <div class="alert alert-block">
        <h4 class="alert-heading">Внимание!</h4>
        У вас нет активных устройств для отслеживания, необходимо <a href="/control/user/fleet/add">добавить</a> или активировать устройство.
    </div>
{/if}