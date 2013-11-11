<header class="header">
    <div class="limiter">
        <a class="logo" href="/control"></a>

        <div class="tools">
            <span class="global-loading-circle">
                <i class="icon-spin1 animate-spin" title="Загрузка данных"></i>
            </span>

            <nav>
                <a href="javascript:void(0)" onclick="core.ui.exitUser()"><i class="f-icon icon-off color-red"></i> Выход</a>
            </nav>

            <nav>
                <a href="/control/user" {if $core->module.name == 'user'}class="active"{/if}><i class="f-icon icon-user"></i> Руслан Шашков</a>
                <a href="/control/events" {if $core->module.name == 'events'}class="active"{/if}>
                    <i class="f-icon icon-mail">
                        <i {if $core->auth->user.data.new_events_count <= 0}style="display: none"{/if} id="global_events_counter" class="count">{$core->auth->user.data.new_events_count}</i>
                    </i>

                    Сообщения
                </a>
                <a href="/control/user/system" {if $core->module.name == 'user.system'}class="active"{/if}><i class="f-icon icon-cog-2"></i> Настройка</a>
            </nav>
        </div>
    </div>

    <div class="global-loading-bar"></div>
</header>