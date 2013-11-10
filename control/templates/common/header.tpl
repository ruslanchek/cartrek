<header class="header">
    <div class="limiter">
        <a class="logo" href="/control"></a>

        <div class="tools">
            <span class="global-loading animate-spin">
                <i class="icon-spin1" title="Загрузка данных"></i>
            </span>

            <nav>
                <a href="javascript:void(0)" onclick="core.ui.exitUser()"><i class="f-icon icon-off color-red"></i> Выход</a>
            </nav>

            <nav>
                <a href="/control/user" title="{$core->auth->user.data.login}"><i class="f-icon icon-user"></i> {$core->auth->user.data.name}</a>
                <a href="/control/events"><i class="f-icon icon-mail"><i id="global_events_counter" class="count" {if $core->auth->user.data.new_events_count <= 0}style="display: none"{/if}>{$core->auth->user.data.new_events_count}</i></i> Сообщения</a>
                <a href="/control/user/system" class="active"><i class="f-icon icon-cog-2"></i> Настройка</a>
            </nav>
        </div>
    </div>
</header>

