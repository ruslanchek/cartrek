<div class="page-header">
    <h1>{$core->module.title}</h1>
</div>

<ul class="nav nav-tabs">
    <li class="active"><a href="#">Все</a></li>
    <li><a href="#">Легковые</a></li>
    <li><a href="#">Грузовые</a></li>
    <li><a href="#">Курьерские</a></li>
    <li><a href="#">Прокатные</a></li>
    <li><a href="#">Служебные</a></li>
    <li><a href="#">Личные</a></li>
</ul>

<div class="dispatcher_devices">
    {foreach $core->devices->getUserDevices() as $item}
        <div class="item span4" id="item_{$item.id}">

            <div class="item_head">
                <h2><span class="car_name">{$item.name} <span class="thin">{$item.make} {$item.model}</span></span> <span class="g_id">{$item.g_id}</span></h2>
                <!--div class="address_item" data-id="{$item.id}" data-lng="{$item.last_registered_point.lng}" data-lat="{$item.last_registered_point.lat}">&nbsp;</div-->
            </div>

            <div class="params_inline">
                <div class="params_inline_item velocity"    style="width: 25%" data-velocity="{$item.last_registered_point.velocity}"></div>
                <div class="params_inline_item heading"     style="width: 35%" data-heading="{$item.last_registered_point.bb}"></div>
                <div class="params_inline_item parameters"  style="width: 34%; float: right !important; margin-right: 0" data-csq="{$item.last_registered_point.csq}" data-hdop="{$item.last_registered_point.hdop}"></div>
                <div class="clear"></div>
            </div>

            <div class="map" id="map_{$item.id}" data-device_id="{$item.id}" data-heading="{$item.last_registered_point.bb}" data-lng="{$item.last_registered_point.lng}" data-lat="{$item.last_registered_point.lat}"></div>

            <table class="addition_params">
                <tbody>
                    <tr>
                        <th>Статус</th>
                        <th>Зажигание</th>
                        <th>Бензин</th>
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
                        <th>tC, снаружи</th>
                        <th>tC, салон</th>
                    </tr>
                    <tr >
                        <td class="device_battery_status">
                            {$item.battery|voltage} в
                        </td>
                        <td class="device_outside_temp_status">
                            25&deg;
                        </td>
                        <td class="device_inside_temp_status">
                            27&deg;
                        </td>
                    </tr>
                    <tr>
                        <th>Пассажиры</th>
                        <th>Груз</th>
                        <th></th>
                    </tr>
                    <tr >
                        <td class="device_passengers_status">
                            4
                        </td>
                        <td class="device_load_status">
                            265 кг
                        </td>
                        <td>

                        </td>
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