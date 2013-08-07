{$fleets = $core->devices->getFleetsList()}

{if $fleets}
    <table class="table table-bordered" id="groups-table">
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
                    <strong><a rel="{$item.id}" class="group-edit" href="#" data-id="{$item.id}"
                       data-name="{$item.name|escape}">{$item.name}</a></strong>
                </td>
                <td>{$item.cars}</td>
                <td>
                    <a href="javascript:void(0)" title="Удалить" class="btn-delete group-delete" data-count="{$item.cars}" data-id="{$item.id}" data-name="{$item.name|escape}">
                        <span class="fui-cross"></span>
                    </a>
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