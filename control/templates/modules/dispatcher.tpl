<div class="dispatcher">
    {foreach $core->devices->getUserDevices() as $item}
        <div class="brick">
            <div class="item" id="item_{$item.id}" data-id="{$item.id}">
                <div class="head">
                    <h2>{$item.name}</h2>
                    <div class="make_model">{if $item.make && $item.model}{$item.make} {$item.model}{else}&nbsp;{/if}</div>
                    <span class="g_id small">{$item.g_id}</span>
                </div>

                <div class="map" id="car-map-{$item.id}">

                </div>
            </div>
        </div>
    {/foreach}
    </div>
</div>