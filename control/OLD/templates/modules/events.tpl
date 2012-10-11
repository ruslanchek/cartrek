<div class="page-header">
    <h1>{$core->module.title}</h1>
</div>

<div class="left_col">
    <div id="events_load_area"></div>
    <button class="btn" id="load_more">Показать еще</button>
</div>

<div class="right_col">
    <div class="well well_nopadding">
        <ul class="nav nav-list">
            <li class="nav-header">Уведомления</li>

            <li class="active"><a data-action="unreaded" class="action_menu_item" href="javascript:void(0)" data-toggle="tab">Непросмотренные</a></li>
            <li><a data-action="readed" class="action_menu_item" href="javascript:void(0)" data-toggle="tab">Просмотренные</a></li>
            <li><a data-action="all" class="action_menu_item" href="javascript:void(0)" data-toggle="tab">Все</a></li>

            <li class="divider"></li>

            <li><a data-action="read_all" class="gray_link action_menu_item" href="javascript:void(0)">Отметить все как просмотренные</a></li>
            <li><a data-action="delete_all" class="red_link action_menu_item" href="javascript:void(0)" class="red">Удалить все</a></li>
        </ul>
    </div>
</div>

<div class="clear"></div>

<script>
    $(function(){
        core.events.init();
    });
</script>