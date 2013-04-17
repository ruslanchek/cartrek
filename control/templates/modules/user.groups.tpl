<div class="threequarter">
    {$fleets = $core->devices->getFleetsList()}

    {if $fleets}
        <div class="table-wrapper">
            <table class="width-100 hovered" id="groups-table">
                <thead class="thead-gray">
                <tr>
                    <th width="98%">Название</th>
                    <th width="1%">Машин</th>
                    <th width="1%"></th>
                </tr>
                </thead>

                <tbody>
                {foreach $fleets as $item}
                    <tr class="group-row" rel="{$item.id}">
                        <td>
                            <a rel="{$item.id}" class="group-edit" href="#" data-id="{$item.id}"
                               data-name="{$item.name|escape}">{$item.name}</a>
                        </td>
                        <td>{$item.cars}</td>
                        <td>
                            <a href="javascript:void(0)" class="btn red delete-btn group-delete"
                               data-count="{$item.cars}" data-id="{$item.id}"
                               data-name="{$item.name|escape}">Удалить</a>
                        </td>
                    </tr>
                {/foreach}
                </tbody>
            </table>
        </div>
    {else}
        <div class="alert alert-block">
            У вас нет групп, но вы можете их <a href="#" class="add_fleet">создать</a>.
        </div>
    {/if}
</div>

<div class="quarter">
    {include file="modules/user.menu.tpl"}
</div>