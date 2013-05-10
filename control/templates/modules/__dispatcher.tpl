<div class="page-header">
    <h1>{$core->module.title}</h1>
</div>

{if $core->devices->devices_present}

{$fleets = $core->devices->getFleetsList()}
{if $fleets}
<ul class="nav nav-tabs" id="fleets">
    <li {if !isset($smarty.get.fleet)}class="active"{/if}><a href="/control/dispatcher/">Все</a></li>
    {foreach $fleets as $fleet}
    <li {if isset($smarty.get.fleet) && $smarty.get.fleet == $fleet.id}class="active"{/if}><a href="/control/dispatcher/?fleet={$fleet.id}">{$fleet.name}</a></li>
    {/foreach}
</ul>
{/if}

<div class="dispatcher_devices">
    {foreach $core->devices->getUserDevices() as $item}
        <div class="item span4" id="item_{$item.id}" data-id="{$item.id}">
            <div class="item_head">
                <h2><span class="car_name">{$item.name} <span class="thin">{$item.make} {$item.model}</span></span> <span class="g_id">{$item.g_id}</span></h2>
                <!--div class="address_item" data-id="{$item.id}" data-lng="{$item.last_registered_point.lng}" data-lat="{$item.last_registered_point.lat}">&nbsp;</div-->
            </div>

            <table class="params_top">
                <tbody>
                    <tr>
                        <td width="33%"><div class="params_inline_item velocity" data-velocity="{$item.last_registered_point.velocity}"></div></td>
                        <td width="67%"><div class="params_inline_item heading" data-heading="{$item.last_registered_point.bb}"></div></td>
                    </tr>
                </tbody>
            </table>

            <div class="map" id="map_{$item.id}" data-device_id="{$item.id}" data-heading="{$item.last_registered_point.bb}" data-lng="{$item.last_registered_point.lng}" data-lat="{$item.last_registered_point.lat}"></div>

            <table class="addition_params">
                <tbody>
                    <tr>
                        <th>Статус</th>
                        <th>Зажигание</th>
                        <th>Аккумулятор</th>
                    </tr>
                    <tr>
                        <td class="device_trip_status">
                            {if $item.last_registered_point.velocity > 0}
                                <span class="positive">Движется</span>
                            {else}
                                <span class="negative">Остановка</span>
                            {/if}
                        </td>
                        <td class="device_ignition_status">
                            <span class="positive">Включено</span>
                        </td>
                        <td class="device_fuel_status">
                            <div class="progress progress-warning" title="41%">
                                <div class="bar" style="width: 41%"></div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>Аккумулятор</th>
                        <th>Сигнал GPS</th>
                        <th>Сигнал GSM</th>
                    </tr>
                    <tr>
                        <td class="device_battery_status">
                            <span {if $item.battery <= 0}class="negative"{/if}>{$item.battery|voltage} В</span>
                        </td>
                        <td class="device_csq_indicator" data-csq="{$item.last_registered_point.csq}"></td>
                        <td class="device_hdop_indicator" data-hdop="{$item.last_registered_point.hdop}"></td>
                    </tr>
                </tbody>
            </table>
        </div>

    {/foreach}
    <div class="clear"></div>
</div>

{*

<ul class="thumbnails dispatcher_devices">
    {foreach $core->devices->getUserDevices() as $item}
    <li class="span4 item">
        <div class="thumbnail">
            <div class="caption">
                <h5>{$item.name} &mdash; {$item.make} {$item.model} <span class="g_id">{$item.g_id}</span></h5>

                <p class="address_item" data-id="{$item.id}" data-lng="{$item.last_registered_point.lng}" data-lat="{$item.last_registered_point.lat}">&nbsp;</p>

                <table class="table table-condensed">
                    <tbody>
                        <tr>
                            <th>Скорость</th>
                            <td><div class="velocity" data-velocity="{$item.last_registered_point.velocity}"></div></td>
                        </tr>
                        <tr>
                            <th>Направление</th>
                            <td><div class="heading" data-heading="{$item.last_registered_point.bb}"></div></td>
                        </tr>
                        <tr>
                            <th>Уровень сигнала</th>
                            <td><div class="parameters" data-csq="{$item.last_registered_point.csq}" data-hdop="{$item.last_registered_point.hdop}"></div></td>
                        </tr>
                        <tr>
                            <th>Состояние</th>
                            <td>{$core->devices->getDeviceSatus($item)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </li>
    {/foreach}
</ul>

*}

<script>core.dispatcher.init();</script>
{else}
    <div class="alert alert-block">
        <h4 class="alert-heading">Внимание!</h4>
        У вас нет активных устройств для отслеживания, необходимо <a href="/control/fleet/add">добавить</a> или активировать устройство в разделе <a href="/control/fleet">автопарк</a>.
    </div>
{/if}