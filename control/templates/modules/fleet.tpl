<div class="page-header">
    <h1>{$core->module.title}</h1>
</div>

<div class="row-fluid">
    <div class="span9">
        <table class="table table-striped table-bordered">
            <tr>
                <th width="59%">Название</th>
                <th width="10%">Госномер</th>
                <th width="10%">Стаутс</th>
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
    </div>

    <div class="span3">
        <div class="tabbable tabs-right">
            <ul class="nav nav-tabs">

            </ul>
            <div class="tab-content">

            </div>
        </div>
    </div>
</div>