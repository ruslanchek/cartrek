<div class="threequarter">
    {if $devices}
        <div class="table-wrapper">
            <table class="width-100 hovered" id="fleet-table">
                <thead class="thead-gray">
                    <tr>
                        <th width="1%"></th>
                        <th width="43%">Название</th>
                        <th width="30%">Марка/модель</th>
                        <th width="5%">Госномер</th>
                        <th width="20%">Группа</th>
                        <th width="1%">Режим</th>
                    </tr>
                </thead>
                <tbody>
                    {foreach $devices as $item}
                    <tr rel="{$item.id}" class="{if !$item.active}unactive_row{/if}" data-online="{if $item.online == 1 && $item.active}true{else}false{/if}">
                        <th width="1%" class="activity-cell"><i title="{if $item.online == 1}Онлайн{else}Офлайн{/if}" class="activity-icon {if $item.online == 1 && $item.active}active{else}unactive{/if}"></i></th>
                        <td><a class="car-edit" href="/control/user/fleet/#car={$item.id}"><strong>{$item.name}</strong></a></td>
                        <td><strong>{$item.make}</strong> {$item.model}</td>
                        <td><span class="g_id">{$item.g_id}</span></td>
                        <td>{$item.fleet_name}</td>
                        <td>
                            <label for="item_active_{$item.id}"></label>
                            <input class="activity-toggler slickswitch" type="checkbox" {if $item.active}checked{/if} data-id="{$item.id}" name="item_active" />
                        </td>
                    </tr>
                    {/foreach}
                </tbody>
            </table>
        </div>

        <script>fleet.init();</script>
    {else}
        <div class="alert alert-block">
            <h4 class="alert-heading">Внимание!</h4>
            У вас нет активных устройств для отслеживания, необходимо <a href="/control/user/fleet/add">добавить</a> или активировать устройство.
        </div>
    {/if}
</div>

<div class="quarter">
    {include file="modules/user.menu.tpl"}
</div>