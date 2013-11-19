{if $devices}
    <div class="table-wrapper">
        <table class="width-100 hovered" id="fleet-table">
            <thead class="thead-gray">
                <tr>

                    <th width="1%"></th>
                    <th width="1%" class="text-centered"><i title="Вкл/выкл" class="icon-off"></i></th>
                    <th width="23%">Название</th>
                    <th width="15%">Госномер</th>
                    <th width="20%">Марка/модель</th>
                    <th width="20%">Тип</th>
                    <th width="20%">Группа</th>

                </tr>
            </thead>
            <tbody>
                {foreach $devices as $item}
                <tr rel="{$item.id}" class="{if !$item.active}unactive_row{/if}" data-online="{if $item.online == 1 && $item.active}true{else}false{/if}">
                    <td width="1%" class="activity-cell">
                        <i title="{if $item.online == 1}Онлайн{else}Офлайн{/if}" class="activity-icon icon-signal-1 {if $item.online == 1 && $item.active}active{else}unactive{/if}"></i>
                    </td>
                    <td>
                        <label for="item_active_{$item.id}"></label>
                        <input class="activity-toggler slickswitch" type="checkbox" {if $item.active}checked{/if} data-id="{$item.id}" name="item_active" />
                    </td>
                    <td><a class="car-edit" href="/control/user/fleet/#car={$item.id}"><strong>{$item.name}</strong></a></td>
                    <td><span class="g_id">{$item.g_id}</span></td>
                    <td>{$item.make} {$item.model}</td>
                    <td>{$core->getDeviceTypeData($item.type, 'title')}</td>
                    <td>{$item.fleet_name}</td>

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