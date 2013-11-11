<div class="threequarter">
    <div id="events_load_area"></div>
    <button class="btn" id="load_more">Показать еще</button>
</div>

<div class="quarter">
    <ul class="nav-side">
        <li class="active"><a data-action="unreaded" class="action_menu_item" href="javascript:void(0)">Непросмотренные</a></li>
        <li><a data-action="readed" class="action_menu_item" href="javascript:void(0)">Просмотренные</a></li>

        <li><a data-action="notify" class="action_menu_item notify" href="javascript:void(0)">Уведомления<i class="label alert-notify"></i></a></li>
        <li><a data-action="success" class="action_menu_item success" href="javascript:void(0)">Успешние действия<i class="label alert-success"></i></a></li>
        <li><a data-action="attention" class="action_menu_item attention" href="javascript:void(0)">Внимание<i class="label alert-attention"></i></a></li>
        <li><a data-action="error" class="action_menu_item" href="javascript:void(0)">Ошибки<i class="label alert-error"></i></a></li>

        <li><a data-action="all" class="action_menu_item" href="javascript:void(0)">Все</a></li>
    </ul>

    <div class="nav-side-btn">
        <a data-action="read_all" class="btn gray action_menu_item" href="javascript:void(0)">Отметить все как просмотренные</a>
        <a data-action="delete_all" class="btn red action_menu_item" href="javascript:void(0)" class="red">Удалить все</a>
    </div>
</div>

<script>
    $(function(){
        core.events.init();
    });
</script>