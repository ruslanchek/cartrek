<div class="threequarter">
    <a href="/control/user/fleet/add" class="btn btn-success"><i class="icon-plus icon-white"></i> Добавить автомобиль</a>

    {if $core->devices->devices_present}
        <table class="width-100 bordered hovered">
            <thead class="thead-gray">
                <tr>
                    <th width="44%">Название</th>
                    <th width="30%">Марка/модель</th>
                    <th width="5%">Госномер</th>
                    <th width="20%">Группа</th>
                    <th width="1%">Режим</th>
                </tr>
            </thead>

            <tbody>
                {foreach $core->devices->getUserDevices(true) as $item}
                <tr{if !$item.active} class="unactive_row"{/if}>
                    <td><a href="/control/fleet/{$item.id}"><strong>{$item.name}</strong></a></td>
                    <td>{$item.make} {$item.model}</td>
                    <td><span class="g_id">{$item.g_id}</span></td>
                    <td>{$item.fleet_name}</td>
                    <td>
                        <label for="item_active_{$item.id}"></label><input type="checkbox" {if $item.active}checked="checked"{/if} id="item_active_{$item.id}" name="item_active" />
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
</div>

<div class="quarter">
    {include file="modules/user.menu.tpl"}
</div>