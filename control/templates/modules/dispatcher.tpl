<div class="page-header">
    <h1 class="pull-left">{$core->module.title}</h1>

    <div class="header_tools pull-right">
        <div class="pull-right">
        </div>

        <div class="clear"></div>
    </div>

    <div class="clear"></div>
</div>


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


<script>core.dispatcher.init();</script>