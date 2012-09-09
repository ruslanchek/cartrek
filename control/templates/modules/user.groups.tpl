<div class="page-header">
    <h1 class="pull-left">{$core->module.title}</h1>

    <div class="pull-right">
        <a href="#" class="btn btn-success add_fleet"><i class="icon-plus icon-white"></i> Добавить группу</a>
    </div>

    <div class="clear"></div>
</div>

{include file="modules/user.menu.tpl"}

{$fleets = $core->devices->getFleetsList()}

{if $fleets}
<table class="table table-striped table-bordered fleet_table">
    <thead>
        <tr>
            <th width="98%">Название</th>
            <th width="1%">Машин</th>
            <th width="1%"></th>
        </tr>
    </thead>
    <tbody>
        {foreach $fleets as $item}
        <tr>
            <td>{$item.name}</td>
            <td>{$item.cars}</td>
            <td>
                <a href="#" class="delete_group label label-important" data-id="{$item.id}" data-name="{$item.name|escape}">Удалить</a>
            </td>
        </tr>
        {/foreach}
    </tbody>
</table>
{else}
<div class="alert alert-block">
    У вас нет групп, но вы можете их <a href="#" class="add_fleet">создать</a>.
</div>
{/if}