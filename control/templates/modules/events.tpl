<div class="quarter">
    <ul class="left-nav">
        <li class="active"><a data-action="unreaded" class="action_menu_item" href="javascript:void(0)" data-toggle="tab">Непросмотренные</a></li>
        <li><a data-action="readed" class="action_menu_item" href="javascript:void(0)" data-toggle="tab">Просмотренные</a></li>
        <li><a data-action="all" class="action_menu_item" href="javascript:void(0)" data-toggle="tab">Все</a></li>

        <li class="divider"></li>

        <li class="gray-button"><a data-action="read_all" class="action_menu_item" href="javascript:void(0)">Отметить все как просмотренные</a></li>
        <li class="red-button"><a data-action="delete_all" class="action_menu_item" href="javascript:void(0)" class="red">Удалить все</a></li>
    </ul>
</div>

<div class="threequarter">
    <div id="events_load_area"></div>
    <button class="btn" id="load_more">Показать еще</button>
</div>

<script>
    $(function(){
        core.events.init();
    });
</script>