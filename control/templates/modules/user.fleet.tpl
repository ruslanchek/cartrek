<div class="page-header">
    <h1 class="pull-left">{$core->module.title}</h1>

    <div class="header_tools pull-right">
        <div class="pull-right">
            <a href="/control/user/fleet/add" class="btn btn-success"><i class="icon-plus icon-white"></i> Добавить автомобиль</a>
        </div>

        <div class="clear"></div>
    </div>

    <div class="clear"></div>
</div>

<ul class="nav nav-tabs" id="fleets">
    <li><a href="/control/user/">Учетные данные</a></li>
    <li class="active"><a href="/control/user/fleet">Автопарк</a></li>
    <li><a href="/control/user/groups">Группы</a></li>
    <li><a href="/control/user/system">Система</a></li>
    <li><a href="/control/user/notifications">Уведомления</a></li>
    <li><a href="/control/user/tariff">Финансы и тарифы</a></li>
    <li><a href="/control/user/password_change">Изменить пароль</a></li>
</ul>

{if $core->devices->devices_present}
    <table class="table table-striped table-bordered fleet_table">
        <thead>
            <tr>
                <th width="74%">Название</th>
                <th width="20%">Группа</th>
                <th width="5%">Госномер</th>
                <th width="1%">Режим</th>
            </tr>
        </thead>
        <tbody>
            {foreach $core->devices->getUserDevices(true) as $item}
            <tr{if !$item.active} class="unactive_row"{/if}>
                <td><a href="/control/fleet/{$item.id}"><strong>{$item.name}</strong> {$item.make} {$item.model}</a></td>
                <td>{$item.fleet_name}</td>
                <td><span class="g_id">{$item.g_id}</span></td>
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
{else}
    <div class="alert alert-block">
        <h4 class="alert-heading">Внимание!</h4>
        У вас нет активных устройств для отслеживания, необходимо <a href="/control/fleet/add">добавить</a> или активировать устройство.
    </div>
{/if}