<div class="page-header">
    <h1>{$core->module.title}</h1>
</div>

<ul class="nav nav-tabs" id="fleets">
    <li><a href="/control/user/">Учетные данные</a></li>
    <li class="active"><a href="/control/user/groups">Группы</a></li>
    <li><a href="/control/user/system">Система</a></li>
    <li><a href="/control/user/notifications">Уведомления</a></li>
    <li><a href="/control/user/tariff">Финансы и тарифы</a></li>
    <li><a href="/control/user/password_change">Изменить пароль</a></li>
</ul>

<table class="table table-striped table-bordered fleet_table">
    <thead>
        <tr>
            <th width="1%">ID</th>
            <th width="70%">Название</th>
            <th width="28%">Машин</th>
            <th width="1%"></th>
        </tr>
    </thead>
    <tbody>
        {foreach $core->devices->getFleetsList() as $item}
        <tr>
            <td>{$item.id}</td>
            <td>{$item.name}</td>
            <td>{$item.name}</td>
            <td>
                <a href="?actiondelete&id={$item.id}" class="label label-important">Удалить</a>
            </td>
        </tr>
        {/foreach}
    </tbody>
</table>