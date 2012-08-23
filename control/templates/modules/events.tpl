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

            <li class="strong"><a href="#" data-toggle="tab">Непроспотренные</a></li>
            <li><a href="#" data-toggle="tab">Просмотренные</a></li>
            <li><a href="#" data-toggle="tab">Все</a></li>

            <li class="divider"></li>

            <li><a href="#">Отметить все как просмотренные</a></li>
            <li><a href="#" class="red">Удалить все</a></li>
        </ul>
    </div>
</div>

<div class="clear"></div>

<script>
    core.events.init();
</script>