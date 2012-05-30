<div class="page-header">
    <h1 class="pull-left">{$core->module.title}</h1>

    <div class="header_tools pull-right">
        <div class="pull-right">
            <a href="/control/fleet/add" class="btn btn-success"><i class="icon-plus icon-white"></i> Добавить автомобиль</a>
        </div>

        <div class="clear"></div>
    </div>

    <div class="clear"></div>
</div>

<table class="table table-striped table-bordered fleet_table">
    <thead>
        <tr>
            <th width="25%">Название</th>
            <th width="5%">Госномер</th>
            <th width="30%">Местонахождение</th>
            <th width="10%">Направление</th>
            <th width="10%">Скорость</th>
            <th width="15%">Уровень сигнала</th>
            <th width="1%">Статус</th>
            <th width="1%">Режим</th>
        </tr>
    </thead>
    <tbody>
        {foreach $core->devices->getUserDevices(true) as $item}
        <tr{if !$item.active} class="unactive_row"{/if}>
            <td><a href="/control/fleet/{$item.id}"><strong>{$item.name}</strong> &mdash; {$item.make} {$item.model}</a></td>
            <td><span class="g_id">{$item.g_id}</span></td>
            <td><div class="address_item" data-lng="{$item.last_registered_point.lng}" data-lat="{$item.last_registered_point.lat}"></div></td>
            <td><div class="heading" data-heading="{$item.last_registered_point.bb}"></div></td>
            <td><div class="velocity" data-velocity="{$item.last_registered_point.velocity}"></div></td>
            <td><div class="parameters" data-csq="{$item.last_registered_point.csq}" data-hdop="{$item.last_registered_point.hdop}"></div></td>
            <td>{$core->devices->getDeviceSatus($item)}</td>
            <td>
                {if $item.active}
                    <a href="#" class="label label-success">Вкл</a>
                {else}
                    <a href="#" class="label label-important">Выкл</a>
                {/if}
            </td>
        </tr>
        {/foreach}
    </tbody>
</table>

<script>core.fleet.init();</script>