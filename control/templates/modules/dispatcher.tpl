{if $core->devices->devices_present}
    <ul class="dispatcher-fleets-menu" id="fleets">

    </ul>

    <div class="clear"></div>

    <div class="dispatcher"></div>
{else}
    <div class="alert alert-block">
        <h4 class="alert-heading">Внимание!</h4>
        У вас нет активных устройств для отслеживания, необходимо <a href="/control/user/fleet/add">добавить</a> или активировать устройство.
    </div>
{/if}