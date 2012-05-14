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

<table class="table table-striped table-bordered">
    <tr>
        <th width="59%">Название</th>
        <th width="10%">Госномер</th>
        <th width="1%">Стаутс</th>
        <th width="1%">ID</th>
    </tr>
    {foreach $core->devices->getUserDevices() as $item}
    <tr>
        <td><strong>{$item.name}</strong> &mdash; {$item.make} {$item.model}</td>
        <td><span class="g_id">{$item.g_id}</span></td>
        <td>{$core->devices->getSatusFromPoint($item.last_registered_point)}</td>
        <td>{$item.last_registered_point.dev}</td>
    </tr>
    {/foreach}
</table>