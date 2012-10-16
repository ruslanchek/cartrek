<div class="quarter">
    {include file="modules/user.menu.tpl"}
</div>

<div class="threequarter">
    <a href="#" class="btn btn-success add_fleet"><i class="icon-plus icon-white"></i> Добавить группу</a>

    {$fleets = $core->devices->getFleetsList()}

    {if $fleets}
    <table class="width-100 bordered hovered">
        <thead class="thead-gray">
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
                <td class="text-centered">{$item.cars}</td>
                <td>
                    <a href="#" class="red" data-id="{$item.id}" data-name="{$item.name|escape}">Удалить</a>
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
</div>