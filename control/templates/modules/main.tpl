<div class="page-header">
    <h1>Добро пожаловать, {$core->auth->user_status.userdata.name}</h1>
</div>

<div class="row-fluid">
    <div class="span9">
        <table class="table table-striped table-bordered table-condensed">
            <tr>
                <th width="59%">Название</th>
                <th width="30%">Марка</th>
                <th width="10%">Госномер</th>
                <th width="1%">Идентификатор</th>
            </tr>
            {foreach $core->getUserDevices() as $item}
            <tr>
                <td><a href="#">{$item.name}</a></td>
                <td>{$item.make} {$item.model}</td>
                <td><span class="g_id">{$item.g_id}</span></td>
                <td>{$item.id}{$item.secret}</td>
            </tr>
            {/foreach}
        </table>
    </div>
</div>