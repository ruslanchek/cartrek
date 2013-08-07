{if $devices}
    <table class="table table-bordered" id="fleet-table">
        <thead class="thead-gray">
            <tr>
                <th width="1%"></th>
                <th width="35%">Название</th>
                <th width="25%">Модель</th>
                <th width="18%">Госномер</th>
                <th width="20%">Группа</th>
                <th width="1%">Режим</th>
            </tr>
        </thead>
        <tbody>
            {foreach $devices as $item}
            <tr rel="{$item.id}" class="{if !$item.active}unactive_row{/if}" data-online="{if $item.online == 1 && $item.active}true{else}false{/if}">
                <th width="1%" class="activity-cell">
                    <span title="{if $item.online == 1}Онлайн{else}Офлайн{/if}" class="activity-icon text-center {if $item.online == 1 && $item.active}fui-radio-checked active{else}fui-radio-unchecked unactive{/if}"></span>
                </th>
                <td>
                    <a class="car-edit" href="/control/user/fleet/#car={$item.id}">
                        <strong>{$item.name}</strong>
                    </a>
                </td>
                <td>
                    <strong>{$item.make}</strong> {$item.model}
                </td>
                <td>
                    <span class="g_id">{$item.g_id}</span>
                </td>
                <td>{$item.fleet_name}</td>
                <td>
                    <label class="checkbox switch-checkbox no-label">
                        <div class="switch switch-small switch-animate"
                             data-on-label="<i class='fui-check'></i>"
                             data-off-label="<i class='fui-cross'></i>">
                            <input type="checkbox" class="activity-toggler" {if $item.active}checked{/if} data-id="{$item.id}" name="item_active" value="1" />
                        </div>
                    </label>
                </td>
            </tr>
            {/foreach}
        </tbody>
    </table>

    <script>fleet.init();</script>
{else}
    <div class="alert alert-block">
        <h4 class="alert-heading">Внимание!</h4>
        У вас нет активных устройств для отслеживания, необходимо <a href="/control/user/fleet/add">добавить</a> или активировать устройство.
    </div>
{/if}