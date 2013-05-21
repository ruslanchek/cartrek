{if $core->devices->devices_present}

{$fleets = $core->devices->getFleetsList()}
    {if $fleets && count($fleets) > 1}
    <ul class="dispatcher-fleets-menu" id="fleets">
        <li {if !isset($smarty.get.fleet)}class="active"{/if}><a href="/control/dispatcher/">Все</a></li>
        {foreach $fleets as $fleet}
        <li {if isset($smarty.get.fleet) && $smarty.get.fleet == $fleet.id}class="active"{/if}><a href="/control/dispatcher/?fleet={$fleet.id}">{$fleet.name}</a></li>
        {/foreach}
        <li class="clear"></li>
    </ul>
    {/if}

    <div class="dispatcher"></div>
{else}
    <div class="alert alert-block">
        <h4 class="alert-heading">Внимание!</h4>
        У вас нет активных устройств для отслеживания, необходимо <a href="/control/user/fleet/add">добавить</a> или активировать устройство.
    </div>
{/if}