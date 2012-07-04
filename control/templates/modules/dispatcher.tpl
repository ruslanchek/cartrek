<div class="page-header">
    <h1 class="pull-left">{$core->module.title}</h1>

    <div class="header_tools pull-right">
        <div class="pull-right">
        </div>

        <div class="clear"></div>
    </div>

    <div class="clear"></div>
</div>

<div class="dispatcher_devices">
    {foreach $core->devices->getUserDevices() as $item}
        <div class="item" id="item_{$item.id}">
            <div class="item_head">
                <h2><span class="car_name">{$item.name} <span class="thin">{$item.make} {$item.model}</span></span> <span class="g_id">{$item.g_id}</span></h2>
                <div class="address_item" data-id="{$item.id}" data-lng="{$item.last_registered_point.lng}" data-lat="{$item.last_registered_point.lat}">&nbsp;</div>
            </div>

            <div class="map" id="map_{$item.id}" data-device_id="{$item.id}" data-heading="{$item.last_registered_point.bb}" data-lng="{$item.last_registered_point.lng}" data-lat="{$item.last_registered_point.lat}"></div>

            <div class="params_inline">
                <div class="params_inline_item velocity" style="width: 25%" data-velocity="{$item.last_registered_point.velocity}"></div>
                <div class="params_inline_item heading" style="width: 35%" data-heading="{$item.last_registered_point.bb}"></div>
                <div class="params_inline_item parameters" style="width: 34%; float: right !important; margin-right: 0" data-csq="{$item.last_registered_point.csq}" data-hdop="{$item.last_registered_point.hdop}"></div>
                <div class="clear"></div>
            </div>

            <table class="addition_params">
                <tbody>
                    <tr>
                        <th>Статус</th>
                        <td>
                            {$core->devices->getDeviceSatus($item)}
                        </td>
                    </tr>
                    <tr>
                        <th>Бензин</th>
                        <td>
                            <div class="progress progress-warning">
                                <div class="bar " style="width: 41%"></div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>Аккумулятор</th>
                        <td>
                            11,8 в
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